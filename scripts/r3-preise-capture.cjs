const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const ROUTE = '/preise';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/preise/r3-1';
const DESKTOP_HEIGHT = 900;
const MOBILE_HEIGHT = 844;

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

async function captureSlices(page, sliceHeight, prefix) {
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const sliceCount = Math.max(1, Math.ceil(pageHeight / sliceHeight));
  const paths = [];
  for (let index = 0; index < sliceCount; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), index * sliceHeight);
    await page.waitForTimeout(200);
    const filePath = `${OUT}/${prefix}-${String(index + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: filePath });
    paths.push(filePath);
  }
  return paths;
}

async function captureContext(browser, viewport, sliceHeight, prefix) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: viewport.width === 390,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    const response = await page.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    if (!response || response.status() >= 400) {
      throw new Error(`page status ${response ? response.status() : 'navigation failed'}`);
    }
    await prepare(page);
    return await captureSlices(page, sliceHeight, prefix);
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    const paths = [
      ...await captureContext(browser, { width: 1440, height: 900 }, DESKTOP_HEIGHT, 'd'),
      ...await captureContext(browser, { width: 390, height: 844 }, MOBILE_HEIGHT, 'm'),
    ];
    process.stdout.write(`${paths.join('\n')}\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(`ERROR: ${error.message.split('\n')[0]}\n`);
  process.exitCode = 1;
});
