const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');

const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux142';
const URL = 'http://127.0.0.1:5175/events';
const browser = await chromium.launch();

async function acceptCookies(page) {
  const button = page.getByRole('button', { name: 'Alle akzeptieren', exact: true });
  await button.waitFor({ state: 'visible', timeout: 5000 });
  await button.click();
  await button.waitFor({ state: 'hidden', timeout: 5000 });
  return 'Alle akzeptieren';
}

// Desktop 1440x730 with the CTA inside the captured fold.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 730 },
    deviceScaleFactor: 2,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const cta = page.getByRole('link', { name: 'Nächste Events ansehen', exact: true }).first();
  await cta.waitFor({ state: 'visible' });
  const ctaBox = await cta.boundingBox();
  if (!ctaBox || ctaBox.y < 0 || ctaBox.y + ctaBox.height > 730) {
    throw new Error(`CTA is outside the 1440x730 fold: ${JSON.stringify(ctaBox)}`);
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/events-desktop-1440.png` });
  console.log('CTA box:', JSON.stringify(ctaBox), 'fold=730');
  await page.close();
}

// Mobile 390x844, with cookies accepted via the required button before capture.
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  console.log('mobile cookie:', await acceptCookies(page));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/events-mobil-390.png` });
  await page.close();
}

// Desktop 1440x900 after scrolling the Danceflow composition into view.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const danceflow = page.locator('#danceflow');
  await danceflow.waitFor({ state: 'visible' });
  await danceflow.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1200);
  const danceflowBox = await danceflow.boundingBox();
  if (!danceflowBox || danceflowBox.y >= 900 || danceflowBox.y + danceflowBox.height <= 0) {
    throw new Error(`Danceflow composition is outside the viewport: ${JSON.stringify(danceflowBox)}`);
  }
  await page.screenshot({ path: `${OUT}/events-danceflow-scroll-1440.png` });
  console.log('danceflow box:', JSON.stringify(danceflowBox), 'viewport=1440x900');
  await page.close();
}

await browser.close();
console.log('SHOTS_OK');
