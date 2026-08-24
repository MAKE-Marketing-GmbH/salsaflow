// R206: Belege fuer Raphaels Mobile-Menue- und /faq-Ansage (23.08. 16:40).
// Nimmt Interaktionszustaende auf, die der r205-Sweep nicht abdeckt:
// offenes Mobile-Menue (zu + Untermenue offen) auf 390px und /faq-Desktop-Folds.
// Aufruf: TAG=vorher node scripts/r206-menu-faq-shots.cjs
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:5173';
const TAG = process.env.TAG || 'vorher';
const OUT = 'fertig/r206';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // --- Mobile-Menue, 390px ---
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.locator('header button[aria-controls="mobile-navigation"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/menu-offen-m390-${TAG}.png` });
    // Untermenue Tanzkurse oeffnen
    await page.locator('#mobile-navigation button', { hasText: 'Tanzkurse' }).first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/menu-untermenu-m390-${TAG}.png` });
    await ctx.close();
  }

  // --- /faq Desktop, 1440px: Fold + zwei Scrollstufen ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/faq', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
    // Reveals feuern lassen
    await page.evaluate(async () => {
      const step = innerHeight * 0.8;
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 120));
      }
      scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/faq-d1440-fold-${TAG}.png` });
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    for (const [name, frac] of [['mitte', 0.4], ['ende', 1]]) {
      await page.evaluate((t) => scrollTo({ top: t, behavior: 'instant' }), Math.max(0, docH * frac - 900));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/faq-d1440-${name}-${TAG}.png` });
    }
    console.log('faq docH', docH);
    await ctx.close();
  }

  await browser.close();
  console.log('fertig:', TAG);
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
