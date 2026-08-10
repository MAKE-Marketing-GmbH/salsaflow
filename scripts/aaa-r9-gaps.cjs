// Misst TOTE BAENDER auf der Home: zusammenhaengende y-Bereiche, in denen KEIN
// sichtbares Inhaltselement liegt (Text, Bild, Button, Linie).
// Nutzung: node scripts/aaa-r9-gaps.cjs [width] [minGap]
const { chromium } = require('playwright-core');

const W = +(process.argv[2] || 1440);
const MIN = +(process.argv[3] || 90);

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const page = await browser.newPage({ viewport: { width: W, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);

  const res = await page.evaluate((MIN) => {
    const main = document.querySelector('main');
    const spans = [];
    // Blattknoten mit echter visueller Substanz einsammeln.
    for (const el of main.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 1 || r.width < 1) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const isMedia = ['IMG', 'SVG', 'VIDEO', 'HR'].includes(el.tagName);
      const hasBorder = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderBottomWidth) > 0;
      if (!hasText && !isMedia && !hasBorder) continue;
      spans.push([Math.round(r.top + scrollY), Math.round(r.bottom + scrollY)]);
    }
    spans.sort((a, b) => a[0] - b[0]);
    const gaps = [];
    let cur = spans[0][1];
    const start = spans[0][0];
    for (const [t, b] of spans) {
      if (t - cur >= MIN) gaps.push({ from: cur, to: t, size: t - cur });
      if (b > cur) cur = b;
    }
    const secs = [...main.querySelectorAll('section')].map((s) => ({
      id: s.id || s.dataset.designUnit || 'sec',
      top: Math.round(s.getBoundingClientRect().top + scrollY),
      bottom: Math.round(s.getBoundingClientRect().bottom + scrollY),
    }));
    const label = (y) => {
      const s = secs.find((s) => y >= s.top && y <= s.bottom);
      return s ? s.id : '-';
    };
    return {
      total: document.body.scrollHeight,
      first: start,
      gaps: gaps.map((g) => ({ ...g, at: `${label(g.from)} -> ${label(g.to)}` })),
      deadSum: gaps.reduce((a, g) => a + g.size, 0),
    };
  }, MIN);

  console.log(`width=${W} total=${res.total} dead=${res.deadSum}px (${((res.deadSum / res.total) * 100).toFixed(1)}%)`);
  for (const g of res.gaps) console.log(String(g.size).padStart(5), `y=${g.from}..${g.to}`, g.at);
  await browser.close();
})();
