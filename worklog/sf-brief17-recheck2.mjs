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
const page = await browser.newPage({ viewport: { width: 1440, height: 730 } });
await page.goto('http://127.0.0.1:5175/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
await dismiss(page);
await page.locator('#anfahrt').scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const p = `${OUT}/standort-anfahrt.png`;
await page.screenshot({ path: p, animations: 'disabled', caret: 'hide' });
console.log('standort', statSync(p).size, 'iframes', await page.locator('#anfahrt iframe').count());
await page.close();

const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto('http://127.0.0.1:5175/schnupperstunde', { waitUntil: 'domcontentloaded' });
await mob.waitForTimeout(1300);
await dismiss(mob);
await mob.evaluate(() => window.scrollTo(0, 780));
await mob.waitForTimeout(400);
const p2 = `${OUT}/schnupper-mobile.png`;
await mob.screenshot({ path: p2, animations: 'disabled', caret: 'hide' });
const wa = await mob.locator('a[href*="wa.me"]').count();
const next = await mob.locator('[data-testid="inquiry-next"]').boundingBox();
console.log('schnupper', statSync(p2).size, 'wa', wa, 'next', next);
await mob.close();
await browser.close();
