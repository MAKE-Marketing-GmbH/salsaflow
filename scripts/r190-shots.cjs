// R190: Belegt den Stand nach dem Fix mit echten Screenshots.
// Zwei Zustaende je Route: waehrend des Scrollens (Motion sichtbar) und im Ruhezustand.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R190';
const ROUTES = ['/', '/tanzkurse/bachata', '/kursplan'];
const VIEWPORTS = [['desktop', { width: 1440, height: 900 }], ['mobil', { width: 390, height: 844 }]];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  let count = 0;

  for (const route of ROUTES) {
    for (const [vpName, viewport] of VIEWPORTS) {
      const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);

      const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '_');
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const step = Math.round(viewport.height * 0.8);

      for (let i = 0, y = 0; y <= maxScroll && i < 9; i += 1, y += step) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
        // 120 ms: kurz genug, dass Reveals noch LAUFEN und die Bewegung im Bild ist.
        await page.waitForTimeout(120);
        const name = `${OUT}/${slug}-${vpName}-${String(i).padStart(2, '0')}-motion.png`;
        await page.screenshot({ path: name });
        count += 1;
      }

      // Ruhezustand: ganz oben, alles fertig.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}/${slug}-${vpName}-settled.png` });
      count += 1;

      await context.close();
    }
  }

  await browser.close();
  console.log(`${count} Screenshots unter ${OUT}`);
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
