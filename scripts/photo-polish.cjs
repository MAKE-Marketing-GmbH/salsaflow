/**
 * Photo-Polish SalsaFlow DC — Runde 1 (2026-08-07)
 *
 * Erzeugt Varianten NEBEN den Originalen (Originale bleiben unangetastet):
 *  - Hero-Crops (quer, ~21:9) fuer Bilder, die als Section-Hero taugen,
 *    aber im Original Hochformat oder schlecht beschnitten sind
 *  - Card-Crops (4:5) fuer Kurs-Kacheln, bei denen der Standard-Crop Koepfe anschneidet
 *  - WebP-Re-Encode fuer Dateien >500KB (hier: shows/show-21.webp, 553KB)
 *
 * Fokus-Strategie: sharp `strategy: ENTROPY` waere unberechenbar bei Personen am Rand,
 * darum explizite Fokus-Positionen (`attention` bzw. pro Bild gesetzte gravity/offsets),
 * jeweils visuell aus den Kurations-Dokumenten abgeleitet.
 *
 * Aufruf: node scripts/photo-polish.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const out = [];

async function meta(file) {
  return sharp(path.join(ROOT, file)).metadata();
}

/** Hero-Crop 21:9, Fokus via extract aus dem Original (kein Resize vor Crop -> max. Qualitaet) */
async function heroCrop(src, dest, focusY = 0.4, targetW = 2100) {
  const m = await meta(src);
  const targetH = Math.round(targetW / (21 / 9));
  const cropH = Math.min(m.height, Math.round(m.width / (21 / 9)));
  const top = Math.max(0, Math.min(m.height - cropH, Math.round(m.height * focusY - cropH / 2)));
  await sharp(path.join(ROOT, src))
    .extract({ left: 0, top, width: m.width, height: cropH })
    .resize(targetW, targetH)
    .webp({ quality: 80 })
    .toFile(path.join(ROOT, dest));
  out.push([dest, `${targetW}x${targetH}`, `Hero 21:9, Fokus y=${focusY}`]);
}

/** Card-Crop 4:5, Fokus x/y als relativer Punkt */
async function cardCrop(src, dest, fx = 0.5, fy = 0.4, targetW = 960) {
  const m = await meta(src);
  const targetH = Math.round(targetW * 5 / 4);
  // maximales 4:5-Fenster im Original
  let cropW, cropH;
  if (m.width / m.height > 4 / 5) { cropH = m.height; cropW = Math.round(m.height * 4 / 5); }
  else { cropW = m.width; cropH = Math.round(m.width * 5 / 4); }
  const left = Math.max(0, Math.min(m.width - cropW, Math.round(m.width * fx - cropW / 2)));
  const top = Math.max(0, Math.min(m.height - cropH, Math.round(m.height * fy - cropH / 2)));
  await sharp(path.join(ROOT, src))
    .extract({ left, top, width: cropW, height: cropH })
    .resize(targetW, targetH)
    .webp({ quality: 80 })
    .toFile(path.join(ROOT, dest));
  out.push([dest, `${targetW}x${targetH}`, `Card 4:5, Fokus x=${fx} y=${fy}`]);
}

async function recompress(src, dest, maxW = 2000, q = 78) {
  await sharp(path.join(ROOT, src))
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: q })
    .toFile(path.join(ROOT, dest));
  const s = fs.statSync(path.join(ROOT, dest));
  out.push([dest, `${maxW}w q${q}`, `Re-Encode ${(s.size / 1024).toFixed(0)}KB`]);
}

(async () => {
  // 1) Hero-Crops (21:9)
  // offer-salsa: Taenzerin im Dreh, sitzt weit rechts, Fokus obere Bildhaelfte (Kopf/Haare)
  await heroCrop('public/photos/premium/offer-salsa-1200.webp',
    'public/photos/premium/offer-salsa-hero-2100.webp', 0.38);
  // offer-bachata: Paar-Nahaufnahme, Koepfe im oberen Drittel
  await heroCrop('public/photos/premium/offer-bachata-1200.webp',
    'public/photos/premium/offer-bachata-hero-2100.webp', 0.34);
  // offer-heels: zwei Taenzerinnen Ganzkoerper -> Kopfzone wichtig
  await heroCrop('public/photos/premium/offer-heels-1200.webp',
    'public/photos/premium/offer-heels-hero-2100.webp', 0.33);
  // kurse-heels-energie-01: 21:9 liegt schon nahe dran (1920x1281), Crop aus Mitte-oben
  await heroCrop('public/photos/2026/kurse-heels-energie-01.webp',
    'public/photos/2026/kurse-heels-energie-hero-2100.webp', 0.42);
  // hero-paar-studiowand-01: Paar vor Logo-Wand, beide Koepfe oben-mittig
  await heroCrop('public/photos/2026/hero-paar-studiowand-01.webp',
    'public/photos/2026/hero-paar-studiowand-hero-2100.webp', 0.36);
  // community-story: Vierer auf Lederbank, Koepfe mittig-oben
  await heroCrop('public/photos/premium/community-story-1600.webp',
    'public/photos/premium/community-story-hero-2100.webp', 0.38);
  // kurse-classfreude-01: Gruppenklasse, Koepfe oben
  await heroCrop('public/photos/2026/kurse-classfreude-01.webp',
    'public/photos/2026/kurse-classfreude-hero-2100.webp', 0.40);

  // 2) Card-Crops (4:5) fuer die 2026-Charge (Querformat -> 4:5 braucht Seitenwahl)
  // hero-paar-dreh-01: Frau lacht mittig-links -> Fokus links
  await cardCrop('public/photos/2026/hero-paar-dreh-01.webp',
    'public/photos/2026/hero-paar-dreh-card-960.webp', 0.38, 0.42);
  // kurse-heels-energie-01: Frontfrau mittig
  await cardCrop('public/photos/2026/kurse-heels-energie-01.webp',
    'public/photos/2026/kurse-heels-energie-card-960.webp', 0.48, 0.38);
  // event-social-couple-01: Paar mittig
  await cardCrop('public/photos/2026/event-social-couple-01.webp',
    'public/photos/2026/event-social-couple-card-960.webp', 0.5, 0.4);
  // community-crowd-01: Menge, Fokus Mitte
  await cardCrop('public/photos/2026/community-crowd-01.webp',
    'public/photos/2026/community-crowd-card-960.webp', 0.5, 0.42);

  // 3) Re-Encode >500KB
  await recompress('public/photos/shows/show-21.webp',
    'public/photos/shows/show-21-opt.webp', 2000, 78);

  console.log('Erzeugte Dateien:');
  for (const [f, dim, note] of out) {
    const size = (fs.statSync(path.join(ROOT, f)).size / 1024).toFixed(0);
    console.log(`  ${f}  ${dim}  ${size}KB  (${note})`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
