// Runde 1: Screenshot-Capture /tanzkurse/salsa (Desktop+Mobile, ueberlappende Slices).
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const ROUTE = '/tanzkurse/salsa';
const OUT = '_screenshots-runde1/stil-salsa/r1';
const SLICE_H = 900;
const OVERLAP = 90;

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

async function slices(page, prefix, viewportH, out) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  const step = viewportH - OVERLAP;
  const n = Math.max(1, Math.ceil((H - OVERLAP) / step));
  const paths = [];
  for (let s = 0; s < n; s++) {
    let y = s * step;
    if (y + viewportH > H) y = Math.max(0, H - viewportH);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
    const p = `${out}/${prefix}-${String(s + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: p });
    paths.push(p);
  }
  return paths;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const all = [];

  // Desktop 1440x900
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const dp = await dctx.newPage();
  try {
    await dp.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    await prep(dp);
    all.push(...await slices(dp, 'd', SLICE_H, OUT));
  } catch (e) { console.log('ERROR desktop: ' + e.message.split('\n')[0]); process.exitCode = 1; }
  await dctx.close();

  // Mobile 390x844
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
  const mp = await mctx.newPage();
  try {
    await mp.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    await prep(mp);
    all.push(...await slices(mp, 'm', 844, OUT));
  } catch (e) { console.log('ERROR mobile: ' + e.message.split('\n')[0]); process.exitCode = 1; }
  await mctx.close();

  await browser.close();
  const path = require('path');
  all.forEach((p) => console.log(path.resolve(p)));
})();
