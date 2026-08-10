// Oeffentliche Buchungs-Engine: ein gemeinsamer Platzpool pro Kurs.
// Rollen bleiben als Information an der Buchung, steuern aber weder Kapazitaet noch Warteliste.

import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../db/client.js';
import { bookings, coursePrices, courses, levelRungs, notifications, participants, styles, tariffs, terms } from '../db/schema.js';
import { INFO_EMAIL, sendMail } from './mail.js';

type Database = Pick<Db, 'select' | 'insert' | 'update' | 'delete'>;
type CourseRow = typeof courses.$inferSelect;
type BookingRow = typeof bookings.$inferSelect;

export type BookingRole = 'leader' | 'follower';
export type BookingModeT = 'solo' | 'couple';

export class BookingError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
  }
}

function seatsOf(booking: Pick<BookingRow, 'mode'>): number {
  return booking.mode === 'couple' ? 2 : 1;
}
function occupies(booking: BookingRow): boolean {
  return booking.status === 'confirmed' || booking.status === 'completed';
}

export type Availability = {
  courseId: string;
  bookingType: 'leader_follower' | 'open';
  status: CourseRow['status'];
  capacity: number;
  capacityTotal: number;
  free: number;
  freeLeader: number;
  freeFollower: number;
  freeOpen: number;
  confirmed: number;
  confirmedLeader: number;
  confirmedFollower: number;
  balance: number;
  needsAushilfeFollower: number;
  needsAushilfeLeader: number;
  waitlist: number;
  waitlistLeader: number;
  waitlistFollower: number;
  waitlistCouple: number;
  waitlistOpen: number;
};

export async function computeAvailability(db: Database, courseId: string): Promise<Availability | null> {
  const course = (await db.select().from(courses).where(eq(courses.id, courseId)).limit(1))[0];
  if (!course) return null;
  const rows = await db.select().from(bookings).where(eq(bookings.courseId, courseId));
  const active = rows.filter(occupies);
  const confirmed = active.reduce((sum, booking) => sum + seatsOf(booking), 0);
  const free = Math.max(0, course.capacityTotal - confirmed);
  const waitlisted = rows.filter((booking) => booking.status === 'waitlisted');
  const single = (role: BookingRole) => active.filter((booking) => booking.mode === 'solo' && booking.role === role).length;
  const wait = (role: BookingRole) => waitlisted.filter((booking) => booking.mode === 'solo' && booking.role === role).length;
  const confirmedLeader = single('leader') + active.filter((booking) => booking.mode === 'couple').length;
  const confirmedFollower = single('follower') + active.filter((booking) => booking.mode === 'couple').length;

  return {
    courseId,
    bookingType: course.bookingType,
    status: course.status,
    capacity: course.capacityTotal,
    capacityTotal: course.capacityTotal,
    free,
    // Kompatibilitaetsfelder fuer die bestehende Admin-Anzeige: alle zeigen denselben Pool.
    freeLeader: free,
    freeFollower: free,
    freeOpen: free,
    confirmed,
    confirmedLeader,
    confirmedFollower,
    balance: confirmedLeader - confirmedFollower,
    needsAushilfeFollower: active.filter((booking) => booking.mode === 'solo' && booking.role === 'leader' && booking.needsAushilfe).length,
    needsAushilfeLeader: active.filter((booking) => booking.mode === 'solo' && booking.role === 'follower' && booking.needsAushilfe).length,
    waitlist: waitlisted.length,
    waitlistLeader: wait('leader'),
    waitlistFollower: wait('follower'),
    waitlistCouple: waitlisted.filter((booking) => booking.mode === 'couple').length,
    waitlistOpen: course.bookingType === 'open' ? waitlisted.length : 0,
  };
}

type PersonInput = { firstName: string; lastName: string; email: string; phone?: string | null };
async function upsertParticipant(db: Database, person: PersonInput): Promise<string> {
  const email = person.email.toLowerCase().trim();
  const existing = (await db.select().from(participants).where(eq(participants.email, email)).limit(1))[0];
  if (existing) {
    await db.update(participants).set({ firstName: person.firstName.trim(), lastName: person.lastName.trim(), ...(person.phone ? { phone: person.phone.trim() } : {}) }).where(eq(participants.id, existing.id));
    return existing.id;
  }
  const id = randomUUID();
  await db.insert(participants).values({ id, firstName: person.firstName.trim(), lastName: person.lastName.trim(), email, phone: person.phone?.trim() ?? null });
  return id;
}
async function priceFor(db: Database, courseId: string, tariffId: string, normalTariffId: string | null): Promise<string> {
  const prices = await db.select().from(coursePrices).where(eq(coursePrices.courseId, courseId));
  return prices.find((price) => price.tariffId === tariffId)?.amountChf ?? prices.find((price) => price.tariffId === normalTariffId)?.amountChf ?? '0.00';
}

