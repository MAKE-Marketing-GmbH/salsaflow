const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const ROUTE = '/tanzkurse/salsa';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/stil-salsa/r3-2';
const SLICE_HEIGHTS = [
  { name: 'd', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'm', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
];

async function prepare(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
  });
  const captures = [];

  for (const viewport of SLICE_HEIGHTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      isMobile: viewport.isMobile,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    await prepare(page);

    const pageHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const count = Math.max(1, Math.ceil(pageHeight / viewport.height));
    for (let index = 0; index < count; index += 1) {
      const y = index * viewport.height;
      const sliceHeight = Math.min(viewport.height, Math.max(1, pageHeight - y));
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(200);
      const path = `${OUT}/${viewport.name}-${String(index + 1).padStart(2, '0')}.png`;
      await page.screenshot({
        path,
        clip: { x: 0, y: 0, width: viewport.width, height: sliceHeight },
      });
      captures.push(path);
    }
    await context.close();
  }

  await browser.close();
  console.log(captures.join('\n'));
})().catch((error) => {
  console.error(`ERROR: ${error.message.split('\n')[0]}`);
  process.exitCode = 1;
});
