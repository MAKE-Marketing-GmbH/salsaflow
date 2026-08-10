// Runde r14: eine einzelne Sektion gross herausschneiden (2x Skalierung fuer Detailpruefung).
// Rein lesend. Aufruf: node scripts/aaa-r14-crop.cjs <sektion-id> [breite] [outdir]
const { chromium } = require('playwright-core');
const fs = require('fs');
const ID = process.argv[2] || 'community';
const W = Number(process.argv[3] || 1440);
const OUT = process.argv[4] || '/tmp/aaa-r14';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const p = await (await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1000);

  const box = await p.evaluate((id) => {
    const main = document.querySelector('main');
    const el = id === 'price'
      ? [...main.children].find((c) => !c.id && c.querySelector('h2'))
      : document.getElementById(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: 0, y: Math.round(r.top + scrollY), width: window.innerWidth, height: Math.round(r.height) };
  }, ID);
  if (!box) { console.log('Sektion nicht gefunden:', ID); await b.close(); return; }
  await p.screenshot({ path: `${OUT}/crop-${ID}-${W}.png`, fullPage: true, clip: box });
  console.log(`${OUT}/crop-${ID}-${W}.png  ${box.width}x${box.height} @y=${box.y}`);
  await b.close();
})();
