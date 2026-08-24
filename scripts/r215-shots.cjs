// R215: Fold-Screenshots von /mehr/partys plus die beiden Rhythmus-Geschwister
// als Gegenprobe. Kein fullPage — der Fold ist der Beleg.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4732';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R215';
const ROUTES = (process.env.ROUTES || '/mehr/partys,/events,/team').split(',');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of [
    { tag: '1440x730', width: 1440, height: 730 },
    { tag: '1440x900', width: 1440, height: 900 },
    { tag: '390', width: 390, height: 844 },
  ]) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const slug = route.replace(/\//g, '-').replace(/^-/, '') || 'home';
      const file = `${OUT}/${slug}-${vp.tag}-fold.png`;
      await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
      console.log(`  ${file}`);
      await ctx.close();
    }
  }
  await browser.close();
})();
