/* R190: Warum liefert die `clip`-Variante keine Messung?
   Das Reveal-Gate meldet sie als fehlend. Drei moegliche Gruende, und diese Sonde
   trennt sie: (a) das Element existiert nicht, (b) es kommt nie in den Viewport,
   (c) es traegt beim Vorbeikommen keine laufende Animation. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const ROUTE = '/tanzkurse/bachata';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(600);

  const vorhanden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal-variant="clip"]')].map((el) => ({
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      hoehe: Math.round(el.getBoundingClientRect().height),
    })),
  );
  console.log(`(a) clip-Elemente im DOM: ${vorhanden.length}`);
  for (const v of vorhanden) console.log(`    Dokument-y ${v.top}, Hoehe ${v.hoehe}`);
  if (!vorhanden.length) {
    await browser.close();
    return;
  }

  // (b)+(c): dieselben 720er-Spruenge wie im Gate, und bei jedem schauen, was clip macht.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  console.log(`\n(b)+(c) Spruenge zu je 720 px bis ${maxY}:`);
  for (let y = 720; y <= maxY; y += 720) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
    const zustand = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal-variant="clip"]')].map((el) => {
        const box = el.getBoundingClientRect();
        const anims = el.getAnimations();
        return {
          imBild: box.top >= 0 && box.top <= innerHeight,
          top: Math.round(box.top),
          hoehe: Math.round(box.height),
          animationen: anims.map((a) => a.playState).join(',') || 'keine',
        };
      }),
    );
    for (const [i, z] of zustand.entries()) {
      if (!z.imBild && z.animationen === 'keine') continue;
      console.log(
        `  y=${y} clip#${i}: top ${z.top}, Hoehe ${z.hoehe}, ` +
          `imBild ${z.imBild ? 'ja' : 'nein'}, Animationen ${z.animationen}`,
      );
    }
  }

  await browser.close();
})();
