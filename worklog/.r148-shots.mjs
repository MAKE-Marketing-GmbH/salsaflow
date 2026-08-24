import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux148';

async function acceptCookies(page) {
  const button = page.getByRole('button', { name: /^(Alle akzeptieren|Akzeptieren)$/ });
  await button.waitFor({ state: 'visible', timeout: 8000 });
  await button.click();
  await button.waitFor({ state: 'hidden', timeout: 8000 });
}

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 730 },
    deviceScaleFactor: 2,
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/faq-desktop-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/faq-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  const first = page.locator('#faq summary').first();
  await first.waitFor({ state: 'visible', timeout: 20000 });
  await first.click();
  await page.waitForTimeout(500);
  await first.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/faq-accordion-scroll-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  const heels = page.getByRole('button', { name: /Heels-Kurs/ }).or(page.locator('#faq summary').filter({ hasText: 'Heels' }));
  const first = page.locator('#faq summary').first();
  await first.waitFor({ state: 'visible', timeout: 20000 });
  await first.click();
  await page.waitForTimeout(400);
  const target = (await heels.count()) > 0 ? heels.first() : page.locator('#faq summary').nth(5);
  await target.evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/faq-accordion-scroll-390.png`, timeout: 15000 });
  await page.close();
}

await browser.close();
console.log('SHOTS_OK');
