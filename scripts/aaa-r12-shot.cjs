// Runde r12 (2026-08-09): Screenshots der fuenf Kritik-Stellen auf Home, 1440px.
// Rein lesend. Aufruf: node scripts/aaa-r12-shot.cjs [tag]
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = '/tmp/aaa-r12';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal],[style*="opacity"]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);

  const shots = {
    team: '#team',
    community: '#community',
    events: '#events',
    faq: '#faq',
    kurse: '#kurse',
  };
  for (const [name, sel] of Object.entries(shots)) {
    const el = await p.$(sel);
    if (!el) { console.log('MISS ' + sel); continue; }
    await el.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
    console.log('ok ' + name);
  }
  // Kante Reviews -> Events als eigener Ausschnitt
  const edge = await p.evaluate(() => {
    const c = document.querySelector('#community').getBoundingClientRect();
    const e = document.querySelector('#events').getBoundingClientRect();
    return { y: Math.round(c.bottom + scrollY - 260), h: Math.round(e.top - c.bottom + 520) };
  });
  await p.screenshot({ path: `${OUT}/${TAG}-edge-reviews-events.png`, fullPage: true, clip: { x: 0, y: edge.y, width: 1440, height: edge.h } });
  console.log('ok edge', JSON.stringify(edge));
  await b.close();
})();
