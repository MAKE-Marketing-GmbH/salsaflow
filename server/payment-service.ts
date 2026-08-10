// Zahlungs-Orchestrierung (Etappe 9). Verbindet die Buchungs-Engine (server/booking.ts) mit dem
// Zahlungs-Provider (server/payments.ts) und der DB (payments + payment_events + notifications).
//
// Harte Regel (ARCHITEKTUR.md 6): Eine Buchung wird erst `confirmed`, wenn der VERIFIZIERTE
// Zahlungs-Webhook die Zahlung als `succeeded` meldet - nie durch den Browser-Redirect.
//
// Idempotenz: Jedes Webhook-Event wird ueber `payment_events.provider_event_id` (UNIQUE) genau
// einmal verarbeitet. Ein doppelt zugestelltes Event ist ein No-Op.

import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../db/client.js';
import { bookings, notifications, payments, paymentEvents } from '../db/schema.js';
import {
  BookingError,
  confirmBooking,
  courseLine,
  expireBooking,
  loadBookingDisplay,
  normalizeWaitlist,
  promoteWaitlist,
} from './booking.js';
import {
  buildEvent,
  createCheckoutSession,
  paymentMode,
  publicBaseUrl,
  refundPayment,
  signWebhookPayload,
  verifyWebhookSignature,
  webhookSecret,
  type StripeEvent,
} from './payments.js';
import { INFO_EMAIL, sendMail } from './mail.js';

type PaymentRow = typeof payments.$inferSelect;

export function successUrl(base: string, bookingId: string): string {
  return `${base.replace(/\/+$/, '')}/buchung/erfolg?booking=${bookingId}`;
}
export function cancelUrl(base: string, bookingId: string): string {
  return `${base.replace(/\/+$/, '')}/buchung/abbruch?booking=${bookingId}`;
}

async function findPaymentByBooking(db: Db, bookingId: string): Promise<PaymentRow | null> {
  const rows = await db.select().from(payments).where(eq(payments.bookingId, bookingId)).limit(1);
  return rows[0] ?? null;
}
async function findPaymentBySession(db: Db, sessionId: string): Promise<PaymentRow | null> {
  const rows = await db.select().from(payments).where(eq(payments.checkoutSessionId, sessionId)).limit(1);
  return rows[0] ?? null;
}
async function findPaymentByIntent(db: Db, intentId: string): Promise<PaymentRow | null> {
  const rows = await db.select().from(payments).where(eq(payments.paymentIntentId, intentId)).limit(1);
  return rows[0] ?? null;
}

/* ----------------------------------------------------------------------------
 * Checkout starten: Zahlung beim Buchen (TWINT/Karte)
 * -------------------------------------------------------------------------- */
export type StartCheckoutResult = {
  status: 'redirect' | 'free_confirmed' | 'already_confirmed';
  url?: string;
};

