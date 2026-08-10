// Prueft auf 390px, ob eine fixe Leiste IRGENDEIN Inhaltselement (Text-Leaf oder Medium)
// ueberdeckt — nicht nur Links. An mehreren Scrollpositionen inkl. Seitenende.
// Aufruf: node scripts/aaa-r10-cover.cjs
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
      const inside = (el, roots) => roots.some((r) => r && r.contains(el));
      const hits = [];
      for (const f of fixed) {
        const fr = f.getBoundingClientRect();
        for (const el of document.body.querySelectorAll('*')) {
          if (f.contains(el) || el.contains(f)) continue;
          if (inside(el, fixed)) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
          const leaf = el.children.length === 0 && el.textContent.trim();
          const media = ['IMG', 'SVG', 'VIDEO'].includes(el.tagName);
          if (!leaf && !media) continue;
          const r = el.getBoundingClientRect();
          if (r.height <= 0 || r.width <= 0) continue;
          const oy = Math.min(fr.bottom, r.bottom) - Math.max(fr.top, r.top);
          const ox = Math.min(fr.right, r.right) - Math.max(fr.left, r.left);
          if (oy > 2 && ox > 2)
            hits.push({ el: (el.tagName + ' ' + (el.textContent || el.getAttribute('src') || '')).trim().slice(0, 40), oy: Math.round(oy) });
        }
      }
      return { scrollY: Math.round(scrollY), fixedCount: fixed.length, hits };
    });

  console.log('top      ', JSON.stringify(await probe()));
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (const y of [200, 400, Math.round(H / 2), H]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    console.log('y=' + y, JSON.stringify(await probe()));
  }
  await browser.close();
})();
