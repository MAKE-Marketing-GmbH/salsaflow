// R187 G57-Nachtrag: Schliesst die zwei Messluecken in R187-messung.json.
//
// Der Sammellauf hinterliess drei laufFehler, alle auf `/fotos` bei 1024, 1440
// und 1920: "Execution context was destroyed, most likely because of a
// navigation". Die Galerie navigiert waehrend des Scroll-Schritts. Dadurch war
// `/fotos` nur mit 2 statt 5 Viewports gemessen und `/kursplan` mit 4.
//
// Dieses Skript misst genau diese beiden Routen neu und fuehrt die Werte in die
// bestehende JSON zurueck. Alle uebrigen Routen bleiben unberuehrt.
//
// Gegen die Navigationsfalle: der Scroll laeuft in kleinen Happen, jeder in
// seinem eigenen `evaluate`. Stirbt der Kontext, ist nur ein Happen verloren,
// nicht die ganze Messung. Vor der Ernte wartet der Lauf auf Ruhe.
// Port-Falle (GATES.md): 5175 ist Salsaflow, 5173 ist AlpenEnergie.
import pkg from '/usr/lib/node_modules/playwright/index.js';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.R187_BASE || 'http://127.0.0.1:5175';
const PFLICHT = 2.0;
const ROUTEN = ['/fotos', '/kursplan'];
const VIEWPORTS = [
  { w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1024, h: 768 },
  { w: 1440, h: 730 }, { w: 1920, h: 1080 },
];

// Identisch zur Erntefunktion in .r187-messung.mjs. Bewusst kopiert: das
// Skript laeuft im Seitenkontext und darf nichts importieren.
function ernte() {
  const raster = /\.(png|jpe?g|webp|avif|gif)(\?|$)/i;
  const sichtbar = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const treffer = [];
  for (const el of document.querySelectorAll('img')) {
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    const src = el.currentSrc || el.src || '';
    if (!raster.test(src)) continue;
    treffer.push({
      art: 'img', src, natW: el.naturalWidth, natH: el.naturalHeight,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: getComputedStyle(el).objectFit || 'fill',
      geladen: el.complete && el.naturalWidth > 0,
      alt: (el.getAttribute('alt') || '').slice(0, 60),
    });
  }
  for (const el of document.querySelectorAll('*')) {
    if (!sichtbar(el)) continue;
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === 'none') continue;
    const treffe = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (!treffe || !raster.test(treffe[1])) continue;
    const r = el.getBoundingClientRect();
    treffer.push({
      art: 'background', src: treffe[1], natW: 0, natH: 0,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: getComputedStyle(el).backgroundSize || 'auto', geladen: true, alt: '',
    });
  }
  for (const el of document.querySelectorAll('video[poster]')) {
    if (!sichtbar(el)) continue;
    const src = el.getAttribute('poster') || '';
    if (!raster.test(src)) continue;
    const r = el.getBoundingClientRect();
    treffer.push({
      art: 'poster', src, natW: 0, natH: 0,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: getComputedStyle(el).objectFit || 'fill', geladen: true, alt: '',
    });
  }
  return treffer;
}

// object-fit: cover fuellt die Box, der Ueberstand faellt weg.
const dichte = (t) => {
  if (!t.natW || !t.natH || !t.boxW || !t.boxH) return null;
  if (t.fit === 'cover' || t.fit === 'fill') {
    const scale = Math.max(t.boxW / t.natW, t.boxH / t.natH);
    return Math.round((1 / scale) * 100) / 100;
  }
  return Math.round(Math.min(t.natW / t.boxW, t.natH / t.boxH) * 100) / 100;
};

