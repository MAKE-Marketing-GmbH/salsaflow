// R187 G57: Echte Pixeldichte jedes sichtbaren Rasterbilds, je Route und Viewport.
//
// Warum nicht die Klassen lesen: Tailwind-Klassen sagen nicht, wie gross ein Bild
// am Ende WIRKLICH rendert. Container, Breakpoints, aspect-ratio und object-fit
// greifen ineinander. Gemessen wird darum im Browser.
//
// Warum nicht .video-evidence.mjs v3-reso: das prueft `naturalWidth < 900` als feste
// Schwelle, nur auf Home, nur in einem Viewport, nur `main img` ueber 280px Breite,
// und rechnet keine Dichte. Ein 800er Bild in einer 200px-Box ist gut (4.0), ein
// 1600er in einer 1400px-Box ist schlecht (1.14) — die alte Schwelle dreht beides um.
//
// Dichte bei object-fit: cover: das Bild fuellt die Box, Ueberstand wird geschnitten.
// scale = max(boxW/natW, boxH/natH); Dichte = 1/scale.
// Bei contain/scale-down/none: Dichte = min(natW/boxW, natH/boxH).
// Port-Falle (GATES.md): 5175 ist Salsaflow, 5173 ist AlpenEnergie.
import pkg from '/usr/lib/node_modules/playwright/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.R187_BASE || 'http://127.0.0.1:5175';
const PFLICHT = 2.0;

const ROUTEN = [
  '/', '/tanzkurse', '/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels',
  '/privatstunden', '/kursaufbau', '/preise', '/shows-animationen', '/events',
  '/events-workshops/danceflow-night', '/events-workshops/anniversary-weekend',
  '/events-workshops/floweekend', '/events-workshops/eventkalender', '/team',
  '/fotos', '/kontakt', '/schnupperstunde', '/kontakt/standort-raumvermietung',
  '/mehr/collabs', '/mehr/tanzschuhe', '/mehr/partys', '/faq', '/impressum',
  '/datenschutz', '/kursplan', '/buchung',
];

const VIEWPORTS = [
  { w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1024, h: 768 },
  { w: 1440, h: 730 }, { w: 1920, h: 1080 },
];

// Im Browser: jedes sichtbare Rasterbild einsammeln — <img>, background-image, video[poster].
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
    if (!raster.test(src)) continue; // SVG bleibt draussen: keine feste Pixelaufloesung
    treffer.push({
      art: 'img', src, natW: el.naturalWidth, natH: el.naturalHeight,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: getComputedStyle(el).objectFit || 'fill',
      geladen: el.complete && el.naturalWidth > 0,
      alt: (el.getAttribute('alt') || '').slice(0, 60),
    });
  }

  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    const bg = s.backgroundImage;
    if (!bg || bg === 'none' || !bg.includes('url(')) continue;
    const url = (bg.match(/url\(["']?([^"')]+)["']?\)/) || [])[1];
    if (!url || !raster.test(url)) continue;
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    treffer.push({
      art: 'background', src: url, natW: 0, natH: 0,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: s.backgroundSize === 'contain' ? 'contain' : 'cover',
      geladen: null, alt: '',
    });
  }

  for (const el of document.querySelectorAll('video[poster]')) {
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    const src = el.getAttribute('poster') || '';
    if (!raster.test(src)) continue;
    treffer.push({
      art: 'poster', src, natW: 0, natH: 0,
      boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height * 100) / 100,
      fit: 'cover', geladen: null, alt: '',
    });
  }
  return treffer;
}

function dichte(t) {
  if (!t.natW || !t.natH || !t.boxW || !t.boxH) return null;
  if (t.fit === 'cover' || t.fit === 'fill') {
    const scale = Math.max(t.boxW / t.natW, t.boxH / t.natH);
    return scale > 0 ? Math.round((1 / scale) * 100) / 100 : null;
  }
  return Math.round(Math.min(t.natW / t.boxW, t.natH / t.boxH) * 100) / 100;
}

const alle = [];
const fehler = [];
const kaputt = new Set();

// Ein Browser je Route, nicht einer fuer alle 135 Seiten. GATES.md Teil A haelt
// fest, dass ein einzelner Browser ueber viele Gates mit "Target closed" stirbt
// und dann falsch FAIL meldet. .r183-check.mjs loest es genauso.
// Ein Viewport-Durchgang, gekapselt und einzeln wiederholbar. Auf dieser Maschine
// laufen parallel andere Playwright-Jobs; ein Start kann darum vereinzelt scheitern.
// Ein harter Abbruch waere hier ein Messfehler, kein Befund.
async function messeSeite(browser, route, vp) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('response', (res) => {
    const u = res.url();
    if (res.status() >= 400 && /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(u)) kaputt.add(`${res.status()} ${u}`);
  });
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    const titel = await page.title();
    if (!/salsaflow/i.test(titel)) throw new Error(`Fremde Seite auf ${BASE}: "${titel}"`);
    await page.evaluate(async () => {
      const schritt = Math.max(200, Math.floor(innerHeight * 0.8));
      for (let y = 0; y < document.body.scrollHeight; y += schritt) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
      await Promise.all([...document.querySelectorAll('img')].map((el) => {
        el.loading = 'eager';
        return el.complete ? null : el.decode().catch(() => null);
      }));
    });
    await page.waitForTimeout(400);
    return await page.evaluate(ernte);
  } finally {
    await page.close().catch(() => null);
  }
}

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
      for (const t of ergebnis) alle.push({ route, vw: vp.w, vh: vp.h, ...t, dichte: dichte(t) });
    } else {
      fehler.push({ route, vp: `${vp.w}x${vp.h}`, fehler: String(letzterFehler?.message || letzterFehler).slice(0, 200) });
    }
  }
  process.stdout.write('.');
}

