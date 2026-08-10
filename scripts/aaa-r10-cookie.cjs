// Prueft auf 390px, ob eine fixe Leiste (Cookie/Sticky) irgendeinen Link/Button des Footers
// oder des Abschluss-CTA ueberdeckt — an mehreren Scrollpositionen, inklusive Seitenende.
// Aufruf: node scripts/aaa-r10-cookie.cjs
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const probe = () =>
    page.evaluate(() => {
      const fixed = [...document.querySelectorAll('body *')].filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        const b = el.getBoundingClientRect();
        return b.height > 20 && b.width > 100 && b.bottom > innerHeight * 0.5;
      });
      const targets = [...document.querySelectorAll('footer a, footer button, main a, main button')]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.height > 0 && b.top < innerHeight && b.bottom > 0;
        });
      const hits = [];
      for (const f of fixed) {
        const fr = f.getBoundingClientRect();
        for (const t of targets) {
          const tr = t.getBoundingClientRect();
          const oy = Math.min(fr.bottom, tr.bottom) - Math.max(fr.top, tr.top);
          const ox = Math.min(fr.right, tr.right) - Math.max(fr.left, tr.left);
          if (oy > 0 && ox > 0) hits.push({ target: t.textContent.trim().slice(0, 34), overlapPx: Math.round(oy) });
        }
      }
      return { scrollY: Math.round(scrollY), fixed: fixed.map((f) => f.className.toString().slice(0, 42)), hits };
    });

  console.log('top      ', JSON.stringify(await probe()));
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (const y of [400, Math.round(H / 2), H]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    console.log('y=' + y, JSON.stringify(await probe()));
  }
  await browser.close();
})();
