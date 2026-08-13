// Headless UI-Smoke: oeffentlicher RESERVIERUNGS-Flow (Stand 13.08.2026).
// Der alte Smoke prüfte den Kauf-Flow (book-open, Admin-Balance) — den gibt es nicht mehr:
// Buchung = Reservierung per Mail, ohne Datenbank (DECISIONS.md). Geprueft wird der echte
// Klickweg: /kursplan-Zeile -> /buchung?kurs=<id> -> Rolle -> Daten -> "Reservierung ist da",
// dazu die Paar-Reservierung und mobile Sauberkeit des Dialogs.
//
// Aufruf: SMOKE_ORIGIN=http://127.0.0.1:5174 node scripts/ui-smoke-booking.cjs
// (Default 5173; die lokale API muss laufen, sonst laedt der Kursplan nicht.)
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = process.env.SMOKE_ORIGIN || 'http://localhost:5173';
const SHOTS = '.marathon/reservation-shots';
const STAMP = Date.now();
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function fillPerson(page, prefix, first) {
  await page.locator(`input[name="${prefix}-firstName"]`).fill(first);
  await page.locator(`input[name="${prefix}-lastName"]`).fill('Smoke');
  await page.locator(`input[name="${prefix}-email"]`).fill(`${first.toLowerCase()}.${STAMP}@uismoke.local`);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1600 },
    // Eigener Rate-Limit-Eimer pro Lauf: der Server keyed auf x-forwarded-for; ohne das
    // laeuft der zweite Smoke innerhalb von 10 Minuten in die 429 (5 Mails/10min).
    extraHTTPHeaders: { 'x-forwarded-for': `10.77.${Math.floor(STAMP / 1000) % 250}.${STAMP % 250}` },
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  try {
    // --- 1) /kursplan: Zeilen sind Links auf /buchung?kurs=<id> ------------
    await page.goto(`${ORIGIN}/kursplan`, { waitUntil: 'networkidle' });
    const firstCard = page.locator('[data-testid="course-card"]').first();
    await firstCard.waitFor({ timeout: 15000 });
    const href = await firstCard.getAttribute('href');
    ok('Kursplan-Zeile verlinkt auf /buchung?kurs=', /^\/buchung\?kurs=/.test(href || ''), href || 'kein href');

    // --- 2) Vorauswahl: Link folgen, Dialog steht auf dem Kurs -------------
    await page.goto(`${ORIGIN}${href}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 10000 });
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 10000 });
    ok('Dialog oeffnet vorausgewaehlt', true);

    // --- 3) Solo-Reservierung bis zum Erfolg -------------------------------
    // Offene Kurse (Heels etc.) haben keine Rollenwahl — nur klicken, wenn es sie gibt.
    const role = page.locator('[data-testid="role-follower"]');
    if (await role.count()) await role.click();
    await fillPerson(page, 'bk', 'Solo');
    await page.locator('[data-testid="booking-submit"]').click();
    await page.locator('[data-testid="booking-success"]').waitFor({ timeout: 10000 });
    const soloStatus = await page.locator('[data-testid="booking-success"]').getAttribute('data-status');
    ok('Solo-Reservierung erreicht Erfolgsscreen', soloStatus === 'confirmed' || soloStatus === 'waitlisted', `status ${soloStatus}`);
    await page.screenshot({ path: `${SHOTS}/01-solo.png`, fullPage: false });
    await page.locator('[data-testid="booking-close"]').click().catch(() => {});
    await page.waitForTimeout(300);

    // --- 4) Paar-Reservierung ----------------------------------------------
    await page.goto(`${ORIGIN}/buchung`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="course-list"] button').first().waitFor({ timeout: 10000 });
    await page.locator('[data-testid="course-list"] button').first().click();
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 10000 });
    const role2 = page.locator('[data-testid="role-leader"]');
    if (await role2.count()) await role2.click();
    await page.locator('[data-testid="mode-couple"]').click();
    await fillPerson(page, 'bk', 'PaarA');
    await fillPerson(page, 'bk-p', 'PaarB');
    await page.locator('[data-testid="booking-submit"]').click();
    await page.locator('[data-testid="booking-success"]').waitFor({ timeout: 10000 });
    const coupleStatus = await page.locator('[data-testid="booking-success"]').getAttribute('data-status');
    ok('Paar-Reservierung erreicht Erfolgsscreen', coupleStatus === 'confirmed' || coupleStatus === 'waitlisted', `status ${coupleStatus}`);
    await page.screenshot({ path: `${SHOTS}/02-couple.png`, fullPage: false });

    // --- 5) Mobil: Dialog ohne Ueberlauf, Absenden erreichbar --------------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${ORIGIN}${href}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 10000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil: kein horizontaler Ueberlauf', overflow <= 1, `${overflow}px`);
    const submitVisible = await page.locator('[data-testid="booking-submit"]').isVisible();
    ok('Mobil: Absende-Knopf sichtbar', submitVisible);
    await page.screenshot({ path: `${SHOTS}/03-mobile.png`, fullPage: false });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (RESERVIERUNG) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
