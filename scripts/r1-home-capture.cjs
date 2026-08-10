const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const out = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/home/r2';

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
  const response = await page.goto('http://localhost:5173/', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  if (!response || response.status() >= 400) {
    throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
  }
  await prep(page);
  const total = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  const step = height - 100;
  const positions = [];
  for (let y = 0; y < total; y += step) {
    positions.push(Math.min(y, Math.max(0, total - height)));
  }
  const uniquePositions = [...new Set(positions)];
  for (let index = 0; index < uniquePositions.length; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), uniquePositions[index]);
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(out, `${prefix}-${String(index + 1).padStart(2, '0')}.png`),
    });
  }
  await context.close();
}

(async () => {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    await capture(browser, 1440, 900, 'd', false);
    await capture(browser, 390, 844, 'm', true);
  } finally {
    await browser.close();
  }
  for (const file of fs.readdirSync(out).filter((file) => file.endsWith('.png')).sort()) {
    console.log(path.join(out, file));
  }
})().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
