// R188: Seiten-Screenshots Desktop 1440 + Mobil 390, Slices je Viewport.
// Aufruf: node scripts/r188-capture.cjs <outdir> [route ...]
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = process.argv[2] || 'worklog/shots/R188/before';
const ROUTES = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ['/', '/kontakt', '/faq', '/team', '/events', '/events-workshops/eventkalender',
     '/shows-animationen', '/preise', '/privatstunden', '/kursplan', '/schnupperstunde',
     '/tanzkurse', '/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels', '/kursaufbau'];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const manifest = [];
  for (const route of ROUTES) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    for (const [prefix, viewport, sliceH] of [['d', { width: 1440, height: 900 }, 900], ['m', { width: 390, height: 844 }, 844]]) {
      const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      const errors = [];
      p.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
      p.on('pageerror', e => errors.push(String(e).slice(0, 160)));
      const res = await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null);
      if (!res || res.status() >= 400) { console.log(`ERROR ${route} status ${res ? res.status() : 'nav-failed'}`); await ctx.close(); continue; }
      // Cookie-Banner wegklicken, damit Slices sauber sind
      await p.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
      await p.evaluate(async () => {
        document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; });
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
        window.scrollTo(0, 0);
      });
      await p.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(350);
      const dir = `${OUT}/${slug}`;
      fs.mkdirSync(dir, { recursive: true });
      const H = await p.evaluate(() => document.body.scrollHeight);
      const slices = Math.min(Math.ceil(H / sliceH), 14);
      for (let s = 0; s < slices; s++) {
        await p.evaluate(y => window.scrollTo(0, y), s * sliceH);
        await p.waitForTimeout(150);
        await p.screenshot({ path: `${dir}/${prefix}-${String(s + 1).padStart(2, '0')}.png` });
      }
      manifest.push({ route, prefix, slices, height: H, consoleErrors: errors });
      await ctx.close();
    }
    console.log(`done ${route}`);
  }
  await browser.close();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1));
  console.log('MANIFEST', `${OUT}/manifest.json`);
})();
