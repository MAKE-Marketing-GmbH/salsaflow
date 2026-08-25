import { chromium } from 'playwright-core';

const baseUrl = process.env.SALSAFLOW_BASE_URL ?? 'http://127.0.0.1:5173';

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
});

await context.addInitScript(() => {
  localStorage.setItem('salsaflow-cookie-ok', '1');
});

const page = await context.newPage();

async function waitForReact(selector) {
  await page.waitForFunction((target) => {
    const element = document.querySelector(target);
    return Boolean(element && Object.keys(element).some((key) => key.startsWith('__reactProps$')));
  }, selector);
}

try {
  await page.goto(`${baseUrl}/buchung`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15_000 });
  await waitForReact('[data-testid^="pick-course-"]');
  await page.locator('[data-testid^="pick-course-"]').first().click();

  const reserve = page.locator('[data-testid="reserve-spot"]');
  await reserve.focus();
  await reserve.click();
  await page.waitForSelector('[data-testid="booking-dialog"]');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);

  const activeTestId = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
  if (activeTestId !== 'reserve-spot') {
    throw new Error(`Expected focus on reserve-spot after closing dialog, received ${activeTestId ?? '<body>'}`);
  }

  console.log('Booking dialog focus restore: PASS');
} finally {
  await browser.close();
}
