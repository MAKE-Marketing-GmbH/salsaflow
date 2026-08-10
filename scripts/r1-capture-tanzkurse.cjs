// Runde 1: /tanzkurse Capture — Desktop + Mobile Slices (~900px, überlappend).
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/tanzkurse/r1';
const SLICE = 900;
const OVERLAP = 80; // Überlappung
const STEP = SLICE - OVERLAP;

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
  const n = Math.max(1, Math.ceil((H - OVERLAP) / STEP));
  for (let s = 0; s < n; s++) {
    const y = Math.min(s * STEP, Math.max(0, H - viewportH));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
    const p = `${OUT}/${prefix}-${String(s + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: p });
    out.push(p);
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const out = [];
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const dp = await dctx.newPage();
  const resp = await dp.goto(BASE + '/tanzkurse', { waitUntil: 'networkidle', timeout: 25000 });
  if (!resp || resp.status() >= 400) { console.log('ERROR: HTTP ' + (resp ? resp.status() : 'no response')); process.exit(1); }
  await prep(dp);
  await slices(dp, 'd', 900, out);
  await dctx.close();

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/tanzkurse', { waitUntil: 'networkidle', timeout: 25000 });
  await prep(mp);
  await slices(mp, 'm', 844, out);
  await mctx.close();

  await browser.close();
  const path = require('path');
  console.log(out.map((p) => path.resolve(p)).join('\n'));
})();
