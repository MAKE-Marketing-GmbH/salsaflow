const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const before = await p.evaluate(() => ({
      attr: document.querySelector('[data-cookie-clear]')?.getAttribute('data-cookie-clear') ?? null,
      vis: getComputedStyle(document.querySelector('[data-testid="cookie-accept"]').closest('[role="region"]')).visibility,
      bodyPad: getComputedStyle(document.body).paddingBottom,
      heroPad: getComputedStyle(document.querySelector('[data-hero-fold]')).paddingBottom,
    }));
    await p.mouse.wheel(0, 500);
    await p.waitForTimeout(500);
    const after = await p.evaluate(() => ({
      attr: document.querySelector('[data-cookie-clear]')?.getAttribute('data-cookie-clear') ?? null,
      vis: getComputedStyle(document.querySelector('[data-testid="cookie-accept"]').closest('[role="region"]')).visibility,
      heroPad: getComputedStyle(document.querySelector('[data-hero-fold]')).paddingBottom,
    }));
    console.log(vp.width, 'before', JSON.stringify(before), 'after', JSON.stringify(after));
    await ctx.close();
  }
  await b.close();
})();
