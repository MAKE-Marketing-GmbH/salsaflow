// Prueft ob die Einwaende-Sektion (WhyGrid) als 2x2-Raster rendert (Kritiker-Befund r15:
// "noch vertikale Accordion-Liste statt 2x2-Paarfeld"). Misst gridTemplateColumns und die
// realen Kind-Positionen — zwei Kinder auf gleicher y-Hoehe = echtes 2-Spalten-Raster.
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  });
  const info = await p.evaluate(() => {
    const grids = [...document.querySelectorAll('.sm\\:grid-cols-2')];
    return grids.map(g => {
      const kids = [...g.children].map(c => {
        const kr = c.getBoundingClientRect();
        return { x: Math.round(kr.x), y: Math.round(kr.y + window.scrollY), w: Math.round(kr.width) };
      });
      return {
        children: g.children.length,
        cols: getComputedStyle(g).gridTemplateColumns,
        firstText: (g.textContent || '').slice(0, 60),
        kids: kids.slice(0, 4),
      };
    });
  });
  console.log(JSON.stringify(info, null, 1));
  const el = await p.$('section:has(.sm\\:grid-cols-2)');
  if (el) await el.screenshot({ path: '/tmp/whygrid-section.png' });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
