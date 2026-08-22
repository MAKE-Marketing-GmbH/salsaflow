// R189: Gleich grosse, anonyme Vergleichs-Screenshots fuer den blinden Design-Vergleich.
const { chromium } = require('playwright-core');
const fs = require('fs');

const OUT = 'worklog/shots/R189/blind-benchmark';
const SITES = [
  { key: 'A', url: 'https://www.stepsnyc.com/' },
  { key: 'B', url: 'http://127.0.0.1:5175/' },
  { key: 'C', url: 'https://www.pineapple.uk.com/' },
];
const VIEWPORTS = [
  { key: 'd', width: 1440, height: 900 },
  { key: 'm', width: 390, height: 844 },
];
const CONSENT = [
  'Accept All',
  'Accept all',
  'Accept',
  'Allow all',
  'I agree',
  'Got it',
  'Akzeptieren',
];

async function dismissConsent(page) {
  for (const text of CONSENT) {
    const button = page.getByRole('button', { name: text, exact: true }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 2000 }).catch(() => {});
      return;
    }
  }
}

async function captureSite(browser, site, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  await dismissConsent(page);
  await page.waitForTimeout(1200);

  for (let index = 0; index < 3; index += 1) {
    const y = Math.round(viewport.height * 0.88 * index);
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${viewport.key}-${site.key}-${index}.png` });
  }
  await context.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  await Promise.all(
    VIEWPORTS.flatMap((viewport) =>
      SITES.map((site) => captureSite(browser, site, viewport)),
    ),
  );
  await browser.close();
  console.log(`DONE ${SITES.length * VIEWPORTS.length * 3} benchmark shots -> ${OUT}`);
})();
