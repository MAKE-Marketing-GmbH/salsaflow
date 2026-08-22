// R189: Misst den Events-Block mobil und prueft echte Ueberdeckungen.
//
// Warum Viewport-Screenshot und Rechteck-Vergleich statt Element-Screenshot: ein
// Element-Shot rendert fixierte Leisten mit, obwohl sie im Sichtfenster woanders liegen
// (dokumentierte Falle GATES.md G55). Fuer die Frage "schneidet die Sticky-CTA ein Bild an?"
// zaehlt allein, ob sich die Rechtecke im Viewport ueberlappen.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/events-r3';

function overlaps(a, b) {
  if (!a || !b) return 0;
  const x = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return Math.round(x * y);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const [tag, viewport] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
    });

    const section = page.locator('#events');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);

    const height = await section.evaluate((el) => Math.round(el.getBoundingClientRect().height));
    const images = await section.locator('img').all();
    if (images.length < 3) throw new Error(`${tag}: Events-Block hat nur ${images.length} Bilder`);
    const imageBoxes = [];
    for (const img of images) imageBoxes.push(await img.boundingBox());

    const sticky = await page.locator('[data-sticky-cta], [class*="sticky"]').first().boundingBox().catch(() => null);
    const whatsappButton = page.locator('.whatsapp-float').first();
    const whatsapp = await whatsappButton.isVisible()
      ? await whatsappButton.boundingBox()
      : null;

    const hits = imageBoxes
      .map((box, index) => ({
        index,
        sticky: overlaps(box, sticky),
        whatsapp: overlaps(box, whatsapp),
      }))
      .filter((hit) => hit.sticky > 0 || hit.whatsapp > 0);

    await page.screenshot({ path: `${OUT}/${tag}-events.png` });
    results.push({ tag, height, images: imageBoxes.length, hits });
    console.log(`${tag}: hoehe=${height}px bilder=${imageBoxes.length} kollisionen=${JSON.stringify(hits)}`);
    await context.close();
  }
  await browser.close();

  const failures = results.filter((result) => result.hits.length > 0);
  if (failures.length) {
    throw new Error(`Events-Kollisionen gefunden: ${JSON.stringify(failures)}`);
  }
})();
