import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { createContactRoutes } from '../server/contact-routes.js';
import { createReservationRoutes, type SeedSchedule } from '../server/reservation-routes.js';
import { openDb } from '../db/client.js';
import { createApp, loadDbCoursesForReservation } from '../server/app.js';
import { createPublicRoutes } from '../server/public.js';

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

// Dieser oeffentliche Vertrag bleibt auf Vercel unabhaengig von DATABASE_URL stabil.
// Die Datenbank darf Admin-Routen ergaenzen, aber weder Kurs-IDs noch den beschlossenen
// Reservierungsweg gegen den alten Kauf-Funnel austauschen.
const publicContractApp = new Hono();

publicContractApp.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'salsaflow-dc-api',
    mode: 'vercel-reservation',
    bookingEnabled: false,
    reservationEnabled: true,
    contactConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
  }),
);

publicContractApp.get('/api/public/schedule', async (c) => c.json(await currentSchedule()));
publicContractApp.get('/api/public/events', (c) => c.json({ today: todayISO(), events: [] }));

publicContractApp.route('/', createContactRoutes());
publicContractApp.route(
  '/',
  createReservationRoutes(async () => {
    // SAFETY: schedulePromise liest db/seed/public-schedule.json, das genau die
    // SeedSchedule-Form hat (gepruefte Seed-Datei im Repo, kein Fremdinput).
    const schedule = (await schedulePromise) as SeedSchedule;
    return schedule;
  }),
);

const retiredBooking = (c: Context) =>
  c.json(
    {
      error: 'Der frühere Kaufweg ist geschlossen.',
      detail: 'Kursplätze werden per Reservierung gemeldet und vor Ort bezahlt.',
    },
    410,
  );
publicContractApp.post('/api/public/bookings', retiredBooking);
publicContractApp.all('/api/public/bookings/*', retiredBooking);

const staticApp = new Hono();
staticApp.route('/', publicContractApp);

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

type EditorialSchedule = { terms?: unknown[] };

export function createDatabaseRuntime(db: Parameters<typeof createApp>[0]) {
  const app = new Hono();
  const editorial = createPublicRoutes(db);
  const reservationHealth = {
    ok: true,
    service: 'salsaflow-dc-api',
    mode: 'vercel-reservation',
    bookingEnabled: false,
    reservationEnabled: true,
    contactConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
  } as const;

  app.get('/api/health', (c) => c.json(reservationHealth));

  // Redaktion vor createApp: sonst wuerde der alte Kauf-Funnel aus server/app.ts
  // die Reservierung und den Eventkalender wieder ueberschreiben.
  app.get('/api/public/schedule', async (c) => {
    c.header('Cache-Control', 'no-store');
    const response = await editorial.request('/api/public/schedule');
    const body = (await response.json()) as EditorialSchedule;
    if (Array.isArray(body.terms) && body.terms.length > 0) return c.json(body);
    return c.json(await currentSchedule());
  });
  app.get('/api/public/events', async (c) => {
    c.header('Cache-Control', 'no-store');
    return editorial.request('/api/public/events');
  });
  app.post('/api/public/bookings', retiredBooking);
  app.all('/api/public/bookings/*', retiredBooking);
  app.route(
    '/',
    createReservationRoutes(async () => {
      const response = await editorial.request('/api/public/schedule');
      const body = (await response.json()) as EditorialSchedule;
      if (Array.isArray(body.terms) && body.terms.length > 0) {
        return { courses: await loadDbCoursesForReservation(db) };
      }
      return (await schedulePromise) as SeedSchedule;
    }),
  );
  app.route('/', createApp(db));
  return app;
}

async function databaseApp() {
  const handle = await openDb();
  try {
    await handle.migrate();
  } catch (error) {
    try {
      await handle.close();
    } catch (closeError) {
      console.error('Failed to close database handle after initialization error.', closeError);
    }
    throw error;
  }
  return createDatabaseRuntime(handle.db);
}

type RuntimeOptions = {
  databaseUrl?: string;
  loadDatabaseApp?: () => Promise<Hono>;
  wait?: (milliseconds: number) => Promise<void>;
  report?: (error: Error) => void;
};

const transientDatabaseErrorSchema = z.object({
  code: z.enum(['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN', 'ENETUNREACH', 'EHOSTUNREACH']),
});

function isTransientDatabaseError(error: Error) {
  let current: Error | undefined = error;
  while (current) {
    if (transientDatabaseErrorSchema.safeParse(current).success) return true;
    current = current.cause instanceof Error ? current.cause : undefined;
  }
  return false;
}

const waitForRetry = (milliseconds: number) =>
  new Promise<void>((resolveRetry) => setTimeout(resolveRetry, milliseconds));

export async function runtimeApp({
  databaseUrl = process.env.DATABASE_URL,
  loadDatabaseApp = databaseApp,
  wait = waitForRetry,
  report = (error) => console.error('Database initialization failed; serving the public API only.', error),
}: RuntimeOptions = {}) {
  if (!databaseUrl?.trim()) return staticApp;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await loadDatabaseApp();
    } catch (caughtError) {
      const error = caughtError instanceof Error ? caughtError : new Error('Database initialization failed.');
      lastError = error;
      if (!isTransientDatabaseError(error) || attempt === 1) break;
      await wait(150);
    }
  }

  report(lastError ?? new Error('Database initialization failed.'));
  return staticApp;
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
