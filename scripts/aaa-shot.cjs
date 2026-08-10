// Verify-Shots fuer die Home-Fixes. Aufruf: node scripts/aaa-shot.cjs <tag> [y1,y2,...]
const { chromium } = require('/usr/lib/node_modules/playwright');
const fs = require('fs');

const tag = process.argv[2] || 'base';
const ys = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
const OUT = '/tmp/aaa-home/' + tag;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  for (const [name, w, h] of [['dsk', 1440, 900], ['mob', 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    await p.waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(500);
    const H = await p.evaluate(() => document.body.scrollHeight);
    const stops = ys.length ? ys : Array.from({ length: Math.ceil(H / h) }, (_, i) => i * h);
    for (const y of stops) {
      await p.evaluate((yy) => window.scrollTo(0, yy), y);
      await p.waitForTimeout(320);
      await p.screenshot({ path: OUT + '/' + name + '-y' + y + '.png' });
    }
    console.log(name + ' H=' + H + (errs.length ? ' ERRORS: ' + errs.join(' | ') : ' no-js-errors'));
    await ctx.close();
  }
  await b.close();
  console.log('-> ' + OUT);
})();
