#!/usr/bin/env node
/*
 * Gate (Etappe 17, Regel 069 / Failsafe zu Regel 039):
 * Scannt src + server nach deutschen ASCII-Ersatz-Umlauten (ae/oe/ue) in
 * SICHTBAREN Strings UND Screenreader-Attributen (alt/title/aria-label sind
 * Teil des Quelltexts und werden mitgescannt). Kommentare werden entfernt.
 * ss bleibt erlaubt (Schweizer Default). Exit 1 bei Fund.
 *
 * Bewusst Wortliste statt blindem (ae|oe|ue)-Digraph: deutsche Diphthonge wie
 * "Neue"/"treue"/"heute" enthalten dieselben Digraphe legitim. Die Liste deckt
 * die sichtbaren UI-/Mail-/alt-Begriffe + gaengige Stamm-Formen ab.
 */
const fs = require('fs');
const path = require('path');

const ROOTS = ['src', 'server'];
const EXT = new Set(['.ts', '.tsx', '.cts', '.mts']);

const DENY = [
  // UI-Strings (Buttons/Labels/Toasts/Status)
  'veroeffentlich', 'uebersicht', 'uebernomm', 'oeffnen', 'oeffentlich',
  'hinzufueg', 'zurueck', 'plaetze', 'kapazitaet', 'geloescht', 'loeschen',
  'befuell', 'ermaessigt', 'laedt', 'waehlen', 'moeglich', 'ungueltig',
  'maerz', 'gebuehr', 'gefuehr', 'naechst', 'verfueg', 'gemaess', 'begruess',
  'vergueti', 'anfueg',
  // Flaechen-/alt-/Body-Begriffe (haeufige Stamm-Formen)
  'taenzer', 'ruecken', 'schoen', 'hoeh', 'draussen', 'gefuehl', 'beruehr',
  'frueh', 'gruen', 'suess', 'persoenl', 'koerper', 'laechel', 'froehl',
  'huebsch', 'maenner', 'wuerd', 'fuess', 'tuer', 'staerk', 'waerm', 'fuehl',
];

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
for (const r of ROOTS) if (fs.existsSync(r)) walk(r, files);

let hits = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const stripped = stripComments(raw).split('\n');
  const rawLines = raw.split('\n');
  for (let i = 0; i < stripped.length; i++) {
    const low = stripped[i].toLowerCase();
    for (const w of DENY) {
      if (low.includes(w)) {
        console.log(`  ✗ ${f}:${i + 1}  [${w}]  ${rawLines[i].trim().slice(0, 90)}`);
        hits++;
      }
    }
  }
}

if (hits === 0) {
  console.log('VERDICT: PASS (0 ASCII-Umlaut-Verstoesse in sichtbaren Strings + alt/title/aria)');
  process.exit(0);
} else {
  console.log(`\nVERDICT: FAIL (${hits} Verstoss/-Verstoesse). Regel 069: echte Umlaute (ae/oe/ue -> ä/ö/ü), ss bleibt ss.`);
  process.exit(1);
}
