import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Hono } from 'hono';
import { createContactRoutes } from '../server/contact-routes.js';
import { createReservationRoutes, type SeedSchedule } from '../server/reservation-routes.js';
import { openDb } from '../db/client.js';
import { createApp } from '../server/app.js';

const here = dirname(fileURLToPath(import.meta.url));
const schedulePath = resolve(here, '../db/seed/public-schedule.json');
const schedulePromise = readFile(schedulePath, 'utf8').then((raw) => JSON.parse(raw));

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function currentSchedule() {
  const source = await schedulePromise;
  const today = todayISO();
  const terms = source.terms
    .filter((term: { endDate: string }) => term.endDate >= today)
    .map((term: { startDate: string }) => ({
      ...term,
      phase: term.startDate <= today ? 'running' : 'upcoming',
    }));
  const termPhase = new Map(terms.map((term: { id: string; phase: string }) => [term.id, term.phase]));
  const courses = source.courses
    .filter((course: { termId: string }) => termPhase.has(course.termId))
    .map((course: { termId: string }) => ({ ...course, phase: termPhase.get(course.termId) }));
  // bookingEnabled bleibt false: es gibt keinen Kauf. reservationEnabled ist der Weg,
  // den der Funnel unter /buchung geht — Platz melden, zahlen vor Ort.
  return { ...source, today, terms, courses, bookingEnabled: false, reservationEnabled: true };
}

const staticApp = new Hono();

staticApp.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'salsaflow-dc-api',
    mode: 'vercel-static',
    bookingEnabled: false,
    reservationEnabled: true,
    contactConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
  }),
);

staticApp.get('/api/public/schedule', async (c) => c.json(await currentSchedule()));
staticApp.get('/api/public/events', (c) => c.json({ today: todayISO(), events: [] }));

staticApp.route('/', createContactRoutes());
staticApp.route(
  '/',
  createReservationRoutes(async () => {
    // SAFETY: schedulePromise liest db/seed/public-schedule.json, das genau die
    // SeedSchedule-Form hat (gepruefte Seed-Datei im Repo, kein Fremdinput).
    const schedule = (await schedulePromise) as SeedSchedule;
    return schedule;
  }),
);

// Alles Uebrige unter /api ist Kauf-/Admin-Mechanik und braucht eine Datenbank.
// Die gibt es hier nicht. Ehrliche 503 statt stiller Fehler.
staticApp.all('/api/*', (c) =>
  c.json(
    {
      error: 'Dieser Weg ist auf dieser Website nicht offen.',
      detail: 'Kursplätze laufen über die Reservierung, alles andere über das Kontaktformular.',
    },
    503,
  ),
);

async function runtimeApp() {
  if (!process.env.DATABASE_URL?.trim()) return staticApp;
  const handle = await openDb();
  await handle.migrate();
  return createApp(handle.db);
}

const appPromise = runtimeApp();
async function dispatch(request: Request) {
  const app = await appPromise;
  return app.fetch(request);
}

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
