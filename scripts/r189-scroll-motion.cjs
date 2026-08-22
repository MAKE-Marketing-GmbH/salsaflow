// R189: Beweist echte scroll-gebundene Bewegung an den gerenderten Elementen.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/scroll-motion';
const ROUTES = ['/', '/tanzkurse/bachata'];

async function translateY(locator) {
  return locator.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const route of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);

    const markers = page.locator('[data-scroll-motion]');
    const count = await markers.count();
    for (let index = 0; index < count; index += 1) {
      const marker = markers.nth(index);
      const name = await marker.getAttribute('data-scroll-motion');
      const geometry = await marker.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top + scrollY, height: rect.height };
      });
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const start = Math.max(0, Math.min(maxScroll, Math.round(geometry.top - 900)));
      const end = Math.max(0, Math.min(maxScroll, Math.round(geometry.top + geometry.height)));

      await page.evaluate((top) => scrollTo(0, top), start);
      await page.waitForTimeout(400);
      const before = await translateY(marker);
      await page.evaluate((top) => scrollTo(0, top), end);
      await page.waitForTimeout(400);
      const after = await translateY(marker);
      results.push({ route, name, start, end, before, after, delta: Math.abs(after - before) });
    }
    await context.close();
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const moving = results.filter((result) => result.delta >= 8);
  if (results.length < 6 || moving.length < 6) {
    throw new Error(`Zu wenig echte Scroll-Bewegung: ${moving.length}/${results.length}`);
  }
})();
