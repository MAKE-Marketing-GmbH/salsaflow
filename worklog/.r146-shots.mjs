import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const TEAM_OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux144';
const FOTOS_OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux146';

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

await mkdir(FOTOS_OUT, { recursive: true });

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto('http://127.0.0.1:5175/team', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  await page.getByRole('heading', { name: /Die Menschen/ }).waitFor({ state: 'visible' });
  await page.locator('#founders').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${TEAM_OUT}/team-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 730 },
    deviceScaleFactor: 2,
  });
  await page.goto('http://127.0.0.1:5175/fotos', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${FOTOS_OUT}/fotos-desktop-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto('http://127.0.0.1:5175/fotos', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await acceptCookies(page);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${FOTOS_OUT}/fotos-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto('http://127.0.0.1:5175/fotos', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const grid = page.locator('main img').nth(2);
  await grid.waitFor({ state: 'visible', timeout: 20000 });
  await grid.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${FOTOS_OUT}/fotos-galerie-scroll-1440.png`, timeout: 15000 });
  await page.close();
}

await browser.close();
console.log('SHOTS_OK');