console.log('');

// Je Bildpfad+Route der SCHLECHTESTE Wert ueber alle Viewports — der zaehlt.
const proBild = new Map();
for (const z of alle) {
  if (z.dichte === null) continue;
  const key = `${z.route}|${z.src}`;
  const alt = proBild.get(key);
  if (!alt || z.dichte < alt.dichte) proBild.set(key, z);
}
const liste = [...proBild.values()].sort((a, b) => a.dichte - b.dichte);
const schwach = liste.filter((z) => z.dichte < PFLICHT);
const ungelesen = alle.filter((z) => z.art === 'img' && z.geladen === false);

mkdirSync('worklog', { recursive: true });
writeFileSync('worklog/R187-messung.json', JSON.stringify({
  base: BASE, pflicht: PFLICHT, routen: ROUTEN.length, viewports: VIEWPORTS,
  messungen: alle, schlechtesterWertProBild: liste,
  schwach, kaputteBildpfade: [...kaputt], ladefehler: ungelesen, laufFehler: fehler,
}, null, 2));

const md = [
  '# R187 Messung — effektive Pixeldichte',
  '',
  `Basis \`${BASE}\`, ${ROUTEN.length} Routen, Viewports ${VIEWPORTS.map((v) => `${v.w}x${v.h}`).join(', ')}.`,
  `Pflicht ${PFLICHT.toFixed(1)}. Je Bild und Route zaehlt der schlechteste Wert ueber alle Viewports.`,
  '',
  `- Gemessene Bild-Vorkommen: ${alle.length}`,
  `- Eindeutige Bild/Route-Paare: ${liste.length}`,
  `- Unter Pflicht: ${schwach.length}`,
  `- Kaputte Bildpfade (HTTP >= 400): ${kaputt.size}`,
  `- Nicht geladen: ${ungelesen.length}`,
  `- Lauf-Fehler: ${fehler.length}`,
  '',
  '## Unter Pflicht 2,0',
  '',
  '| Dichte | Route | Bild | Nat. Pixel | CSS-Box | Viewport | fit |',
  '|---|---|---|---|---|---|---|',
  ...schwach.map((z) => `| **${z.dichte.toFixed(2)}** | \`${z.route}\` | \`${z.src.replace(BASE, '')}\` | ${z.natW}x${z.natH} | ${z.boxW}x${z.boxH} | ${z.vw} | ${z.fit} |`),
  '',
  '## Alle Bild/Route-Paare',
  '',
  '| Dichte | Route | Bild | Nat. Pixel | CSS-Box | Viewport | fit |',
  '|---|---|---|---|---|---|---|',
  ...liste.map((z) => `| ${z.dichte.toFixed(2)} | \`${z.route}\` | \`${z.src.replace(BASE, '')}\` | ${z.natW}x${z.natH} | ${z.boxW}x${z.boxH} | ${z.vw} | ${z.fit} |`),
];
if (kaputt.size) md.push('', '## Kaputte Bildpfade', '', ...[...kaputt].map((k) => `- ${k}`));
if (fehler.length) md.push('', '## Lauf-Fehler', '', ...fehler.map((f) => `- \`${f.route}\` ${f.vp}: ${f.fehler}`));
writeFileSync('worklog/R187-messung.md', md.join('\n'));

console.log(`Vorkommen ${alle.length}, Paare ${liste.length}, schwach ${schwach.length}, kaputt ${kaputt.size}, Fehler ${fehler.length}`);
for (const z of schwach.slice(0, 25)) {
  console.log(`  ${z.dichte.toFixed(2)}  ${z.route}  ${z.src.replace(BASE, '')}  nat ${z.natW}x${z.natH}  box ${z.boxW}x${z.boxH} @${z.vw}`);
}
if (fehler.length) { console.error('LAUF-FEHLER:'); for (const f of fehler) console.error(` ${f.route} ${f.vp}: ${f.fehler}`); process.exit(2); }
console.log(schwach.length === 0 ? 'R187 MESSUNG PASS' : `R187 MESSUNG: ${schwach.length} Bilder unter ${PFLICHT}`);
