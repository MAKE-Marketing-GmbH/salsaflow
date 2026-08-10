const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const ROUTE = '/tanzkurse';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/tanzkurse/r3-1';
const DESKTOP_SLICE_HEIGHT = 900;
const MOBILE_SLICE_HEIGHT = 844;

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

async function captureSlices(page, viewportHeight, prefix) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const slices = Math.max(1, Math.ceil(height / viewportHeight));
  const paths = [];
  for (let index = 0; index < slices; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), index * viewportHeight);
    await page.waitForTimeout(200);
    const path = `${OUT}/${prefix}-${String(index + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path });
    paths.push(path);
  }
  return paths;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const paths = [];

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    await prepare(desktopPage);
    paths.push(...await captureSlices(desktopPage, DESKTOP_SLICE_HEIGHT, 'd'));
    await desktopContext.close();

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      reducedMotion: 'reduce',
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE + ROUTE, { waitUntil: 'networkidle', timeout: 25000 });
    await prepare(mobilePage);
    paths.push(...await captureSlices(mobilePage, MOBILE_SLICE_HEIGHT, 'm'));
    await mobileContext.close();

    process.stdout.write(`${paths.join('\n')}\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(`ERROR: ${error.message.split('\n')[0]}\n`);
  process.exitCode = 1;
});
