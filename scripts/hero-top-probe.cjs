// Reproduktion Kritiker-Befund home r8 m-top: Foto fehlt im frischen Top-Zustand?
// Misst nach networkidle+Waits das Hero-<img>: Sichtbarkeit, Opacity, naturalWidth, currentSrc.
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  for (const wait of [400, 1200, 3000]) {
    await p.waitForTimeout(wait === 400 ? 400 : wait - (wait === 1200 ? 400 : 1200));
    const info = await p.evaluate(() => {
      const img = document.querySelector('section picture img');
      if (!img) return { img: false };
      const wrap = img.closest('div[class*="58svh"]') || img.closest('picture').parentElement;
      const cs = getComputedStyle(wrap);
      const r = wrap.getBoundingClientRect();
      return {
        img: true,
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        complete: img.complete,
        wrapOpacity: cs.opacity,
        wrapDisplay: cs.display,
        wrapRect: { x: r.x, y: r.y, w: r.width, h: r.height },
        imgOpacity: getComputedStyle(img).opacity,
      };
    });
    console.log(`t=${wait}ms`, JSON.stringify(info));
  }
  await p.screenshot({ path: '/tmp/hero-top-repro.png' });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
