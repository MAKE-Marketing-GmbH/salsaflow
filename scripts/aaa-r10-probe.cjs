// Punktuelle Messung einzelner Elemente (Spaltenhoehen im dunklen Events-Band,
// Gruender-Panels, Cookie-Leiste gegen Footer-Links).
// Aufruf: node scripts/aaa-r10-probe.cjs [width]
const { chromium } = require('/usr/lib/node_modules/playwright');
const W = Number(process.argv[2] || 1440);
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);

  const dark = await p.evaluate(() => {
    const s = document.querySelector('#events');
    const r = s.getBoundingClientRect();
    const cols = [...s.querySelector('.mx-auto').children].map((c) => {
      const cr = c.getBoundingClientRect();
      return { top: Math.round(cr.top - r.top), h: Math.round(cr.height) };
    });
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height), cols };
  });
  console.log('events', JSON.stringify(dark));

  const founders = await p.evaluate(() => {
    const ul = document.querySelector('#team ul');
    const r = ul.getBoundingClientRect();
    return {
      ulTop: Math.round(r.top + scrollY), ulH: Math.round(r.height),
      items: [...ul.children].map((li) => {
        const lr = li.getBoundingClientRect();
        return {
          w: Math.round(lr.width),
          top: Math.round(lr.top - r.top),
          bot: Math.round(lr.bottom - r.top),
        };
      }),
    };
  });
  console.log('founders', JSON.stringify(founders));
  await b.close();
})();
