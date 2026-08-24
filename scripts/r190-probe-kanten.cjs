const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const [w, h] of [[1440, 900], [1280, 800], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:5175/', { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const out = await page.evaluate(() => {
      const sec = document.querySelector('section#faq') || document.querySelector('section#kurse');
      const s = sec.querySelector('[class*="max-w-[1400px]"]') ||
                Array.from(sec.querySelectorAll('*')).find((e) => getComputedStyle(e).maxWidth === '1400px');
      const cs = getComputedStyle(s);
      const h2 = sec.querySelector('h2').getBoundingClientRect();
      // Rechteste sichtbare Textkante der Sektion.
      let maxRight = 0;
      const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const p = n.parentElement;
        if (!n.textContent.trim() || !p?.checkVisibility?.({ checkOpacity: true })) continue;
        const rng = document.createRange(); rng.selectNodeContents(n);
        for (const r of rng.getClientRects()) if (r.width > 2) maxRight = Math.max(maxRight, r.right);
      }
      return {
        padLinks: cs.paddingLeft, padRechts: cs.paddingRight,
        textLinks: Math.round(h2.left),
        textRechtsAbstand: Math.round(innerWidth - maxRight),
      };
    });
    console.log(w + 'px: ' + JSON.stringify(out));
    await ctx.close();
  }
  await browser.close();
})();
