// Wieviel Platz hat das Band im Cookie-offen-Fold wirklich?
// Misst auf 1440x730 und 390x844 mit offener Leiste: Bandhoehe, Unterkante Band,
// Position der Wochen-Pfeile, Oberkante der Cookie-Leiste.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:5175';
const browser = await chromium.launch();

for (const [name, w, h] of [
  ['desktop 1440x730', 1440, 730],
  ['mobile 390x844', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.waitForFunction(
    () => document.querySelectorAll('#kursplan-list button, #kursplan-list a').length > 3,
    { timeout: 15000 },
  ).catch(() => {});

  const m = await page.evaluate(() => {
    const img = document.querySelector('[data-schedule-hero-photo] img');
    const ir = img.getBoundingClientRect();
    const cs = getComputedStyle(img);

    // Cookie-Leiste
    const accept = document.querySelector('[data-testid=cookie-accept]');
    let banner = accept;
    while (banner && banner !== document.body) {
      const r = banner.getBoundingClientRect();
      if (r.width > window.innerWidth * 0.5) break;
      banner = banner.parentElement;
    }
    const br = banner ? banner.getBoundingClientRect() : null;

    // Wochen-Pfeile: Buttons mit Pfeil-Beschriftung oder aria-label Woche
    const arrows = [...document.querySelectorAll('#kursplan-list button')]
      .filter((b) => /woche|week|vor|zur/i.test(b.getAttribute('aria-label') || b.textContent || ''))
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { label: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom) };
      });

    return {
      bandTop: Math.round(ir.top),
      bandH: Math.round(ir.height),
      bandBottom: Math.round(ir.bottom),
      cssHeight: cs.height,
      objPos: cs.objectPosition,
      bannerTop: br ? Math.round(br.top) : null,
      bannerH: br ? Math.round(br.height) : null,
      arrows,
      vh: window.innerHeight,
    };
  });

  console.log(`\n=== ${name} (Cookie OFFEN) ===`);
  console.log(`Band: top=${m.bandTop} h=${m.bandH} bottom=${m.bandBottom}  (css height ${m.cssHeight}, object-position ${m.objPos})`);
  console.log(`Cookie-Leiste: top=${m.bannerTop} h=${m.bannerH}   Viewport h=${m.vh}`);
  console.log(`Wochen-Pfeile:`, JSON.stringify(m.arrows));
  if (m.bannerTop !== null) {
    const budget = m.bannerTop - m.bandBottom;
    console.log(`Platz zwischen Bandunterkante und Cookie-Oberkante: ${budget}px`);
  }
  await page.close();
}

await browser.close();