export type ReserveInput = {
  courseId: string;
  role: BookingRole | null;
  mode: BookingModeT;
  participant: PersonInput;
  partner?: PersonInput | null;
  tariffKey?: string;
  needsAushilfe?: boolean;
  language?: 'de' | 'en';
  notes?: string | null;
};
export type ReserveResult = {
  bookingId: string;
  status: 'confirmed' | 'waitlisted';
  role: BookingRole | null;
  mode: BookingModeT;
  waitlistPosition: number | null;
  amountChf: string;
};

export async function reserveBooking(db: Db, input: ReserveInput): Promise<ReserveResult> {
  const result = await db.transaction(async (tx) => {
    const course = (await tx.select().from(courses).where(eq(courses.id, input.courseId)).limit(1))[0];
    if (!course) throw new BookingError('course_not_found', 'Kurs nicht gefunden', 404);
    const term = (await tx.select().from(terms).where(eq(terms.id, course.termId)).limit(1))[0];
    if (!term || term.status !== 'published' || !['open', 'full'].includes(course.status)) throw new BookingError('course_not_bookable', 'Dieser Kurs ist nicht buchbar.', 409);
    const mode = course.bookingType === 'open' ? 'solo' : input.mode;
    const role = course.bookingType === 'open' ? null : input.role;
    if (mode === 'solo' && course.bookingType === 'leader_follower' && role !== 'leader' && role !== 'follower') throw new BookingError('role_required', 'Bitte Leader oder Follower wählen.');
    if (mode === 'couple' && !input.partner) throw new BookingError('partner_required', 'Bitte die Partner-Daten angeben.');
    if (mode === 'couple' && input.partner?.email.toLowerCase().trim() === input.participant.email.toLowerCase().trim()) throw new BookingError('partner_same_email', 'Partner braucht eine eigene E-Mail.');

    const tariffRows = await tx.select().from(tariffs);
    const tariff = tariffRows.find((item) => item.key === (input.tariffKey ?? (mode === 'couple' ? 'couple' : 'normal'))) ?? tariffRows.find((item) => item.key === 'normal');
    if (!tariff) throw new BookingError('tariff_not_found', 'Kein gültiger Tarif gefunden.');
    const participantId = await upsertParticipant(tx, input.participant);
    const partnerParticipantId = mode === 'couple' ? await upsertParticipant(tx, input.partner!) : null;
    const availability = await computeAvailability(tx, course.id);
    if (!availability) throw new BookingError('course_not_found', 'Kurs nicht gefunden', 404);
    const seats = mode === 'couple' ? 2 : 1;
    const status: ReserveResult['status'] = availability.free >= seats ? 'confirmed' : 'waitlisted';
    const waitlistPosition = status === 'waitlisted' ? availability.waitlist + 1 : null;
    const id = randomUUID();
    const amountChf = await priceFor(tx, course.id, tariff.id, tariffRows.find((item) => item.key === 'normal')?.id ?? null);
    await tx.insert(bookings).values({
      id, courseId: course.id, participantId, role, mode, partnerParticipantId,
      partnerRole: mode === 'couple' ? (role === 'follower' ? 'leader' : 'follower') : null,
      needsAushilfe: mode === 'solo' && !!input.needsAushilfe, tariffId: tariff.id, amountChf, status,
      waitlistPosition, language: input.language === 'en' ? 'en' : 'de', notes: input.notes?.trim() || null,
      confirmedAt: status === 'confirmed' ? new Date() : null,
    });
    return { bookingId: id, status, role, mode, waitlistPosition, amountChf };
  });
  if (result.status === 'confirmed') await sendConfirmation(db, result.bookingId, 'booking_confirmation');
  return result;
}

