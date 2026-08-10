const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/tanzkurse/r2';

async function prep(page) {
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

async function capture(browser, prefix, viewport, step, contextOptions = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', ...contextOptions });
  const page = await context.newPage();
  const response = await page.goto('http://localhost:5173/tanzkurse', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  if (!response || response.status() >= 400) {
    throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
  }
  await prep(page);
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const lastTop = Math.max(0, pageHeight - viewport.height);
  const positions = [];
  for (let y = 0; y < pageHeight; y += step) positions.push(Math.min(y, lastTop));
  const uniquePositions = [...new Set(positions)];
  for (let index = 0; index < uniquePositions.length; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), uniquePositions[index]);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(OUT, `${prefix}-${String(index + 1).padStart(2, '0')}.png`),
    });
  }
  await context.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const file of fs.readdirSync(OUT)) {
    if (/^[dm]-\d+\.png$/.test(file)) fs.unlinkSync(path.join(OUT, file));
  }
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    await capture(browser, 'd', { width: 1440, height: 900 }, 800, { deviceScaleFactor: 1 });
    await capture(browser, 'm', { width: 390, height: 844 }, 744, {
      deviceScaleFactor: 2,
      isMobile: true,
    });
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
