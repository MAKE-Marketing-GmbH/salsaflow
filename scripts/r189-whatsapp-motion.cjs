// R189: Beweist den anlassbezogenen WhatsApp-Wechsel Pille -> Kreis -> Pille.
// Der Test sucht eine echte freie Scrollposition. Er schaltet den Kollisionssolver nicht aus.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/whatsapp-motion';

async function buttonState(page) {
  const button = page.locator('.whatsapp-float').first();
  if (!(await button.isVisible())) throw new Error('WhatsApp-Float ist nicht sichtbar');
  const box = await button.boundingBox();
  if (!box) throw new Error('WhatsApp-Float ist nicht messbar');
  return button.evaluate((element, measured) => {
    const label = element.querySelector('[data-whatsapp-label]');
    return {
      x: Math.round(measured.x),
      buttonY: Math.round(measured.y),
      width: Math.round(measured.width),
      height: Math.round(measured.height),
      classMode: element.className.includes('sm:w-14') ? 'circle' : 'pill',
      label: label?.textContent ?? null,
      labelWidth: label ? Math.round(label.getBoundingClientRect().width) : 0,
    };
  }, box);
}

async function captureButton(page, name) {
  const button = page.locator('.whatsapp-float').first();
  await button.waitFor({ state: 'visible', timeout: 3000 });
  await button.screenshot({ path: `${OUT}/${name}.png` });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2000 }).catch(() => {});

  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let idle = null;
  for (let y = 0; y <= maxScroll; y += 320) {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await page.waitForTimeout(2700);
    const state = await buttonState(page).catch(() => null);
    if (state && state.width >= 100) {
      idle = { scrollY: y, ...state };
      break;
    }
  }
  if (!idle) throw new Error('Keine freie Position fuer die WhatsApp-Pille gefunden');

  await captureButton(page, '01-idle-pill');
  // Derselbe Browser-Event wie beim Rad, aber ohne die Geometrie unter dem fixierten Knopf
  // zu verschieben. So prueft Bild 3 die Rueckkehr der Pille und nicht einen neuen Slot.
  await page.evaluate(() => dispatchEvent(new Event('scroll')));
  await page.waitForTimeout(900);
  const scrolling = await buttonState(page);
  await captureButton(page, '02-scroll-circle');

  await page.waitForTimeout(1900);
  const settled = await buttonState(page);
  await captureButton(page, '03-settled-pill');

  const result = { idle, scrolling, settled };
  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result));

  await context.close();
  await browser.close();

  const idleIsPill = idle.width >= 100 && idle.classMode === 'pill' && idle.label === 'WhatsApp';
  const scrollingIsCircle =
    scrolling.width <= 70 && scrolling.classMode === 'circle' && scrolling.label === null;
  const settledIsPill =
    settled.width >= 100 && settled.classMode === 'pill' && settled.label === 'WhatsApp';
  if (!idleIsPill || !scrollingIsCircle || !settledIsPill) {
    throw new Error(`WhatsApp-Motion weicht ab: ${JSON.stringify(result)}`);
  }
})();
