// R187 G58/G59: Sucht zu jedem schwachen Bild eine groessere Fassung DESSELBEN
// Motivs und prueft den Ausschnitt messtechnisch statt per Augenschein.
//
// Ein gleicher Dateiname-Stamm beweist nichts, und "sieht gleich aus" ist kein
// Beleg: offer-salsa-800 und offer-salsa-1200 wirkten beim Ansehen verschieden
// geschnitten, sind es aber nicht (RMSE 0.016 = Kompressionsrauschen).
// Darum: beide Kandidaten auf dieselbe Groesse bringen und RMSE messen.
// Kleiner Wert = derselbe Ausschnitt = reiner Dateitausch.
// Grosser Wert = anderer Crop = Austausch wuerde das Bild sichtbar veraendern.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const WURZEL = '/root/clients/salsaflow-w1';
const SUCHORTE = [
  'public/photos', 'public/composites', 'public/graphics',
  'docs/bilder/assets/masters', 'docs/bilder/assets/photos',
  'docs/bilder/assets/premium-2026-07-03', 'docs/bilder/assets/harvest-2026-07-07',
  'docs/bilder/assets/harvest-2026-07-08', 'docs/bilder/assets/live-site-harvest-2026-07-21',
  'docs/bilder/assets/graphic-world', 'docs/bilder/live-site-bilder',
  'docs/bilder/redesign-2026-08',
];
const GLEICHER_CROP = 0.06; // RMSE-Schwelle. Darunter: reines Kompressionsrauschen.

const sh = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };

// Alle Kandidaten einsammeln.
const katalog = [];
for (const ort of SUCHORTE) {
  const p = `${WURZEL}/${ort}`;
  if (!existsSync(p)) continue;
  const roh = sh('find', [p, '-type', 'f', '-regextype', 'posix-extended', '-iregex', '.*\\.(png|jpe?g|webp|avif)$']);
  for (const datei of roh.split('\n').filter(Boolean)) {
    const dim = sh('identify', ['-format', '%w %h', `${datei}[0]`]);
    const [w, h] = dim.split(' ').map(Number);
    if (w > 0 && h > 0) katalog.push({ datei, w, h, px: w * h, ar: w / h });
  }
}
console.log(`Katalog: ${katalog.length} Bilder aus ${SUCHORTE.length} Orten`);

// Eingabe ist die bereits entdoppelte Liste: je Bilddatei der schlechteste Fall
// ueber alle Routen und Viewports, plus die echte Zielgroesse (MAX-Box x 2).
const eindeutig = JSON.parse(readFileSync(`${WURZEL}/worklog/R187-schwach-eindeutig.json`, 'utf8'));
const proDatei = new Map(eindeutig.map((z) => [z.rel, { ...z, boxW: z.zielW / 2, boxH: z.zielH / 2 }]));

mkdirSync('/tmp/r187-cmp', { recursive: true });
let n = 0;
const befunde = [];

