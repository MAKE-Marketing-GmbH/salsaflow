// Reservierung ohne Datenbank und ohne Zahlung (Beschluss 13.08.2026).
//
// Warum es diese Route gibt: Der Buchungs-Funnel unter /buchung war live tot. Er rief die
// DB-Endpunkte, die auf Vercel nicht existieren, und bekam 503. Der Funnel war aber nie ein
// Kauf — er ist eine Reservierung: "Platz melden, zahlen vor Ort". Also braucht er keine
// Datenbank. Er braucht eine Mail.
//
// Diese Route spiegelt darum server/booking-routes.ts im Vertrag, aber:
//   - keine Datenbank, keine Transaktion, kein Kapazitaets-Zaehler
//   - kein Preis, keine Tarife, kein Stripe
//   - eine Reservierung erzeugt genau eine Mail an INFO_EMAIL
// Der Kurs-Status kommt aus db/seed/public-schedule.json ("full" -> Warteliste, sonst frei).
//
// Scheitert der Mailversand, antwortet die Route mit Fehler. Kein Fake-Erfolg.

import { Hono } from 'hono';
import { z } from 'zod';
import { INFO_EMAIL, sendMail } from './mail.js';
import { clientKey, rateLimit } from './rate-limit.js';

type SeedTeacher = { displayName: string };
type SeedCourse = {
  id: string;
  styleDe: string;
  styleEn: string;
  levelDe: string;
  levelEn: string;
  weekday: string;
  startTime: string;
  endTime: string;
  locationName: string;
  status: string;
  teachers?: SeedTeacher[];
};
type SeedSchedule = { courses: SeedCourse[] };

const WEEKDAY_DE: Record<string, string> = {
  mon: 'Montag',
  tue: 'Dienstag',
  wed: 'Mittwoch',
  thu: 'Donnerstag',
  fri: 'Freitag',
  sat: 'Samstag',
  sun: 'Sonntag',
};

// Namen und Telefonnummern landen in der Betreffzeile der Mail. Ein Zeilenumbruch darin
// wuerde dort eine neue Kopfzeile oeffnen (siehe headerSafe in server/mail.ts). Zwei Ebenen:
// hier abweisen, dort zusaetzlich saeubern.
const singleLine = z.string().trim().regex(/^[^\r\n]*$/, 'Zeilenumbrüche sind nicht erlaubt');

// Nachname und E-Mail sind Pflicht — genau wie im Formular (BookingPanel.tsx). Vorher war der
// Server lockerer: per curl kam eine Reservierung ohne Nachname und ohne E-Mail durch, und das
// Studio bekam eine Anfrage, mit der es niemanden zuordnen oder erreichen kann.
const personSchema = z.object({
  firstName: singleLine.min(1).max(80),
  lastName: singleLine.min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: singleLine.max(40).optional().default(''),
});

const reservationSchema = z
  .object({
    // Kurs-IDs sind UUIDs aus dem Plan. Die enge Form haelt Muell frueh ab.
    courseId: z.string().trim().min(1).max(80),
    role: z.enum(['leader', 'follower']).nullable().optional(),
    mode: z.enum(['solo', 'couple']).default('solo'),
    participant: personSchema,
    partner: personSchema.nullable().optional(),
    needsAushilfe: z.boolean().optional(),
    language: z.enum(['de', 'en']).optional(),
    notes: z.string().trim().max(2000).optional().default(''),
    // Honeypot wie im Kontaktformular: gefuellt -> still verwerfen.
    website: z.string().optional(),
  });

function personLine(label: string, person: z.infer<typeof personSchema>) {
  const name = [person.firstName.trim(), person.lastName.trim()].filter(Boolean).join(' ');
  return (
    `${label}: ${name}\n` +
    `  E-Mail: ${person.email?.trim() || '(nicht angegeben)'}\n` +
    `  Telefon: ${person.phone?.trim() || '(nicht angegeben)'}\n`
  );
}

/**
 * Reservierungs-Routen. `loadSchedule` liefert den Seed-Plan; so bleibt die Route
 * unabhaengig davon, ob der Plan aus einer Datei oder spaeter aus einer DB kommt.
 */
