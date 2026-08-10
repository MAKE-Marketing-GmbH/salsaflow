import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { openDb } from '../db/client.js';
import {
  adminProfiles,
  styles,
  levelRungs,
  tariffs,
  teachers,
  terms,
  courses,
  coursePrices,
} from '../db/schema.js';
import { createApp } from '../server/app.js';
import { issueSession, verifyPassword, verifySession } from '../server/auth.js';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = resolve(here, '../db/seed/januar-2026.json');

const EXPECTED_TABLES = [
  'admin_profiles',
  'audit_log',
  'locations',
  'teachers',
  'styles',
  'level_rungs',
  'terms',
  'courses',
  'course_teachers',
  'tariffs',
  'course_prices',
  'participants',
  'bookings',
  'payments',
  'payment_events',
  'notifications',
];

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

async function main() {
  const handle = await openDb();
  const { db } = handle;

  /* 1) Migration: alle Tabellen vorhanden -------------------------------- */
  const tableRows = (
    await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    )
  ).rows as { table_name: string }[];
  const present = new Set(tableRows.map((r) => r.table_name));
  const missing = EXPECTED_TABLES.filter((t) => !present.has(t));
  check(
    'Migration: alle 16 Tabellen vorhanden',
    missing.length === 0,
    missing.length === 0 ? `${EXPECTED_TABLES.length}/16 da` : `fehlt: ${missing.join(', ')}`,
  );

  /* 2) Seed: Stammdaten + Staffel ---------------------------------------- */
  const styleCount = (await db.select().from(styles)).length;
  check('Seed: 10 Stile', styleCount === 10, `${styleCount} Stile`);

  const rungCount = (await db.select().from(levelRungs)).length;
  check('Seed: Level-Leitern vorhanden', rungCount >= 20, `${rungCount} Rungs`);

  const tariffCount = (await db.select().from(tariffs)).length;
  check('Seed: 5 Tarife', tariffCount === 5, `${tariffCount} Tarife`);

  const teacherCount = (await db.select().from(teachers)).length;
  check('Seed: Lehrer vorhanden', teacherCount > 0, `${teacherCount} Lehrer`);

  const termRows = await db.select().from(terms).where(eq(terms.name, 'Staffel Januar 2026'));
  check('Seed: Staffel Januar 2026 in DB', termRows.length === 1, `${termRows.length} Term`);

  const source = JSON.parse(await readFile(SOURCE_PATH, 'utf8')) as {
    courses: { is_workshop: boolean }[];
  };
  const expectedCourses = source.courses.filter((c) => !c.is_workshop).length;
  const courseCount = termRows.length
    ? (await db.select().from(courses).where(eq(courses.termId, termRows[0].id))).length
    : 0;
  check(
    'Seed: Kurse der Staffel = Excel-Header',
    courseCount === expectedCourses && courseCount > 0,
    `${courseCount} Kurse (erwartet ${expectedCourses})`,
  );

  const priceCount = (await db.select().from(coursePrices)).length;
  check('Seed: Kurs-Preise (Normal/ermaessigt)', priceCount >= courseCount, `${priceCount} Preise`);

  /* 3) Auth-Logik: Passwort-Hash + Session ------------------------------- */
  const adminRows = await db
    .select()
    .from(adminProfiles)
    .where(eq(adminProfiles.email, 'admin@salsaflow-dc.com'));
  const admin = adminRows[0];
  check('Auth: Admin-Account geseedet', !!admin, admin ? admin.email : 'kein Admin');

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026';
  if (admin) {
    check(
      'Auth: korrektes Passwort akzeptiert',
      verifyPassword(adminPassword, admin.passwordHash),
      'verifyPassword(richtig) = true',
    );
    check(
      'Auth: falsches Passwort abgelehnt',
      !verifyPassword('falsch-falsch', admin.passwordHash),
      'verifyPassword(falsch) = false',
    );
    const token = issueSession(admin.id);
    check('Auth: gueltige Session akzeptiert', verifySession(token)?.sub === admin.id, 'Session-Roundtrip ok');
    check('Auth: manipulierte Session abgelehnt', verifySession(token + 'x') === null, 'Tamper erkannt');
  }

  /* 4) End-to-End: echter HTTP-Login ueber die Hono-Route ----------------- */
  const app = createApp(db);

  const okRes = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salsaflow-dc.com', password: adminPassword }),
  });
  const okBody = (await okRes.clone().json().catch(() => ({}))) as { user?: { email?: string } };
  check(
    'HTTP: Login mit richtigem Passwort -> 200',
    okRes.status === 200 && okBody.user?.email === 'admin@salsaflow-dc.com',
    `status ${okRes.status}`,
  );

  const setCookie = okRes.headers.get('set-cookie') ?? '';
  const sessionCookie = setCookie.split(';')[0];
  check('HTTP: Session-Cookie gesetzt', sessionCookie.startsWith('sf_session='), sessionCookie.split('=')[0] || 'kein Cookie');

  const meRes = await app.request('/api/auth/me', { headers: { cookie: sessionCookie } });
  check('HTTP: /me mit Cookie -> 200', meRes.status === 200, `status ${meRes.status}`);

  const meNoCookie = await app.request('/api/auth/me');
  check('HTTP: /me ohne Cookie -> 401', meNoCookie.status === 401, `status ${meNoCookie.status}`);

  const badRes = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salsaflow-dc.com', password: 'falsch' }),
  });
  check('HTTP: Login mit falschem Passwort -> 401', badRes.status === 401, `status ${badRes.status}`);

  await handle.close();

  /* Ausgabe -------------------------------------------------------------- */
  console.log('\n=== Etappe 5 Verify (Backend + DB + Auth) ===');
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
  console.error('[verify] FEHLER:', err);
  process.exit(1);
});
