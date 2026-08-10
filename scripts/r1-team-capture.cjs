// Runde 1: /team capture, Desktop 1440x900 + Mobile 390x844 als Slices (~900px).
const { chromium } = require('/usr/lib/node_modules/playwright/node_modules/playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/team/r1';

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

async function slices(page, prefix, vh) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  const n = Math.ceil(H / vh);
  const paths = [];
  for (let s = 0; s < n; s++) {
    await page.evaluate((y) => window.scrollTo(0, y), s * vh);
    await page.waitForTimeout(200);
    const p = `${OUT}/${prefix}-${String(s + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: p });
    paths.push(p);
  }
  return paths;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const all = [];
  try {
    const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const dp = await dctx.newPage();
    const dr = await dp.goto(BASE + '/team', { waitUntil: 'networkidle', timeout: 25000 });
    if (!dr || dr.status() >= 400) { console.log('ERROR: /team HTTP ' + (dr ? dr.status() : 'no-response')); process.exit(1); }
    await prep(dp);
    all.push(...await slices(dp, 'd', 900));
    await dctx.close();

    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
    const mp = await mctx.newPage();
    await mp.goto(BASE + '/team', { waitUntil: 'networkidle', timeout: 25000 });
    await prep(mp);
    all.push(...await slices(mp, 'm', 844));
    await mctx.close();
  } catch (e) {
    console.log('ERROR: ' + e.message.split('\n')[0]);
    process.exit(1);
  } finally {
    await browser.close();
  }
  console.log(all.map((p) => process.cwd() + '/' + p).join('\n'));
})();
