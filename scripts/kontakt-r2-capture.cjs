const { chromium } = require('/root/tools/antibot/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const out = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/kontakt/r2';

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

async function capture(browser, prefix, viewport, step, isMobile) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const response = await page.goto('http://localhost:5173/kontakt', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  if (!response || response.status() >= 400) {
    throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
  }
  await prep(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const maxY = Math.max(0, height - viewport.height);
  const positions = [];
  for (let y = 0; y < maxY; y += step) positions.push(y);
  if (!positions.length || positions.at(-1) !== maxY) positions.push(maxY);

  for (let index = 0; index < positions.length; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), positions[index]);
    await page.waitForTimeout(200);
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
    await capture(browser, 'd', { width: 1440, height: 900 }, 800, false);
    await capture(browser, 'm', { width: 390, height: 844 }, 744, true);
  } finally {
    await browser.close();
  }
  console.log(fs.readdirSync(out).sort().map((file) => path.join(out, file)).join('\n'));
})().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
