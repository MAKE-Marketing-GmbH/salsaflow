import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { eq, inArray, like } from 'drizzle-orm';
import { openDb } from '../db/client.js';
import { createApp } from '../server/app.js';
import {
  bookings,
  courses,
  coursePrices,
  levelRungs,
  locations,
  notifications,
  participants,
  styles,
  tariffs,
  terms,
} from '../db/schema.js';

// End-to-End-Gate fuer den aktuellen Buchungsvertrag: ein gemeinsamer Platzpool,
// sofortige Bestaetigung bei freien Plaetzen, Warteliste bei voller Kapazitaet,
// Nachruecken nach Storno und Bestaetigungsmails an Teilnehmer + info@.

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const TEST_DOMAIN = '@e8-test.local';
const INFO_EMAIL = 'info@salsaflow-dc.com';

type BookingResponse = { status?: string; role?: string | null; mode?: string; bookingId?: string; waitlistPosition?: number | null };
type AvailabilityResponse = {
  bookable: boolean;
  capacity: number;
  free: number;
  freeLeader: number;
  freeFollower: number;
  tariffs: { key: string; nameDe: string; amountChf: string | null }[];
};
type BalanceAvailability = {
  capacity: number;
  capacityTotal: number;
  free: number;
  confirmed: number;
  waitlist: number;
};

