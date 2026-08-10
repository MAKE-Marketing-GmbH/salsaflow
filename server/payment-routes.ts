// Zahlungs-Routen (Etappe 9). Oeffentlich (kein Admin-Auth):
//   POST /api/public/bookings/:id/checkout  -> startet die Zahlung, liefert die Redirect-URL.
//   GET  /api/public/bookings/:id/status    -> Buchungs-/Zahlungs-Status fuer die Rueckkehrseite.
//   POST /api/payments/webhook              -> verifizierter Stripe-Webhook (Roh-Body + Signatur).
//
// Nur im Sandbox-Modus (kein STRIPE_SECRET_KEY) zusaetzlich die lokale Test-Bezahlseite:
//   GET  /api/sandbox/checkout/:sessionId            -> gehostete Test-Bezahlseite (HTML).
//   POST /api/sandbox/checkout/:sessionId/complete   -> Aktion (bezahlen/fehlschlagen/abbrechen).

import { Hono } from 'hono';
import { z } from 'zod';
import type { Db } from '../db/client.js';
import { paymentMode, publicBaseUrl } from './payments.js';
import { BookingError } from './booking.js';
import {
  cancelUrl,
  fetchBookingPaymentStatus,
  findPaymentForSandbox,
  processSignedWebhook,
  sandboxComplete,
  sandboxDisplay,
  startCheckout,
  successUrl,
} from './payment-service.js';

const checkoutSchema = z.object({ language: z.enum(['de', 'en']).optional() });
const completeSchema = z.object({
  action: z.enum(['pay', 'fail', 'cancel', 'expire']),
  method: z.enum(['twint', 'card']).default('twint'),
});

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) =>
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '"' ? '&quot;' : '&#39;',
  );
}

// Basis-URL aus dem Request (damit success/cancel auf den echten Browser-Origin zeigen).
function baseFrom(c: { req: { header: (k: string) => string | undefined } }): string {
  const origin = c.req.header('origin');
  return (origin || publicBaseUrl()).replace(/\/+$/, '');
}

export function createPaymentRoutes(db: Db) {
  const app = new Hono();

  // --- Checkout starten ----------------------------------------------------
  app.post('/api/public/bookings/:id/checkout', async (c) => {
    const id = c.req.param('id');
    const parsed = checkoutSchema.safeParse(await c.req.json().catch(() => ({})));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe' }, 400);
    try {
      const r = await startCheckout(db, id, { baseUrl: baseFrom(c) });
      return c.json(r);
    } catch (e) {
      if (e instanceof BookingError) return c.json({ error: e.message, code: e.code }, e.status as 400);
      console.error('[payment] checkout-Fehler:', e);
      return c.json({ error: 'Zahlung konnte nicht gestartet werden.' }, 500);
    }
  });

  // --- Status fuer die Rueckkehrseite --------------------------------------
  app.get('/api/public/bookings/:id/status', async (c) => {
    const id = c.req.param('id');
    const s = await fetchBookingPaymentStatus(db, id);
    if (!s) return c.json({ error: 'Buchung nicht gefunden' }, 404);
    return c.json(s);
  });

  // --- Webhook (Roh-Body + Signatur) ---------------------------------------
  app.post('/api/payments/webhook', async (c) => {
    const rawBody = await c.req.text();
    const sig = c.req.header('stripe-signature');
    const r = await processSignedWebhook(db, rawBody, sig);
    return c.json({ received: r.status === 'processed' || r.status === 'duplicate', status: r.status, reason: r.reason }, r.httpStatus);
  });

  // --- Sandbox-Bezahlseite (nur lokal, ohne echtes Stripe) -----------------
  app.get('/api/sandbox/checkout/:sessionId', async (c) => {
    if (paymentMode() !== 'sandbox') return c.text('Not found', 404);
    const sessionId = c.req.param('sessionId');
    const found = await findPaymentForSandbox(db, sessionId);
    if (!found) return c.html('<h1>Session nicht gefunden</h1>', 404);
    const info = await sandboxDisplay(db, found.bookingId);
    return c.html(sandboxPage(sessionId, found.payment.amountChf, info.courseDe, info.email));
  });

  app.post('/api/sandbox/checkout/:sessionId/complete', async (c) => {
    if (paymentMode() !== 'sandbox') return c.json({ error: 'not_sandbox' }, 404);
    const sessionId = c.req.param('sessionId');
    const parsed = completeSchema.safeParse(await c.req.json().catch(() => ({})));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe' }, 400);
    const found = await findPaymentForSandbox(db, sessionId);
    if (!found) return c.json({ error: 'Session nicht gefunden' }, 404);

    const base = baseFrom(c);
    const { action, method } = parsed.data;

    // Abbrechen: kein Event, Buchung bleibt pending_payment -> zurueck auf die Abbruch-Seite.
    if (action === 'cancel') {
      return c.json({ redirect: cancelUrl(base, found.bookingId) });
    }

    const sandboxAction = action === 'pay' ? 'succeed' : action === 'expire' ? 'expire' : 'fail';
    const r = await sandboxComplete(db, found.payment, found.bookingId, sandboxAction, method);
    if (r.httpStatus !== 200) return c.json({ error: 'Verarbeitung fehlgeschlagen', detail: r }, 502);

    // Erfolg -> Erfolgsseite; Fehler/Ablauf -> Abbruch-/Retry-Seite.
    const redirect = action === 'pay' ? successUrl(base, found.bookingId) : cancelUrl(base, found.bookingId);
    return c.json({ redirect });
  });

  return app;
}

