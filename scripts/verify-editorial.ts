import 'dotenv/config';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { eq } from 'drizzle-orm';
import { events, locations, teachers } from '../db/schema.js';

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

const ADMIN_EMAIL = 'admin@salsaflow-dc.com';
const ADMIN_PW = process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026';

async function main() {
  const tmpDataDir = mkdtempSync(join(tmpdir(), 'salsaflow-verify-editorial-'));
  process.env.PGLITE_DATA_DIR = tmpDataDir;
  delete process.env.DATABASE_URL;

  const [{ openDb }, { createDatabaseRuntime }, { runSeed }] = await Promise.all([
    import('../db/client.js'),
    import('../api/index.js'),
    import('./seed.js'),
  ]);

  let handle = await openDb();
  await handle.migrate();
  await handle.close();
  await runSeed();
  handle = await openDb();
  const app = createDatabaseRuntime(handle.db);

  try {
    const health = await app.request('/api/health');
    const healthBody = (await health.json()) as { mode?: string; bookingEnabled?: boolean; reservationEnabled?: boolean };
    check('Health bleibt Reservierungsmodus', healthBody.mode === 'vercel-reservation', healthBody.mode ?? 'kein mode');
    check('Kein Online-Kauf im Health', healthBody.bookingEnabled === false && healthBody.reservationEnabled === true, JSON.stringify(healthBody));

    const schedule = await app.request('/api/public/schedule');
    const scheduleBody = (await schedule.json()) as {
      terms: { name: string }[];
      courses: { id: string; status: string; teachers?: { displayName: string }[]; locationName?: string }[];
      bookingEnabled?: boolean;
      reservationEnabled?: boolean;
    };
    check('Kursplan aus der DB, nicht leer', schedule.status === 200 && scheduleBody.terms.length > 0, `${scheduleBody.terms.length} Staffeln`);
    check('Kursplan hat aktuelle Staffeln', scheduleBody.terms.some((term) => term.name.includes('August') || term.name.includes('Oktober')), scheduleBody.terms.map((term) => term.name).join(', '));
    check('Reservierung statt Kauf', scheduleBody.bookingEnabled === false && scheduleBody.reservationEnabled === true, `booking=${String(scheduleBody.bookingEnabled)} reservation=${String(scheduleBody.reservationEnabled)}`);
    check('Kursplan nicht gecacht', schedule.headers.get('cache-control') === 'no-store', schedule.headers.get('cache-control') ?? 'kein header');

    const retired = await app.request('/api/public/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    check('Alter Kaufweg bleibt geschlossen (410)', retired.status === 410, `status ${retired.status}`);

    const courseId = scheduleBody.courses.find((course) => course.status === 'open')?.id;
    check('Mindestens ein offener Kurs im Plan', Boolean(courseId), courseId ?? 'kein Kurs');
    if (courseId) {
      const availability = await app.request(`/api/public/courses/${courseId}/availability`);
      const availabilityBody = (await availability.json()) as { mode?: string; bookable?: boolean };
      check('Reservierung kennt denselben Kurs', availability.status === 200 && availabilityBody.mode === 'reservation' && availabilityBody.bookable === true, JSON.stringify(availabilityBody));
    }

    const login = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PW }),
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0];
    check('Admin-Login gegen dieselbe Runtime', cookie.startsWith('sf_session='), cookie.split('=')[0] || 'kein Cookie');

    const create = await app.request('/api/admin/events', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({
        slug: 'editorial-verify-workshop',
        format: 'workshop',
        titleDe: 'Editorial Verify Workshop',
        titleEn: 'Editorial Verify Workshop',
        summaryDe: 'Ein verifizierbarer Termin, der nach dem Speichern sofort öffentlich sichtbar sein muss.',
        summaryEn: 'A verifiable date that must appear publicly immediately after saving.',
        startDate: '2027-03-12',
        endDate: null,
        startTime: '19:30',
        endTime: '21:00',
        location: 'Salsaflow Basel',
        ticketUrl: 'https://eventfrog.ch/salsaflow',
        detailUrl: '/events-workshops/eventkalender',
        imageUrl: null,
        imageAltDe: null,
        imageAltEn: null,
        featured: true,
        status: 'published',
        sort: 1,
      }),
    });
    const created = (await create.json()) as { id?: string };
    check('Event anlegen und veröffentlichen -> 201', create.status === 201 && Boolean(created.id), `status ${create.status}`);
    if (created.id) {
      const publicEvents = await app.request('/api/public/events');
      const publicBody = (await publicEvents.json()) as { events?: { id: string; titleDe: string }[] };
      const visible = publicBody.events?.find((event) => event.id === created.id);
      check('Veröffentlichtes Event erscheint sofort öffentlich', Boolean(visible), visible?.titleDe ?? 'fehlt');
      check('Eventkalender nicht gecacht', publicEvents.headers.get('cache-control') === 'no-store', publicEvents.headers.get('cache-control') ?? 'kein header');
      await handle.db.delete(events).where(eq(events.id, created.id));
    }

    const teacherCreate = await app.request('/api/admin/teachers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ displayName: 'Editorial Guest', role: 'Guest', isActive: true }),
    });
    const teacherBody = (await teacherCreate.json()) as { id?: string };
    check('Lehrer anlegen -> 201', teacherCreate.status === 201 && Boolean(teacherBody.id), `status ${teacherCreate.status}`);

    const locationCreate = await app.request('/api/admin/locations', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Studio Editorial', address: 'Teststrasse 1, 4051 Basel' }),
    });
    const locationBody = (await locationCreate.json()) as { id?: string };
    check('Studio anlegen -> 201', locationCreate.status === 201 && Boolean(locationBody.id), `status ${locationCreate.status}`);

    const meta = await app.request('/api/admin/meta', { headers: { cookie } });
    const metaBody = (await meta.json()) as {
      teachers: { id: string; displayName: string }[];
      locations: { id: string; name: string }[];
      styles: { id: string }[];
      weekdays: { key: string }[];
    };
    check('Neuer Lehrer steht in der Kursauswahl', Boolean(teacherBody.id && metaBody.teachers.some((teacher) => teacher.id === teacherBody.id)), teacherBody.id ?? 'kein Lehrer');
    check('Neues Studio steht in der Kursauswahl', Boolean(locationBody.id && metaBody.locations.some((location) => location.id === locationBody.id)), locationBody.id ?? 'kein Studio');

    const openCourseId = scheduleBody.courses.find((course) => course.status === 'open')?.id;
    const termsList = await app.request('/api/admin/terms', { headers: { cookie } });
    const termsBody = (await termsList.json()) as { terms: { id: string; status: string }[] };
    let original: { id: string; locationId: string; teachers: { id: string }[] } | undefined;
    for (const term of termsBody.terms.filter((item) => item.status === 'published')) {
      const detail = await app.request(`/api/admin/terms/${term.id}`, { headers: { cookie } });
      const detailBody = (await detail.json()) as { courses?: { id: string; locationId: string; teachers: { id: string }[] }[] };
      original = detailBody.courses?.find((course) => course.id === openCourseId);
      if (original) break;
    }
    if (openCourseId && teacherBody.id && locationBody.id && original) {
      const patch = await app.request(`/api/admin/courses/${openCourseId}`, {
        method: 'PATCH',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify({ teacherIds: [teacherBody.id], locationId: locationBody.id }),
      });
      check('Kurs auf neuen Lehrer und neues Studio umhängen', patch.status === 200, `status ${patch.status}`);
      const live = await app.request('/api/public/schedule');
      const liveBody = (await live.json()) as { courses: { id: string; teachers?: { displayName: string }[]; locationName?: string }[] };
      const liveCourse = liveBody.courses.find((course) => course.id === openCourseId);
      check('Öffentlicher Kursplan zeigt den neuen Lehrer', Boolean(liveCourse?.teachers?.some((teacher) => teacher.displayName === 'Editorial Guest')), liveCourse?.teachers?.map((teacher) => teacher.displayName).join(', ') ?? 'fehlt');
      check('Öffentlicher Kursplan zeigt das neue Studio', liveCourse?.locationName === 'Studio Editorial', liveCourse?.locationName ?? 'fehlt');
      await app.request(`/api/admin/courses/${openCourseId}`, {
        method: 'PATCH',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify({
          teacherIds: original.teachers.map((teacher) => teacher.id),
          locationId: original.locationId,
        }),
      });
    } else {
      check('Kurs auf neuen Lehrer und neues Studio umhängen', false, 'kein offener Kurs oder fehlende Stammdaten');
    }

    if (teacherBody.id) await handle.db.delete(teachers).where(eq(teachers.id, teacherBody.id));
    if (locationBody.id) await handle.db.delete(locations).where(eq(locations.id, locationBody.id));

    const failed = checks.filter((item) => !item.ok).length;
    for (const item of checks) {
      console.log(`  ${item.ok ? 'PASS' : 'FAIL'}  ${item.name}  (${item.detail})`);
    }
    console.log(`\nVERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${checks.length - failed}/${checks.length} Checks gruen)`);
    process.exitCode = failed === 0 ? 0 : 1;
  } finally {
    await handle.close();
    rmSync(tmpDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
