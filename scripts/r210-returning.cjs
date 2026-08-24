// Wiederkehrer: ohne Hinweis muss der Fold exakt so aussehen wie vor R210. Alle Regeln
// haengen an :has([data-testid='cookie-accept']) — ohne Hinweis darf keine greifen.
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[390,844],[844,390],[1024,700],[1440,730],[1920,900]]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('salsaflow-cookie-ok','1'); } catch {} });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:4605/', { waitUntil:'networkidle' });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const fold = document.querySelector('[data-hero-fold]');
      const sect = fold.closest('section');
      const main = document.querySelector('main');
      return { banner: !!document.querySelector('[data-cookie-banner]'),
               photoH: getComputedStyle(sect).getPropertyValue('--hero-photo-h').trim(),
               sectPadBottom: getComputedStyle(sect).paddingBottom,
               mainPadTop: getComputedStyle(main).paddingTop,
               foldPadBottom: getComputedStyle(fold).paddingBottom,
               cookieVar: getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-height').trim() };
    });
    console.log(`${w}x${h}: Hinweis=${r.banner} --hero-photo-h=${r.photoH} sectPadBottom=${r.sectPadBottom} mainPadTop=${r.mainPadTop} foldPadBottom=${r.foldPadBottom} var=${r.cookieVar}`);
    await ctx.close();
  }
  await b.close();
})();