export type PaymentReceipt = { amountChf: string; method: string | null };
export async function confirmBooking(db: Db, bookingId: string, kind: 'booking_confirmation' | 'waitlist_promoted' = 'booking_confirmation', _receipt?: PaymentReceipt) {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);
  if (booking.status === 'confirmed' || booking.status === 'completed') return { ok: true, alreadyConfirmed: true, sent: [] as { to: string; kind: string; ok: boolean }[] };
  if (booking.status !== 'pending_payment') throw new BookingError('not_confirmable', 'Buchung ist in keinem bestätigbaren Status.', 409);
  await db.update(bookings).set({ status: 'confirmed', confirmedAt: new Date(), paymentDeadline: null, waitlistPosition: null }).where(eq(bookings.id, bookingId));
  const sent = await sendConfirmation(db, bookingId, kind);
  return { ok: sent.every((mail) => mail.ok), alreadyConfirmed: false, sent };
}

export async function cancelBooking(db: Db, bookingId: string): Promise<{ ok: boolean; promoted: number }> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);
  if (booking.status === 'cancelled' || booking.status === 'refunded') return { ok: true, promoted: 0 };
  const freed = occupies(booking);
  await db.update(bookings).set({ status: 'cancelled', cancelledAt: new Date(), waitlistPosition: null }).where(eq(bookings.id, bookingId));
  const promoted = freed ? await promoteWaitlist(db, booking.courseId) : 0;
  await normalizeWaitlist(db, booking.courseId);
  return { ok: true, promoted };
}

export async function promoteWaitlist(db: Db, courseId: string): Promise<number> {
  let promoted = 0;
  for (;;) {
    const availability = await computeAvailability(db, courseId);
    const next = (await db.select().from(bookings).where(eq(bookings.courseId, courseId)))
      .filter((booking) => booking.status === 'waitlisted')
      .sort((a, b) => (a.waitlistPosition ?? Number.MAX_SAFE_INTEGER) - (b.waitlistPosition ?? Number.MAX_SAFE_INTEGER) || a.createdAt.getTime() - b.createdAt.getTime())
      .find((booking) => availability && availability.free >= seatsOf(booking));
    if (!next) break;
    await db.update(bookings).set({ status: 'confirmed', confirmedAt: new Date(), waitlistPosition: null }).where(eq(bookings.id, next.id));
    await sendConfirmation(db, next.id, 'waitlist_promoted');
    promoted++;
  }
  return promoted;
}

export async function normalizeWaitlist(db: Db, courseId: string): Promise<void> {
  const waiting = (await db.select().from(bookings).where(eq(bookings.courseId, courseId)))
    .filter((booking) => booking.status === 'waitlisted')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  for (const [index, booking] of waiting.entries()) {
    if (booking.waitlistPosition !== index + 1) await db.update(bookings).set({ waitlistPosition: index + 1 }).where(eq(bookings.id, booking.id));
  }
}

export async function expireBooking(db: Db, bookingId: string): Promise<{ ok: boolean; promoted: number }> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);
  if (booking.status !== 'pending_payment') return { ok: true, promoted: 0 };
  await db.update(bookings).set({ status: 'expired', paymentDeadline: null }).where(eq(bookings.id, bookingId));
  return { ok: true, promoted: await promoteWaitlist(db, booking.courseId) };
}

