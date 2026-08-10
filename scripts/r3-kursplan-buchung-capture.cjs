const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/buchung/r3-1';
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true };
const made = [];

async function prepare(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
      image.decoding = 'sync';
    });
    const height = document.body.scrollHeight;
    for (let y = 0; y <= height; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
    { timeout: 15000 },
  ).catch(() => {});
  await page.waitForTimeout(500);
}

function slicePositions(totalHeight, viewportHeight) {
  const maxScroll = Math.max(0, totalHeight - viewportHeight);
  const positions = [];
  for (let y = 0; y < totalHeight; y += viewportHeight) {
    positions.push(Math.min(y, maxScroll));
  }
  if (positions.length === 0) positions.push(0);
  if (positions[positions.length - 1] !== maxScroll) positions.push(maxScroll);
  return [...new Set(positions)];
}

async function newPage(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    reducedMotion: 'reduce',
  });
  await context.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  return { context, page: await context.newPage() };
}

async function assertResponse(response, route) {
  if (!response || response.status() === 404 || response.status() >= 500) {
    throw new Error(`${route} HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
  }
}

async function captureSchedule(browser, viewport, prefix) {
  const { context, page } = await newPage(browser, viewport);
  try {
    const response = await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle', timeout: 30000 });
    await assertResponse(response, '/kursplan');
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });
    await prepare(page);
    const totalHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const positions = slicePositions(totalHeight, viewport.height);
    for (let index = 0; index < positions.length; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), positions[index]);
      await page.waitForTimeout(200);
      const file = path.join(OUT, `${prefix}-${String(index + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      made.push(file);
    }
  } finally {
    await context.close();
  }
}

async function captureFunnel(browser, viewport, prefix) {
  const { context, page } = await newPage(browser, viewport);
  try {
    const response = await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle', timeout: 30000 });
    await assertResponse(response, '/kursplan');
    const cta = page.locator('a[data-testid="course-card"]').first();
    await cta.waitFor({ timeout: 15000 });
    await cta.scrollIntoViewIfNeeded();
    const href = await cta.getAttribute('href');
    await cta.click();
    await page.waitForTimeout(500);
    if (href && !page.url().includes('/buchung')) {
      await page.goto(BASE + href, { waitUntil: 'networkidle', timeout: 30000 });
    }
    await page.locator('[data-testid="booking-funnel"]').waitFor({ timeout: 15000 });
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 20000 });
    await page.waitForTimeout(400);

    const empty = path.join(OUT, `${prefix}-01.png`);
    await page.screenshot({ path: empty, fullPage: true });
    made.push(empty);

    const follower = page.locator('[data-testid="role-follower"]');
    const leader = page.locator('[data-testid="role-leader"]');
    if (await follower.count()) {
      await follower.first().click();
    } else if (await leader.count()) {
      await leader.first().click();
    }
    await page.locator('[data-testid="bk-firstName"]').fill('Critic');
    await page.locator('[data-testid="bk-lastName"]').fill('Test');
    await page.locator('[data-testid="bk-email"]').fill('critic-test@example.com');
    const filled = path.join(OUT, `${prefix}-02.png`);
    await page.screenshot({ path: filled, fullPage: true });
    made.push(filled);

    await page.locator('[data-testid="booking-submit"]').click();
    await page.locator('[data-testid="booking-success"]').waitFor({ timeout: 20000 });
    await page.waitForTimeout(500);
    const success = path.join(OUT, `${prefix}-03.png`);
    await page.screenshot({ path: success, fullPage: true });
    made.push(success);
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const file of fs.readdirSync(OUT)) {
    if (/^(?:d|m|f|fm)-\d+\.png$/.test(file)) fs.unlinkSync(path.join(OUT, file));
  }

  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    await captureSchedule(browser, DESKTOP, 'd');
    await captureSchedule(browser, MOBILE, 'm');
    await captureFunnel(browser, DESKTOP, 'f');
    await captureFunnel(browser, MOBILE, 'fm');
  } finally {
    await browser.close();
  }
  process.stdout.write(`${made.join('\n')}\n`);
})().catch((error) => {
  process.stderr.write(`ERROR: ${error.message.split('\n')[0]}\n`);
  process.exit(1);
});
