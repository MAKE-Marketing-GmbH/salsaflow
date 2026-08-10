// Runde 1: /kursplan Slices (Desktop 1440x900, Mobile 390x844) + Buchungs-Funnel
// (erste Buchen-CTA -> /kontakt Formular -> ausgefuellt -> Bestaetigung), je Desktop+Mobile.
// Muster: scripts/e17-capture.cjs (headless System-Chrome, Lazy-Load-Prep).
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/buchung/r1';
const made = [];

async function prep(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}

async function slices(page, vh, prefix) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(vh * 0.9); // ~10% Ueberlappung
  const n = Math.min(24, Math.max(1, Math.ceil(H / step)));
  for (let s = 0; s < n; s++) {
    const y = Math.min(s * step, Math.max(0, H - vh));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
    const p = `${OUT}/${prefix}-${String(s + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: p });
    made.push(p);
  }
}

async function funnelShot(page, name) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const p = `${OUT}/${name}.png`;
  await page.screenshot({ path: p, fullPage: true });
  made.push(p);
}

async function runFunnel(page, prefix) {
  // Erste Buchen-CTA auf /kursplan (SlotRow-Link nach /kontakt?kurs=...).
  const cta = page.locator('a[data-testid="course-card"]').first();
  await cta.scrollIntoViewIfNeeded();
  const href = await cta.getAttribute('href');
  await cta.click();
  await page.waitForTimeout(500);
  // Das CTA-Ziel direkt laden, damit paralleles Hot-Reload keinen SPA-Zwischenzustand festhaelt.
  if (href) await page.goto(BASE + href, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('[data-testid="contact-name"]:visible').first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  await funnelShot(page, `${prefix}-01`); // leeres Formular (Kurs vorausgewaehlt)
  await page.locator('[data-testid="contact-name"]:visible').first().fill('Critic Test');
  await page.locator('[data-testid="contact-email"]:visible').first().fill('critic-test@example.com');
  const msg = page.locator('[data-testid="contact-message"]:visible').first();
  if (await msg.count()) await msg.fill('Testbuchung Critic Runde 1: bitte einen Platz reservieren.');
  await funnelShot(page, `${prefix}-02`); // ausgefuellt
  await page.locator('[data-testid="contact-submit"]:visible').first().click();
  await page.locator('[data-testid="contact-success"]').waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await funnelShot(page, `${prefix}-03`); // Bestaetigung
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    // Desktop
    const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const dp = await dctx.newPage();
    await dp.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    const r = await dp.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle', timeout: 30000 });
    if (!r || r.status() >= 400) { console.log(`ERROR: /kursplan HTTP ${r ? r.status() : 'no-response'}`); process.exit(1); }
    await dp.waitForSelector('[data-testid="course-card"]', { timeout: 15000 });
    await prep(dp);
    await slices(dp, 900, 'd');
    await runFunnel(dp, 'f');
    await dctx.close();

    // Mobile
    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
    const mp = await mctx.newPage();
    await mp.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await mp.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle', timeout: 30000 });
    await mp.waitForSelector('[data-testid="course-card"]', { timeout: 15000 });
    await prep(mp);
    await slices(mp, 844, 'm');
    await runFunnel(mp, 'fm');
    await mctx.close();
  } catch (e) {
    console.log('ERROR: ' + e.message.split('\n')[0]);
    console.log(made.join('\n'));
    await browser.close();
    process.exit(1);
  }
  await browser.close();
  console.log(made.join('\n'));
})();
