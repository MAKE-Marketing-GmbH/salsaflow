// Misst, welche Inhalts-Elemente der fixe Cookie-Hinweis auf "/" wirklich verdeckt.
const { chromium } = require('playwright-core');

const SELECTOR = 'main :is(h1,h2,h3,p,li,a,button,dt,dd,span,figcaption)';

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    for (const y of [0, 900, 3000, 6000, 9000]) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(250);
      const r = await p.evaluate((sel) => {
        const banner = document.querySelector('[data-testid="cookie-accept"]');
        if (!banner) return { banner: false };
        const bb = banner.closest('[role="region"]').getBoundingClientRect();
        const hits = [];
        let minGap = Infinity;
        document.querySelectorAll(sel).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) return;
          if (el.querySelector(sel)) return;
          if (r.bottom > bb.top && r.top < bb.bottom) {
            hits.push((el.textContent || el.tagName).trim().slice(0, 42));
          } else if (r.bottom <= bb.top) {
            minGap = Math.min(minGap, bb.top - r.bottom);
          }
        });
        return { bannerTop: Math.round(bb.top), covered: hits.slice(0, 6), n: hits.length, minGap: Math.round(minGap) };
      }, SELECTOR);
      console.log(vp.width, 'y=' + y, JSON.stringify(r));
    }
    await ctx.close();
  }
  await b.close();
})();
