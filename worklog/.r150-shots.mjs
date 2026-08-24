import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux150';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

async function acceptCookies(page) {
  const button = page.locator('button').filter({ hasText: /^(Alle akzeptieren|Akzeptieren)$/ }).first();
  try {
    await button.waitFor({ state: 'visible', timeout: 8000 });
    await button.click({ force: true });
    await page.waitForTimeout(300);
  } catch {
    /* Banner schon weg */
  }
}

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openPage(page) {
  if (mode !== 'vorher') {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('salsaflow-cookie-ok', '1');
      } catch {
        /* ignore */
      }
    });
  }
  await page.goto('http://127.0.0.1:5175/mehr/tanzschuhe', { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (mode === 'vorher') await acceptCookies(page);
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/tanzschuhe-desktop-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/tanzschuhe-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page);
  const media = page.locator('img[src*="heels-shoes-stilllife"]').first();
  await media.waitFor({ state: 'visible', timeout: 20000 });
  await media.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/tanzschuhe-hero-scroll-1440.png`, timeout: 15000 });
  await page.close();
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
