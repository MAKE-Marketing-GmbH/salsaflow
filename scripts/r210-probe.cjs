// Warum greift die Querformat-Regel nicht, und wie breit ist die Textspalte wirklich
// relativ zum Fenster? Fakten sammeln statt Werte raten.
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[1024,700],[1440,730],[844,390],[932,430]]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:4604/', { waitUntil:'networkidle' });
    await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const fold = document.querySelector('[data-hero-fold]');
      const sect = fold.closest('section');
      const card = document.querySelector('[data-cookie-banner]')?.firstElementChild;
      const f = fold.getBoundingClientRect(), c = card.getBoundingClientRect();
      return {
        vw: window.innerWidth, vh: window.innerHeight,
        foldRight: Math.round(f.right), foldRightPctVw: +(f.right / window.innerWidth * 100).toFixed(1),
        cardLeft: Math.round(c.left), cardW: Math.round(c.width),
        photoH: getComputedStyle(sect).getPropertyValue('--hero-photo-h').trim(),
        cardMaxW: getComputedStyle(card).maxWidth,
      };
    });
    console.log(`${w}x${h}: Textspalte bis ${r.foldRight} (${r.foldRightPctVw}% vw) | Karte left=${r.cardLeft} w=${r.cardW} maxW=${r.cardMaxW} | --hero-photo-h=${r.photoH}`);
    await ctx.close();
  }
  await b.close();
})();
