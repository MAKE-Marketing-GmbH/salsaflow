// R183f Sweep — mobiler Crop: welcher object-position-x haelt BEIDE Koepfe ganz?
// Landmarken aus /tmp/r183f/source-ruler.png (Raster alle 200px abgelesen):
//   Mann  Haaransatz links  x ~ 280   (Hinterkopf-Rundung)
//   Frau  rechte Haarkante  x ~ 1300  (Haar faellt bis dahin)
//   Frau  rechte Hand       x ~ 1500  (nicht koerperteil-kritisch)
// Bindend fuer "Koepfe ganz": Fenster muss x 280..1300 enthalten = 1020px Spanne.
import pkg from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pkg;

const MANN_HAAR = 280;
const FRAU_HAAR_RECHTS = 1300;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

const natW = 2100, natH = 900;
const boxW = await page.evaluate(() => document.querySelector('[data-schedule-hero-photo] img').getBoundingClientRect().width);

console.log(`Mobil-Box breit ${boxW}px. Bindend: Quelle x ${MANN_HAAR}..${FRAU_HAAR_RECHTS} (${FRAU_HAAR_RECHTS - MANN_HAAR}px)`);
console.log('');

for (const hRem of [15, 16, 17, 18, 20, 22]) {
  const boxH = hRem * 16;
  const scale = Math.max(boxW / natW, boxH / natH);
  const drawnW = natW * scale;
  const winW = boxW / scale;
  const passt = winW >= (FRAU_HAAR_RECHTS - MANN_HAAR);
  const row = [];
  for (const pct of [0, 10, 20, 30, 40, 50]) {
    const offX = (drawnW - boxW) * (pct / 100);
    const L = offX / scale, R = (offX + boxW) / scale;
    const ok = L <= MANN_HAAR && R >= FRAU_HAAR_RECHTS;
    row.push(`${pct}%:${L.toFixed(0)}-${R.toFixed(0)}${ok ? ' OK' : ''}`);
  }
  console.log(`h ${hRem}rem (${boxH}px) Fenster ${winW.toFixed(0)}px ${passt ? 'reicht' : 'ZU SCHMAL'} | ${row.join('  ')}`);
}

await page.close();
await browser.close();
