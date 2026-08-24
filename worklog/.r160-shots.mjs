import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux160';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openPage(page, path) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto(`http://127.0.0.1:5175${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
}

async function deskAt(path, y, name) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page, path);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  if (y > 0) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}`, timeout: 15000 });
  await page.close();
}

await deskAt('/privatstunden', 0, 'privat-desktop-1440.png');
await deskAt('/privatstunden', 1400, 'privat-y1400.png');

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page, '/privatstunden');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/privat-mobil-390.png`, timeout: 15000 });
  await page.close();
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