async function main() {
  const handle = await openDb();
  const { db } = handle;
  const app = createApp(db);

  // --- Test-Stammdaten holen (aus dem Seed) --------------------------------
  const salsa = (await db.select().from(styles).where(eq(styles.key, 'salsa')).limit(1))[0];
  const rung = (await db.select().from(levelRungs).where(eq(levelRungs.ladderKey, 'salsa_bachata')))[0];
  const loc = (await db.select().from(locations))[0];
  const tariffRows = await db.select().from(tariffs);
  const normalT = tariffRows.find((t) => t.key === 'normal');
  const coupleT = tariffRows.find((t) => t.key === 'couple');
  if (!salsa || !rung || !loc || !normalT || !coupleT) {
    console.log('VERDICT: FAIL (Seed-Stammdaten fehlen - bitte npm run setup)');
    await handle.close();
    process.exit(1);
  }

  // --- Isolierte Test-Staffel + Kurs mit einem gemeinsamen Pool --------------
  const termId = randomUUID();
  const courseId = randomUUID();
  await db.insert(terms).values({
    id: termId,
    name: 'Single-Pool Testbuchung',
    startDate: '2026-01-01',
    endDate: '2099-12-31',
    weekCount: 8,
    status: 'published',
  });
  await db.insert(courses).values({
    id: courseId,
    termId,
    styleId: salsa.id,
    levelRungId: rung.id,
    weekday: 'mon',
    startTime: '18:30:00',
    endTime: '19:30:00',
    locationId: loc.id,
    bookingType: 'leader_follower',
    capacityTotal: 2,
    allowsLateEntry: true,
    status: 'open',
  });
  await db.insert(coursePrices).values([
    { courseId, tariffId: normalT.id, amountChf: '190.00' },
    { courseId, tariffId: coupleT.id, amountChf: '340.00' },
  ]);

  // Admin-Login fuer die Balance-/Storno-Routen.
  const loginRes = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@salsaflow-dc.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026',
    }),
  });
  const cookie = (loginRes.headers.get('set-cookie') || '').match(/sf_session=[^;]+/)?.[0] ?? '';
  check('Admin-Login fuer Balance-Sicht', loginRes.status === 200 && cookie.length > 0, `status ${loginRes.status}`);

  // Helfer: oeffentlich buchen / Verfuegbarkeit / Admin-Balance / Storno.
  type BookBody = Record<string, unknown>;
  async function book(body: BookBody) {
    const res = await app.request('/api/public/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as BookingResponse;
    return { status: res.status, json };
  }
  async function availability() {
    const res = await app.request(`/api/public/courses/${courseId}/availability`);
    return (await res.json()) as AvailabilityResponse;
  }
  async function balance() {
    const res = await app.request(`/api/admin/terms/${termId}/balance`, { headers: { cookie } });
    const json = (await res.json()) as {
      courses: { courseId: string; availability: BalanceAvailability | null }[];
    };
    return json.courses.find((course) => course.courseId === courseId)!.availability!;
  }
  async function cancel(bookingId: string) {
    const res = await app.request(`/api/admin/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: '{}',
    });
    return (await res.json()) as { ok: boolean; promoted: number };
  }
  const person = (n: string) => ({ firstName: n, lastName: 'Test', email: `${n.toLowerCase()}${TEST_DOMAIN}` });

  /* 1) Freier Platz -> Bestaetigung, ein Platz bleibt im gemeinsamen Pool. */
  const a = await book({ courseId, role: 'leader', mode: 'solo', participant: person('Anna'), needsAushilfe: true });
  check('Freier Platz: Leader-Buchung angenommen (201)', a.status === 201, `status ${a.status}`);
  check('Freier Platz: Buchung wird sofort bestaetigt', a.json.status === 'confirmed', `status ${a.json.status}`);
  check('Bestaetigte Buchung hat keine Wartelisten-Position', a.json.waitlistPosition === null, `pos ${a.json.waitlistPosition}`);
  check('Nach erster Buchung bleibt ein Pool-Platz frei', (await availability()).free === 1, `frei ${(await availability()).free}`);

  /* 2) Gleiche Rolle nutzt ebenfalls den gemeinsamen Pool -> bestaetigt. */
  const b = await book({ courseId, role: 'leader', mode: 'solo', participant: person('Ben') });
  check('Gemeinsamer Pool: zweiter Leader wird bestaetigt', b.json.status === 'confirmed', `status ${b.json.status}`);
  const avAfterB = await availability();
  check(
    'Gemeinsamer Pool: Rollen sehen dieselbe freie Kapazitaet',
    avAfterB.free === 0 && avAfterB.freeLeader === 0 && avAfterB.freeFollower === 0,
    `frei ${avAfterB.free} / Rollen ${avAfterB.freeLeader}/${avAfterB.freeFollower}`,
  );

  /* 3) Voller gemeinsamer Pool -> Follower auf Warteliste Position 1. */
  const c = await book({ courseId, role: 'follower', mode: 'solo', participant: person('Carla') });
  check('Voller Pool: Follower landet auf der Warteliste', c.json.status === 'waitlisted', `status ${c.json.status}`);
  check('Warteliste: erste Einzelbuchung ist Position 1', c.json.waitlistPosition === 1, `pos ${c.json.waitlistPosition}`);

  /* 4) Paar benoetigt zwei Plaetze und kommt bei vollem Pool auf Position 2. */
  const d = await book({
    courseId,
    role: 'leader',
    mode: 'couple',
    participant: person('Dora'),
    partner: person('Tom'),
    tariffKey: 'couple',
  });
  check('Voller Pool: Paar landet auf der Warteliste', d.json.status === 'waitlisted', `status ${d.json.status}`);
  check('Warteliste: Paar folgt auf Position 2', d.json.waitlistPosition === 2, `pos ${d.json.waitlistPosition}`);

  /* 5) Verfuegbarkeit und Balance beschreiben nur den gemeinsamen Pool. */
  const av1 = await availability();
  check('Verfuegbarkeit: Kurs ist buchbar', av1.bookable === true, `bookable ${av1.bookable}`);
  check('Verfuegbarkeit: gemeinsamer Pool ist voll', av1.capacity === 2 && av1.free === 0, `${av1.free}/${av1.capacity}`);
  check('Verfuegbarkeit: Leader und Follower haben denselben Poolstand', av1.freeLeader === 0 && av1.freeFollower === 0, `${av1.freeLeader}/${av1.freeFollower}`);
  check(
    'Verfuegbarkeit: Normal-Tarif traegt Preis 190.-',
    av1.tariffs.find((tariff) => tariff.key === 'normal')?.amountChf === '190.00',
    `normal ${av1.tariffs.find((tariff) => tariff.key === 'normal')?.amountChf}`,
  );
  check(
    'Verfuegbarkeit: Tarife ohne eigenen Preis fallen auf Normal-Preis zurueck',
    av1.tariffs.every((tariff) => tariff.amountChf !== null),
    `keys ${av1.tariffs.map((tariff) => `${tariff.key}=${tariff.amountChf}`).join(',')}`,
  );

  const bal1 = await balance();
  check('Balance: Pool-Kapazitaet = 2', bal1.capacityTotal === 2 && bal1.capacity === 2, `${bal1.capacityTotal}`);
  check('Balance: 2 Plaetze belegt', bal1.confirmed === 2 && bal1.free === 0, `${bal1.confirmed} bestaetigt / ${bal1.free} frei`);
  check('Balance: 2 Buchungen warten', bal1.waitlist === 2, `${bal1.waitlist}`);

  /* 6) Jede Bestaetigung sendet eine Mail an den User und an info@. */
  const courseBookingIds = (await db.select().from(bookings).where(eq(bookings.courseId, courseId))).map((booking) => booking.id);
  const confirmationNotifs = (await db.select().from(notifications).where(inArray(notifications.bookingId, courseBookingIds)))
    .filter((notification) => notification.kind === 'booking_confirmation');
  check('Bestaetigungsmails: 2 Buchungen x User + info@', confirmationNotifs.length === 4, `${confirmationNotifs.length}`);
  check('Alle Bestaetigungsmails haben Status sent', confirmationNotifs.every((notification) => notification.status === 'sent'), 'sent');
  check('Bestaetigungsmails: je eine info@-Mail pro Buchung', confirmationNotifs.filter((notification) => notification.toEmail === INFO_EMAIL).length === 2, 'info@');
  check(
    'Bestaetigungsmails: Anna und Ben erhalten je eine User-Mail',
    confirmationNotifs.some((notification) => notification.toEmail === `anna${TEST_DOMAIN}`) &&
      confirmationNotifs.some((notification) => notification.toEmail === `ben${TEST_DOMAIN}`),
    'User-Empfaenger vorhanden',
  );

  /* 7) Storno eines Platzes -> erste Wartelisten-Buchung rueckt nach. */
  const cancelA = await cancel(a.json.bookingId!);
  check('Storno gibt einen Pool-Platz frei', cancelA.ok === true, `ok ${cancelA.ok}`);
  check('Storno rueckt genau eine Einzelbuchung nach', cancelA.promoted === 1, `promoted ${cancelA.promoted}`);
  const carlaRow = (await db.select().from(bookings).where(eq(bookings.id, c.json.bookingId!)))[0];
  const doraWaitingRow = (await db.select().from(bookings).where(eq(bookings.id, d.json.bookingId!)))[0];
  check('Nachgerueckte Followerin ist bestaetigt', carlaRow?.status === 'confirmed' && carlaRow.waitlistPosition === null, `status ${carlaRow?.status}`);
  check('Paar wartet weiter auf zwei freie Plaetze', doraWaitingRow?.status === 'waitlisted' && doraWaitingRow.waitlistPosition === 1, `status ${doraWaitingRow?.status} / pos ${doraWaitingRow?.waitlistPosition}`);

  const carlaPromoNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, c.json.bookingId!)))
    .filter((notification) => notification.kind === 'waitlist_promoted');
  check('Nachrueck-Mails: Carla + info@, Status sent', carlaPromoNotifs.length === 2 && carlaPromoNotifs.every((notification) => notification.status === 'sent'), `${carlaPromoNotifs.length}`);
  check(
    'Nachrueck-Mails: Carla und info@ sind Empfaenger',
    carlaPromoNotifs.some((notification) => notification.toEmail === `carla${TEST_DOMAIN}`) &&
      carlaPromoNotifs.some((notification) => notification.toEmail === INFO_EMAIL),
    'User + info@',
  );

  const bal2 = await balance();
  check('Balance nach erstem Storno: Pool bleibt voll', bal2.confirmed === 2 && bal2.free === 0, `${bal2.confirmed} bestaetigt / ${bal2.free} frei`);
  check('Balance nach erstem Storno: eine Buchung wartet', bal2.waitlist === 1, `${bal2.waitlist}`);

  /* 8) Zwei weitere Einzelplaetze frei -> Paar rueckt als Zwei-Platz-Buchung nach. */
  const cancelCarla = await cancel(c.json.bookingId!);
  check('Storno der nachgerueckten Einzelbuchung gibt einen Platz frei', cancelCarla.promoted === 0, `promoted ${cancelCarla.promoted}`);
  const cancelBen = await cancel(b.json.bookingId!);
  check('Zweiter Storno gibt genug Pool-Plaetze fuer das Paar frei', cancelBen.promoted === 1, `promoted ${cancelBen.promoted}`);
  const doraRow = (await db.select().from(bookings).where(eq(bookings.id, d.json.bookingId!)))[0];
  check('Paar rueckt mit zwei Plaetzen nach und wird bestaetigt', doraRow?.status === 'confirmed' && doraRow.waitlistPosition === null, `status ${doraRow?.status}`);
  const doraPromoNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, d.json.bookingId!)))
    .filter((notification) => notification.kind === 'waitlist_promoted');
  check('Paar-Nachrueck-Mails gehen an User + info@', doraPromoNotifs.length === 2 && doraPromoNotifs.every((notification) => notification.status === 'sent'), `${doraPromoNotifs.length}`);

  const bal3 = await balance();
  check('Balance nach vollstaendigem Nachruecken: Pool wieder voll belegt', bal3.confirmed === 2 && bal3.free === 0, `${bal3.confirmed} bestaetigt / ${bal3.free} frei`);
  check('Balance nach vollstaendigem Nachruecken: Warteliste leer', bal3.waitlist === 0, `${bal3.waitlist}`);

  /* 9) Open-Kurs ohne Rollenzwang: Buchung wird ebenfalls bestaetigt. */
  const openCourseId = randomUUID();
  await db.insert(courses).values({
    id: openCourseId,
    termId,
    styleId: salsa.id,
    levelRungId: null,
    weekday: 'tue',
    startTime: '19:00:00',
    endTime: '20:00:00',
    locationId: loc.id,
    bookingType: 'open',
    capacityTotal: 10,
    allowsLateEntry: true,
    status: 'open',
  });
  await db.insert(coursePrices).values({ courseId: openCourseId, tariffId: normalT.id, amountChf: '30.00' });
  const openBooking = await book({ courseId: openCourseId, role: null, mode: 'solo', participant: person('Emil') });
  check('Open-Kurs: Buchung ohne Rolle wird bestaetigt', openBooking.status === 201 && openBooking.json.status === 'confirmed', `status ${openBooking.json.status}`);
  check('Open-Kurs: Rolle bleibt leer', openBooking.json.role === null, `role ${openBooking.json.role}`);

  // --- Cleanup (self-cleaning) ---------------------------------------------
  const allCourseIds = [courseId, openCourseId];
  const allBookingIds = (await db.select().from(bookings).where(inArray(bookings.courseId, allCourseIds))).map((booking) => booking.id);
  if (allBookingIds.length > 0) {
    await db.delete(notifications).where(inArray(notifications.bookingId, allBookingIds));
    await db.delete(bookings).where(inArray(bookings.id, allBookingIds));
  }
  await db.delete(coursePrices).where(inArray(coursePrices.courseId, allCourseIds));
  await db.delete(courses).where(inArray(courses.id, allCourseIds));
  await db.delete(terms).where(eq(terms.id, termId));
  await db.delete(participants).where(like(participants.email, `%${TEST_DOMAIN}`));

  await handle.close();

  /* Ausgabe ----------------------------------------------------------------- */
  console.log('\n=== Verify Buchungs-Flow Single-Pool ===');
  console.log(`DB-Treiber: ${handle.driver}\n`);
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
  console.error('[verify-booking] FEHLER:', err);
  process.exit(1);
});