for (const [rel, z] of proDatei) {
  const jetzt = `${WURZEL}/public${rel}`;
  if (!existsSync(jetzt)) { befunde.push({ ...z, status: 'DATEI-FEHLT' }); continue; }
  const dimJetzt = sh('identify', ['-format', '%w %h', `${jetzt}[0]`]).split(' ').map(Number);
  const arJetzt = dimJetzt[0] / dimJetzt[1];

  // Kandidaten: mehr Pixel als jetzt, und nicht die Datei selbst.
  const kandidaten = katalog
    .filter((k) => k.datei !== jetzt && k.px > dimJetzt[0] * dimJetzt[1] * 1.15)
    .sort((a, b) => b.px - a.px)
    .slice(0, 40);

  // Zwei Bilder vergleichen, beide auf dieselbe Flaeche gebracht.
  // modus 'verzerrt': stur auf 240x240 quetschen. Findet denselben Ausschnitt.
  // modus 'beschnitten': proportional fuellen und mittig schneiden. Findet dasselbe
  // Motiv auch dann, wenn das Master ein anderes Seitenverhaeltnis hat — sonst
  // wuerde ein echtes 3:2-Master zu einem 4:5-Web-Bild faelschlich durchfallen.
  const vergleiche = (links, rechts, modus, id) => {
    const a = `/tmp/r187-cmp/a-${id}.png`;
    const b = `/tmp/r187-cmp/b-${id}.png`;
    const args = modus === 'verzerrt'
      ? ['-resize', '240x240!']
      : ['-resize', '240x240^', '-gravity', 'center', '-extent', '240x240'];
    sh('convert', [`${links}[0]`, ...args, '-colorspace', 'sRGB', a]);
    sh('convert', [`${rechts}[0]`, ...args, '-colorspace', 'sRGB', b]);
    if (!existsSync(a) || !existsSync(b)) return null;
    try {
      execFileSync('compare', ['-metric', 'RMSE', a, b, 'null:'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return 0;
    } catch (e) {
      const m = String(e.stderr || '').match(/\(([0-9.]+)\)/);
      return m ? Number(m[1]) : null;
    }
  };

  let treffer = null;
  for (const k of kandidaten) {
    const rVerzerrt = vergleiche(jetzt, k.datei, 'verzerrt', n++);
    const rBeschnitten = vergleiche(jetzt, k.datei, 'beschnitten', n++);
    const werte = [rVerzerrt, rBeschnitten].filter((x) => x !== null);
    if (!werte.length) continue;
    const rmse = Math.min(...werte);
    if (!treffer || rmse < treffer.rmse) treffer = { ...k, rmse, rVerzerrt, rBeschnitten };
  }

  const arGleich = treffer ? Math.abs(treffer.ar - arJetzt) / arJetzt < 0.02 : false;
  // Reicht der Kandidat ueberhaupt fuer die Pflichtdichte? Ein groesseres Master,
  // das die Zielgroesse trotzdem verfehlt, ist eine Teilverbesserung, kein Freispruch.
  const reicht = treffer ? treffer.w >= z.zielW && treffer.h >= z.zielH : false;
  befunde.push({
    route: z.route, rel, dichte: z.dichte, vw: z.vw,
    natJetzt: `${dimJetzt[0]}x${dimJetzt[1]}`, box: `${z.boxW}x${z.boxH}`, fit: z.fit,
    ziel: `${z.zielW}x${z.zielH}`,
    kandidat: treffer ? treffer.datei.replace(`${WURZEL}/`, '') : null,
    kandidatPx: treffer ? `${treffer.w}x${treffer.h}` : null,
    rmse: treffer ? Math.round(treffer.rmse * 10000) / 10000 : null,
    rmseVerzerrt: treffer ? Math.round(treffer.rVerzerrt * 10000) / 10000 : null,
    rmseBeschnitten: treffer ? Math.round(treffer.rBeschnitten * 10000) / 10000 : null,
    arGleich, reicht,
    status: !treffer ? 'KEIN-ORIGINAL'
      : treffer.rmse <= GLEICHER_CROP && arGleich ? 'TAUSCHBAR'
      : treffer.rmse <= GLEICHER_CROP ? 'GLEICHES-MOTIV-ANDERES-AR'
      : 'NUR-AEHNLICH',
  });
  process.stdout.write('.');
}
console.log('');

befunde.sort((a, b) => a.dichte - b.dichte);
writeFileSync(`${WURZEL}/worklog/R187-originale.json`, JSON.stringify(befunde, null, 2));

const zaehl = {};
for (const b of befunde) zaehl[b.status] = (zaehl[b.status] || 0) + 1;
console.log('Status:', JSON.stringify(zaehl));
console.log('');
for (const b of befunde) {
  console.log(`${b.status.padEnd(26)} ${b.dichte.toFixed(2)} ${b.rel}`);
  console.log(`   jetzt ${b.natJetzt} in Box ${b.box} @${b.vw} (${b.fit}) auf ${b.route}`);
  if (b.kandidat) console.log(`   Kandidat ${b.kandidat} ${b.kandidatPx} RMSE ${b.rmse} AR-gleich ${b.arGleich}`);
}
