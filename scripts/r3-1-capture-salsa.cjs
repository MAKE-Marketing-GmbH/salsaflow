const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const ROUTE = '/tanzkurse/salsa';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/stil-salsa/r3-1';

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

async function capture(browser, width, height, prefix, isMobile = false) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(BASE + ROUTE, {
      waitUntil: 'networkidle',
      timeout: 25000,
    });
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
    }
    await prep(page);
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const lastTop = Math.max(0, pageHeight - height);
    const step = Math.max(1, Math.floor(height * 0.9));
    const positions = [];
    for (let y = 0; y < pageHeight; y += step) {
      positions.push(Math.min(y, lastTop));
    }
    if (positions.length === 0) positions.push(0);
    const uniquePositions = [...new Set(positions)];
    const files = [];
    for (let index = 0; index < uniquePositions.length; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), uniquePositions[index]);
      await page.waitForTimeout(200);
      const file = path.join(OUT, `${prefix}-${String(index + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      files.push(file);
    }
    return files;
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const file of fs.readdirSync(OUT)) {
    if (/^[dm]-\d+\.png$/.test(file)) fs.unlinkSync(path.join(OUT, file));
  }

  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    const files = [
      ...(await capture(browser, 1440, 900, 'd')),
      ...(await capture(browser, 390, 844, 'm', true)),
    ];
    process.stdout.write(files.join('\n') + '\n');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(`ERROR: ${error.message.split('\n')[0]}\n`);
  process.exit(1);
});
