const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const OUT = '_screenshots-runde1/home/r3-1';
const outputs = [];

async function prepare(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    const height = document.body.scrollHeight;
    for (let y = 0; y <= height; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
    { timeout: 15000 },
  ).catch(() => {});
  await page.waitForTimeout(400);
}

async function capture(browser, viewport, prefix, sliceHeight) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
    if (!response || response.status() >= 400) {
      throw new Error(`page status ${response ? response.status() : 'navigation failed'}`);
    }
    await prepare(page);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const slices = Math.ceil(height / sliceHeight);
    for (let index = 0; index < slices; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), index * sliceHeight);
      await page.waitForTimeout(180);
      const filePath = `${OUT}/${prefix}-${String(index + 1).padStart(2, '0')}.png`;
      await page.screenshot({ path: filePath });
      outputs.push(`${process.cwd()}/${filePath}`);
    }
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    await capture(browser, { width: 1440, height: 900 }, 'd', 900);
    await capture(browser, { width: 390, height: 844 }, 'm', 844);
    process.stdout.write(outputs.join('\n') + '\n');
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message.split('\n')[0]}\n`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
