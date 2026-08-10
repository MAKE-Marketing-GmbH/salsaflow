const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/kursplan/r2-2';

async function prep(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
      image.decoding = 'sync';
    });
    const height = document.documentElement.scrollHeight;
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

async function capture(browser, width, height, prefix, isMobile) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  let crashed = false;
  page.on('crash', () => { crashed = true; });
  const response = await page.goto('http://localhost:5173/kursplan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  if (crashed || !response || response.status() === 404 || response.status() >= 500) {
    throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}${crashed ? ' PAGE_CRASH' : ''}`);
  }
  await prep(page);
  const totalHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  const step = height - 100;
  const positions = [];
  for (let y = 0; ;) {
    const actual = Math.min(y, Math.max(0, totalHeight - height));
    if (positions[positions.length - 1] !== actual) positions.push(actual);
    if (actual >= totalHeight - height) break;
    y += step;
  }
  for (let i = 0; i < positions.length; i += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, `${prefix}-${String(i + 1).padStart(2, '0')}.png`) });
  }
  await context.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome' });
  try {
    await capture(browser, 1440, 900, 'd', false);
    await capture(browser, 390, 844, 'm', true);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(2);
});
