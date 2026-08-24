// R187 G56-Nachtrag: Die drei oeffentlichen Routen, die in der ersten Messung
// fehlten. routes.tsx fuehrt 131 Eintraege; 100 tragen redirectTo, einer ist
// app-private (/admin). Bleiben 30 echte oeffentliche Routen, gemessen waren 27.
//
// Gleiche Rechnung wie .r187-messung.mjs, damit die Werte vergleichbar sind.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require_ = createRequire(import.meta.url);
const pkg = require_('/usr/lib/node_modules/playwright/index.js');

const BASE = 'http://127.0.0.1:5175';
const PFLICHT = 2.0;
const ROUTEN = ['/buchung/erfolg', '/buchung/abbruch', '/404'];
const VIEWPORTS = [
  { w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1024, h: 768 },
  { w: 1440, h: 730 }, { w: 1920, h: 1080 },
];

// Im Browser ausgefuehrt: jedes sichtbare Rasterbild mit natuerlicher Groesse,
// gerenderter Box und object-fit einsammeln.
function ernte() {
  const raus = [];
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width >= 24 && r.height >= 24 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05;
  };
  for (const el of document.querySelectorAll('img')) {
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    raus.push({
      art: 'img', src: el.currentSrc || el.src,
      natW: el.naturalWidth, natH: el.naturalHeight,
      boxW: r.width, boxH: r.height,
      fit: getComputedStyle(el).objectFit,
      geladen: el.complete && el.naturalWidth > 0,
      alt: (el.alt || '').slice(0, 60),
    });
  }
  // Hintergrundbilder und Video-Poster zaehlen genauso, der Nutzer sieht sie.
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage;
    const t = bg && bg.match(/url\(["']?([^"')]+\.(?:png|jpe?g|webp|avif|gif))["']?\)/i);
    if (!t || !sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    raus.push({ art: 'bg', src: t[1], natW: 0, natH: 0, boxW: r.width, boxH: r.height, fit: getComputedStyle(el).backgroundSize, geladen: true, alt: '' });
  }
  for (const el of document.querySelectorAll('video[poster]')) {
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    raus.push({ art: 'poster', src: el.poster, natW: 0, natH: 0, boxW: r.width, boxH: r.height, fit: getComputedStyle(el).objectFit, geladen: true, alt: '' });
  }
  return raus;
}

// Bei cover fuellt das Bild die Box und wird beschnitten: es zaehlt die groessere
// noetige Skalierung. Sonst begrenzt die knappere Achse.
function dichte(t) {
  if (!t.natW || !t.natH) return null;
  if (t.fit === 'cover') return Math.round((1 / Math.max(t.boxW / t.natW, t.boxH / t.natH)) * 100) / 100;
  return Math.round(Math.min(t.natW / t.boxW, t.natH / t.boxH) * 100) / 100;
}

const alle = [];
const fehler = [];
const kaputt = new Set();

for (const route of ROUTEN) {
  for (const vp of VIEWPORTS) {
    let browser = null;
    try {
      browser = await pkg.chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
      await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
      page.on('response', (res) => {
        if (res.status() >= 400 && /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(res.url())) kaputt.add(`${res.status()} ${res.url()}`);
      });
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
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
      for (const t of await page.evaluate(ernte)) alle.push({ route, vw: vp.w, vh: vp.h, ...t, dichte: dichte(t) });
    } catch (e) {
      fehler.push({ route, vp: `${vp.w}x${vp.h}`, fehler: String(e.message || e).slice(0, 200) });
    } finally {
      if (browser) await browser.close().catch(() => null);
    }
  }
  process.stdout.write('.');
}
console.log('');

const schwach = alle.filter((t) => t.dichte !== null && t.dichte < PFLICHT);
writeFileSync('/root/clients/salsaflow-w1/worklog/R187-nachzuegler.json', JSON.stringify({ routen: ROUTEN, viewports: VIEWPORTS, messungen: alle, schwach, kaputteBildpfade: [...kaputt], laufFehler: fehler }, null, 1));

console.log(`Routen ${ROUTEN.length}, Messungen ${alle.length}, schwach ${schwach.length}, kaputt ${kaputt.size}, Fehler ${fehler.length}`);
for (const s of schwach) console.log(`  d=${s.dichte} ${new URL(s.src, BASE).pathname} @vw${s.vw} ${s.route} box ${Math.round(s.boxW)}x${Math.round(s.boxH)} ${s.fit}`);
if (fehler.length) for (const f of fehler) console.log(`  FEHLER ${f.route} ${f.vp}: ${f.fehler}`);
