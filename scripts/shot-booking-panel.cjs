const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto('http://localhost:5173/kursplan', { waitUntil: 'networkidle' });
  await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });
  const btn = page.locator('[data-testid="book-open"]').nth(2);
  await btn.scrollIntoViewIfNeeded();
  await btn.evaluate((el) => el.click());
  await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 8000 });
  await page.locator('[data-testid="role-leader"]').click();
  await page.locator('[data-testid="booking-dialog"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await page.screenshot({ path: '/tmp/panel-desktop.png', fullPage: false });
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-testid="booking-dialog"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/panel-mobile.png', fullPage: false });
  await browser.close();
  console.log('shots ok');
})();
