import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux152';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openPage(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto('http://127.0.0.1:5175/mehr/collabs', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
}

async function deskAt(y, name) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  if (y === 'end') {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  } else if (y > 0) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}`, timeout: 15000 });
  await page.close();
}

await deskAt(0, 'collabs-y0.png');
await deskAt(800, 'collabs-y800.png');
await deskAt(1600, 'collabs-y1600.png');
await deskAt(2400, 'collabs-y2400.png');
await deskAt('end', 'collabs-yend.png');

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
  await page.screenshot({ path: `${OUT}/collabs-mobil-390.png`, timeout: 15000 });
  await page.close();
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
