// Etappe-9-Gate: prueft die Online-Zahlung (TWINT/Karte) Ende-zu-Ende ueber die echten HTTP-Routen
// im SANDBOX-Modus (kein STRIPE_SECRET_KEY) mit PAYMENT_ENABLED=1. Beweist das Fertig-Kriterium:
//   - Test-Transaktion im Sandbox-Modus geht durch (Webhook completed -> Buchung confirmed).
//   - Fehlerfall wird abgefangen (Webhook failed -> Buchung bleibt pending, payment failed).
//   - Buchung ist erst NACH erfolgreicher Zahlung fix (vorher pending; nur der verifizierte Webhook bestaetigt).
//   - Buchung + Zahlung sind in der DB verknuepft (payments.booking_id + payment_events).
// Zusatzdeckung: Signaturpruefung (gefaelschte Signatur abgelehnt), Idempotenz (Event nur einmal),
//   Frist-Ablauf gibt den Platz frei (Warteliste rueckt nach, OHNE Auto-Confirm), Storno mit Refund.
// Isolierte Test-Staffel, self-cleaning. Mailtreiber = Outbox (kein Resend).

process.env.PAYMENT_ENABLED = '1';

import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
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
  payments,
  paymentEvents,
  styles,
  tariffs,
  terms,
} from '../db/schema.js';
import { buildEvent, signWebhookPayload, webhookSecret } from '../server/payments.js';
import { OUTBOX_DIR } from '../server/mail.js';

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const STAMP = Date.now();
const DOMAIN = '@e9-test.local';