export async function startCheckout(
  db: Db,
  bookingId: string,
  opts: { baseUrl?: string } = {},
): Promise<StartCheckoutResult> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);

  const base = (opts.baseUrl || publicBaseUrl()).replace(/\/+$/, '');

  if (booking.status === 'confirmed' || booking.status === 'completed') {
    return { status: 'already_confirmed', url: successUrl(base, bookingId) };
  }
  if (booking.status !== 'pending_payment') {
    // waitlisted/cancelled/expired/refunded sind nicht zahlbar.
    throw new BookingError('not_payable', 'Diese Buchung kann nicht bezahlt werden.', 409);
  }

  const minor = Math.round(Number.parseFloat(booking.amountChf) * 100);
  // Betrag 0 (z.B. unbepreister Kurs) -> keine Zahlung noetig, direkt bestaetigen.
  if (!Number.isFinite(minor) || minor <= 0) {
    await confirmBooking(db, bookingId, 'booking_confirmation');
    return { status: 'free_confirmed' };
  }

  const display = await loadBookingDisplay(db, bookingId);
  const description = `Salsaflow ${courseLine(display, 'de')}`.trim();

  const session = await createCheckoutSession({
    bookingId,
    amountChf: booking.amountChf,
    description,
    customerEmail: display.participantEmail || 'kunde@example.com',
    successUrl: successUrl(base, bookingId),
    cancelUrl: cancelUrl(base, bookingId),
  });

  const existing = await findPaymentByBooking(db, bookingId);
  if (existing) {
    await db
      .update(payments)
      .set({
        status: 'pending',
        checkoutSessionId: session.id,
        paymentIntentId: session.paymentIntentId,
        amountChf: booking.amountChf,
        method: null,
      })
      .where(eq(payments.id, existing.id));
  } else {
    await db.insert(payments).values({
      id: randomUUID(),
      bookingId,
      provider: 'stripe', // Sandbox emuliert Stripe; das Enum kennt nur 'stripe'.
      checkoutSessionId: session.id,
      paymentIntentId: session.paymentIntentId,
      amountChf: booking.amountChf,
      currency: 'CHF',
      status: 'pending',
    });
  }

  return { status: 'redirect', url: session.url };
}

/* ----------------------------------------------------------------------------
 * Status fuer die Rueckkehrseite (kein Personenbezug, Buchungs-ID = Zugriffsschluessel)
 * -------------------------------------------------------------------------- */
export type BookingPaymentStatus = {
  bookingStatus: string;
  paymentStatus: string | null;
  amountChf: string | null;
  method: string | null;
};

export async function fetchBookingPaymentStatus(db: Db, bookingId: string): Promise<BookingPaymentStatus | null> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) return null;
  const payment = await findPaymentByBooking(db, bookingId);
  return {
    bookingStatus: booking.status,
    paymentStatus: payment?.status ?? null,
    amountChf: payment?.amountChf ?? null,
    method: payment?.method ?? null,
  };
}

/* ----------------------------------------------------------------------------
 * Webhook: Signatur pruefen -> Idempotenz -> Event verarbeiten
 * -------------------------------------------------------------------------- */
export type WebhookResult = { httpStatus: 200 | 400; status: string; reason?: string };

export async function processSignedWebhook(
  db: Db,
  rawBody: string,
  signatureHeader: string | null | undefined,
): Promise<WebhookResult> {
  const v = verifyWebhookSignature(rawBody, signatureHeader, webhookSecret());
  if (!v.ok) return { httpStatus: 400, status: 'invalid_signature', reason: v.reason };

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return { httpStatus: 400, status: 'invalid_payload' };
  }
  if (!event || typeof event.id !== 'string' || typeof event.type !== 'string') {
    return { httpStatus: 400, status: 'invalid_payload' };
  }

  // Idempotenz: Event genau einmal verarbeiten (UNIQUE provider_event_id).
  const inserted = await db
    .insert(paymentEvents)
    .values({ id: randomUUID(), providerEventId: event.id, type: event.type, payload: event as unknown as object })
    .onConflictDoNothing({ target: paymentEvents.providerEventId })
    .returning({ id: paymentEvents.id });
  if (inserted.length === 0) return { httpStatus: 200, status: 'duplicate' };

  await handleEvent(db, event, inserted[0].id);
  return { httpStatus: 200, status: 'processed' };
}

function normalizeMethod(obj: Record<string, unknown>): 'twint' | 'card' | 'apple_pay' | 'google_pay' | 'other' {
  const types = obj['payment_method_types'];
  const raw =
    (Array.isArray(types) ? (types[0] as string) : undefined) ??
    (obj['payment_method_type'] as string | undefined) ??
    (obj['method'] as string | undefined);
  if (raw === 'twint' || raw === 'card' || raw === 'apple_pay' || raw === 'google_pay') return raw;
  return 'other';
}

