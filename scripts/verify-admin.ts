import 'dotenv/config';
import { eq, inArray, notInArray } from 'drizzle-orm';
import { openDb } from '../db/client.js';
import { adminProfiles, coursePrices, courses, events, levelRungs, terms } from '../db/schema.js';
import { createApp } from '../server/app.js';
import { hashPassword } from '../server/auth.js';

// Maschineller Check fuer Etappe 6 (Admin-UI / Staffel-Duplizieren mit Auto-Aufstieg).
// Faehrt die echten Admin-HTTP-Routen ueber app.request() (wie scripts/verify.ts) und prueft:
//  - Auth-Gate, Staffel anlegen, Duplizieren-Vorschau, Auto-Aufstieg korrekt, Commit + Override.
// Self-cleaning: alle angelegten Test-Staffeln/Rungs/Accounts werden am Ende entfernt.

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

const ADMIN_EMAIL = 'admin@salsaflow-dc.com';
const ADMIN_PW = process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026';

// Referenz-Implementierung der Aufstiegs-Regel direkt aus den Labels (ARCHITEKTUR.md 3.4),
// unabhaengig vom Server-Code -> echter Gegen-Check, kein gemeinsamer Bug.
function expectedNext(ladderKey: string, label: string | null): string | null {
  if (label === null) return null;
  if (ladderKey === 'open') return label;
  if (ladderKey === 'heels') {
    if (label === 'Beginner') return 'Intermediate';
    if (label === 'Intermediate') return 'Advanced';
    return 'Advanced'; // Advanced bleibt (endliche Leiter)
  }
  // salsa_bachata
  let m = label.match(/^Beginner Stufe (\d+)$/);
  if (m) {
    const n = Number(m[1]);
    return n < 6 ? `Beginner Stufe ${n + 1}` : 'Beginner Flow';
  }
  if (label === 'Beginner Flow') return 'Intermediate Stufe 7';
  m = label.match(/^Intermediate Stufe (\d+)$/);
  if (m) {
    const n = Number(m[1]);
    return n < 12 ? `Intermediate Stufe ${n + 1}` : 'Intermediate Flow';
  }
  if (label === 'Intermediate Flow') return 'Advanced Stufe 13';
  m = label.match(/^Advanced Stufe (\d+)$/);
  if (m) return `Advanced Stufe ${Number(m[1]) + 1}`;
  if (label === 'Advanced Flow') return 'Advanced Flow';
  return label;
}

