import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux144';
const URL = 'http://127.0.0.1:5175/team';

async function openTeam(page) {
  const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  if (!response || response.status() !== 200) {
    throw new Error(`Expected ${URL} to return HTTP 200, got ${response?.status() ?? 'no response'}`);
  }
  console.log(`route: HTTP ${response.status()} ${response.url()}`);
}

async function waitUntilSettled(page, locator, label) {
  await locator.waitFor({ state: 'visible', timeout: 20_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => !image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });

  let previous = null;
  let stableSamples = 0;
  for (let sample = 0; sample < 20 && stableSamples < 3; sample += 1) {
    const state = await locator.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        x: Math.round(box.x * 10) / 10,
        y: Math.round(box.y * 10) / 10,
        width: Math.round(box.width * 10) / 10,
        height: Math.round(box.height * 10) / 10,
        opacity: style.opacity,
        transform: style.transform,
      };
    });
    stableSamples = JSON.stringify(state) === JSON.stringify(previous) ? stableSamples + 1 : 0;
    previous = state;
    await page.waitForTimeout(150);
  }
  if (stableSamples < 3) throw new Error(`${label} did not settle: ${JSON.stringify(previous)}`);
  console.log(`${label}: visible and settled ${JSON.stringify(previous)}`);
}

async function acceptCookies(page) {
  const button = page.getByRole('button', {
    name: /^(Accept|Accept all|Akzeptieren|Alle akzeptieren)$/i,
  });
  await button.waitFor({ state: 'visible', timeout: 8_000 });
  const label = (await button.textContent())?.trim() ?? '';
  await button.click();
  await button.waitFor({ state: 'hidden', timeout: 8_000 });
  console.log(`mobile cookie: ${label}`);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

try {
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 730 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await openTeam(page);
    const heading = page.getByRole('heading', { level: 1 }).first();
    await waitUntilSettled(page, heading, 'desktop heading');
    await page.screenshot({ path: `${OUT}/team-desktop-1440.png`, timeout: 15_000 });
    await page.close();
  }

  {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    await openTeam(page);
    await acceptCookies(page);
    const heading = page.getByRole('heading', { level: 1 }).first();
    await waitUntilSettled(page, heading, 'mobile heading');
    await page.screenshot({ path: `${OUT}/team-mobil-390.png`, timeout: 15_000 });
    await page.close();
  }

  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await openTeam(page);
    const founders = page.locator('#founders');
    await founders.waitFor({ state: 'attached', timeout: 20_000 });
    await founders.evaluate((element) => element.scrollIntoView({ block: 'start' }));
    const founderText = founders.getByText('Fabio', { exact: true });
    await waitUntilSettled(page, founderText, 'founders text');
    const founderPortrait = founders.locator('img').first();
    await waitUntilSettled(page, founderPortrait, 'founders portrait');
    const box = await founders.boundingBox();
    if (!box || box.y >= 900 || box.y + box.height <= 0) {
      throw new Error(`Founders section is outside the viewport: ${JSON.stringify(box)}`);
    }
    await page.screenshot({ path: `${OUT}/team-founders-scroll-1440.png`, timeout: 15_000 });
    console.log(`founders box: ${JSON.stringify(box)} viewport=1440x900`);
    await page.close();
  }

  console.log('SHOTS_OK');
} finally {
  await browser.close();
}
