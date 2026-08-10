// Headless UI-Smoke (Etappe 8): öffentlicher Buchungs-Flow unter /kursplan + Admin-Balance.
// Prueft den echten Klickweg: Karte -> "Jetzt buchen" -> Rolle/Modus -> Daten -> bestaetigt,
// die Paar-Buchung, die DE/EN-Uebersetzung des Dialogs, mobile Sauberkeit und dass das Admin
// nach der Buchung die Leader/Follower-Balance sieht. Headless-Pflicht (Memory): System-Chrome.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = 'http://localhost:5173';
const PLAN = `${ORIGIN}/kursplan`;
const SHOTS = '.marathon/e8-shots';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

// Laufende Staffel heisst im Seed "Staffel <Monat> <Jahr>" mit Start = heute - 28 Tage.
function monthYearDe(d) {
  const M = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${M[d.getMonth()]} ${d.getFullYear()}`;
}
const runStart = new Date();
runStart.setDate(runStart.getDate() - 28);
const RUNNING_TERM = `Staffel ${monthYearDe(runStart)}`;
const STAMP = Date.now();

async function fill(page, testid, value) {
  await page.locator(`[data-testid="${testid}"]`).fill(value);
}

async function openBooking(page, index = 0) {
  const button = page.locator('[data-testid="book-open"]').nth(index);
  await button.scrollIntoViewIfNeeded();
  await button.evaluate((el) => el.click());
}

async function courseIdAt(page, index = 0) {
  return page.locator('[data-testid="course-card"]').nth(index).getAttribute('data-course-id');
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text());
  });

  try {
    await page.goto(PLAN, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });

    // --- 1) Dialog oeffnet + EN-Uebersetzung ------------------------------
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.waitForTimeout(150);
    await openBooking(page, 3);
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
    // Warten bis die Verfuegbarkeit geladen ist (dann steht das Formular, nicht nur der Spinner).
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 8000 });
    const enBody = await page.locator('[data-testid="booking-dialog"]').innerText();
    ok('Buchungs-Dialog oeffnet sich', enBody.length > 0);
    ok('Dialog uebersetzt nach EN (Book course / Reserve my spot)', enBody.includes('Book course') && enBody.includes('Reserve my spot'), 'EN-Lexikon');
    await page.locator('[data-testid="booking-close"]').click();
    await page.locator('[data-testid="booking-dialog"]').waitFor({ state: 'detached', timeout: 5000 });

    // zurueck auf DE + nur laufende Kurse (gehoeren zur laufenden Staffel)
    await page.locator('[data-testid="lang-de"]').first().evaluate((el) => el.click());
    await page.waitForTimeout(150);
    await page.locator('[data-testid="phase-running"]').evaluate((el) => el.click());
    await page.waitForTimeout(250);

    // --- 2) Leader allein buchen -> bestaetigt ----------------------------
    const soloCourseId = await courseIdAt(page, 3);
    await openBooking(page, 3);
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="role-leader"]').click();
    await fill(page, 'bk-firstName', 'SmokeLeader');
    await fill(page, 'bk-lastName', 'Test');
    await fill(page, 'bk-email', `smoke.leader.${STAMP}@e8ui.local`);
    await page.locator('[data-testid="booking-submit"]').click();
    await page.locator('[data-testid="booking-success"]').waitFor({ timeout: 8000 });
    const soloStatus = await page.locator('[data-testid="booking-success"]').getAttribute('data-status');
    ok('Leader-allein-Buchung wird bestaetigt', soloStatus === 'confirmed', `status ${soloStatus}`);
    await page.screenshot({ path: `${SHOTS}/01-solo-confirmed.png`, fullPage: true });
    await page.locator('[data-testid="booking-success"] >> text=Schliessen').click().catch(async () => {
      await page.locator('[data-testid="booking-close"]').click().catch(() => {});
    });
    await page.waitForTimeout(300);

    // --- 3) Paar buchen -> bestaetigt -------------------------------------
    await openBooking(page, 4);
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="role-leader"]').click();
    await page.locator('[data-testid="mode-couple"]').click();
    await fill(page, 'bk-firstName', 'SmokePaarA');
    await fill(page, 'bk-lastName', 'Test');
    await fill(page, 'bk-email', `smoke.paarA.${STAMP}@e8ui.local`);
    await fill(page, 'bk-p-firstName', 'SmokePaarB');
    await fill(page, 'bk-p-lastName', 'Test');
    await fill(page, 'bk-p-email', `smoke.paarB.${STAMP}@e8ui.local`);
    await page.locator('[data-testid="booking-submit"]').click();
    await page.locator('[data-testid="booking-success"]').waitFor({ timeout: 8000 });
    const coupleStatus = await page.locator('[data-testid="booking-success"]').getAttribute('data-status');
    ok('Paar-Buchung wird bestaetigt', coupleStatus === 'confirmed', `status ${coupleStatus}`);
    await page.screenshot({ path: `${SHOTS}/02-couple-confirmed.png`, fullPage: true });

    // --- 4) Mobil: Dialog ohne horizontalen Ueberlauf ---------------------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PLAN, { waitUntil: 'networkidle' });
    await openBooking(page, 3);
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil: Dialog ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-dialog.png`, fullPage: true });
    await page.setViewportSize({ width: 1280, height: 1600 });

    // --- 5) Admin sieht die Balance ---------------------------------------
    await page.goto(`${ORIGIN}/admin`, { waitUntil: 'networkidle' });
    await page.locator('input[type=password]').fill(process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await page.getByRole('heading', { name: 'Kursplan verwalten' }).waitFor({ timeout: 10000 });

    // Laufende Staffel oeffnen (dort liegen die eben gebuchten Plätze).
    const card = page.locator('.rounded-xl').filter({ hasText: RUNNING_TERM }).first();
    await card.getByRole('button', { name: 'Öffnen' }).click();
    await page.getByRole('button', { name: 'Buchungen & Balance' }).waitFor({ timeout: 8000 });
    await page.locator('[data-testid="open-balance"]').click();
    await page.locator('[data-testid="balance-view"]').waitFor({ timeout: 8000 });
    await page.waitForTimeout(300);
    const balBody = await page.locator('[data-testid="balance-view"]').innerText();
    ok('Admin: Balance-Sicht erreichbar', balBody.includes('Buchungen & Balance'));
    ok('Admin: Leader/Follower-Balance sichtbar', balBody.includes('Leader') && balBody.includes('Follower'), 'Rollen-Spalten');
    ok('Admin: mind. eine bestaetigte Buchung sichtbar', balBody.includes('Bestätigt'), 'Status-Badge');
    const bookedCourse = page.locator(`[data-testid="balance-course"][data-course-id="${soloCourseId}"]`).first();
    const leaderBadge = await bookedCourse.locator('[data-testid="bal-leader"]').innerText().catch(() => '');
    ok('Admin: bestaetigter Leader gezaehlt (>=1)', /Leader\s+[1-9]/.test(leaderBadge), `"${leaderBadge}"`);
    await page.screenshot({ path: `${SHOTS}/04-admin-balance.png`, fullPage: true });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (BOOKING) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
