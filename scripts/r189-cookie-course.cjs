// R189: Prüft den stabilen Cookie-Hinweis auf /kursplan in beiden Breiten.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/cookie-course';
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

function overlap(a, b) {
  if (!a || !b) return 0;
  const width = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const height = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return Math.round(width * height);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const [name, viewport] of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(BASE + '/kursplan', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1200);

    const banner = page.locator('[data-cookie-banner]');
    const count = await banner.count();
    const cookie = count ? await banner.locator(':scope > div').boundingBox() : null;
    const buttons = await page.locator('[data-testid^="style-"]').all();
    if (buttons.length < 6) throw new Error(`${name}: zu wenige Stilfilter (${buttons.length})`);
    const collisions = [];
    for (const button of buttons) {
      const box = await button.boundingBox();
      const area = overlap(cookie, box);
      if (area > 0) collisions.push({ label: (await button.textContent())?.trim(), area });
    }

    const position = count
      ? await banner.evaluate((element) => {
          const style = getComputedStyle(element);
          return { top: style.top, bottom: style.bottom, padding: style.padding };
        })
      : null;
    const result = { name, count, cookie, position, collisions };
    results.push(result);
    await page.screenshot({ path: `${OUT}/${name}.png` });
    await context.close();
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const failures = results.filter(
    (result) => result.count !== 1 || !result.cookie || result.collisions.length > 0,
  );
  if (failures.length) {
    throw new Error(`Cookie-Gate fehlgeschlagen: ${JSON.stringify(failures)}`);
  }
})();