// Minimale, gebrandete Test-Bezahlseite (server-gerendert, kein React). Buttons schicken die Aktion
// an /complete und leiten dann auf die Stripe-aequivalente Rueckkehr-URL weiter.
function sandboxPage(sessionId: string, amountChf: string, courseDe: string, email: string): string {
  const safeCourse = escapeHtml(courseDe);
  const safeEmail = escapeHtml(email);
  const safeAmount = escapeHtml(amountChf);
  const safeSession = escapeHtml(sessionId);
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Salsaflow - Testzahlung</title>
<style>
  :root { --salsa: #AD1827; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, system-ui, Segoe UI, Roboto, sans-serif; background: #f5f5f5; color: #111; }
  .wrap { max-width: 460px; margin: 0 auto; padding: 32px 20px; }
  .card { background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.08); overflow: hidden; }
  .bar { background: #000; color: #fff; padding: 14px 20px; font-weight: 700; letter-spacing: .02em; }
  .bar span { color: var(--salsa); }
  .body { padding: 22px 20px; }
  .sandbox { display:inline-block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--salsa); border:1px solid var(--salsa); border-radius:999px; padding:2px 10px; margin-bottom:14px; }
  .course { font-size: 14px; color:#555; }
  .amount { font-size: 30px; font-weight: 800; margin: 6px 0 2px; }
  .email { font-size: 12px; color:#888; margin-bottom: 18px; }
  .methods { display:flex; gap:10px; margin-bottom:18px; }
  .method { flex:1; border:1px solid #ddd; border-radius:10px; padding:10px; text-align:center; font-weight:600; font-size:14px; cursor:pointer; background:#fff; }
  .method[aria-pressed="true"] { border-color: var(--salsa); background: #fdeef0; }
  button.act { width:100%; border:0; border-radius:10px; padding:13px; font-size:15px; font-weight:700; cursor:pointer; margin-top:8px; }
  .pay { background: var(--salsa); color:#fff; }
  .fail { background:#fff; color:#b45309; border:1px solid #f59e0b; }
  .cancel { background:#fff; color:#555; border:1px solid #ddd; }
  .hint { font-size:11px; color:#999; margin-top:14px; line-height:1.5; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="bar">SALSAFLOW <span>DC</span></div>
      <div class="body">
        <span class="sandbox">Testmodus</span>
        <div class="course">${safeCourse}</div>
        <div class="amount" data-testid="sandbox-amount">CHF ${safeAmount}</div>
        <div class="email">${safeEmail}</div>
        <div class="methods">
          <div class="method" data-testid="method-twint" data-method="twint" aria-pressed="true">TWINT</div>
          <div class="method" data-testid="method-card" data-method="card" aria-pressed="false">Karte</div>
        </div>
        <button class="act pay" data-testid="sandbox-pay" data-action="pay">Jetzt bezahlen</button>
        <button class="act fail" data-testid="sandbox-fail" data-action="fail">Zahlung schlägt fehl (Test)</button>
        <button class="act cancel" data-testid="sandbox-cancel" data-action="cancel">Abbrechen</button>
        <p class="hint">Dies ist eine lokale Test-Bezahlseite. Im echten Betrieb steht hier die
          gehostete Stripe-Seite mit TWINT, Karte, Apple Pay und Google Pay.</p>
      </div>
    </div>
  </div>
<script>
  var method = 'twint';
  var session = ${JSON.stringify(safeSession)};
  document.querySelectorAll('.method').forEach(function (el) {
    el.addEventListener('click', function () {
      method = el.getAttribute('data-method');
      document.querySelectorAll('.method').forEach(function (m) { m.setAttribute('aria-pressed', m === el ? 'true' : 'false'); });
    });
  });
  document.querySelectorAll('button.act').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var action = btn.getAttribute('data-action');
      document.querySelectorAll('button.act').forEach(function (b) { b.disabled = true; });
      try {
        var res = await fetch('/api/sandbox/checkout/' + session + '/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: action, method: method }),
        });
        var data = await res.json();
        if (data && data.redirect) { window.location.assign(data.redirect); return; }
      } catch (e) {}
      document.querySelectorAll('button.act').forEach(function (b) { b.disabled = false; });
    });
  });
</script>
</body>
</html>`;
}
