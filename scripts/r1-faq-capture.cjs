// Runde 1 FAQ-Capture: Desktop + Mobile, Full-Page in überlappenden Slices.
const { chromium } = require('/root/website-projects/make-anfrage-leck-check/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/faq/r1';

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

async function captureSlices(page, width, height, prefix) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.floor(height * 0.8); // ~20% Überlappung
  const slices = Math.max(1, Math.ceil((H - height) / step) + 1);
  const files = [];
  for (let s = 0; s < slices; s++) {
    const y = Math.min(s * step, Math.max(0, H - height));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
    const f = path.join(OUT, `${prefix}-${String(s + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: f });
    files.push(f);
  }
  return files;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const all = [];
  try {
    // Desktop
    const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const dp = await dctx.newPage();
    const resp = await dp.goto(BASE + '/faq', { waitUntil: 'networkidle', timeout: 25000 });
    if (!resp || resp.status() >= 400) throw new Error(`HTTP ${resp ? resp.status() : 'none'}`);
    await prep(dp);
    all.push(...(await captureSlices(dp, 1440, 900, 'd')));
    await dctx.close();

    // Mobile
    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
    const mp = await mctx.newPage();
    const resp2 = await mp.goto(BASE + '/faq', { waitUntil: 'networkidle', timeout: 25000 });
    if (!resp2 || resp2.status() >= 400) throw new Error(`HTTP ${resp2 ? resp2.status() : 'none'}`);
    await prep(mp);
    all.push(...(await captureSlices(mp, 390, 844, 'm')));
    await mctx.close();
  } catch (e) {
    console.log(`ERROR: ${e.message.split('\n')[0]}`);
    process.exitCode = 1;
  }
  await browser.close();
  console.log(all.map((f) => path.resolve(f)).join('\n'));
})();