export function createReservationRoutes(loadSchedule: () => Promise<SeedSchedule>) {
  const app = new Hono();

  // Verfuegbarkeit: nur "kann man reservieren, ja oder nein". Keine Platzzahlen, keine Preise.
  // Platzzahlen waeren ohne Datenbank geraten — und geraten ist schlimmer als weglassen.
  app.get('/api/public/courses/:courseId/availability', async (c) => {
    const schedule = await loadSchedule();
    const course = schedule.courses.find((entry) => entry.id === c.req.param('courseId'));
    if (!course) return c.json({ error: 'Kurs nicht gefunden' }, 404);
    const full = course.status === 'full';
    return c.json({
      courseId: course.id,
      mode: 'reservation',
      bookable: true,
      full,
      status: course.status,
    });
  });

  app.post('/api/public/reservations', async (c) => {
    // Jede gueltige Reservierung erzeugt eine Mail ans Studio. Fuenf in zehn Minuten decken
    // jeden echten Fall ab — auch wer sich zu zweit anmeldet und einmal danebengreift.
    const limit = rateLimit(clientKey(c.req.raw.headers, 'reservations'), 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return c.json(
        { error: 'Zu viele Anfragen in kurzer Zeit. Bitte versuch es später noch einmal.' },
        429,
        { 'retry-after': String(limit.retryAfterSeconds) },
      );
    }

    const parsed = reservationSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    }
    const d = parsed.data;

    if (d.website && d.website.trim().length > 0) {
      return c.json({ ok: true, skipped: true }, 200);
    }

    const schedule = await loadSchedule();
    const course = schedule.courses.find((entry) => entry.id === d.courseId);
    if (!course) return c.json({ error: 'Kurs nicht gefunden' }, 404);

    const full = course.status === 'full';
    const status: 'waitlisted' | 'reserved' = full ? 'waitlisted' : 'reserved';
    const replyEmail = d.participant.email?.trim() || null;
    const courseLine =
      `${course.styleDe} · ${course.levelDe}\n` +
      `  ${WEEKDAY_DE[course.weekday] ?? course.weekday} ${course.startTime}–${course.endTime}\n` +
      `  ${course.locationName}\n` +
      (course.teachers?.length ? `  Leitung: ${course.teachers.map((t) => t.displayName).join(', ')}\n` : '');

    const roleLabel = d.role === 'leader' ? 'Leader' : d.role === 'follower' ? 'Follower' : '(offen)';
    const headline = full ? 'Warteliste' : 'Reservierung';
    const subject = `${headline}: ${course.styleDe} ${course.levelDe} - ${d.participant.firstName.trim()}`;

    const text =
      `Neue ${full ? 'Anfrage für die Warteliste' : 'Reservierung'} über den Kursplan der Website.\n\n` +
      `Kurs:\n  ${courseLine}\n` +
      `Rolle: ${roleLabel}\n` +
      `Anmeldung: ${d.mode === 'couple' ? 'zu zweit' : 'alleine'}\n` +
      (d.needsAushilfe ? `Tanzpartner gesucht: ja\n` : '') +
      `\n` +
      personLine('Teilnehmer', d.participant) +
      (d.partner ? personLine('Partner', d.partner) : '') +
      `\nSprache: ${d.language === 'en' ? 'Englisch' : 'Deutsch'}\n` +
      (d.notes.trim() ? `\nNachricht:\n${d.notes.trim()}\n` : '') +
      `\n${full
        ? 'Der Kurs ist als ausgebucht markiert. Bitte auf die Warteliste setzen und Bescheid geben.'
        : 'Bitte den Platz bestätigen. Bezahlt wird vor Ort (Twint oder bar).'}\n` +
      (replyEmail ? `\nAntwort geht direkt an ${replyEmail} (Reply-To gesetzt).\n` : `\nAntwort bitte per Telefon oder WhatsApp.\n`);

    const res = await sendMail({
      to: INFO_EMAIL,
      replyTo: replyEmail ?? undefined,
      subject,
      text,
      tag: `reservierung_${status}`,
    });

    if (!res.ok) {
      // Der Grund bleibt im Log. Frueher ging die rohe Antwort des Mailanbieters an den
      // Client — sie nannte Anbieter und Fehlerdetails und half beim Verfeinern eines Angriffs.
      console.error('[reservation] Mailversand fehlgeschlagen:', res.error);
      return c.json({ error: 'Reservierung konnte nicht gesendet werden' }, 502);
    }

    return c.json({ ok: true, status, courseId: course.id }, 200);
  });

  return app;
}