export type AdminBookingRow = { id: string; participantName: string; participantEmail: string; role: BookingRole | null; mode: BookingModeT; partnerName: string | null; needsAushilfe: boolean; status: BookingRow['status']; waitlistPosition: number | null; createdAt: string };
export async function bookingsForCourse(db: Database, courseId: string): Promise<AdminBookingRow[]> {
  const rows = await db.select().from(bookings).where(eq(bookings.courseId, courseId));
  const people = new Map((await db.select().from(participants)).map((person) => [person.id, person]));
  const name = (id: string | null) => { const person = id ? people.get(id) : null; return person ? `${person.firstName} ${person.lastName}`.trim() : null; };
  return rows.map((booking) => ({ id: booking.id, participantName: name(booking.participantId) ?? 'Unbekannt', participantEmail: people.get(booking.participantId)?.email ?? '', role: booking.role as BookingRole | null, mode: booking.mode as BookingModeT, partnerName: name(booking.partnerParticipantId), needsAushilfe: booking.needsAushilfe, status: booking.status, waitlistPosition: booking.waitlistPosition, createdAt: booking.createdAt.toISOString() })).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export type BookingDisplay = { bookingId: string; participantName: string; participantEmail: string; styleDe: string; styleEn: string; levelDe: string | null; levelEn: string | null; weekday: string; startTime: string; endTime: string; termName: string; language: 'de' | 'en' };
export async function loadBookingDisplay(db: Db, bookingId: string): Promise<BookingDisplay> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);
  const course = (await db.select().from(courses).where(eq(courses.id, booking.courseId)).limit(1))[0];
  const style = course ? (await db.select().from(styles).where(eq(styles.id, course.styleId)).limit(1))[0] : null;
  const rung = course?.levelRungId ? (await db.select().from(levelRungs).where(eq(levelRungs.id, course.levelRungId)).limit(1))[0] : null;
  const term = course ? (await db.select().from(terms).where(eq(terms.id, course.termId)).limit(1))[0] : null;
  const participant = (await db.select().from(participants).where(eq(participants.id, booking.participantId)).limit(1))[0];
  return { bookingId, participantName: participant ? `${participant.firstName} ${participant.lastName}`.trim() : 'Gast', participantEmail: participant?.email ?? '', styleDe: style?.nameDe ?? '', styleEn: style?.nameEn ?? '', levelDe: rung?.labelDe ?? null, levelEn: rung?.labelEn ?? null, weekday: course?.weekday ?? 'mon', startTime: course?.startTime.slice(0, 5) ?? '', endTime: course?.endTime.slice(0, 5) ?? '', termName: term?.name ?? '', language: booking.language === 'en' ? 'en' : 'de' };
}
const DAYS_DE: Record<string, string> = { mon: 'Montag', tue: 'Dienstag', wed: 'Mittwoch', thu: 'Donnerstag', fri: 'Freitag', sat: 'Samstag', sun: 'Sonntag' };
const DAYS_EN: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
export function courseLine(display: BookingDisplay, language: 'de' | 'en'): string { return `${language === 'de' ? display.styleDe : display.styleEn}${(language === 'de' ? display.levelDe : display.levelEn) ? ` ${language === 'de' ? display.levelDe : display.levelEn}` : ''} - ${language === 'de' ? DAYS_DE[display.weekday] : DAYS_EN[display.weekday]} ${display.startTime}-${display.endTime}`; }

async function sendConfirmation(db: Db, bookingId: string, kind: 'booking_confirmation' | 'waitlist_promoted') {
  const display = await loadBookingDisplay(db, bookingId);
  const promoted = kind === 'waitlist_promoted';
  const subject = display.language === 'en' ? (promoted ? 'A spot opened up - your Salsaflow booking is confirmed' : 'Your Salsaflow booking is confirmed') : (promoted ? 'Ein Platz ist frei geworden - deine Salsaflow-Buchung ist bestätigt' : 'Deine Salsaflow-Buchung ist bestätigt');
  const text = display.language === 'en' ? `Hi ${display.participantName},\n\nyour spot is confirmed.\n\nCourse: ${courseLine(display, 'en')}\n${display.termName ? `Term: ${display.termName}\n` : ''}\nSee you on the dance floor!\nSalsaflow Dance Company` : `Hallo ${display.participantName},\n\ndein Platz ist bestätigt.\n\nKurs: ${courseLine(display, 'de')}\n${display.termName ? `Staffel: ${display.termName}\n` : ''}\nWir freuen uns auf dich!\nSalsaflow Dance Company`;
  const info = `Teilnehmer: ${display.participantName} (${display.participantEmail})\nKurs: ${courseLine(display, 'de')}\nBuchungs-ID: ${bookingId}\n`;
  return Promise.all([deliver(db, bookingId, kind, display.participantEmail, display.language, subject, text), deliver(db, bookingId, kind, INFO_EMAIL, 'de', `${promoted ? 'Nachgerückt' : 'Neue Buchung'}: ${display.participantName}`, info)]);
}
async function deliver(db: Db, bookingId: string, kind: 'booking_confirmation' | 'waitlist_promoted', to: string, language: string, subject: string, text: string) {
  const id = randomUUID();
  await db.insert(notifications).values({ id, bookingId, kind, toEmail: to, language, status: 'queued' });
  const result = await sendMail({ to, subject, text, tag: `${kind}_${to}` });
  await db.update(notifications).set({ status: result.ok ? 'sent' : 'failed', sentAt: result.ok ? new Date() : null }).where(eq(notifications.id, id));
  return { to, kind, ok: result.ok };
}
