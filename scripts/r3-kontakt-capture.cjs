const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173/kontakt';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/kontakt/r3-1';

async function prepare(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    const height = document.body.scrollHeight;
    for (let y = 0; y <= height; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
    { timeout: 15000 },
  ).catch(() => {});
  await page.waitForTimeout(500);
}

function slicePositions(height, viewportHeight) {
  const maxScroll = Math.max(0, height - viewportHeight);
  const positions = [];
  for (let y = 0; y < height; y += viewportHeight) {
    positions.push(Math.min(y, maxScroll));
  }
  if (positions.length === 0) positions.push(0);
  if (positions[positions.length - 1] !== maxScroll) positions.push(maxScroll);
  return [...new Set(positions)];
}

async function capture(browser, width, height, prefix, isMobile) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: isMobile ? 2 : 1,
    isMobile,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
    if (!response || response.status() === 404 || response.status() >= 500) {
      throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
    }
    await prepare(page);
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const positions = slicePositions(totalHeight, height);
    const paths = [];
    for (let i = 0; i < positions.length; i += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
      await page.waitForTimeout(200);
      const path = `${OUT}/${prefix}-${String(i + 1).padStart(2, '0')}.png`;
      await page.screenshot({ path });
      paths.push(path);
    }
    return paths;
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    const paths = [
      ...(await capture(browser, 1440, 900, 'd', false)),
      ...(await capture(browser, 390, 844, 'm', true)),
    ];
    console.log(paths.join('\n'));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(`ERROR: ${error.message.split('\n')[0]}`);
  process.exitCode = 1;
});
