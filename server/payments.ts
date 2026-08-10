// Zahlungs-Provider-Abstraktion (Etappe 9). Kapselt Stripe Checkout (ARCHITEKTUR.md 7.3) hinter
// einer schlanken Schnittstelle, ohne DB-Wissen. Zwei Treiber, analog zum Mail-Treiber (server/mail.ts):
//
//  - STRIPE_SECRET_KEY gesetzt -> echter Stripe-Modus: Checkout-Session + Refund ueber die Stripe-REST-API
//    (per fetch, kein SDK-Dependency - dieselbe Begruendung wie beim Resend-Treiber). Webhooks werden
//    mit STRIPE_WEBHOOK_SECRET (HMAC-SHA256, Stripe-Signaturschema) verifiziert.
//  - sonst (Default) -> lokaler Sandbox-Treiber: erstellt eine Session mit einer lokalen, gehosteten
//    Test-Bezahlseite (server/payment-routes.ts) und signiert die Webhook-Events mit demselben Schema.
//    So ist der komplette Zahlungs-Flow (Erfolg/Fehler/Storno/Idempotenz) ohne Kunden-Credentials
//    maschinell verifizierbar, und derselbe Code laeuft spaeter unveraendert gegen Stripe-Testmodus.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export type PaymentMode = 'stripe' | 'sandbox';
export type CheckoutMethod = 'twint' | 'card';

const STRIPE_API = 'https://api.stripe.com/v1';

// Im Sandbox-Modus ist das Secret fest (kein echtes Stripe), damit die Test-Bezahlseite die
// Webhook-Events korrekt signieren kann. Im echten Modus zwingend STRIPE_WEBHOOK_SECRET setzen.
const SANDBOX_WEBHOOK_SECRET = 'whsec_sandbox_salsaflow_dev';

export function paymentMode(): PaymentMode {
  return process.env.STRIPE_SECRET_KEY?.trim() ? 'stripe' : 'sandbox';
}

