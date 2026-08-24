import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux163';
const BASE = 'http://127.0.0.1:5175';

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(ROOT, { recursive: true });

async function openFaq(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto(`${BASE}/faq`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.locator('#faq details').first().waitFor({ state: 'visible', timeout: 20000 });
}

async function openSecondAndShot(page, outName) {
  const items = page.locator('#faq details');
  await items.nth(1).scrollIntoViewIfNeeded();
  const summary = items.nth(1).locator('summary');
  await summary.click();
  await page.waitForTimeout(500);
  await items.nth(1).evaluate((el) => {
    const header = 88;
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top - header);
  });
  await page.waitForTimeout(200);
  const openAttr = await items.nth(1).evaluate((el) => el.hasAttribute('open'));
  const answerText = await items.nth(1).locator('p').innerText();
  if (!openAttr) {
    throw new Error(`${outName}: details[1] has no open attribute after click`);
  }
  if (!/Beginner-Kurse|Beginner courses/i.test(answerText)) {
    throw new Error(`${outName}: answer not visible, got: ${answerText.slice(0, 120)}`);
  }
  const vp = page.viewportSize();
  if (vp.width >= 1000) {
    await page.screenshot({ path: `${ROOT}/${outName}`, timeout: 15000 });
  } else {
    const box = await items.nth(1).boundingBox();
    if (!box) {
      throw new Error(`${outName}: no bounding box for open details`);
    }
    const padTop = 16;
    const y = Math.max(0, box.y - padTop);
    const height = Math.min(vp.height - y, box.height + padTop);
    if (height < 120) {
      throw new Error(`${outName}: clip height too small (${height})`);
    }
    await page.screenshot({
      path: `${ROOT}/${outName}`,
      clip: { x: 0, y, width: vp.width, height },
      timeout: 15000,
    });
  }
  console.log(`${outName} OPEN=1 ANSWER=${JSON.stringify(answerText.slice(0, 80))}`);
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openFaq(page);
  await openSecondAndShot(page, 'faq-open-1440.png');
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openFaq(page);
  await openSecondAndShot(page, 'faq-open-390.png');
  await page.close();
}

await browser.close();
console.log('FAQ_OPEN_SHOTS_OK');
