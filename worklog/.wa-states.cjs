// WA-Float Zustands-Shots: Ruhe, Hover (Icon-Geste), Press (scale), kompakt.
const { chromium } = require('playwright-core');
const fs = require('fs');
const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/wa-states';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  fs.mkdirSync(OUT, { recursive: true });

  // Desktop: Pille mit Label sichtbar
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
  await page.waitForTimeout(1200);

  const wa = page.locator('a.whatsapp-float').first();
  const box = await wa.boundingBox();
  const clip = box ? { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 40), width: box.width + 120, height: box.height + 120 } : undefined;

  await page.screenshot({ path: `${OUT}/d-ruhe.png`, clip });
  await wa.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/d-hover.png`, clip });
  await wa.dispatchEvent('mousedown').catch(() => {});
  await page.mouse.down().catch(() => {});
  await page.waitForTimeout(120);
  await page.screenshot({ path: `${OUT}/d-press.png`, clip });
  await page.mouse.up().catch(() => {});
  await ctx.close();

  // Mobil: kompakter Kreis
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await mp.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
  await mp.waitForTimeout(1200);
  const mwa = mp.locator('a.whatsapp-float').first();
  const mbox = await mwa.boundingBox();
  const mclip = mbox ? { x: Math.max(0, mbox.x - 30), y: Math.max(0, mbox.y - 30), width: mbox.width + 90, height: mbox.height + 90 } : undefined;
  await mp.screenshot({ path: `${OUT}/m-ruhe.png`, clip: mclip });
  await mctx.close();

  console.log('DONE');
  await browser.close();
})();