async function handleEvent(db: Db, event: StripeEvent, eventRowId: string): Promise<void> {
  const obj = event.data?.object ?? {};
  const sessionId = typeof obj['id'] === 'string' ? (obj['id'] as string) : null;
  const intentId = typeof obj['payment_intent'] === 'string' ? (obj['payment_intent'] as string) : null;
  const metaBookingId =
    typeof (obj['metadata'] as Record<string, unknown> | undefined)?.['booking_id'] === 'string'
      ? ((obj['metadata'] as Record<string, string>)['booking_id'])
      : null;

  // Zugehoerige Zahlung finden (je nach Event ueber Session-ID oder Intent-ID).
  let payment: PaymentRow | null = null;
  if (event.type.startsWith('checkout.session.') && sessionId) payment = await findPaymentBySession(db, sessionId);
  else if (intentId) payment = await findPaymentByIntent(db, intentId);
  else if (sessionId) payment = await findPaymentBySession(db, sessionId);
  if (!payment && metaBookingId) payment = await findPaymentByBooking(db, metaBookingId);

  const bookingId = payment?.bookingId ?? metaBookingId;

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      if (payment) {
        const method = normalizeMethod(obj);
        await db
          .update(payments)
          .set({
            status: 'succeeded',
            method,
            paidAt: new Date(),
            paymentIntentId: intentId ?? payment.paymentIntentId,
          })
          .where(eq(payments.id, payment.id));

        if (bookingId) {
          try {
            await confirmBooking(db, bookingId, 'booking_confirmation', { amountChf: payment.amountChf, method });
          } catch (e) {
            // Seltener Wettlauf (z.B. Buchung bereits abgelaufen): Geld ist da + verbucht,
            // Buchung ist nicht mehr bestaetigbar. Loggen, nicht crashen (Webhook bleibt 200),
            // UND info@ alarmieren, damit der Fall (bezahlt ohne Bestaetigung) manuell geklaert wird.
            console.warn('[payment] confirm nach Zahlung fehlgeschlagen:', e instanceof Error ? e.message : e);
            await notifyConfirmFailed(db, bookingId, payment.amountChf).catch(() => {});
          }
        }
      }
      break;
    }
    case 'checkout.session.expired': {
      if (payment) {
        await db.update(payments).set({ status: 'expired' }).where(eq(payments.id, payment.id));
      }
      if (bookingId) await expireBooking(db, bookingId);
      break;
    }
    case 'checkout.session.async_payment_failed':
    case 'payment_intent.payment_failed': {
      if (payment) {
        await db.update(payments).set({ status: 'failed' }).where(eq(payments.id, payment.id));
      }
      // Buchung bleibt pending_payment (Kunde kann erneut zahlen). Hinweis-Mail an den Kunden.
      if (bookingId) await notifyPaymentFailed(db, bookingId);
      break;
    }
    case 'charge.refunded':
    case 'refund.created':
    case 'refund.updated': {
      // Bestaetigendes Refund-Event. Synchroner Storno-Refund hat meist schon gesetzt -> idempotent.
      if (payment && payment.status !== 'refunded' && bookingId) {
        await markRefunded(db, payment, bookingId);
      }
      break;
    }
    default:
      break;
  }

  await db
    .update(paymentEvents)
    .set({ processedAt: new Date(), paymentId: payment?.id ?? null })
    .where(eq(paymentEvents.id, eventRowId));
}

/* ----------------------------------------------------------------------------
 * Storno mit Refund (Admin). Gibt false zurueck, wenn die Buchung nicht bezahlt ist
 * (dann uebernimmt der normale cancelBooking-Pfad in der Admin-Route).
 * -------------------------------------------------------------------------- */
export type RefundBookingResult = { refunded: boolean; promoted: number; alreadyRefunded?: boolean };

