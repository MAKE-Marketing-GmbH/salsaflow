import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux164';
const BASE = 'http://127.0.0.1:5175';
await mkdir(ROOT, { recursive: true });

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

const report = [];
function add(id, ok, note) {
  report.push({ id, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${note}`);
}

async function pageAt(w, h, mobile = false) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
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
  return page;
}

{
  const page = await pageAt(1440, 900);
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  await page.locator('header').getByTestId('lang-en').first().click();
  await page.waitForTimeout(400);
  const nav = await page.locator('header').innerText();
  add('header-en', /Classes|Schedule|Team|Photos|More|Contact/i.test(nav), nav.slice(0, 180).replace(/\s+/g, ' '));
  await page.screenshot({ path: `${ROOT}/header-en-1440.png`, timeout: 15000 });
  await page.locator('header').getByTestId('lang-de').first().click();
  await page.waitForTimeout(300);
  const navDe = await page.locator('header').innerText();
  add('header-de', /Tanzkurse|Kursplan/.test(navDe), navDe.slice(0, 120).replace(/\s+/g, ' '));
  await page.close();
}

{
  const page = await pageAt(1440, 900);
  await page.goto(`${BASE}/schnupperstunde`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(600);
  const h1 = await page.locator('h1').first().innerText();
  add('schnupper-h1', /Komm einmal|Come once/i.test(h1), h1);
  const img = page.locator('img').first();
  add('schnupper-img', await img.isVisible(), 'hero img');
  await page.screenshot({ path: `${ROOT}/schnupper-desktop-1440.png`, timeout: 15000 });
  const form = page.locator('#anfrage, [data-testid*="inquiry"], form').first();
  add('schnupper-form', await form.isVisible().catch(() => false), 'form');
  const meta = await page.locator('meta[name="description"]').getAttribute('content');
  add('schnupper-meta', !!(meta && meta.length > 40 && !/Metabeschreibung/i.test(meta)), meta ?? 'NONE');
  await page.close();
}

{
  const page = await pageAt(390, 844, true);
  await page.goto(`${BASE}/schnupperstunde`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${ROOT}/schnupper-mobil-390.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await pageAt(1440, 900);
  const KURS = '01c4fd80-2e4f-44c0-b499-33cddbf0a54e';
  await page.goto(`${BASE}/buchung?kurs=${KURS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  const dialog = page.getByTestId('booking-dialog');
  if (!(await dialog.isVisible().catch(() => false))) {
    const pick = page.locator('[data-testid^="pick-course-"]').first();
    await pick.waitFor({ state: 'visible', timeout: 12000 });
    await pick.click();
    await page.getByTestId('reserve-spot').click();
  }
  await dialog.waitFor({ state: 'visible', timeout: 8000 });
  const leader = page.getByTestId('role-leader');
  if (await leader.isVisible().catch(() => false)) await leader.click();
  await page.getByTestId('booking-next').click();
  await page.waitForTimeout(400);
  const first = page.getByTestId('bk-firstName');
  add('form-step2', await first.isVisible().catch(() => false), 'bk-firstName');
  await page.screenshot({ path: `${ROOT}/buchung-step2-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await pageAt(1440, 900);
  await page.goto(`${BASE}/events`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 20000 });
  const desc = await page.locator('meta[name="description"]').getAttribute('content');
  add('events-meta', !!(desc && !/Salsaflow Dance Company\.$/.test(desc) && desc.length > 50), desc ?? 'NONE');
  await page.close();
}

await browser.close();
const fail = report.filter((r) => !r.ok);
console.log(`DONE fail=${fail.length} total=${report.length}`);
if (fail.length) process.exit(1);
