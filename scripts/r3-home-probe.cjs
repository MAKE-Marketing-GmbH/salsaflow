const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const banner = document.querySelector('[data-testid="cookie-accept"]')?.closest('[role="region"]');
      const ev = document.querySelector('#events');
      const next = ev && ev.nextElementSibling;
      const main = document.querySelector('#main');
      return {
        bannerH: banner ? banner.getBoundingClientRect().height : null,
        mainPadBottom: main ? getComputedStyle(main).paddingBottom : null,
        eventsH: ev ? ev.getBoundingClientRect().height : null,
        eventsPad: ev ? getComputedStyle(ev).paddingBottom : null,
        nextId: next ? next.id || next.tagName : null,
        nextPadTop: next ? getComputedStyle(next).paddingTop : null,
        bodyH: document.body.scrollHeight,
      };
    });
    console.log(vp.width, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
