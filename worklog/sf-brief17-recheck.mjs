import { chromium } from '/root/clients/salsaflow/node_modules/playwright-core/index.mjs';
import { mkdirSync, statSync } from 'node:fs';

const OUT = '/tmp/sf-brief17-recheck';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
async function dismiss(page) {
  try {
    const btn = page.locator('button:has-text("Akzeptieren"), button:has-text("Okay")').first();
    if (await btn.count()) await btn.click({ timeout: 700 });
  } catch { /* ok */ }
}
async function shot(page, name) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, animations: 'disabled', caret: 'hide' });
  console.log(name, statSync(path).size);
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 730 } });
  await page.goto('http://127.0.0.1:5175/buchung', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1400);
  await dismiss(page);
  await page.locator('[data-testid^="pick-course-"]').first().click();
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForTimeout(400);
  await shot(page, 'buchung-maps');
  await page.locator('[data-testid="reserve-spot"]').click();
  await page.waitForTimeout(700);
  await shot(page, 'buchung-modal');
  const privacyVisible = await page.locator('[data-testid="booking-privacy"]').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, inFold: r.bottom <= 730 && r.top >= 0 };
  });
  console.log('privacy', privacyVisible);

  await page.goto('http://127.0.0.1:5175/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1100);
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  await shot(page, 'standort-y900');
  const iframe = await page.locator('#anfahrt iframe').count();
  console.log('standort iframes', iframe);
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:5175/schnupperstunde', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(400);
  await shot(page, 'schnupper-mobile');
  const wa = page.locator('a[href*="wa.me"]');
  console.log('wa count', await wa.count());
  const next = page.locator('[data-testid="inquiry-next"]');
  const nextBox = await next.boundingBox();
  console.log('next', nextBox);
  await page.close();
}

await browser.close();
