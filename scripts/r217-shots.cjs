/* R217: Belegbilder der Kurskarten auf /tanzkurse, 1440 und 390.
   Kein fullPage — der Ausschnitt wird auf die Kartenreihe gescrollt und im
   Viewport aufgenommen (Sweep-Vertrag). */
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = process.env.R217_BASE ?? 'http://127.0.0.1:4753';
const OUT = '/root/clients/salsaflow-w1/worklog/shots/R217';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
  });
  for (const vp of [{ w: 1440, h: 730 }, { w: 390, h: 844 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(`${BASE}/tanzkurse`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const card = page.locator('a[href*="/kursplan"]').filter({ has: page.locator('img') }).first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `${OUT}/tanzkurse-karten-${vp.w}.png`,
      animations: 'disabled',
      caret: 'hide',
    });
    console.log(`${OUT}/tanzkurse-karten-${vp.w}.png`);
    await page.close();
  }
  await browser.close();
})();
