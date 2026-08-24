import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-video-pass';
const BASE = 'http://127.0.0.1:5175';

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(ROOT, { recursive: true });

const report = [];

async function shot(page, name) {
  await page.screenshot({ path: `${ROOT}/${name}.png`, timeout: 15000 });
}

async function open(path, width = 1440, height = 900, mobile = false) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
  });
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  const res = await page.goto(`${BASE}${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForTimeout(400);
  const heroImg = page.locator('main img').first();
  if (await heroImg.count()) {
    await heroImg.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await page.waitForFunction(() => {
      const img = document.querySelector('main img');
      if (!img) return false;
      const r = img.getBoundingClientRect();
      const parent = img.parentElement;
      return r.width > 160 && Number(getComputedStyle(parent).opacity) === 1;
    }, { timeout: 8000 }).catch(() => {});
  }
  return { page, status: res?.status() ?? 0 };
}

function add(id, ok, note) {
  report.push({ id, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${note}`);
}

{
  const { page, status } = await open('/');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const body = await page.locator('body').innerText();
  add('v1-home-status', status === 200, `HTTP ${status}`);
  add('v6-coaching-weg', !/1:1 Coaching/i.test(body), '1:1-Coaching-Karte');
  const kurs = page.getByRole('link', { name: /^Tanzkurse$/i }).first();
  add('v2-nav-kurse', await kurs.isVisible(), 'Nav Tanzkurse');
  await shot(page, 'home-1440');
  await page.close();
}

{
  const { page } = await open('/tanzkurse/salsa');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const slots = page.locator('[data-testid="style-slot"]');
  add('v7-salsa-slots', (await slots.count()) > 0, `slots=${await slots.count()}`);
  await shot(page, 'salsa-1440');
  await page.close();
}

{
  const { page } = await open('/tanzkurse/bachata');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v7-bachata', /Bachata/i.test(await page.locator('h1').first().innerText()), 'H1');
  await shot(page, 'bachata-1440');
  await page.close();
}

{
  const { page } = await open('/tanzkurse/heels');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v10-heels', /Heels/i.test(await page.locator('h1').first().innerText()), 'H1');
  const heelSlots = page.locator('[data-testid="style-slot"]');
  add('v10-heels-slots', (await heelSlots.count()) > 0, `slots=${await heelSlots.count()}`);
  await shot(page, 'heels-1440');
  await page.close();
}

{
  const { page } = await open('/faq');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const items = page.locator('details');
  const n = await items.count();
  if (n > 1) {
    await items.nth(1).locator('summary').click();
    await page.waitForTimeout(400);
  }
  const openN = await page.locator('details[open]').count();
  add('v8-faq-open', openN >= 1, `open=${openN} total=${n}`);
  await shot(page, 'faq-1440');
  await page.close();
}

{
  const { page } = await open('/mehr/tanzschuhe');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const img = page.locator('[data-tanzschuhe-page] img').first();
  add('v18-schuhe-img', await img.isVisible().catch(() => false), 'Hero-Bild');
  await shot(page, 'tanzschuhe-1440');
  await page.close();
}

{
  const { page } = await open('/mehr/collabs');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v17-collabs', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'collabs-1440');
  await page.evaluate(() => window.scrollTo(0, 2200));
  await page.waitForTimeout(500);
  const imgs = await page.locator('img').count();
  add('v17-collabs-scroll', imgs > 0, `imgs=${imgs}`);
  await shot(page, 'collabs-y2200');
  await page.close();
}

{
  const { page } = await open('/mehr/partys');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v19-partys', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'partys-1440');
  await page.close();
}

{
  const { page } = await open('/team');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v15-team', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'team-1440');
  await page.close();
}

{
  const { page } = await open('/fotos');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v16-fotos', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'fotos-1440');
  await page.close();
}

{
  const { page } = await open('/privatstunden');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v11-privat', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'privat-1440');
  await page.close();
}

{
  const { page } = await open('/events');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v13-events', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'events-1440');
  await page.close();
}

{
  const { page } = await open('/preise');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  add('v12-preise', (await page.locator('h1').count()) > 0, 'H1');
  await shot(page, 'preise-1440');
  await page.close();
}

{
  const { page } = await open('/buchung');
  await page.waitForTimeout(900);
  const pick = page.locator('[data-testid^="pick-course-"]').first();
  if (await pick.isVisible().catch(() => false)) {
    await pick.click();
    const reserve = page.getByTestId('reserve-spot');
    if (await reserve.isVisible().catch(() => false)) await reserve.click();
  }
  const dialog = page.getByTestId('booking-dialog');
  const vis = await dialog.isVisible().catch(() => false);
  add('v1-modal', vis, 'booking-dialog');
  if (vis) await shot(page, 'buchung-modal-1440');
  await page.close();
}

{
  const { page } = await open('/', 390, 844, true);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const wa = page.locator('.whatsapp-float, a[href*="wa.me"], [data-whatsapp]').first();
  add('v9-wa', await wa.isVisible().catch(() => false), 'WA sichtbar');
  await shot(page, 'home-390');
  await page.close();
}

await browser.close();

const fail = report.filter((r) => !r.ok);
await writeFile(`${ROOT}/report.json`, JSON.stringify({ fail: fail.length, report }, null, 2));
console.log(`DONE fail=${fail.length} total=${report.length}`);
if (fail.length) process.exit(1);
