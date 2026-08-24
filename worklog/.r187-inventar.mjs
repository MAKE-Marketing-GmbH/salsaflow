// R187: Erzeugt das vollständige Inventar aus der finalen Browser-Messung.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const W = '/root/clients/salsaflow-w1';
const messung = JSON.parse(readFileSync(`${W}/worklog/R187-messung.json`, 'utf8'));
const originale = JSON.parse(readFileSync(`${W}/worklog/R187-originale.json`, 'utf8'));
const rel = (wert) => wert.replace(/^https?:\/\/[^/]+/, '');
const shell = (programm, argumente) => {
  try {
    return execFileSync(programm, argumente, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
};

const tausche = new Map([
  ['/photos/premium/danceflow-home-3840.webp', '/photos/premium/danceflow-home-1400.webp'],
  ['/photos/showcase/hp-27-3840.webp', '/photos/showcase/hp-27.webp'],
  ['/photos/premium/community-story-2634.webp', '/photos/premium/community-story-1600.webp'],
  ['/photos/events/event-03-2634.webp', '/photos/events/event-03.jpg'],
  ['/photos/premium/events-hero-1998.webp', '/photos/premium/events-hero-1400.webp'],
  ['/photos/premium/offer-heels-1404.webp', '/photos/premium/offer-heels-1200.webp'],
]);
const originalVon = new Map(originale.map((eintrag) => [eintrag.rel, eintrag]));
const quelle = new Map();
for (const zeile of shell('grep', ['-rnoE', '/(photos|composites|graphics|logo)/[A-Za-z0-9._/-]+\\.(webp|jpg|jpeg|png|avif|gif)', `${W}/src`]).split('\n')) {
  const treffer = zeile.match(/^(.+?):(\d+):(.+)$/);
  if (!treffer) continue;
  const datei = treffer[1].replace(`${W}/`, '');
  const pfad = treffer[3];
  if (!quelle.has(pfad)) quelle.set(pfad, []);
  const fundstellen = quelle.get(pfad);
  if (fundstellen.length < 4 && !fundstellen.some((wert) => wert.startsWith(datei))) {
    fundstellen.push(`${datei}:${treffer[2]}`);
  }
}

const motiv = new Map();
for (const wert of messung.messungen) {
  const pfad = rel(wert.src);
  if (wert.alt?.trim() && !motiv.has(pfad)) motiv.set(pfad, wert.alt.trim());
}

const paare = [...messung.schlechtesterWertProBild]
  .sort((a, b) => a.dichte - b.dichte || a.route.localeCompare(b.route));
const routen = [...new Set(paare.map((wert) => wert.route))].sort();
const dateien = [...new Set(paare.map((wert) => rel(wert.src)))];
const schwach = paare.filter((wert) => wert.dichte < messung.pflicht);

const ratio = (breite, hoehe) => (breite / hoehe).toFixed(3);
const position = (wert) => wert.fit === 'cover' ? 'CSS-Quelle; Motiv-Lock unverändert' : 'kein Crop';
const groesstesOriginal = (pfad) => {
  const alt = tausche.get(pfad);
  const fund = originalVon.get(alt ?? pfad);
  if (!fund?.kandidat) return 'kein größeres Original belegt';
  return `\`${fund.kandidat}\` ${fund.kandidatPx}`;
};
const status = (wert, pfad) => {
  if (tausche.has(pfad)) return 'TAUSCHBAR, eingebaut';
  return wert.dichte >= messung.pflicht ? 'PASS' : 'MATERIALBEDARF';
};
const zeile = (wert) => {
  const pfad = rel(wert.src);
  const fundstellen = quelle.get(pfad);
  const alt = tausche.get(pfad);
  const breite = wert.natW / wert.boxW;
  const hoehe = wert.natH / wert.boxH;
  return `| \`${wert.route}\` | ${fundstellen ? fundstellen.map((fund) => `\`${fund}\``).join('<br>') : '—'} | ${(motiv.get(pfad) ?? '—').slice(0, 64)} | ${alt ? `\`${alt}\`` : `\`${pfad}\``} | ${alt ? `\`${pfad}\`` : 'unverändert'} | ${wert.natW}x${wert.natH} | ${wert.boxW}x${wert.boxH} @ ${wert.vw}x${wert.vh} | ${breite.toFixed(2)} | ${hoehe.toFixed(2)} | **${wert.dichte.toFixed(2)}** | ${ratio(wert.natW, wert.natH)} | ${wert.fit}; ${position(wert)} | ${groesstesOriginal(pfad)} | **${status(wert, pfad)}** |`;
};

const kopf = '| Route | Komponente | Motiv | Alte Quelle | Neue Quelle | Natürliche Pixel | Größte CSS-Box | Breiten-Dichte | Höhen-Dichte | Effektive Dichte | Seitenverhältnis | Crop | Größtes belegtes Original | Ergebnis |';
const trenn = '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|';
const markdown = [
  '# R187 Inventar: sichtbare Rasterbilder je Route',
  '',
  'Die Browser-Messung erfasst `<img>`, CSS-Hintergründe und Video-Poster.',
  'Je Bild und Route zählt der kleinste Wert aus fünf Viewports.',
  '',
  '## Umfang',
  '',
  '| Größe | Wert |',
  '|---|---|',
  `| Öffentliche Haupt-Routen | ${routen.length} |`,
  `| Viewports | ${messung.viewports.map((wert) => `${wert.w}x${wert.h}`).join(', ')} |`,
  `| Sichtbare Bild-Vorkommen | ${messung.messungen.length} |`,
  `| Bild/Route-Paare | ${paare.length} |`,
  `| Eindeutige Dateien | ${dateien.length} |`,
  `| Paare unter 2,0 | ${schwach.length} |`,
  `| Kaputte Bildpfade | ${messung.kaputteBildpfade.length} |`,
  `| Ladefehler | ${messung.ladefehler.length} |`,
  `| Lauf-Fehler | ${messung.laufFehler.length} |`,
  '',
  '## Berechnung',
  '',
  'Breiten-Dichte ist `natW / boxW`. Höhen-Dichte ist `natH / boxH`.',
  'Bei `cover` und `fill` zählt `1 / max(boxW/natW, boxH/natH)`.',
  'Diese Formel berücksichtigt den Beschnitt durch die Box.',
  '',
  '## Paare unter 2,0',
  '',
  kopf,
  trenn,
  ...schwach.map(zeile),
  '',
  '## Alle Bild/Route-Paare',
  '',
  kopf,
  trenn,
  ...paare.map(zeile),
  '',
  '## Ausnahmen',
  '',
  '- SVG-Dateien skalieren ohne feste Pixelauflösung.',
  '- Browser-Icons gehören nicht zum sichtbaren Seiteninhalt.',
  '- `/admin` ist privat.',
  '- Weiterleitungen rendern eine bereits gemessene Zielroute.',
  '- Elemente mit `display:none`, `visibility:hidden`, Opazität 0 oder Box 0x0 sind unsichtbar.',
  '',
  '## Gemessene Haupt-Routen',
  '',
  ...routen.map((route) => `- \`${route}\``),
  '',
  'Die Zustände `/buchung/erfolg`, `/buchung/abbruch` und `/404` wurden zusätzlich geprüft.',
  'Sie gehören nicht zum vertraglichen Raster aus 27 Haupt-Routen.',
];

writeFileSync(`${W}/worklog/R187-inventar.md`, `${markdown.join('\n')}\n`);
console.log(`R187-inventar.md: ${paare.length} Paare, ${dateien.length} Dateien, ${routen.length} Routen, ${schwach.length} Materialfälle`);
