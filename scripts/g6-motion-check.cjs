// G6: Schritt-Scroll durch die Seite, dann: alle Reveals opak? reduced-motion ohne Rest-Transform?
const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const rm of ['reduce', 'no-preference']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:5173' + (process.env.ROUTE || '/'), { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      const step = innerHeight * 0.7;
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 250));
      }
    });
    await page.waitForTimeout(1200);
    const res = await page.evaluate(() => {
      const els = [...document.querySelectorAll('[data-reveal]')];
      return {
        total: els.length,
        notOpaque: els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length,
        residualTransform: els.filter((el) => {
          const t = getComputedStyle(el).transform;
          return t !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(t);
        }).length,
      };
    });
    console.log(rm, JSON.stringify(res));
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
