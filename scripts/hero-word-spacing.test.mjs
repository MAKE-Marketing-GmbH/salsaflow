import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const output = process.env.OUT ?? '/tmp/salsaflow-hero-word-spacing';
const minimumGap = 3.5;
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 640,
      hasTouch: viewport.width < 640,
      reducedMotion: 'reduce',
      locale: 'de-CH',
    });
    await context.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    const page = await context.newPage();
    const response = await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.locator('main h1').first().waitFor({ state: 'visible', timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const lines = await page.locator('main h1 [data-reveal-variant="letters"] > [aria-hidden="true"]').evaluateAll((containers) =>
      containers.map((container) => {
        const words = [...container.children].map((element) => {
          const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
          const rawText = textNode?.textContent ?? '';
          const word = rawText.trim();
          if (!textNode || !word) return null;
          const start = rawText.indexOf(word);
          const range = document.createRange();
          range.setStart(textNode, start);
          range.setEnd(textNode, start + word.length);
          const rect = range.getBoundingClientRect();
          return { word, left: rect.left, right: rect.right, top: rect.top };
        }).filter(Boolean);

        const gaps = [];
        for (let index = 0; index < words.length - 1; index += 1) {
          const current = words[index];
          const next = words[index + 1];
          if (Math.abs(current.top - next.top) < 2) {
            gaps.push({ pair: `${current.word} ${next.word}`, pixels: next.left - current.right });
          }
        }
        return gaps;
      }).flat(),
    );

    await page.screenshot({
      path: `${output}/home-${viewport.name}-${viewport.width}x${viewport.height}.png`,
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
    results.push({
      viewport: viewport.name,
      status: response?.status() ?? null,
      gaps: lines.map((gap) => ({ ...gap, pixels: Number(gap.pixels.toFixed(2)) })),
    });
    await context.close();
  }
} finally {
  await browser.close();
}

const failures = results.flatMap((result) =>
  result.gaps
    .filter((gap) => gap.pixels < minimumGap)
    .map((gap) => `${result.viewport}: "${gap.pair}" gap ${gap.pixels}px`),
);
if (results.some((result) => result.status !== 200)) failures.push('navigation did not return HTTP 200');
if (results.some((result) => result.gaps.length < 4)) failures.push('expected headline word pairs were not measured');

console.log(JSON.stringify({ pass: failures.length === 0, minimumGap, failures, results }, null, 2));
if (failures.length) process.exitCode = 1;