async function main() {
  const handle = await openDb();
  const { db } = handle;
  const app = createApp(db);

  const createdTermIds: string[] = [];
  let readonlyAdminId: string | null = null;
  const rungIdsBefore = new Set((await db.select({ id: levelRungs.id }).from(levelRungs)).map((r) => r.id));

  // Login -> Cookie
  const loginRes = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PW }),
  });
  const cookie = (loginRes.headers.get('set-cookie') ?? '').split(';')[0];
  check('Login liefert Session-Cookie', cookie.startsWith('sf_session='), cookie.split('=')[0] || 'kein Cookie');
  const auth = { cookie, 'content-type': 'application/json' };

  /* 1) Auth-Gate ---------------------------------------------------------- */
  const noAuth = await app.request('/api/admin/terms');
  check('Admin-Route ohne Login -> 401', noAuth.status === 401, `status ${noAuth.status}`);

  /* 2) Staffeln listen ---------------------------------------------------- */
  const termsRes = await app.request('/api/admin/terms', { headers: { cookie } });
  // SAFETY: Der vorige Check belegt, dass das Cookie eine gueltige Session ist; die
  // Route antwortet damit mit ihrem Erfolgs-Body aus server/admin-routes.ts (terms[]).
  const termsBody = (await termsRes.json()) as { terms: { id: string; name: string; courseCount: number }[] };
  const januar = termsBody.terms.find((t) => t.name === 'Staffel Januar 2026');
  check('Staffel Januar 2026 wird gelistet', !!januar, januar ? `${januar.courseCount} Kurse` : 'fehlt');
  check('Januar-Staffel hat Kurse', !!januar && januar.courseCount > 0, `${januar?.courseCount ?? 0} Kurse`);

  /* 3) Neue (leere) Staffel anlegen -- Kriterium "neue Staffel anlegen" ---- */
  const newTermRes = await app.request('/api/admin/terms', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ name: 'TEST Neue Staffel', startDate: '2026-09-01', endDate: '2026-10-26', weekCount: 8 }),
  });
  // SAFETY: id ist optional deklariert. Die Assertion behauptet damit nur, dass der Body
  // ein Objekt ist; der Check darunter prueft die id-Existenz selbst und schlaegt sonst fehl.
  const newTermBody = (await newTermRes.json()) as { id?: string };
  check('Neue Staffel anlegen -> 201 + id', newTermRes.status === 201 && !!newTermBody.id, `status ${newTermRes.status}`);
  if (newTermBody.id) createdTermIds.push(newTermBody.id);

  const newTermDetail = await app.request(`/api/admin/terms/${newTermBody.id}`, { headers: { cookie } });
  // SAFETY: term und courses sind optional deklariert, der Check darunter liest beide mit
  // ?. und Default. Fehlen sie (etwa bei einem Fehler-Body), wird der Check FAIL statt Crash.
  const newTermDetailBody = (await newTermDetail.json()) as { term?: { status: string }; courses?: unknown[] };
  check(
    'Neue Staffel ist leer + draft',
    newTermDetailBody.term?.status === 'draft' && (newTermDetailBody.courses?.length ?? -1) === 0,
    `status ${newTermDetailBody.term?.status}, ${newTermDetailBody.courses?.length} Kurse`,
  );

  if (!januar) {
    finish(handle, createdTermIds, readonlyAdminId, rungIdsBefore, db);
    return;
  }

  /* 4) Duplizieren-Vorschau: Auto-Aufstieg pro Kurs gegen Referenz --------- */
  const prevRes = await app.request(`/api/admin/terms/${januar.id}/duplicate-preview`, { headers: { cookie } });
  // SAFETY: januar ist an dieser Stelle geprueft (early return oben, wenn es fehlt), das
  // Cookie ist gueltig. Die Route liefert damit ihren Vorschau-Erfolgs-Body; die Checks
  // darunter vergleichen jedes gelesene Feld einzeln gegen die Referenz-Implementierung.
  const prev = (await prevRes.json()) as {
    suggested: { name: string; startDate: string; endDate: string };
    courses: {
      courseId: string;
      ladderKey: string;
      currentLevelDe: string | null;
      newLevelDe: string | null;
      changed: boolean;
    }[];
    changedCount: number;
  };
  check('Vorschau liefert Kurse', prev.courses.length === januar.courseCount, `${prev.courses.length} Kurse`);
  check('Vorschau schlaegt Namen vor', !!prev.suggested?.name, prev.suggested?.name ?? 'kein Name');

  let mismatches = 0;
  const mismatchSamples: string[] = [];
  for (const pc of prev.courses) {
    const exp = expectedNext(pc.ladderKey, pc.currentLevelDe);
    if (exp !== pc.newLevelDe) {
      mismatches++;
      if (mismatchSamples.length < 4)
        mismatchSamples.push(`${pc.ladderKey}: "${pc.currentLevelDe}" -> erwartet "${exp}", API "${pc.newLevelDe}"`);
    }
  }
  check(
    'Auto-Aufstieg pro Kurs = Referenz (ARCHITEKTUR 3.4)',
    mismatches === 0,
    mismatches === 0 ? `${prev.courses.length}/${prev.courses.length} korrekt` : mismatchSamples.join(' | '),
  );

  // Es muss real etwas hochgestuft worden sein, und Open-Stile duerfen NICHT steigen.
  check('Mindestens ein Kurs wird hochgestuft', prev.changedCount > 0, `${prev.changedCount} geaendert`);
  const openChanged = prev.courses.filter((p) => p.ladderKey === 'open' && p.changed);
  check('Open-Stile steigen nicht auf', openChanged.length === 0, `${openChanged.length} faelschlich geaendert`);
  const sbChanged = prev.courses.filter((p) => p.ladderKey === 'salsa_bachata' && p.changed);
  check('Salsa/Bachata-Kurse steigen auf', sbChanged.length > 0, `${sbChanged.length} hochgestuft`);

  /* 5) Commit: Duplizieren (Auto) ----------------------------------------- */
  const dupRes = await app.request(`/api/admin/terms/${januar.id}/duplicate`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      name: 'TEST Duplikat Auto',
      startDate: prev.suggested.startDate,
      endDate: prev.suggested.endDate,
    }),
  });
  // SAFETY: Alle drei Felder sind optional deklariert; die Checks darunter pruefen jedes
  // einzeln (!!id, courses ===, promoted ?? 0). Ein Fehler-Body faellt als FAIL auf.
  const dupBody = (await dupRes.json()) as { id?: string; courses?: number; promoted?: number };
  check('Duplizieren -> 201', dupRes.status === 201 && !!dupBody.id, `status ${dupRes.status}`);
  if (dupBody.id) createdTermIds.push(dupBody.id);
  check('Duplikat: Kurs-Anzahl wie Original', dupBody.courses === januar.courseCount, `${dupBody.courses} Kurse`);
  check('Duplikat: hat hochgestufte Kurse', (dupBody.promoted ?? 0) > 0, `${dupBody.promoted} hochgestuft`);

  // Duplikat-Detail laden: Levels muessen den Vorschau-Werten entsprechen.
  const dupDetailRes = await app.request(`/api/admin/terms/${dupBody.id}`, { headers: { cookie } });
  // SAFETY: Der Check direkt darueber belegt dupRes.status === 201 und eine vorhandene
  // dupBody.id. Die Detail-Route liefert fuer eine existierende Staffel-ID mit gueltigem
  // Cookie ihren Erfolgs-Body aus server/admin-routes.ts (term + courses[]).
  const dupDetail = (await dupDetailRes.json()) as {
    term: { duplicatedFrom: string | null; status: string };
    courses: { levelDe: string | null; status: string; styleDe: string }[];
  };
  check('Duplikat: status draft + duplicatedFrom gesetzt', dupDetail.term.status === 'draft' && dupDetail.term.duplicatedFrom === januar.id, `from ${dupDetail.term.duplicatedFrom}`);
  const allDraft = dupDetail.courses.every((c) => c.status === 'draft');
  check('Duplikat: alle Kurse draft', allDraft, allDraft ? 'ok' : 'nicht alle draft');

  // Die Menge der neuen Level-Labels muss der Menge der Vorschau-newLevelDe entsprechen.
  const expectedLevels = prev.courses.map((p) => p.newLevelDe).sort();
  const actualLevels = dupDetail.courses.map((c) => c.levelDe).sort();
  const levelsMatch = JSON.stringify(expectedLevels) === JSON.stringify(actualLevels);
  check('Duplikat: Levels = Vorschau-Auto-Aufstieg', levelsMatch, levelsMatch ? `${actualLevels.length} Levels` : 'Abweichung Vorschau/Commit');

  // Preise wurden mitkopiert.
  const srcPrices = (await db.select().from(coursePrices).where(inArray(coursePrices.courseId,
    (await db.select({ id: courses.id }).from(courses).where(eq(courses.termId, januar.id))).map((r) => r.id)))).length;
  const dupPrices = (await db.select().from(coursePrices).where(inArray(coursePrices.courseId,
    (await db.select({ id: courses.id }).from(courses).where(eq(courses.termId, dupBody.id!))).map((r) => r.id)))).length;
  check('Duplikat: Preise mitkopiert', dupPrices === srcPrices && dupPrices > 0, `${dupPrices} vs ${srcPrices}`);

  /* 6) Override: ein Kurs behaelt sein altes Level ------------------------ */
  const sample = prev.courses.find((p) => p.ladderKey === 'salsa_bachata' && p.changed && p.currentLevelDe);
  if (sample) {
    // override -> current rung beibehalten: dazu brauchen wir die rungId. Aus /meta holen.
    const metaRes = await app.request('/api/admin/meta', { headers: { cookie } });
    // SAFETY: /api/admin/meta ist eine Lese-Route; das oben geprueft gueltige Cookie passiert
    // das Auth-Gate. Sie liefert damit ihren Erfolgs-Body mit levelRungs[]. Das find()
    // darunter behandelt eine leere Liste selbst (else-Zweig setzt den Check auf FAIL).
    const meta = (await metaRes.json()) as { levelRungs: { id: string; labelDe: string; ladderKey: string }[] };
    const keepRung = meta.levelRungs.find((r) => r.ladderKey === 'salsa_bachata' && r.labelDe === sample.currentLevelDe);
    if (keepRung) {
      const ovRes = await app.request(`/api/admin/terms/${januar.id}/duplicate`, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({
          name: 'TEST Duplikat Override',
          startDate: '2026-11-01',
          endDate: '2026-12-26',
          overrides: { [sample.courseId]: keepRung.id },
        }),
      });
      // SAFETY: id ist optional deklariert; die Zeile darunter prueft sie vor dem Gebrauch.
      const ovBody = (await ovRes.json()) as { id?: string };
      if (ovBody.id) createdTermIds.push(ovBody.id);
      const ovDetailRes = await app.request(`/api/admin/terms/${ovBody.id}`, { headers: { cookie } });
      // SAFETY: Die Detail-Route liefert mit gueltigem Cookie ihren Erfolgs-Body inklusive
      // courses[]. levelDe ist als nullable deklariert, wie die Spalte in db/schema.ts.
      const ovDetail = (await ovDetailRes.json()) as { courses: { levelDe: string | null }[] };
      const keptCount = ovDetail.courses.filter((c) => c.levelDe === sample.currentLevelDe).length;
      const wouldBePromotedCount = prev.courses.filter((p) => p.newLevelDe === sample.currentLevelDe).length;
      check('Override: gewaehltes Level wird respektiert', keptCount > wouldBePromotedCount, `${keptCount} Kurse auf "${sample.currentLevelDe}"`);
    } else {
      check('Override: gewaehltes Level wird respektiert', false, 'keep-Rung nicht gefunden');
    }
  } else {
    check('Override: gewaehltes Level wird respektiert', false, 'kein Sample-Kurs gefunden');
  }

  /* 7) Event-CMS: Entwurf -> veröffentlichen -> öffentlich -> löschen ------ */
  const eventCreate = await app.request('/api/admin/events', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      slug: 'test-cms-workshop',
      format: 'workshop',
      titleDe: 'TEST CMS Workshop',
      titleEn: 'TEST CMS workshop',
      summaryDe: 'Ein verifizierbarer Testtermin für den neuen öffentlichen Eventkalender.',
      summaryEn: 'A verifiable test date for the new public event calendar.',
      startDate: '2027-01-20',
      endDate: null,
      startTime: '19:30',
      endTime: '21:00',
      location: 'Salsaflow Basel',
      ticketUrl: 'https://example.com/tickets',
      detailUrl: '/events-workshops/eventkalender',
      imageUrl: null,
      imageAltDe: null,
      imageAltEn: null,
      featured: true,
      status: 'draft',
      sort: 10,
    }),
  });
  // SAFETY: Die Route liefert bei Erfolg `{ id }`; bei einem Fehler bleibt `id` optional
  // und der unmittelbar folgende Check fällt kontrolliert auf FAIL statt zu dereferenzieren.
  const eventCreateBody = (await eventCreate.json()) as { id?: string };
  check('Event-CMS: Entwurf anlegen -> 201', eventCreate.status === 201 && !!eventCreateBody.id, `status ${eventCreate.status}`);
  const eventId = eventCreateBody.id;
  if (eventId) {
    const eventPublish = await app.request(`/api/admin/events/${eventId}`, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ status: 'published' }),
    });
    check('Event-CMS: veröffentlichen -> 200', eventPublish.status === 200, `status ${eventPublish.status}`);
    const publicEvents = await app.request('/api/public/events');
    // SAFETY: Der öffentliche Endpunkt besitzt genau den `{ events: [...] }`-Vertrag;
    // die optionale Deklaration hält auch einen unerwarteten Fehler-Body crashfrei.
    const publicBody = (await publicEvents.json()) as { events?: { id: string; titleDe: string }[] };
    const visible = publicBody.events?.find((event) => event.id === eventId);
    check('Event-CMS: veröffentlichtes Event erscheint öffentlich', !!visible, visible?.titleDe ?? 'fehlt');
    const eventDelete = await app.request(`/api/admin/events/${eventId}`, { method: 'DELETE', headers: { cookie } });
    check('Event-CMS: Event löschen -> 200', eventDelete.status === 200, `status ${eventDelete.status}`);
    await db.delete(events).where(eq(events.id, eventId));
  }

  /* 8) Schreib-Gate: teacher_readonly darf nicht schreiben ---------------- */
  readonlyAdminId = (
    await db
      .insert(adminProfiles)
      .values({
        email: 'readonly-test@salsaflow-dc.com',
        passwordHash: hashPassword('readonly-test-pw'),
        displayName: 'Readonly Test',
        role: 'teacher_readonly',
      })
      .returning({ id: adminProfiles.id })
  )[0].id;
  const roLogin = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'readonly-test@salsaflow-dc.com', password: 'readonly-test-pw' }),
  });
  const roCookie = (roLogin.headers.get('set-cookie') ?? '').split(';')[0];
  const roWrite = await app.request('/api/admin/terms', {
    method: 'POST',
    headers: { cookie: roCookie, 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'RO', startDate: '2026-09-01', endDate: '2026-10-01' }),
  });
  const roRead = await app.request('/api/admin/terms', { headers: { cookie: roCookie } });
  check('teacher_readonly: Schreiben -> 403', roWrite.status === 403, `status ${roWrite.status}`);
  check('teacher_readonly: Lesen -> 200', roRead.status === 200, `status ${roRead.status}`);

  await finish(handle, createdTermIds, readonlyAdminId, rungIdsBefore, db);
}

