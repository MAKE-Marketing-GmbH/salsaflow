// R189: Beweist die richtungsabhaengige mobile Sticky-CTA.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/sticky-direction';

async function state(page) {
  return page.locator('[data-sticky-cta]').evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      ariaHidden: element.getAttribute('aria-hidden'),
      opacity: Number(style.opacity),
      transform: style.transform,
      top: Math.round(rect.top),
      height: Math.round(rect.height),
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2000 }).catch(() => {});

  await page.evaluate(() => scrollTo(0, 1000));
  await page.waitForTimeout(500);
  const down = await state(page);
  await page.screenshot({ path: `${OUT}/01-down-hidden.png` });

  await page.evaluate(() => scrollTo(0, 760));
  await page.waitForTimeout(500);
  const up = await state(page);
  await page.screenshot({ path: `${OUT}/02-up-visible.png` });

  const result = { down, up };
  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result));
  await context.close();
  await browser.close();

  const downIsHidden = down.ariaHidden === 'true' && down.opacity <= 0.01;
  const upIsVisible = up.ariaHidden !== 'true' && up.opacity >= 0.99;
  if (!downIsHidden || !upIsVisible) {
    throw new Error(`Sticky-CTA-Richtung weicht ab: ${JSON.stringify(result)}`);
  }
})();
