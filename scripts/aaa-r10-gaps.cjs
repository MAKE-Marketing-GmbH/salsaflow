// Misst leere vertikale Baender (kein Text-Leaf, kein Medium) auf der Startseite.
// Aufruf: node scripts/aaa-r10-gaps.cjs [width]
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
  await p.waitForTimeout(900);
  const res = await p.evaluate(() => {
    const H = document.body.scrollHeight;
    const occ = new Uint8Array(H + 2);
    for (const el of document.body.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
      const isLeafText = el.children.length === 0 && el.textContent.trim();
      const isMedia = ['IMG', 'SVG', 'VIDEO', 'CANVAS'].includes(el.tagName);
      if (!isLeafText && !isMedia) continue;
      const r = el.getBoundingClientRect();
      if (r.height <= 0 || r.width <= 0) continue;
      const t = Math.max(0, Math.round(r.top + scrollY));
      const bo = Math.min(H, Math.round(r.bottom + scrollY));
      for (let y = t; y < bo; y++) occ[y] = 1;
    }
    const gaps = []; let s = null;
    for (let y = 0; y < H; y++) {
      if (!occ[y]) { if (s === null) s = y; } else { if (s !== null && y - s >= 90) gaps.push([s, y, y - s]); s = null; }
    }
    if (s !== null && H - s >= 90) gaps.push([s, H, H - s]);
    return { H, gaps };
  });
  console.log(W, JSON.stringify(res));
  await b.close();
})();
