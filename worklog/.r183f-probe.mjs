// R183f — misst den HORIZONTALEN Ausschnitt des Kursplan-Bands.
// Frage: welcher Teil der Quelle 2100x900 ist auf 390 und auf 1440 sichtbar?
import pkg from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const BASE = 'http://127.0.0.1:5175';

const VPS = [
  { name: 'mobil-390', width: 390, height: 844, dpr: 3 },
  { name: 'desktop-1440', width: 1440, height: 900, dpr: 2 },
];

const browser = await chromium.launch();
for (const vp of VPS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
  });
  await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const img = document.querySelector('[data-schedule-hero-photo] img');
    if (!img) return { missing: true };
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const natW = img.naturalWidth, natH = img.naturalHeight;
    // object-cover: Skalierung = max(boxW/natW, boxH/natH)
    const scale = Math.max(r.width / natW, r.height / natH);
    const drawnW = natW * scale, drawnH = natH * scale;
    // object-position in Prozent
    const [px, py] = cs.objectPosition.split(' ');
    const pctX = px.endsWith('%') ? parseFloat(px) : (px === 'center' ? 50 : 0);
    const pctY = py && py.endsWith('%') ? parseFloat(py) : 50;
    const offX = (drawnW - r.width) * (pctX / 100);
    const offY = (drawnH - r.height) * (pctY / 100);
    // sichtbares Quellfenster in Quellpixeln
    return {
      missing: false,
      boxW: r.width, boxH: r.height,
      natW, natH, scale,
      objectPosition: cs.objectPosition,
      srcLeft: offX / scale,
      srcRight: (offX + r.width) / scale,
      srcTop: offY / scale,
      srcBottom: (offY + r.height) / scale,
      radius: parseFloat(cs.borderTopLeftRadius) || parseFloat(getComputedStyle(img.parentElement).borderTopLeftRadius) || 0,
    };
  });
  console.log(vp.name, JSON.stringify(m, null, 1));
  await page.close();
}
await browser.close();