async function messeSeite(browser, route, vp) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    const titel = await page.title();
    if (!/salsaflow/i.test(titel)) throw new Error(`Fremde Seite auf ${BASE}: "${titel}"`);

    // Scroll in Einzelschritten. Jeder Schritt ist ein eigener evaluate-Aufruf,
    // damit ein zerstoerter Kontext nur diesen Schritt kostet.
    const hoehe = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
    const schritt = Math.max(200, Math.floor(vp.h * 0.8));
    for (let y = 0; y < hoehe; y += schritt) {
      await page.evaluate((yy) => scrollTo(0, yy), y).catch(() => null);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => scrollTo(0, 0)).catch(() => null);
    await page.waitForTimeout(300);
    await page.evaluate(async () => {
      await Promise.all([...document.querySelectorAll('img')].map((el) => {
        el.loading = 'eager';
        return el.complete ? null : el.decode().catch(() => null);
      }));
    }).catch(() => null);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(400);
    return await page.evaluate(ernte);
  } finally {
    await page.close().catch(() => null);
  }
}

const neu = [];
const fehler = [];
for (const route of ROUTEN) {
  for (const vp of VIEWPORTS) {
    let ergebnis = null;
    let letzterFehler = null;
    for (let versuch = 1; versuch <= 3 && !ergebnis; versuch++) {
      let browser = null;
      try {
        browser = await pkg.chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
        ergebnis = await messeSeite(browser, route, vp);
      } catch (e) {
        letzterFehler = e;
        await new Promise((r) => setTimeout(r, 1500 * versuch));
      } finally {
        if (browser) await browser.close().catch(() => null);
      }
    }
    if (ergebnis) {
      for (const t of ergebnis) neu.push({ route, vw: vp.w, vh: vp.h, ...t, dichte: dichte(t) });
      process.stdout.write('.');
    } else {
      fehler.push({ route, vp: `${vp.w}x${vp.h}`, fehler: String(letzterFehler?.message || letzterFehler).slice(0, 200) });
      process.stdout.write('X');
    }
  }
}
console.log('');

const m = JSON.parse(readFileSync('worklog/R187-messung.json', 'utf8'));
const vorher = m.messungen.length;
// Die alten Werte der zwei Routen fliegen raus, die neuen kommen rein.
m.messungen = m.messungen.filter((z) => !ROUTEN.includes(z.route)).concat(neu);
m.laufFehler = (m.laufFehler || []).filter((f) => !ROUTEN.includes(f.route)).concat(fehler);

// Je Bildpfad+Route zaehlt der schlechteste Wert ueber alle Viewports.
const proBild = new Map();
for (const z of m.messungen) {
  if (z.dichte === null) continue;
  const key = `${z.route}|${z.src}`;
  const alt = proBild.get(key);
  if (!alt || z.dichte < alt.dichte) proBild.set(key, z);
}
m.schlechtesterWertProBild = [...proBild.values()].sort((a, b) => a.dichte - b.dichte);
m.schwach = m.schlechtesterWertProBild.filter((z) => z.dichte < PFLICHT);

writeFileSync('worklog/R187-messung.json', JSON.stringify(m, null, 1));

const vps = {};
for (const z of m.messungen) (vps[z.route] = vps[z.route] || new Set()).add(z.vw);
const luecken = Object.entries(vps).filter(([, s]) => s.size < 5);
const eindeutig = new Set(m.schwach.map((z) => z.src.replace(/^https?:\/\/[^/]+/, '')));

console.log(`Messungen ${vorher} -> ${m.messungen.length}`);
console.log(`Routen ${Object.keys(vps).length}, davon mit <5 Viewports: ${luecken.length}`);
console.log(`Paare ${m.schlechtesterWertProBild.length}, schwach ${m.schwach.length}, eindeutig schwach ${eindeutig.size}`);
console.log(`laufFehler ${m.laufFehler.length}`);
if (luecken.length > 0 || m.laufFehler.length > 0) {
  console.error(`OFFEN: ${JSON.stringify(luecken.map(([r, s]) => `${r}:${s.size}`))} ${JSON.stringify(m.laufFehler)}`);
  process.exit(1);
}
