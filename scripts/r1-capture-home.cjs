const { chromium } = require('playwright-core');
const fs = require('fs');
const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/home/r1';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const paths = [];
  async function capture(viewport, prefix, sliceH) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const res = await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 }).catch(e => null);
    if (!res || res.status() >= 400) { console.log(`ERROR ${prefix} page status ${res ? res.status() : 'nav-failed'}`); await ctx.close(); return; }
    await p.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; });
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await p.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0), { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(400);
    const H = await p.evaluate(() => document.body.scrollHeight);
    const slices = Math.ceil(H / sliceH);
    for (let s = 0; s < slices; s++) {
      await p.evaluate(y => window.scrollTo(0, y), s * sliceH);
      await p.waitForTimeout(180);
      const fp = `${OUT}/${prefix}-${String(s + 1).padStart(2, '0')}.png`;
      await p.screenshot({ path: fp });
      paths.push(process.cwd() + '/' + fp);
    }
    await ctx.close();
  }
  await capture({ width: 1440, height: 900 }, 'd', 900);
  await capture({ width: 390, height: 844 }, 'm', 844);
  await browser.close();
  console.log(paths.join('\n'));
})();