async function finish(
  handle: Awaited<ReturnType<typeof openDb>>,
  createdTermIds: string[],
  readonlyAdminId: string | null,
  rungIdsBefore: Set<string>,
  db: Awaited<ReturnType<typeof openDb>>['db'],
) {
  // Aufraeumen: Test-Staffeln (cascaden Kurse), neu angelegte Rungs, Readonly-Account.
  if (createdTermIds.length > 0) await db.delete(terms).where(inArray(terms.id, createdTermIds));
  if (readonlyAdminId) await db.delete(adminProfiles).where(eq(adminProfiles.id, readonlyAdminId));
  const before = [...rungIdsBefore];
  if (before.length > 0) {
    await db.delete(levelRungs).where(notInArray(levelRungs.id, before));
  }
  await handle.close();

  console.log('\n=== Etappe 6 Verify (Admin-UI: Staffel anlegen + duplizieren mit Auto-Aufstieg) ===');
  let failed = 0;
  for (const c of checks) {
    console.log(`  ${c.ok ? 'PASS' : 'FAIL'}  ${c.name}  (${c.detail})`);
    if (!c.ok) failed++;
  }
  console.log('');
  if (failed > 0) {
    console.log(`VERDICT: FAIL (${failed}/${checks.length} Checks fehlgeschlagen)`);
    process.exit(1);
  }
  console.log(`VERDICT: PASS (${checks.length}/${checks.length} Checks gruen)`);
}

main().catch((err) => {
  console.error('[verify-admin] FEHLER:', err);
  process.exit(1);
});
