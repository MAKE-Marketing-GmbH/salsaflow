import { chromium } from 'playwright-core';

const baseUrl = process.env.SALSAFLOW_BASE_URL ?? 'http://127.0.0.1:5173';

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
});

await context.addInitScript(() => {
  localStorage.setItem('salsaflow-cookie-ok', '1');
});

const page = await context.newPage();
const failures = [];

async function waitForReact(selector) {
  await page.waitForFunction((target) => {
    const element = document.querySelector(target);
    return Boolean(element && Object.keys(element).some((key) => key.startsWith('__reactProps$')));
  }, selector);
}

async function checkHeadingOrder(state) {
  const headings = await page.locator('h1,h2,h3,h4,h5,h6').evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((node) => ({
        level: Number(node.tagName.slice(1)),
        text: node.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
      })),
  );

  for (let index = 1; index < headings.length; index += 1) {
    const previous = headings[index - 1];
    const current = headings[index];
    if (current.level > previous.level + 1) {
      failures.push(`${state}: h${previous.level} "${previous.text}" -> h${current.level} "${current.text}"`);
    }
  }
}

try {
  await page.goto(`${baseUrl}/buchung`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('footer');
  await checkHeadingOrder('booking page');

  await page.goto(`${baseUrl}/kontakt`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="inquiry-next"]');
  await waitForReact('input[name="topic"]');
  await page.locator('input[name="topic"]').first().check({ force: true });
  await page.locator('[data-testid="inquiry-next"]').click();
  await page.waitForTimeout(260);
  await page.locator('[data-testid="inquiry-next"]').click();
  await page.waitForTimeout(260);
  await checkHeadingOrder('contact wizard step 3');

  await page.goto(`${baseUrl}/buchung`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15_000 });
  await page.locator('[data-testid^="pick-course-"]').first().click();
  await page.locator('[data-testid="reserve-spot"]').click();
  await page.waitForSelector('[data-testid="booking-dialog"]');
  await checkHeadingOrder('booking dialog');
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(`Heading order failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Heading order: PASS (booking page, contact wizard, booking dialog)');
}
