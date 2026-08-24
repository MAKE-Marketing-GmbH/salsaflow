import { chromium } from '/root/clients/salsaflow/node_modules/playwright-core/index.mjs';
import { mkdirSync, statSync } from 'node:fs';
const OUT = '/tmp/sf-brief17-recheck';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 730 } });
await page.goto('http://127.0.0.1:5175/buchung', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1400);
try {
  const btn = page.locator('button:has-text("Akzeptieren")').first();
  if (await btn.count()) await btn.click({ timeout: 700 });
} catch { /* ok */ }
await page.locator('[data-testid^="pick-course-"]').first().click();
await page.waitForTimeout(900);
const p = `${OUT}/buchung-detail-side.png`;
await page.screenshot({ path: p, animations: 'disabled', caret: 'hide' });
const box = await page.locator('iframe[src*="google.com/maps"]').boundingBox();
console.log('maps box', box, statSync(p).size);
await browser.close();
