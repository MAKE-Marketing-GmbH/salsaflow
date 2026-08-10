// Kritiker-Verifikation Runde 2026-08-09: Home-Screenshots (Desktop + Mobil).
// Nutzung: node scripts/aaa-r9-shot.cjs <outdir>
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || '/tmp/aaa-r9/base';
const URL = 'http://localhost:5173/';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

  for (const [tag, vp] of [['dsk', { width: 1440, height: 900 }], ['mob', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    // Alles lazy-geladene erzwingen: einmal durchscrollen, dann zurueck.
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const total = await page.evaluate(() => document.body.scrollHeight);
    // Sektionsraster: Position/Hoehe jeder <section> messen (Weissraum-Analyse).
    const secs = await page.evaluate(() =>
      [...document.querySelectorAll('main section')].map((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return {
          id: s.id || s.dataset.designUnit || s.className.slice(0, 40),
          top: Math.round(r.top + window.scrollY),
          h: Math.round(r.height),
          pt: cs.paddingTop,
          pb: cs.paddingBottom,
          bg: cs.backgroundColor,
        };
      }),
    );
    // Gruender-Portraits: rendern die <img> wirklich?
    const founders = await page.evaluate(() => {
      const sec = document.querySelector('#team');
      if (!sec) return null;
      return [...sec.querySelectorAll('li figure img')].map((i) => {
        const r = i.getBoundingClientRect();
        const p = i.closest('div').getBoundingClientRect();
        return {
          src: i.getAttribute('src'),
          complete: i.complete,
          nw: i.naturalWidth,
          imgH: Math.round(r.height),
          imgTop: Math.round(r.top - p.top),
          panelH: Math.round(p.height),
          panelW: Math.round(p.width),
          fillRatio: +(((Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top)) / p.height) * 100).toFixed(1),
        };
      });
    });
    fs.writeFileSync(path.join(OUT, `${tag}-measure.json`), JSON.stringify({ total, secs, founders }, null, 2));

    for (let y = 0; y < total; y += vp.height) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(280);
      await page.screenshot({ path: path.join(OUT, `${tag}-y${String(y).padStart(5, '0')}.png`) });
    }
    await ctx.close();
    console.log(tag, 'total', total);
  }
  await browser.close();
})();