// Oeffentliche Basis-URL fuer success_url / cancel_url und die Sandbox-Bezahlseite.
export function publicBaseUrl(): string {
  return (process.env.PUBLIC_BASE_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

export function webhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || SANDBOX_WEBHOOK_SECRET;
}

// CHF-Betrag ("190.00") -> Rappen (Stripe rechnet in der kleinsten Waehrungseinheit).
export function chfToMinor(amountChf: string): number {
  return Math.round(Number.parseFloat(amountChf) * 100);
}

export type CreateSessionInput = {
  bookingId: string;
  amountChf: string;
  description: string; // Kurs-Beschreibung fuer die Bezahlseite / den Beleg
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreateSessionResult = {
  id: string; // Checkout-Session-ID (cs_...)
  url: string; // Weiterleitungs-URL fuer den Kunden
  paymentIntentId: string | null;
};

export async function createCheckoutSession(input: CreateSessionInput): Promise<CreateSessionResult> {
  const minor = chfToMinor(input.amountChf);
  if (minor <= 0) throw new Error('amount_required');

  if (paymentMode() === 'stripe') {
    const key = process.env.STRIPE_SECRET_KEY!.trim();
    const form = new URLSearchParams();
    form.set('mode', 'payment');
    // TWINT (Redirect, CH) + Karte in einer Integration (ARCHITEKTUR.md 7.2).
    form.append('payment_method_types[]', 'card');
    form.append('payment_method_types[]', 'twint');
    form.set('line_items[0][quantity]', '1');
    form.set('line_items[0][price_data][currency]', 'chf');
    form.set('line_items[0][price_data][unit_amount]', String(minor));
    form.set('line_items[0][price_data][product_data][name]', input.description.slice(0, 250));
    form.set('success_url', input.successUrl);
    form.set('cancel_url', input.cancelUrl);
    form.set('customer_email', input.customerEmail);
    form.set('client_reference_id', input.bookingId);
    form.set('metadata[booking_id]', input.bookingId);

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Stripe ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as { id: string; url: string; payment_intent: string | null };
    return { id: data.id, url: data.url, paymentIntentId: data.payment_intent ?? null };
  }

  // --- Sandbox-Treiber: lokale, gehostete Test-Bezahlseite ------------------
  const id = `cs_test_${randomUUID().replace(/-/g, '')}`;
  const paymentIntentId = `pi_test_${randomUUID().replace(/-/g, '')}`;
  // Die Seite liegt hinter /api (geht durch den Vite-Proxy) und liest Betrag/Buchung aus der DB.
  const url = `${publicBaseUrl()}/api/sandbox/checkout/${id}`;
  return { id, url, paymentIntentId };
}

export type RefundInput = { paymentIntentId: string | null; checkoutSessionId: string | null; amountChf: string };
export type RefundResult = { ok: boolean; refundId?: string; error?: string };

export async function refundPayment(input: RefundInput): Promise<RefundResult> {
  if (paymentMode() === 'stripe') {
    const key = process.env.STRIPE_SECRET_KEY!.trim();
    if (!input.paymentIntentId) return { ok: false, error: 'no_payment_intent' };
    const form = new URLSearchParams();
    form.set('payment_intent', input.paymentIntentId);
    form.set('amount', String(chfToMinor(input.amountChf)));
    try {
      const res = await fetch(`${STRIPE_API}/refunds`, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        return { ok: false, error: `Stripe ${res.status}: ${body.slice(0, 200)}` };
      }
      const data = (await res.json()) as { id?: string };
      return { ok: true, refundId: data.id };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Refund-Fehler' };
    }
  }
  // Sandbox: Refund gilt sofort als erfolgreich.
  return { ok: true, refundId: `re_test_${randomUUID().replace(/-/g, '')}` };
}

/* ----------------------------------------------------------------------------
 * Webhook-Signatur (Stripe-Schema): Header "t=<unix>,v1=<hmac_sha256_hex>".
 * signed_payload = `${t}.${rawBody}`; signature = HMAC-SHA256(secret, signed_payload).
 * -------------------------------------------------------------------------- */
export function signWebhookPayload(rawBody: string, secret: string, timestampSec: number): string {
  const sig = createHmac('sha256', secret).update(`${timestampSec}.${rawBody}`, 'utf8').digest('hex');
  return `t=${timestampSec},v1=${sig}`;
}

function timingSafeHexEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  toleranceSec = 300,
): { ok: boolean; reason?: string } {
  if (!header) return { ok: false, reason: 'no_signature' };
  let t: string | undefined;
  const v1: string[] = [];
  for (const seg of header.split(',')) {
    const i = seg.indexOf('=');
    if (i < 0) continue;
    const k = seg.slice(0, i).trim();
    const v = seg.slice(i + 1).trim();
    if (k === 't') t = v;
    else if (k === 'v1') v1.push(v);
  }
  if (!t || v1.length === 0) return { ok: false, reason: 'malformed' };
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest('hex');
  if (!v1.some((v) => timingSafeHexEqual(v, expected))) return { ok: false, reason: 'signature_mismatch' };
  if (toleranceSec > 0) {
    const age = Math.abs(Math.floor(Date.now() / 1000) - Number(t));
    if (!Number.isFinite(age) || age > toleranceSec) return { ok: false, reason: 'timestamp_out_of_tolerance' };
  }
  return { ok: true };
}

/* ----------------------------------------------------------------------------
 * Event-Envelope (Stripe-Form). Im Sandbox-Modus baut die Test-Bezahlseite damit
 * dieselben Event-Typen, die der echte Stripe-Webhook schickt.
 * -------------------------------------------------------------------------- */
export type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

export function buildEvent(type: string, object: Record<string, unknown>): StripeEvent {
  return { id: `evt_${randomUUID().replace(/-/g, '')}`, type, data: { object } };
}
