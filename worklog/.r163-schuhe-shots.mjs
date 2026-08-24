// R163 / Video-Rest 18.08.: Beleg-Shots fuer /mehr/tanzschuhe.
// Prueft den Fold: die Schuhe muessen im ersten Bildschirm sichtbar sein.
// Cookie-Banner wird per localStorage vorab bestaetigt (Cookie-Init), sonst
// verdeckt er den unteren Fold-Rand und faelscht die Messung.
//
// Aufruf:  node worklog/.r163-schuhe-shots.mjs [vorher]
// Ausgabe: worklog/shots/S7-ux163-schuhe/{,vorher/}tanzschuhe-{desktop-1440,mobil-390}.png
// Zusaetzlich schreibt das Skript die gemessene Geometrie des Media-Bands nach stdout
// (Band-Top, Band-Unterkante, Viewport-Hoehe, object-position). Das ist der
// deterministische G1-Check: sichtbar = Band-Top < Viewport-Hoehe.

import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux163-schuhe';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });

async function openPage(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto('http://127.0.0.1:5175/mehr/tanzschuhe', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(900);
}

/** Misst das Hero-Media-Band: sitzt es im ersten Bildschirm? */
async function measureFold(page, label) {
  const data = await page.evaluate(() => {
    const img = document.querySelector('[data-tanzschuhe-page] img');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      height: Math.round(r.height),
      viewport: window.innerHeight,
      objectPosition: cs.objectPosition,
      src: img.getAttribute('src'),
    };
  });
  if (!data) {
    console.log(`${label} FOLD_MEDIA_MISSING`);
    return null;
  }
  const visiblePx = Math.max(0, Math.min(data.bottom, data.viewport) - Math.max(data.top, 0));
  console.log(
    `${label} src=${data.src} top=${data.top} bottom=${data.bottom} h=${data.height} ` +
      `vh=${data.viewport} visible=${visiblePx}px objectPosition=${data.objectPosition}`,
  );
  return { ...data, visiblePx };
}

const results = [];

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page);
  results.push(await measureFold(page, 'DESKTOP-1440'));
  await page.screenshot({ path: `${OUT}/tanzschuhe-desktop-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page);
  results.push(await measureFold(page, 'MOBIL-390'));
  await page.screenshot({ path: `${OUT}/tanzschuhe-mobil-390.png`, timeout: 15000 });
  await page.close();
}

// Beleg 3: der Weg von der FAQ zur Schuhseite. Die Antwort "Brauche ich Tanzschuhe
// fuer den Start?" traegt jetzt einen echten Link auf /mehr/tanzschuhe.
let faqLinkOk = false;
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(700);

  const summary = page.getByText('Brauche ich Tanzschuhe für den Start?', { exact: true }).first();
  await summary.scrollIntoViewIfNeeded();
  await summary.click();
  await page.waitForTimeout(700);

  const label = await page.evaluate(() => {
    const detail = [...document.querySelectorAll('details')].find((d) =>
      d.querySelector('summary')?.textContent.includes('Brauche ich Tanzschuhe'),
    );
    const link = detail?.querySelector('a[href="/mehr/tanzschuhe"]');
    return link ? link.textContent.trim() : null;
  });
  faqLinkOk = Boolean(label);
  console.log(`FAQ-LINK label=${label ?? 'MISSING'}`);
  await page.screenshot({ path: `${OUT}/faq-schuhe-link-1440.png`, timeout: 15000 });
  await page.close();
}

await browser.close();

// G1: beide Viewports muessen mindestens 80 sichtbare Pixel des Schuh-Bands zeigen,
// die object-position bleibt bei "center 84%" (Lock aus dem Auftrag).
const MIN_VISIBLE = 80;
const fails = [];
for (const r of results) {
  if (!r) {
    fails.push('media element missing');
    continue;
  }
  if (r.visiblePx < MIN_VISIBLE) fails.push(`visible ${r.visiblePx}px < ${MIN_VISIBLE}px`);
  if (!/50%\s+84%|center\s+84%/.test(r.objectPosition)) {
    fails.push(`objectPosition ${r.objectPosition} != center 84%`);
  }
}
if (!faqLinkOk) fails.push('FAQ-Antwort ohne Link auf /mehr/tanzschuhe');

if (fails.length > 0) {
  console.log(`G1_FAIL ${fails.join(' | ')}`);
  process.exit(1);
}
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
console.log('G1_PASS');
