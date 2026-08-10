const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const ROUTE = '/kontakt';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/kontakt/r3-2';
const VIEWPORTS = [
  { prefix: 'd', width: 1440, height: 900, isMobile: false },
  { prefix: 'm', width: 390, height: 844, isMobile: true },
];

async function prepare(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
      image.decoding = 'sync';
    });
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
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

async function captureViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile,
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
    await prepare(page);

    const pageHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const sliceCount = Math.max(1, Math.ceil(pageHeight / viewport.height));
    const paths = [];
    for (let index = 0; index < sliceCount; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), index * viewport.height);
      await page.waitForTimeout(200);
      const outputPath = path.join(OUT, `${viewport.prefix}-${String(index + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: outputPath });
      paths.push(outputPath);
    }
    return paths;
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
    const paths = [];
    for (const viewport of VIEWPORTS) {
      paths.push(...await captureViewport(browser, viewport));
    }
    process.stdout.write(`${paths.join('\n')}\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stdout.write(`ERROR: ${error.message.split('\n')[0]}\n`);
  process.exitCode = 1;
});
