// R187 G58: Erzeugt worklog/R187-originale.md — der Original-Katalog.
//
// Beantwortet je schwacher Datei eine Frage: Gibt es im Repo dieselbe Aufnahme
// in groesser? Die Antwort ist gemessen, nicht geschaetzt. Grundlage ist
// R187-originale.json aus .r187-originalsuche.mjs (RMSE-Vergleich gegen 12
// Bildordner) plus R187-schwach-eindeutig.json (Zielgroesse je Datei).
import { readFileSync, writeFileSync } from 'node:fs';

const W = '/root/clients/salsaflow-w1';
const befunde = JSON.parse(readFileSync(`${W}/worklog/R187-originale.json`, 'utf8'));
const eindeutig = JSON.parse(readFileSync(`${W}/worklog/R187-schwach-eindeutig.json`, 'utf8'));
const ziel = new Map(eindeutig.map((z) => [z.rel, z]));

// Reicht der gefundene Kandidat ueberhaupt fuer Dichte 2,0? Ein groesseres Bild,
// das die Zielgroesse trotzdem verfehlt, waere eine Teilverbesserung, kein Freispruch.
const reicht = (b) => {
  const z = ziel.get(b.rel);
  if (!z || !b.kandidatPx) return null;
  const [kw, kh] = b.kandidatPx.split('x').map(Number);
  return kw >= z.zielW && kh >= z.zielH;
};

const getauscht = befunde.filter((b) => b.status === 'TAUSCHBAR');
const offen = befunde.filter((b) => b.status !== 'TAUSCHBAR').sort((a, b) => a.dichte - b.dichte);

// Die zwei Lager im offenen Rest: Kandidat gross genug (aber anderes Bild) und
// Kandidat ohnehin zu klein. Das erste Lager ist die interessante Gruppe — dort
// scheitert der Tausch am Motiv, nicht an der Aufloesung.
const grossGenugAberAnders = offen.filter((b) => reicht(b) === true);
const zuKlein = offen.filter((b) => reicht(b) === false);

const zeile = (b) => {
  const z = ziel.get(b.rel);
  const r = reicht(b);
  return `| **${b.dichte.toFixed(2)}** | \`${b.rel}\` | ${b.natJetzt} | ${z ? `${z.zielW}x${z.zielH}` : '—'} | \`${b.kandidat || '—'}\` | ${b.kandidatPx || '—'} | ${b.rmse ?? '—'} | ${b.arGleich ? 'ja' : 'nein'} | ${r === null ? '—' : r ? 'ja' : 'nein'} | ${b.status} |`;
};

const KOPF = '| Dichte | Bild jetzt | Nat. Pixel | Zielgroesse | Groesster Kandidat | Kandidat-Pixel | RMSE | AR gleich | Reicht | Urteil |';
const TRENN = '|---|---|---|---|---|---|---|---|---|---|';

