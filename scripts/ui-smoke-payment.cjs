// Headless UI-Smoke (Etappe 9): der echte Klickweg der Online-Zahlung gegen einen laufenden
// Dev-Server mit PAYMENT_ENABLED=1 (npm run dev:pay). Beweist: Buchung -> Weiterleitung auf die
// (Sandbox-)Bezahlseite -> TWINT bezahlen -> Erfolgsseite mit bestaetigter Buchung + Beleg; und
// der Fehlerweg (Zahlung schlaegt fehl -> Abbruch-/Retry-Seite, Buchung NICHT bestaetigt).
// Headless-Pflicht (Memory): System-Chrome.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = 'http://localhost:5173';
const PLAN = `${ORIGIN}/kursplan`;
const SHOTS = '.marathon/e9-shots';
const STAMP = Date.now();
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function gotoPlanRunning(page) {
  await page.goto(PLAN, { waitUntil: 'networkidle' });
  await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });
  await page.locator('[data-testid="lang-de"]').click().catch(() => {});
  await page.waitForTimeout(150);
  await page.locator('[data-testid="phase-running"]').click().catch(() => {});
  await page.waitForTimeout(250);
}

// Eine Leader/Follower-Karte mit freier Rolle oeffnen und die freie Rolle waehlen.
async function openBookableCardAndPickRole(page) {
  const n = await page.locator('[data-testid="course-card"]').count();
  for (let i = 0; i < Math.min(n, 10); i++) {
    const card = page.locator('[data-testid="course-card"]').nth(i);
    await card.locator('[data-testid="book-open"]').click();
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 8000 }).catch(() => {});
    const hasRole = await page.locator('[data-testid="role-leader"]').count();
    if (!hasRole) return true; // offene Klasse -> buchbar
    const ls = await page.locator('[data-testid="role-leader"]').innerText();
    const fs2 = await page.locator('[data-testid="role-follower"]').innerText();
    const leaderFree = parseInt((ls.match(/(\d+)\s*frei/) || [])[1] || '0', 10);
    const followerFree = parseInt((fs2.match(/(\d+)\s*frei/) || [])[1] || '0', 10);
    if (leaderFree > 0) { await page.locator('[data-testid="role-leader"]').click(); return true; }
    if (followerFree > 0) { await page.locator('[data-testid="role-follower"]').click(); return true; }
    await page.locator('[data-testid="booking-close"]').click().catch(() => {});
    await page.locator('[data-testid="booking-dialog"]').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }
  return false;
}

async function fillMe(page, email) {
  await page.locator('[data-testid="bk-firstName"]').fill('SmokePay');
  await page.locator('[data-testid="bk-lastName"]').fill('Test');
  await page.locator('[data-testid="bk-email"]').fill(email);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text()); });

  try {
    /* === A) Erfolgsweg: buchen -> Bezahlseite -> TWINT -> bezahlt -> bestaetigt === */
    await gotoPlanRunning(page);
    const pickedA = await openBookableCardAndPickRole(page);
    ok('Buchbare Karte mit freier Rolle gefunden', pickedA);
    await fillMe(page, `smoke.pay.ok.${STAMP}@e9ui.local`);
    await page.locator('[data-testid="booking-submit"]').click();

    // Weiterleitung auf die (Sandbox-)Bezahlseite.
    await page.waitForURL(/\/api\/sandbox\/checkout\//, { timeout: 12000 });
    ok('Buchung leitet auf die Bezahlseite weiter', /\/api\/sandbox\/checkout\//.test(page.url()), page.url().slice(-28));
    await page.locator('[data-testid="sandbox-pay"]').waitFor({ timeout: 8000 });
    const amountTxt = await page.locator('[data-testid="sandbox-amount"]').innerText();
    ok('Bezahlseite zeigt einen Betrag (CHF)', /CHF\s*\d/.test(amountTxt), amountTxt);
    await page.screenshot({ path: `${SHOTS}/01-checkout.png`, fullPage: true });

    await page.locator('[data-testid="method-twint"]').click();
    await page.locator('[data-testid="sandbox-pay"]').click();

    // Erfolgsseite -> Buchung bestaetigt (Webhook hat serverseitig bereits bestaetigt).
    await page.waitForURL(/\/buchung\/erfolg/, { timeout: 12000 });
    await page.locator('[data-testid="return-confirmed"]').waitFor({ timeout: 12000 });
    ok('Erfolgsseite zeigt bestaetigte Buchung', true);
    const receiptTxt = await page.locator('[data-testid="return-receipt"]').innerText().catch(() => '');
    ok('Beleg auf der Erfolgsseite (CHF + TWINT)', /CHF/.test(receiptTxt) && /TWINT/.test(receiptTxt), receiptTxt);
    await page.screenshot({ path: `${SHOTS}/02-success.png`, fullPage: true });

    /* === B) Mobil: Bezahlseite ohne horizontalen Ueberlauf === */
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoPlanRunning(page);
    const pickedM = await openBookableCardAndPickRole(page);
    ok('Mobil: buchbare Karte gefunden', pickedM);
    await fillMe(page, `smoke.pay.mob.${STAMP}@e9ui.local`);
    await page.locator('[data-testid="booking-submit"]').click();
    await page.waitForURL(/\/api\/sandbox\/checkout\//, { timeout: 12000 });
    await page.locator('[data-testid="sandbox-pay"]').waitFor({ timeout: 8000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil: Bezahlseite ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-checkout.png`, fullPage: true });

    /* === C) Fehlerweg: Zahlung schlaegt fehl -> Buchung NICHT bestaetigt === */
    await page.locator('[data-testid="sandbox-fail"]').click();
    await page.waitForURL(/\/buchung\/abbruch/, { timeout: 12000 });
    await page.locator('[data-testid="payment-return"]').waitFor({ timeout: 12000 });
    const failVisible = await page.locator('[data-testid="return-failed"]').count();
    const cancelledVisible = await page.locator('[data-testid="return-cancelled"]').count();
    ok('Fehlerweg: Buchung nicht bestaetigt (Fehler-/Abbruch-Seite)', failVisible + cancelledVisible >= 1, `failed=${failVisible} cancelled=${cancelledVisible}`);
    const retryVisible = await page.locator('[data-testid="retry-payment"]').count();
    ok('Fehlerweg: erneuter Zahlversuch angeboten', retryVisible >= 1, `retry=${retryVisible}`);
    await page.screenshot({ path: `${SHOTS}/04-failed.png`, fullPage: true });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (PAYMENT) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
