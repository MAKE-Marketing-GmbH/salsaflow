// Prueft, ob die Cookie-Leiste auf 390px die Hero-CTAs ueberdeckt (Rect-Schnitt, kein Augenmass).
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const r = await page.evaluate(() => {
    const fixed = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
      const b = el.getBoundingClientRect();
      return b.height > 20 && b.width > 100 && b.bottom > innerHeight * 0.5;
    });
    const ctas = [...document.querySelectorAll('a, button')]
      .filter((a) => /Schnupperstunde buchen|Kursplan ansehen/.test(a.textContent))
      .map((a) => ({ t: a.textContent.trim().slice(0, 30), r: a.getBoundingClientRect() }));
    const overlaps = [];
    for (const f of fixed) {
      const fr = f.getBoundingClientRect();
      for (const c of ctas) {
        const ov = Math.min(fr.bottom, c.r.bottom) - Math.max(fr.top, c.r.top);
        const ox = Math.min(fr.right, c.r.right) - Math.max(fr.left, c.r.left);
        if (ov > 0 && ox > 0)
          overlaps.push({ cta: c.t, overlapPx: Math.round(ov), by: f.className.toString().slice(0, 50) });
      }
    }
    return {
      fixedCount: fixed.length,
      fixed: fixed.map((f) => ({ cls: f.className.toString().slice(0, 60), top: Math.round(f.getBoundingClientRect().top) })),
      ctas: ctas.map((c) => ({ t: c.t, top: Math.round(c.r.top), bottom: Math.round(c.r.bottom) })),
      overlaps,
    };
  });
  console.log(JSON.stringify(r, null, 2));
  await browser.close();
})();