const md = [
  '# R187 Original-Katalog — groesste vorhandene Fassung je Motiv',
  '',
  'Frage je schwachem Bild: Liegt dieselbe Aufnahme im Repo in groesser?',
  '',
  '## Wie geprueft wurde',
  '',
  'Durchsucht sind zwoelf Ordner: `public/photos`, `public/composites`,',
  '`public/graphics`, `docs/bilder/assets/masters`, `docs/bilder/assets/photos`,',
  '`docs/bilder/assets/premium-2026-07-03`, drei `harvest`-Ordner,',
  '`docs/bilder/assets/graphic-world`, `docs/bilder/live-site-bilder` und',
  '`docs/bilder/redesign-2026-08`.',
  '',
  'Der Dateiname zaehlt nicht als Beleg. Gegenprobe: `event-04.jpg` und das',
  'gleichnamige Master zeigen zwei verschiedene Paare (RMSE 0,257).',
  '',
  'Stattdessen misst der Lauf den Bildinhalt. Beide Fassungen kommen auf dieselbe',
  'Groesse, dann vergleicht `compare -metric RMSE`. Zwei Wege, es zaehlt der',
  'kleinere Wert:',
  '',
  '1. **verzerrt** — stur auf 240x240 quetschen. Findet denselben Ausschnitt.',
  '2. **beschnitten** — proportional fuellen, mittig schneiden. Findet dasselbe',
  '   Motiv auch bei anderem Seitenverhaeltnis. Ohne diesen Weg fiele ein echtes',
  '   3:2-Master zu einem 4:5-Webbild faelschlich durch.',
  '',
  'Schwelle **RMSE 0,06**. Darunter ist der Unterschied Kompressionsrauschen,',
  'der Ausschnitt also derselbe. Ein reiner Dateitausch genuegt. Darueber ist es ein',
  'anderer Ausschnitt oder ein anderes Motiv; ein Tausch wuerde das Bild sichtbar',
  'veraendern und braucht Raphaels Freigabe.',
  '',
  'Warum gemessen und nicht angesehen: Beim Ansehen hielt ich',
  '`offer-salsa-800` und `offer-salsa-1200` fuer verschieden geschnitten. Die',
  'Messung widerlegte das (RMSE 0,0091–0,0160). Sie waren nur unterschiedlich',
  'gross dargestellt. Das Auge taeuscht hier, die Zahl nicht.',
  '',
  '## Ergebnis',
  '',
  '| Lager | Anzahl | Bedeutung |',
  '|---|---|---|',
  `| TAUSCHBAR | ${getauscht.length} | Dasselbe Motiv, derselbe Ausschnitt, gross genug. Eingebaut. |`,
  `| Gross genug, aber anderes Bild | ${grossGenugAberAnders.length} | Kandidat haette die Pixel, zeigt aber etwas anderes. |`,
  `| Kandidat ohnehin zu klein | ${zuKlein.length} | Auch das groesste Fundstueck verfehlt die Zielgroesse. |`,
  `| **Offener Materialbedarf** | **${offen.length}** | Braucht die Originaldatei oder eine neue Aufnahme. |`,
  '',
  '## Lager 1 — TAUSCHBAR, eingebaut',
  '',
  'Diese sechs sind erledigt. Sie stehen in keiner aktuellen Schwachliste mehr;',
  'die Nachmessung zeigt jede neue Fassung bei genau Dichte 2,00.',
  '',
  KOPF, TRENN,
  ...getauscht.map(zeile),
  '',
  '## Lager 2 — Kandidat gross genug, aber anderes Bild',
  '',
  `Diese ${grossGenugAberAnders.length} Faelle sind die Falle dieser Aufgabe. Der groesste Fund im Repo`,
  'haette genug Pixel. Er zeigt aber nicht dieselbe Aufnahme. Der RMSE liegt ueber',
  '0,06. Ein Tausch waere ein Motivwechsel und braucht Raphaels Freigabe.',
  '',
  'Ohne Messung waere genau hier der Fehler passiert: „grosse Datei mit aehnlichem',
  'Namen gefunden, also eingebaut".',
  '',
  KOPF, TRENN,
  ...grossGenugAberAnders.map(zeile),
  '',
  '### Nachgeprueft: `hp-22.webp` und `offer-heels.jpg`',
  '',
  'Dieser Fall liegt mit RMSE 0,1193 am dichtesten an der Schwelle. Die Sichtprobe',
  'zeigt **dieselbe Aufnahme**: zwei Taenzerinnen, gleiche Pose, gleiches',
  'Studio. Der Farbvergleich hat den Unterschied ueberzeichnet.',
  '',
  'Gegenprobe in Graustufen mit ausgeglichenem Kontrast: RMSE **0,0040**. Das',
  'bestaetigt dieselbe Aufnahme. `hp-22` ist nur kuehler abgestimmt, das Master',
  'waermer.',
  '',
  'Trotzdem **kein Tausch**. Die Ausschnitte sind verschieden: `hp-22` ist 2:3',
  '(1200x1800), das Master 3:4 (2400x3200). Eine Suche ueber Zoom und Position in',
  'beiden Achsen findet als besten Neuschnitt `2133x3200+133+0` mit RMSE **0,159**.',
  'Das liegt weit ueber der Schwelle 0,06. `hp-22` ist zusaetzlich nachbearbeitet.',
  '',
  'Ein Neuschnitt aus dem Master waere darum ein sichtbar anderes Bild, also ein',
  'Motivwechsel. Der Auftrag verlangt dafuer Raphaels Freigabe. **Offene Frage an',
  'Raphael:** `hp-22` auf `/tanzkurse/heels` liegt bei Dichte 1,71 und braucht',
  '1404x1755. Aus dem Master waere das erreichbar, das Bild saehe aber waermer und',
  'anders beschnitten aus. Freigeben oder so lassen?',
  '',
  '## Lager 3 — Kandidat ohnehin zu klein',
  '',
  `Bei diesen ${zuKlein.length} scheitert es schon an der Groesse. Selbst wenn das Motiv passte,`,
  'reichte der Kandidat nicht fuer Dichte 2,0.',
  '',
  KOPF, TRENN,
  ...zuKlein.map(zeile),
  '',
  '## Was das fuer R187 heisst',
  '',
  `Der Quellentausch ist ausgeschoepft. ${getauscht.length} Dateien waren belegbar ersetzbar und`,
  `sind ersetzt. Die restlichen ${offen.length} kann kein Modell loesen: Hochskalieren ist laut`,
  'Auftrag verboten und waere sichtbar wirkungslos, ein Motivwechsel braucht',
  'Raphaels Freigabe.',
  '',
  'Die konkrete Mindestpixelzahl je Datei steht in `worklog/STATUS-r187.md`',
  'unter „Materialbedarf".',
  '',
];

writeFileSync(`${W}/worklog/R187-originale.md`, md.join('\n'));
console.log(`R187-originale.md: ${getauscht.length} tauschbar, ${grossGenugAberAnders.length} gross-aber-anders, ${zuKlein.length} zu klein`);
