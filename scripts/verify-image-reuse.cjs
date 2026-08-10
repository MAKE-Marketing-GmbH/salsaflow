#!/usr/bin/env node
/*
 * Gate zu DESIGN.md:93 — "Kein Bild auf derselben Seite doppelt; sitewide max 2x mit klar
 * anderem Einsatz." (Design-Kritik Runde 3, Issue 3: /photos/gallery/kurse/03.jpg lag in
 * Home-Hero, /kontakt, /team, Bachata-Kachel, Bachata-Unterseite und Galerie gleichzeitig.)
 *
 * Warum nicht einfach `grep -c` ueber src/public:
 *  1. DE- und EN-Copy stehen im SELBEN content.ts. Ein Bild an EINER Stelle der Seite taucht
 *     dort zwangslaeufig zweimal auf. Roh gezaehlt haette jede zweisprachige Kachel sofort
 *     "2 Treffer", und jede echte Doppelung waere im Rauschen untergegangen.
 *     Darum zaehlt dieses Skript PLATZIERUNGEN: Vorkommen je Datei werden zu eins
 *     zusammengefasst (eine Datei = eine Seite/ein Baustein).
 *  2. src/public/gallery/content.ts IST das Bildarchiv. Dass dort jedes Foto einmal steht,
 *     ist die Aufgabe der Seite und keine Doppelung — die Datei ist darum ausgenommen.
 *
 * Limit: 2 Platzierungen. Exit 1 bei Fund, damit die Doppelung nicht zurueckkriecht.
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'src/public';
const EXT = new Set(['.ts', '.tsx']);
const LIMIT = 2;
/** Das Foto-Archiv listet bewusst jedes Bild genau einmal. */
const EXEMPT = new Set([path.join('src', 'public', 'gallery', 'content.ts')]);

function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
}

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(e.name))) out.push(p);
  }
}

const files = [];
walk(ROOT, files);

/** src -> Set<Datei>. Eine Datei zaehlt genau einmal (DE+EN sind EINE Platzierung). */
const places = new Map();
for (const f of files) {
  if (EXEMPT.has(f)) continue;
  const src = stripComments(fs.readFileSync(f, 'utf8'));
  const re = /['"](\/photos\/[^'"]+\.(?:jpg|jpeg|png|webp|avif))['"]/g;
  let m;
  while ((m = re.exec(src))) {
    if (!places.has(m[1])) places.set(m[1], new Set());
    places.get(m[1]).add(f);
  }
}

let hits = 0;
const rows = [...places.entries()]
  .map(([src, set]) => [src, [...set]])
  .filter(([, list]) => list.length > LIMIT)
  .sort((a, b) => b[1].length - a[1].length);

for (const [src, list] of rows) {
  console.log(`  ✗ ${src}  ${list.length} Platzierungen (max ${LIMIT})`);
  for (const f of list) console.log(`      ${f}`);
  hits++;
}

if (hits) {
  console.log(`\nVERDICT: FAIL (${hits} Bilder ueber dem Limit von ${LIMIT} Platzierungen)`);
  process.exit(1);
}
console.log(`VERDICT: PASS (kein Bild ueber ${LIMIT} Platzierungen, ${places.size} Bilder geprueft)`);
