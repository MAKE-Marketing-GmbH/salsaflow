// Fix 4, Wurzelursache-Beweis. Gleiche Seite, gleiche Scrollposition, EIN Unterschied:
// prefers-reduced-motion an/aus. Wenn der Overlap nur mit "reduce" auftritt, liegt die
// Ursache in der hide-on-scroll-Abschaltung von SiteHeader.tsx:53-56 und NICHT im
// Abstand der Team-Sektion.
const { chromium } = require('playwright-core');
const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const rm of ['reduce', 'no-preference']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: rm });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(500);

    // Abwaerts lesen mit echten Radschritten bis Team-H2 oben aus dem Bild laeuft.
    const target = await p.evaluate(() => {
      const h = document.getElementById('team').querySelector('h2');
      return Math.round(h.getBoundingClientRect().top + window.scrollY) + 60;
    });
    let guard = 0;
    while (guard++ < 500) {
      const y = await p.evaluate(() => window.scrollY);
      if (y >= target) break;
      await p.mouse.wheel(0, 200);
      await p.waitForTimeout(14);
    }
    await p.waitForTimeout(800);

    const r = await p.evaluate(() => {
      const nav = document.querySelector('header');
      const pill = nav.querySelector('div').getBoundingClientRect();
      const h = document.getElementById('team').querySelector('h2');
      const hb = h.getBoundingClientRect();
      const v = Math.min(pill.bottom, hb.bottom) - Math.max(pill.top, hb.top);
      const hz = Math.min(pill.right, hb.right) - Math.max(pill.left, hb.left);
      return {
        scrollY: Math.round(window.scrollY),
        transform: getComputedStyle(nav).transform,
        overlap: v > 0 && hz > 0 ? Math.round(v) : 0,
      };
    });
    console.log(
      `prefers-reduced-motion=${rm.padEnd(14)} scrollY=${r.scrollY}  nav-transform=${r.transform}  H2-verdeckt=${r.overlap}px`,
    );
    await ctx.close();
  }
  await browser.close();
})();
