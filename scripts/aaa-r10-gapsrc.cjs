// Benennt zu jedem leeren Band das letzte Element darueber und das erste darunter,
// damit der Grund (welches Padding/Margin) belegbar ist statt geraten.
// Aufruf: node scripts/aaa-r10-gapsrc.cjs [width] [minGap]
const { chromium } = require('/usr/lib/node_modules/playwright');
const W = Number(process.argv[2] || 1440);
const MIN = Number(process.argv[3] || 90);
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
  await p.waitForTimeout(900);
  const out = await p.evaluate((MIN) => {
    const H = document.body.scrollHeight;
    const boxes = [];
    for (const el of document.body.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
      const isLeafText = el.children.length === 0 && el.textContent.trim();
      const isMedia = ['IMG', 'SVG', 'VIDEO', 'CANVAS'].includes(el.tagName);
      if (!isLeafText && !isMedia) continue;
      const r = el.getBoundingClientRect();
      if (r.height <= 0 || r.width <= 0) continue;
      boxes.push({
        t: Math.max(0, Math.round(r.top + scrollY)),
        b: Math.min(H, Math.round(r.bottom + scrollY)),
        d: (el.tagName + ' ' + (el.getAttribute('src') || el.textContent || '').trim()).slice(0, 55),
      });
    }
    const occ = new Uint8Array(H + 2);
    for (const x of boxes) for (let y = x.t; y < x.b; y++) occ[y] = 1;
    const gaps = []; let s = null;
    for (let y = 0; y < H; y++) {
      if (!occ[y]) { if (s === null) s = y; } else { if (s !== null && y - s >= MIN) gaps.push([s, y]); s = null; }
    }
    if (s !== null && H - s >= MIN) gaps.push([s, H]);
    return gaps.map(([a, z]) => {
      const above = boxes.filter((x) => x.b <= a).sort((x, y) => y.b - x.b)[0];
      const below = boxes.filter((x) => x.t >= z).sort((x, y) => x.t - y.t)[0];
      return { a, z, h: z - a, above: above && above.d, below: below && below.d };
    });
  }, MIN);
  for (const g of out) console.log(`${String(g.h).padStart(4)}px  y=${g.a}..${g.z}\n        ^ ${g.above}\n        v ${g.below}`);
  await b.close();
})();
