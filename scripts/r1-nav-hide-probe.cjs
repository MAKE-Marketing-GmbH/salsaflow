// Wurzelursache-Test zu Fix 4: die Nav-Pille verdeckt Ueberschriften nur dann dauerhaft,
// wenn hide-on-scroll beim ABWAERTS-Lesen NICHT greift. Genau das wird hier geprueft —
// mit echten Radschritten (mouse.wheel), nicht mit window.scrollTo, damit Lenis und die
// hide-Logik dieselben Ereignisse sehen wie bei einem Menschen.
const { chromium } = require('playwright-core');
const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(600);

    const teamTop = await p.evaluate(() => {
      const h = document.getElementById('team').querySelector('h2');
      return Math.round(h.getBoundingClientRect().top + window.scrollY);
    });

    // Abwaerts bis kurz vor die Team-Ueberschrift radeln
    let guard = 0;
    while (guard++ < 400) {
      const y = await p.evaluate(() => window.scrollY);
      if (y >= teamTop - 300) break;
      await p.mouse.wheel(0, 240);
      await p.waitForTimeout(16);
    }
    await p.waitForTimeout(700);

    const down = await p.evaluate(() => {
      const nav = document.querySelector('header');
      const h = document.getElementById('team').querySelector('h2');
      const hb = h.getBoundingClientRect();
      const pill = nav.querySelector('div').getBoundingClientRect();
      const v = Math.min(pill.bottom, hb.bottom) - Math.max(pill.top, hb.top);
      return {
        scrollY: Math.round(window.scrollY),
        transform: getComputedStyle(nav).transform,
        navHidden: getComputedStyle(nav).transform.includes('-76') || getComputedStyle(nav).transform.includes('-66'),
        headTop: Math.round(hb.top),
        overlap: v > 0 ? Math.round(v) : 0,
      };
    });
    console.log(`\n===== ${vp.width}x${vp.height} =====`);
    console.log(`ABWAERTS lesen: scrollY=${down.scrollY} nav-versteckt=${down.navHidden} h2.top=${down.headTop} overlap=${down.overlap}px  (${down.transform})`);

    // Jetzt ein kleines Stueck aufwaerts (Nav faehrt ein)
    for (let i = 0; i < 6; i++) {
      await p.mouse.wheel(0, -60);
      await p.waitForTimeout(20);
    }
    await p.waitForTimeout(700);
    const up = await p.evaluate(() => {
      const nav = document.querySelector('header');
      const h = document.getElementById('team').querySelector('h2');
      const hb = h.getBoundingClientRect();
      const pill = nav.querySelector('div').getBoundingClientRect();
      const v = Math.min(pill.bottom, hb.bottom) - Math.max(pill.top, hb.top);
      const hz = Math.min(pill.right, hb.right) - Math.max(pill.left, hb.left);
      return {
        scrollY: Math.round(window.scrollY),
        transform: getComputedStyle(nav).transform,
        headTop: Math.round(hb.top),
        overlap: v > 0 && hz > 0 ? Math.round(v) : 0,
      };
    });
    console.log(`AUFWAERTS kurz:  scrollY=${up.scrollY} h2.top=${up.headTop} overlap=${up.overlap}px  (${up.transform})`);
    await ctx.close();
  }
  await browser.close();
})();
