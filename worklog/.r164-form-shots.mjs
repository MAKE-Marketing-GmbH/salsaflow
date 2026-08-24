import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux164-form';
const BASE = 'http://127.0.0.1:5175';
const KURS = '01c4fd80-2e4f-44c0-b499-33cddbf0a54e';
const HINT = 'Bitte fülle die Pflichtfelder aus.';

await mkdir(ROOT, { recursive: true });
await mkdir(`${ROOT}/render`, { recursive: true });

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

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

await page.goto(`${BASE}/buchung?kurs=${KURS}`, {
  waitUntil: 'domcontentloaded',
  timeout: 30000,
});
await page.waitForTimeout(800);

const dialog = page.getByTestId('booking-dialog');
if (!(await dialog.isVisible().catch(() => false))) {
  const reserve = page.getByTestId('reserve-spot');
  if (await reserve.isVisible().catch(() => false)) {
    await reserve.click();
  } else {
    const pick = page.locator('[data-testid^="pick-course-"]').first();
    await pick.waitFor({ state: 'visible', timeout: 12000 });
    await pick.click();
    await page.getByTestId('reserve-spot').waitFor({ state: 'visible', timeout: 8000 });
    await page.getByTestId('reserve-spot').click();
  }
}

await dialog.waitFor({ state: 'visible', timeout: 8000 });

const next = page.getByTestId('booking-next');
await next.waitFor({ state: 'visible', timeout: 8000 });

async function countHint() {
  const bodyText = await dialog.innerText();
  return bodyText.split(HINT).length - 1;
}

// Fail-Pfad: Weiter ohne Rolle — genau ein Pflicht-Satz, nicht zwei.
await next.click();
await page.waitForTimeout(250);
const failHits = await countHint();
if (failHits !== 1) {
  await browser.close();
  throw new Error(`FAILPATH expected one Pflicht-Fehler, got ${failHits}`);
}
console.log(`FAILPATH_ONCE=${failHits}`);

const leader = page.getByTestId('role-leader');
await leader.waitFor({ state: 'visible', timeout: 8000 });
await leader.click();
await page.waitForFunction(() => {
  const el = document.querySelector('[data-testid="role-leader"]');
  return el?.getAttribute('aria-pressed') === 'true';
}, { timeout: 8000 });
await page.waitForTimeout(400);

const styles = await leader.evaluate((el) => {
  const cs = getComputedStyle(el);
  const label = el.querySelector('span.font-display') ?? el.querySelector('span:last-child');
  const ls = label ? getComputedStyle(label) : cs;
  return { bg: cs.backgroundColor, color: ls.color, aria: el.getAttribute('aria-pressed') };
});
if (styles.bg !== 'rgb(173, 24, 39)' || styles.color !== 'rgb(255, 255, 255)') {
  await browser.close();
  throw new Error(`ChoiceTile not white-on-red: ${JSON.stringify(styles)}`);
}
console.log(`TILE_ACTIVE bg=${styles.bg} color=${styles.color}`);

async function shotDialog(path) {
  const box = await dialog.boundingBox();
  if (!box) throw new Error('booking-dialog has no box');
  const pad = 40;
  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: Math.min(1440 - Math.max(0, box.x - pad), box.width + pad * 2),
    height: Math.min(900 - Math.max(0, box.y - pad), box.height + pad * 2),
  };
  await page.screenshot({ path, clip, timeout: 15000 });
}

await shotDialog(`${ROOT}/render/buchung-step1-role-1440.png`);

// SHOTS: Rolle zuerst, aria-pressed, dann Weiter. ERROR_ONCE zählt DANACH.
await next.click();
const first = page.getByTestId('bk-firstName');
await first.waitFor({ state: 'visible', timeout: 8000 });
await page.getByTestId('bk-lastName').waitFor({ state: 'visible', timeout: 4000 });
await page.getByTestId('bk-email').waitFor({ state: 'visible', timeout: 4000 });
await page.waitForTimeout(300);

const afterRoleHits = await countHint();
if (afterRoleHits > 1) {
  await browser.close();
  throw new Error(`after role-leader + next expected 0 or 1 Pflicht-Fehler, got ${afterRoleHits}`);
}
console.log(`ERROR_ONCE=${afterRoleHits}`);

const out = `${ROOT}/buchung-step2-1440.png`;
const renderOut = `${ROOT}/render/buchung-step2-1440.png`;
await page.screenshot({ path: out, timeout: 15000 });
await shotDialog(renderOut);

await browser.close();
console.log('STEP2_OK');
console.log(out);
console.log(renderOut);
