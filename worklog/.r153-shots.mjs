import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux153';
const mode = process.argv[2] === 'vorher' ? 'vorher' : process.argv[2] === 'after' ? 'after' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : mode === 'after' ? `${ROOT}/after` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openErstbesuch(page) {
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('salsaflow-cookie-ok');
    } catch {
      /* ignore */
    }
  });
  await page.goto('http://127.0.0.1:5175/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
}

async function waitFold(page) {
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('[data-cookie-banner]').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(600);
}

if (mode === 'after') {
  const desk = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openErstbesuch(desk);
  await waitFold(desk);
  await desk.locator('[data-testid="cookie-accept"]').click();
  await desk.waitForTimeout(400);
  await desk.screenshot({ path: `${OUT}/cookie-desktop-1440-accepted.png`, timeout: 15000 });
  await desk.close();

  const mob = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openErstbesuch(mob);
  await waitFold(mob);
  await mob.locator('[data-testid="cookie-accept"]').click();
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: `${OUT}/cookie-mobil-390-accepted.png`, timeout: 15000 });
  await mob.close();
} else {
  const desk = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openErstbesuch(desk);
  await waitFold(desk);
  await desk.screenshot({ path: `${OUT}/cookie-desktop-1440.png`, timeout: 15000 });
  await desk.close();

  const mob = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openErstbesuch(mob);
  await waitFold(mob);
  await mob.screenshot({ path: `${OUT}/cookie-mobil-390.png`, timeout: 15000 });
  await mob.close();
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : mode === 'after' ? 'SHOTS_AFTER_OK' : 'SHOTS_OK');
