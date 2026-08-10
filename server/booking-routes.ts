// Oeffentliche Buchungs-API (Etappe 8): Verfuegbarkeit eines Kurses + eine Buchung anstossen.
// KEIN Auth-Gate (Gegenstueck zum Kursplan), aber bewusst schlank: gibt freie Plaetze je Rolle
// heraus (keine Personenbezuege), nimmt eine Buchung an und reserviert/wartelistet serverseitig.
// Logik komplett in server/booking.ts (Architektur Abschnitt 5/6). Zahlung ist Etappe 9.

import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from '../db/client.js';
import { courses, coursePrices, tariffs, terms } from '../db/schema.js';
import { BookingError, computeAvailability, reserveBooking } from './booking.js';

const personSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().nullable(),
});

const bookingSchema = z.object({
  courseId: z.string().uuid(),
  role: z.enum(['leader', 'follower']).nullable().optional(),
  mode: z.enum(['solo', 'couple']),
  participant: personSchema,
  partner: personSchema.optional().nullable(),
  tariffKey: z.string().max(40).optional(),
  needsAushilfe: z.boolean().optional(),
  language: z.enum(['de', 'en']).optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export function createBookingRoutes(db: Db) {
  const app = new Hono();

  // --- Verfuegbarkeit (fuer den Buchungs-Dialog) ---------------------------
  app.get('/api/public/courses/:id/availability', async (c) => {
    const id = c.req.param('id');
    const courseRows = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    const course = courseRows[0];
    if (!course) return c.json({ error: 'Kurs nicht gefunden' }, 404);

    const termRows = await db.select().from(terms).where(eq(terms.id, course.termId)).limit(1);
    const term = termRows[0];
    const bookable =
      !!term &&
      term.status === 'published' &&
      (course.status === 'open' || course.status === 'full');

    const avail = await computeAvailability(db, id);
    const tariffRows = (await db.select().from(tariffs))
      .filter((t) => t.isActive)
      .sort((a, b) => a.sort - b.sort);

    // Preise je Tarif aus course_prices (Beschluss Raphael 2026-07-21: Preis wird im
    // Buchungsschritt gezeigt). Fehlt ein Tarif-Preis, gilt der Normal-Preis als Fallback
    // (gleiche Regel wie priceFor in server/booking.ts).
    const priceRows = await db.select().from(coursePrices).where(eq(coursePrices.courseId, id));
    const normalTariffId = tariffRows.find((t) => t.key === 'normal')?.id ?? null;
    const normalPrice = normalTariffId
      ? (priceRows.find((p) => p.tariffId === normalTariffId)?.amountChf ?? null)
      : null;
    const pricedTariffs = tariffRows.map((t) => ({
      key: t.key,
      nameDe: t.nameDe,
      nameEn: t.nameEn,
      seats: t.seats,
      amountChf: priceRows.find((p) => p.tariffId === t.id)?.amountChf ?? normalPrice,
    }));

    return c.json({
      courseId: id,
      bookingType: course.bookingType,
      bookable,
      capacity: avail?.capacity ?? course.capacityTotal,
      free: avail?.free ?? 0,
      // Rollen bleiben informativ; die Verfuegbarkeit kommt aus dem einen Platzpool.
      freeLeader: avail?.free ?? 0,
      freeFollower: avail?.free ?? 0,
      freeOpen: avail?.free ?? 0,
      tariffs: pricedTariffs,
    });
  });

  // --- Buchung anstossen ---------------------------------------------------
  app.post('/api/public/bookings', async (c) => {
    const parsed = bookingSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    }
    try {
      const r = await reserveBooking(db, {
        courseId: parsed.data.courseId,
        role: parsed.data.role ?? null,
        mode: parsed.data.mode,
        participant: parsed.data.participant,
        partner: parsed.data.partner ?? null,
        tariffKey: parsed.data.tariffKey,
        needsAushilfe: parsed.data.needsAushilfe,
        language: parsed.data.language,
        notes: parsed.data.notes ?? null,
      });
      return c.json(r, 201);
    } catch (e) {
      if (e instanceof BookingError) return c.json({ error: e.message, code: e.code }, e.status as 400);
      console.error('[booking] unerwarteter Fehler:', e);
      return c.json({ error: 'Buchung fehlgeschlagen' }, 500);
    }
  });

  return app;
}
