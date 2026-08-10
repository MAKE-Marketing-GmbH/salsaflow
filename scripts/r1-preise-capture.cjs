// Runde 1: /preise capturen — Desktop 1440x900 + Mobile 390x844,
// beides als überlappende Slices (~900px/844px hoch, ~15% Overlap).
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/preise/r2';

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

async function slices(page, vp, prefix) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(vp * 0.85); // ~15% Overlap
  const n = Math.max(1, Math.ceil((H - vp) / step) + 1);
  const files = [];
  for (let s = 0; s < n; s++) {
    const y = Math.min(s * step, Math.max(0, H - vp));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
    const p = path.join(OUT, `${prefix}-${String(s + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: p });
    files.push(path.resolve(p));
  }
  return files;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const all = [];

  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const dp = await dctx.newPage();
  await dp.goto(BASE + '/preise', { waitUntil: 'networkidle', timeout: 25000 });
  await prep(dp);
  all.push(...await slices(dp, 900, 'd'));
  await dctx.close();

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/preise', { waitUntil: 'networkidle', timeout: 25000 });
  await prep(mp);
  all.push(...await slices(mp, 844, 'm'));
  await mctx.close();

  await browser.close();
  console.log(all.join('\n'));
})().catch((e) => { console.error('ERROR: ' + e.message.split('\n')[0]); process.exit(1); });