async function main() {
  const handle = await openDb();
  const { db } = handle;
  const app = createApp(db);

  // --- Test-Stammdaten aus dem Seed ----------------------------------------
  const salsa = (await db.select().from(styles).where(eq(styles.key, 'salsa')).limit(1))[0];
  const rung = (await db.select().from(levelRungs).where(eq(levelRungs.ladderKey, 'salsa_bachata')))[0];
  const loc = (await db.select().from(locations))[0];
  const tariffRows = await db.select().from(tariffs);
  const normalT = tariffRows.find((t) => t.key === 'normal');
  if (!salsa || !rung || !loc || !normalT) {
    console.log('VERDICT: FAIL (Seed-Stammdaten fehlen - bitte npm run setup)');
    await handle.close();
    process.exit(1);
  }

  // --- Isolierte Test-Staffel + Kurs (1 Leader / 1 Follower, Preis 190) ----
  const termId = randomUUID();
  const courseId = randomUUID();
  await db.insert(terms).values({
    id: termId, name: 'E9 Testzahlung', startDate: '2026-01-01', endDate: '2099-12-31', weekCount: 8, status: 'published',
  });
  await db.insert(courses).values({
    id: courseId, termId, styleId: salsa.id, levelRungId: rung.id, weekday: 'mon',
    startTime: '18:30:00', endTime: '19:30:00', locationId: loc.id, bookingType: 'leader_follower',
    capacityTotal: 2, allowsLateEntry: true, status: 'open',
  });
  await db.insert(coursePrices).values({ courseId, tariffId: normalT.id, amountChf: '190.00' });

  // Admin-Login fuer die Storno-Route.
  const loginRes = await app.request('/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salsaflow-dc.com', password: process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026' }),
  });
  const cookie = (loginRes.headers.get('set-cookie') || '').match(/sf_session=[^;]+/)?.[0] ?? '';
  check('Admin-Login fuer Storno', loginRes.status === 200 && cookie.length > 0, `status ${loginRes.status}`);

  // --- Helfer --------------------------------------------------------------
  const person = (n: string) => ({ firstName: n, lastName: 'Test', email: `${n.toLowerCase()}-${STAMP}${DOMAIN}` });
  async function book(body: Record<string, unknown>) {
    const res = await app.request('/api/public/bookings', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json().catch(() => ({}))) as Record<string, unknown> };
  }
  async function checkout(bookingId: string) {
    const res = await app.request(`/api/public/bookings/${bookingId}/checkout`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
    });
    return { status: res.status, json: (await res.json().catch(() => ({}))) as Record<string, unknown> };
  }
  async function statusOf(bookingId: string) {
    const res = await app.request(`/api/public/bookings/${bookingId}/status`);
    return (await res.json()) as { bookingStatus: string; paymentStatus: string | null; amountChf: string | null; method: string | null };
  }
  async function paymentRow(bookingId: string) {
    return (await db.select().from(payments).where(eq(payments.bookingId, bookingId)).limit(1))[0];
  }
  async function bookingRow(id: string) {
    return (await db.select().from(bookings).where(eq(bookings.id, id)).limit(1))[0];
  }
  function sessionObject(p: { checkoutSessionId: string | null; paymentIntentId: string | null }, method: string) {
    return {
      id: p.checkoutSessionId, object: 'checkout.session', payment_intent: p.paymentIntentId,
      payment_method_types: [method], amount_total: 19000, currency: 'chf', metadata: { booking_id: '' },
    };
  }
  function sign(type: string, object: Record<string, unknown>, secret = webhookSecret()) {
    const event = buildEvent(type, object);
    const rawBody = JSON.stringify(event);
    const header = signWebhookPayload(rawBody, secret, Math.floor(Date.now() / 1000));
    return { event, rawBody, header };
  }
  async function postWebhook(rawBody: string, header: string) {
    const res = await app.request('/api/payments/webhook', {
      method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': header }, body: rawBody,
    });
    return { status: res.status, json: (await res.json().catch(() => ({}))) as Record<string, unknown> };
  }
  function outboxFindCustomerConfirmation(email: string): string | null {
    let files: string[] = [];
    try { files = readdirSync(OUTBOX_DIR); } catch { return null; }
    for (const f of files) {
      const txt = readFileSync(`${OUTBOX_DIR}/${f}`, 'utf8');
      if (txt.includes(email) && txt.includes('bestätigt') && txt.includes('Beleg:')) return txt;
    }
    return null;
  }

  /* 1) Buchung als Leader -> pending_payment (NICHT confirmed) ------------- */
  const anna = await book({ courseId, role: 'leader', mode: 'solo', participant: person('Anna') });
  const annaId = anna.json.bookingId as string;
  check('Buchung angenommen (201)', anna.status === 201, `status ${anna.status}`);
  check('Mit Zahlung: Buchung startet als pending_payment (nicht sofort confirmed)', anna.json.status === 'pending_payment', `status ${anna.json.status}`);

  /* 2) Checkout starten -> payment-Row verknuepft + pending --------------- */
  const co = await checkout(annaId);
  check('Checkout liefert Redirect-URL', co.status === 200 && co.json.status === 'redirect' && typeof co.json.url === 'string', `status ${co.json.status}`);
  const pAnna = await paymentRow(annaId);
  check('Zahlung in DB angelegt + mit Buchung verknuepft', !!pAnna && pAnna.bookingId === annaId, `bookingId ${pAnna?.bookingId}`);
  check('Zahlung Status pending vor Webhook', pAnna?.status === 'pending', `status ${pAnna?.status}`);
  check('Zahlbetrag = 190.00 (Snapshot)', pAnna?.amountChf === '190.00', `${pAnna?.amountChf}`);
  check('Checkout-Session-ID gesetzt', !!pAnna?.checkoutSessionId, `${pAnna?.checkoutSessionId?.slice(0, 12)}`);

  /* 3) Gefaelschte Signatur -> 400, Buchung bleibt pending ---------------- */
  const okObj = sessionObject(pAnna!, 'twint');
  okObj.metadata.booking_id = annaId;
  const bad = sign('checkout.session.completed', { ...okObj }, 'falsches_secret');
  const badRes = await postWebhook(bad.rawBody, bad.header);
  check('Webhook mit falscher Signatur abgelehnt (400)', badRes.status === 400 && badRes.json.status === 'invalid_signature', `status ${badRes.status}/${badRes.json.status}`);
  check('Buchung nach falscher Signatur weiter pending', (await bookingRow(annaId)).status === 'pending_payment', '');

  /* 4) Gueltiger completed-Webhook -> Buchung confirmed, Zahlung succeeded - */
  const good = sign('checkout.session.completed', { ...okObj });
  const goodRes = await postWebhook(good.rawBody, good.header);
  check('Gueltiger Webhook verarbeitet (200)', goodRes.status === 200 && goodRes.json.status === 'processed', `status ${goodRes.status}/${goodRes.json.status}`);
  const annaAfter = await bookingRow(annaId);
  check('Buchung erst NACH Zahlung confirmed', annaAfter.status === 'confirmed' && !!annaAfter.confirmedAt, `status ${annaAfter.status}`);
  const pAnna2 = await paymentRow(annaId);
  check('Zahlung succeeded + paidAt gesetzt', pAnna2?.status === 'succeeded' && !!pAnna2?.paidAt, `status ${pAnna2?.status}`);
  check('Zahlart aus Webhook gespeichert (twint)', pAnna2?.method === 'twint', `${pAnna2?.method}`);

  /* 4b) Bestaetigungs-/Beleg-Mails (Kunde + info@) ------------------------ */
  const annaNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, annaId)));
  const confirmNotifs = annaNotifs.filter((n) => n.kind === 'booking_confirmation');
  check('2 Bestaetigungsmails (Kunde + info@) verschickt', confirmNotifs.length === 2 && confirmNotifs.every((n) => n.status === 'sent'), `${confirmNotifs.length}`);
  check('info@ unter den Empfaengern', confirmNotifs.some((n) => n.toEmail === 'info@salsaflow-dc.com'), '');
  const receipt = outboxFindCustomerConfirmation(`anna-${STAMP}${DOMAIN}`);
  check('Beleg (CHF 190.00 + Zahlart) in der Kunden-Mail', !!receipt && receipt.includes('190.00') && receipt.includes('TWINT'), receipt ? 'Beleg gefunden' : 'kein Beleg');

  /* 5) Idempotenz: dasselbe Event erneut -> duplicate, keine Doppel-Mails -- */
  const dup = await postWebhook(good.rawBody, good.header);
  check('Doppeltes Event erkannt (duplicate)', dup.status === 200 && dup.json.status === 'duplicate', `status ${dup.json.status}`);
  const confirmNotifs2 = (await db.select().from(notifications).where(eq(notifications.bookingId, annaId))).filter((n) => n.kind === 'booking_confirmation');
  check('Keine doppelten Bestaetigungsmails nach Duplikat', confirmNotifs2.length === 2, `${confirmNotifs2.length}`);
  const evtRows = await db.select().from(paymentEvents).where(eq(paymentEvents.providerEventId, good.event.id));
  check('Event genau einmal in payment_events (processedAt gesetzt)', evtRows.length === 1 && !!evtRows[0].processedAt, `${evtRows.length}`);

  /* 6) Fehlerfall: Follower zahlt -> failed -> Buchung bleibt pending ----- */
  const carla = await book({ courseId, role: 'follower', mode: 'solo', participant: person('Carla') });
  const carlaId = carla.json.bookingId as string;
  check('Follower-Buchung pending_payment', carla.json.status === 'pending_payment', `status ${carla.json.status}`);
  await checkout(carlaId);
  const pCarla = await paymentRow(carlaId);
  const carlaObj = sessionObject(pCarla!, 'card');
  carlaObj.metadata.booking_id = carlaId;
  const fail = sign('checkout.session.async_payment_failed', { ...carlaObj });
  const failRes = await postWebhook(fail.rawBody, fail.header);
  check('Fehler-Webhook verarbeitet (200)', failRes.status === 200, `status ${failRes.status}`);
  check('Zahlung Status failed', (await paymentRow(carlaId))?.status === 'failed', '');
  check('Buchung bleibt pending_payment (nicht confirmed)', (await bookingRow(carlaId)).status === 'pending_payment', '');
  const failNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, carlaId))).filter((n) => n.kind === 'payment_failed');
  check('Fehler-Hinweismail an den Kunden', failNotifs.length === 1 && failNotifs[0].status === 'sent', `${failNotifs.length}`);

  /* 7) Frist-Ablauf gibt Platz frei + Warteliste rueckt nach (ohne Confirm) */
  const dora = await book({ courseId, role: 'follower', mode: 'solo', participant: person('Dora') });
  const doraId = dora.json.bookingId as string;
  check('Zweiter Follower auf Warteliste (Rolle durch pending belegt)', dora.json.status === 'waitlisted', `status ${dora.json.status}`);
  const expire = sign('checkout.session.expired', { ...carlaObj });
  const expRes = await postWebhook(expire.rawBody, expire.header);
  check('Expiry-Webhook verarbeitet (200)', expRes.status === 200, `status ${expRes.status}`);
  check('Abgelaufene Buchung -> expired', (await bookingRow(carlaId)).status === 'expired', '');
  const doraAfter = await bookingRow(doraId);
  check('Warteliste rueckt nach -> pending_payment (NICHT auto-confirmed)', doraAfter.status === 'pending_payment', `status ${doraAfter.status}`);
  const doraNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, doraId))).filter((n) => n.kind === 'waitlist_promoted');
  check('Nachrueck-Zahl-Mail an Dora', doraNotifs.length === 1 && doraNotifs[0].status === 'sent', `${doraNotifs.length}`);

  /* 8) Storno mit Refund (bezahlte Buchung Anna) -------------------------- */
  // Ben wartet als Leader (Anna belegt die Leader-Rolle confirmed) -> rueckt bei Refund nach.
  const ben = await book({ courseId, role: 'leader', mode: 'solo', participant: person('Ben') });
  const benId = ben.json.bookingId as string;
  check('Zweiter Leader auf Warteliste', ben.json.status === 'waitlisted', `status ${ben.json.status}`);
  const cancelRes = await app.request(`/api/admin/bookings/${annaId}/cancel`, {
    method: 'POST', headers: { 'content-type': 'application/json', cookie }, body: '{}',
  });
  const cancelJson = (await cancelRes.json()) as { ok: boolean; refunded?: boolean; promoted: number };
  check('Storno mit Refund (refunded=true)', cancelRes.status === 200 && cancelJson.refunded === true, `refunded ${cancelJson.refunded}`);
  check('Buchung -> refunded', (await bookingRow(annaId)).status === 'refunded', '');
  check('Zahlung -> refunded + refundAmount = 190.00', (await paymentRow(annaId))?.status === 'refunded' && (await paymentRow(annaId))?.refundAmountChf === '190.00', '');
  const refundNotifs = (await db.select().from(notifications).where(eq(notifications.bookingId, annaId))).filter((n) => n.kind === 'refund');
  check('Refund-Mails (Kunde + info@)', refundNotifs.length === 2 && refundNotifs.every((n) => n.status === 'sent'), `${refundNotifs.length}`);
  check('Freigewordene Leader-Rolle laesst Ben nachruecken (pending_payment)', (await bookingRow(benId)).status === 'pending_payment', '');

  /* 9) Status-Route (Rueckkehrseite) ------------------------------------- */
  const st = await statusOf(carlaId);
  check('Status-Route liefert Buchungs-+Zahlungsstatus', st.bookingStatus === 'expired' && st.paymentStatus === 'expired', `${st.bookingStatus}/${st.paymentStatus}`);

  /* 10) DB-Verknuepfung gesamthaft --------------------------------------- */
  const testBookingIds = (await db.select().from(bookings).where(eq(bookings.courseId, courseId))).map((b) => b.id);
  const testPayments = await db.select().from(payments).where(inArray(payments.bookingId, testBookingIds));
  check('Jede Zahlung verweist auf eine Buchung dieses Kurses', testPayments.length >= 2 && testPayments.every((p) => testBookingIds.includes(p.bookingId)), `${testPayments.length} Zahlungen`);
  const testEvents = await db.select().from(paymentEvents).where(inArray(paymentEvents.paymentId, testPayments.map((p) => p.id)));
  check('payment_events mit Zahlungen verknuepft + verarbeitet', testEvents.length >= 3 && testEvents.every((e) => !!e.processedAt && !!e.paymentId), `${testEvents.length} Events`);

  // --- Cleanup (self-cleaning) ---------------------------------------------
  const paymentIds = testPayments.map((p) => p.id);
  if (paymentIds.length > 0) await db.delete(paymentEvents).where(inArray(paymentEvents.paymentId, paymentIds));
  if (testBookingIds.length > 0) {
    await db.delete(payments).where(inArray(payments.bookingId, testBookingIds));
    await db.delete(notifications).where(inArray(notifications.bookingId, testBookingIds));
    await db.delete(bookings).where(inArray(bookings.id, testBookingIds));
  }
  await db.delete(coursePrices).where(eq(coursePrices.courseId, courseId));
  await db.delete(courses).where(eq(courses.id, courseId));
  await db.delete(terms).where(eq(terms.id, termId));
  await db.delete(participants).where(like(participants.email, `%${DOMAIN}`));

  await handle.close();

  /* Ausgabe ----------------------------------------------------------------- */
  console.log('\n=== Etappe 9 Verify (Online-Zahlung TWINT/Karte, Sandbox) ===');
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
  console.error('[verify-payment] FEHLER:', err);
  process.exit(1);
});
