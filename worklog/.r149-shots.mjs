import { mkdir, copyFile } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux149';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

async function acceptCookies(page) {
  const button = page.locator('button').filter({ hasText: /^(Alle akzeptieren|Akzeptieren)$/ }).first();
  try {
    await button.waitFor({ state: 'visible', timeout: 8000 });
    await button.click({ force: true });
    await page.locator('[data-cookie-banner], .cookie, button').filter({ hasText: /^Akzeptieren$/ }).waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(300);
  } catch {
    /* Banner schon weg oder nicht da */
  }
}

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openCollabs(page) {
  if (mode !== 'vorher') {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('salsaflow-cookie-ok', '1');
      } catch {
        /* ignore */
      }
    });
  }
  await page.goto('http://127.0.0.1:5175/mehr/collabs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (mode === 'vorher') await acceptCookies(page);
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 730 },
    deviceScaleFactor: 2,
  });
  await openCollabs(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/collabs-desktop-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openCollabs(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/collabs-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openCollabs(page);
  const media = page.locator('img[src*="hp-27"]').first();
  await media.waitFor({ state: 'visible', timeout: 20000 });
  await media.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/collabs-hero-scroll-1440.png`, timeout: 15000 });
  await page.close();
}

if (mode === 'nachher') {
  try {
    await copyFile(`${ROOT}/vorher/collabs-mobil-390.png`, `${ROOT}/vorher/collabs-mobil-390.png`);
  } catch {
    /* vorher fehlt = Gate G7 rot, bewusst */
  }
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