export async function refundBooking(db: Db, bookingId: string): Promise<RefundBookingResult> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  if (!booking) throw new BookingError('booking_not_found', 'Buchung nicht gefunden', 404);
  if (booking.status === 'refunded') return { refunded: true, promoted: 0, alreadyRefunded: true };

  const payment = await findPaymentByBooking(db, bookingId);
  if (!payment || payment.status !== 'succeeded') {
    // Nicht bezahlt -> kein Refund. Caller storniert normal.
    return { refunded: false, promoted: 0 };
  }

  const res = await refundPayment({
    paymentIntentId: payment.paymentIntentId,
    checkoutSessionId: payment.checkoutSessionId,
    amountChf: payment.amountChf,
  });
  if (!res.ok) throw new BookingError('refund_failed', res.error || 'Refund fehlgeschlagen', 502);

  const promoted = await markRefunded(db, payment, bookingId);
  return { refunded: true, promoted };
}

// Setzt Zahlung + Buchung auf refunded, gibt den Platz frei und schickt die Refund-Mail.
async function markRefunded(db: Db, payment: PaymentRow, bookingId: string): Promise<number> {
  await db
    .update(payments)
    .set({ status: 'refunded', refundedAt: new Date(), refundAmountChf: payment.amountChf })
    .where(eq(payments.id, payment.id));
  const booking = (await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1))[0];
  await db
    .update(bookings)
    .set({ status: 'refunded', cancelledAt: new Date(), waitlistPosition: null })
    .where(eq(bookings.id, bookingId));

  let promoted = 0;
  if (booking) {
    promoted = await promoteWaitlist(db, booking.courseId);
    await normalizeWaitlist(db, booking.courseId);
  }
  await notifyRefund(db, bookingId, payment.amountChf);
  return promoted;
}

/* ----------------------------------------------------------------------------
 * Hinweis-Mails (Fehler / Refund). Protokoll wie in booking.ts (notifications: queued -> sent).
 * -------------------------------------------------------------------------- */
async function deliverNotification(
  db: Db,
  bookingId: string,
  kind: 'payment_failed' | 'refund',
  to: string,
  language: string,
  mail: { subject: string; text: string },
): Promise<void> {
  const id = randomUUID();
  await db.insert(notifications).values({ id, bookingId, kind, toEmail: to, language, status: 'queued' });
  const res = await sendMail({ to, subject: mail.subject, text: mail.text, tag: `${kind}_${to}` });
  await db
    .update(notifications)
    .set({ status: res.ok ? 'sent' : 'failed', sentAt: res.ok ? new Date() : null })
    .where(eq(notifications.id, id));
}

async function notifyPaymentFailed(db: Db, bookingId: string): Promise<void> {
  const d = await loadBookingDisplay(db, bookingId);
  const payUrl = `${publicBaseUrl()}/buchung/zahlen?booking=${bookingId}`;
  const mail =
    d.language === 'en'
      ? {
          subject: 'Your Salsaflow payment did not go through',
          text:
            `Hi ${d.participantName},\n\n` +
            `your payment for ${courseLine(d, 'en')} did not go through.\n` +
            `Your spot is still reserved for a short while. You can try again here:\n${payUrl}\n\n` +
            `Salsaflow Dance Company`,
        }
      : {
          subject: 'Deine Salsaflow-Zahlung hat nicht geklappt',
          text:
            `Hallo ${d.participantName},\n\n` +
            `deine Zahlung für ${courseLine(d, 'de')} hat nicht geklappt.\n` +
            `Dein Platz ist noch kurz reserviert. Du kannst es hier erneut versuchen:\n${payUrl}\n\n` +
            `Salsaflow Dance Company`,
        };
  await deliverNotification(db, bookingId, 'payment_failed', d.participantEmail, d.language, mail);
}

// Geld eingezogen, aber Buchung liess sich nicht bestaetigen (seltener Wettlauf). info@ alarmieren.
async function notifyConfirmFailed(db: Db, bookingId: string, amountChf: string): Promise<void> {
  await deliverNotification(db, bookingId, 'payment_failed', INFO_EMAIL, 'de', {
    subject: `ACHTUNG manuell prüfen: Zahlung ok, Buchung NICHT bestätigt - ${bookingId}`,
    text:
      `Eine Zahlung über CHF ${amountChf} ist eingegangen, aber die Buchung konnte nicht automatisch\n` +
      `bestätigt werden (z.B. Platz inzwischen vergeben oder Buchung abgelaufen).\n` +
      `Bitte manuell prüfen und bei Bedarf zurückerstatten.\nBuchungs-ID: ${bookingId}\n`,
  });
}

