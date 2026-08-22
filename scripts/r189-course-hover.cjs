// R189: Beweist denselben roten Hover auf Home und /kursplan.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/course-hover';
const TARGETS = [
  ['home', '/'],
  ['kursplan', '/kursplan'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const [name, route] of TARGETS) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });

    const card = page.locator('[data-testid="course-card"]').first();
    await card.scrollIntoViewIfNeeded();
    // ClipReveal auf Home dauert 0.72s. Frueher 300ms: Hover traf die noch geclipte Karte nicht.
    await page.waitForTimeout(900);
    await card.hover({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(350);

    const state = await card.evaluate((element) => {
      const title = element.querySelector('[data-course-title]');
      const cta = element.querySelector('[data-course-cta]');
      const probe = document.createElement('span');
      probe.style.color = 'var(--color-salsa)';
      document.body.append(probe);
      const expectedBackground = getComputedStyle(probe).color;
      probe.remove();
      return {
        background: getComputedStyle(element).backgroundColor,
        expectedBackground,
        titleColor: title ? getComputedStyle(title).color : null,
        ctaColor: cta ? getComputedStyle(cta).color : null,
        href: element.getAttribute('href'),
      };
    });

    await card.screenshot({ path: `${OUT}/${name}-hover.png` });
    results.push({ name, route, ...state });
    await context.close();
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const failures = results.filter(
    (result) =>
      result.background !== result.expectedBackground ||
      result.titleColor !== 'rgb(255, 255, 255)' ||
      result.ctaColor !== 'rgb(255, 255, 255)',
  );
  if (failures.length) {
    throw new Error(`CourseRow-Hover weicht ab: ${JSON.stringify(failures)}`);
  }
})();
