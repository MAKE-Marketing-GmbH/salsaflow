import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux162-modal';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;
const KURS = '01c4fd80-2e4f-44c0-b499-33cddbf0a54e';

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await page.addInitScript(() => {
  try {
    localStorage.setItem('salsaflow-cookie-ok', '1');
  } catch {
    /* ignore */
  }
});
await page.goto(`http://127.0.0.1:5175/buchung?kurs=${KURS}`, {
  waitUntil: 'domcontentloaded',
  timeout: 30000,
});
await page.waitForTimeout(800);

const dialog = page.getByTestId('booking-dialog');
if (!(await dialog.isVisible().catch(() => false))) {
  const pick = page.locator('[data-testid^="pick-course-"]').first();
  await pick.waitFor({ state: 'visible', timeout: 12000 });
  await pick.click();
  const reserve = page.getByTestId('reserve-spot');
  await reserve.waitFor({ state: 'visible', timeout: 8000 });
  await reserve.click();
}

await dialog.waitFor({ state: 'visible', timeout: 8000 });
const leader = page.getByTestId('role-leader');
if (await leader.isVisible().catch(() => false)) {
  await leader.click();
}
await page.waitForTimeout(400);

async function shotDialog(name) {
  const box = await dialog.boundingBox();
  if (!box) throw new Error('booking-dialog has no box');
  const pad = 28;
  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: Math.min(1440 - Math.max(0, box.x - pad), box.width + pad * 2),
    height: Math.min(900 - Math.max(0, box.y - pad), box.height + pad * 2),
  };
  await page.screenshot({
    path: `${OUT}/${name}`,
    clip,
    timeout: 15000,
  });
}

await shotDialog('buchung-modal-1440.png');

const next = page.getByTestId('booking-next');
if (await next.isVisible().catch(() => false)) {
  await next.click();
  await page.waitForTimeout(500);
  await shotDialog('buchung-modal-step2-1440.png');
}

await browser.close();
console.log(mode === 'vorher' ? 'MODAL_VORHER_OK' : 'MODAL_OK');
