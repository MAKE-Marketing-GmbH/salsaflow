// Ganzseiten-PNG der Home (Desktop), fuer die Totflaechen-Analyse aaa-r10-dead.py.
// Aufruf: node scripts/aaa-r12-full.cjs [tag] [width]
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const W = Number(process.argv[3] || 1440);
const OUT = '/tmp/aaa-r12';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);
  const path = `${OUT}/${TAG}-full-${W}.png`;
  await p.screenshot({ path, fullPage: true });
  console.log(path);
  await b.close();
})();