async function notifyRefund(db: Db, bookingId: string, amountChf: string): Promise<void> {
  const d = await loadBookingDisplay(db, bookingId);
  const customer =
    d.language === 'en'
      ? {
          subject: 'Your Salsaflow booking was cancelled and refunded',
          text:
            `Hi ${d.participantName},\n\n` +
            `your booking for ${courseLine(d, 'en')} was cancelled.\n` +
            `We refunded CHF ${amountChf}.\n\n` +
            `Salsaflow Dance Company`,
        }
      : {
          subject: 'Deine Salsaflow-Buchung wurde storniert und zurückerstattet',
          text:
            `Hallo ${d.participantName},\n\n` +
            `deine Buchung für ${courseLine(d, 'de')} wurde storniert.\n` +
            `Wir haben dir CHF ${amountChf} zurückerstattet.\n\n` +
            `Salsaflow Dance Company`,
        };
  await deliverNotification(db, bookingId, 'refund', d.participantEmail, d.language, customer);
  // Interne Mitlese-Mail an info@.
  await deliverNotification(db, bookingId, 'refund', INFO_EMAIL, 'de', {
    subject: `Storno + Refund: ${d.participantName} - ${courseLine(d, 'de')}`,
    text: `Storno mit Refund CHF ${amountChf}\nKunde: ${d.participantName} (${d.participantEmail})\nKurs: ${courseLine(d, 'de')}\nBuchungs-ID: ${bookingId}\n`,
  });
}

/* ----------------------------------------------------------------------------
 * Sandbox: aus einer Aktion der Test-Bezahlseite ein signiertes Stripe-artiges Event bauen
 * und durch denselben Webhook-Pfad schicken (inkl. Signaturpruefung).
 * -------------------------------------------------------------------------- */
export type SandboxAction = 'succeed' | 'fail' | 'expire';

export async function sandboxComplete(
  db: Db,
  payment: PaymentRow,
  bookingId: string,
  action: SandboxAction,
  method: 'twint' | 'card',
): Promise<WebhookResult> {
  if (paymentMode() !== 'sandbox') {
    return { httpStatus: 400, status: 'not_sandbox' };
  }
  const baseObject = {
    id: payment.checkoutSessionId,
    object: 'checkout.session',
    payment_intent: payment.paymentIntentId,
    payment_method_types: [method],
    amount_total: Math.round(Number.parseFloat(payment.amountChf) * 100),
    currency: 'chf',
    metadata: { booking_id: bookingId },
  };
  const type =
    action === 'succeed'
      ? 'checkout.session.completed'
      : action === 'expire'
        ? 'checkout.session.expired'
        : 'checkout.session.async_payment_failed';

  const event = buildEvent(type, baseObject);
  const rawBody = JSON.stringify(event);
  const header = signWebhookPayload(rawBody, webhookSecret(), Math.floor(Date.now() / 1000));
  return processSignedWebhook(db, rawBody, header);
}

export async function findPaymentForSandbox(db: Db, sessionId: string): Promise<{ payment: PaymentRow; bookingId: string } | null> {
  const payment = await findPaymentBySession(db, sessionId);
  if (!payment) return null;
  return { payment, bookingId: payment.bookingId };
}

// Anzeige-Infos fuer die Sandbox-Bezahlseite (Betrag + Kurs + Kunde).
export async function sandboxDisplay(db: Db, bookingId: string): Promise<{ courseDe: string; email: string }> {
  const d = await loadBookingDisplay(db, bookingId);
  return { courseDe: courseLine(d, 'de'), email: d.participantEmail };
}
