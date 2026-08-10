const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173/team';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/team/r3-1';

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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const results = [];

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await prepare(desktopPage);
  const desktopHeight = await desktopPage.evaluate(() => document.body.scrollHeight);
  const desktopPositions = slicePositions(desktopHeight, 900);
  for (let i = 0; i < desktopPositions.length; i += 1) {
    await desktopPage.evaluate((y) => window.scrollTo(0, y), desktopPositions[i]);
    await desktopPage.waitForTimeout(200);
    const path = `${OUT}/d-${String(i + 1).padStart(2, '0')}.png`;
    await desktopPage.screenshot({ path });
    results.push(path);
  }
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await prepare(mobilePage);
  const mobileHeight = await mobilePage.evaluate(() => document.body.scrollHeight);
  const mobilePositions = slicePositions(mobileHeight, 844);
  for (let i = 0; i < mobilePositions.length; i += 1) {
    await mobilePage.evaluate((y) => window.scrollTo(0, y), mobilePositions[i]);
    await mobilePage.waitForTimeout(200);
    const path = `${OUT}/m-${String(i + 1).padStart(2, '0')}.png`;
    await mobilePage.screenshot({ path });
    results.push(path);
  }
  await mobileContext.close();

  await browser.close();
  console.log(results.join('\n'));
})().catch((error) => {
  console.error(`ERROR: ${error.message.split('\n')[0]}`);
  process.exitCode = 1;
});
