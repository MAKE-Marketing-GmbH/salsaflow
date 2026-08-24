// R183f — Acceptance-PNGs fuer den Kursplan-Radius + Kopf-Fix.
//
// FRISCHE-WACHE (Fix-Runde 3, Befund sol-critic). In Runde 2 lagen die vier PNGs
// rund vier Minuten VOR der letzten Quelltext-Aenderung. Damit belegten sie nicht
// den Code auf der Platte, sondern einen aelteren Stand. Sol hat das zu Recht
// beanstandet: ein Bild ohne Zeitbezug ist kein Beleg.
//
// Das Skript prueft die Reihenfolge deshalb jetzt selbst, statt sich auf Disziplin
// zu verlassen:
//   1. VOR dem Rendern: Zeitstempel der Quelldatei merken.
//   2. Der Dev-Server liefert aus der Platte; jedes PNG entsteht danach.
//   3. NACH dem Rendern: hat sich die Quelle waehrenddessen geaendert, sind die
//      Bilder wieder stale -> Exit 1 statt gruener Meldung.
// Am Ende steht ein Nachweis mit mtimes, den ein Kritiker nachrechnen kann.
import pkg from '/usr/lib/node_modules/playwright/index.js';
import { mkdirSync, statSync } from 'node:fs';
const { chromium } = pkg;
const OUT = '/root/clients/salsaflow-w1/worklog/shots/r183f-kursplan-radius';
const SRC = '/root/clients/salsaflow-w1/src/public/SchedulePage.tsx';
mkdirSync(OUT, { recursive: true });

const srcMtimeBefore = statSync(SRC).mtimeMs;
console.log(`QUELLE ${SRC}`);
console.log(`  mtime vor dem Rendern: ${new Date(srcMtimeBefore).toISOString()}`);

const SHOTS = [
  { name: 'kursplan-mobil-390-00-fold', w: 390, h: 844, dpr: 3, cookie: true },
  { name: 'kursplan-mobil-390-01-cookie-offen', w: 390, h: 844, dpr: 3, cookie: false },
  { name: 'kursplan-desktop-1440-00-fold', w: 1440, h: 900, dpr: 2, cookie: true },
  { name: 'kursplan-desktop-1440-01-cookie-offen', w: 1440, h: 730, dpr: 2, cookie: false },
];

const browser = await chromium.launch();

// Wache gegen die falsche Seite: am 20.08. lief ein Lauf gegen 5173 und schoss
// AlpenEnergie. "HTTP 200" ist deshalb kein Beleg, der Titel entscheidet.
const guard = await browser.newPage();
const res = await guard.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'domcontentloaded' });
const title = await guard.title();
await guard.close();
if (res?.status() !== 200 || !/Salsaflow/i.test(title)) {
  console.error(`ABBRUCH: 5175 ist nicht Salsaflow. HTTP ${res?.status()}, Titel "${title}"`);
  await browser.close();
  process.exit(2);
}
console.log(`GUARD /kursplan = "${title}"\n`);

for (const s of SHOTS) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.dpr });
  if (s.cookie) await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  await page.close();
}
await browser.close();

// Nachweis: jedes PNG muss juenger sein als die Quelle. Sonst ist es stale.
const srcMtimeAfter = statSync(SRC).mtimeMs;
console.log('FRISCHE-NACHWEIS (PNG-mtime minus Quell-mtime, muss positiv sein):');
let stale = 0;
for (const s of SHOTS) {
  const png = `${OUT}/${s.name}.png`;
  const d = statSync(png).mtimeMs - srcMtimeAfter;
  if (d <= 0) stale += 1;
  console.log(`  ${d > 0 ? 'FRISCH' : 'STALE '} ${(d / 1000).toFixed(1).padStart(7)}s  ${png}`);
}
if (srcMtimeAfter !== srcMtimeBefore) {
  console.error('\nABBRUCH: Die Quelldatei wurde WAEHREND des Renderns geaendert.');
  process.exit(1);
}
if (stale > 0) {
  console.error(`\nABBRUCH: ${stale} PNG(s) aelter als die Quelle — kein gueltiger Beleg.`);
  process.exit(1);
}
console.log(`\nAlle ${SHOTS.length} PNGs nach der letzten Quellaenderung gerendert.`);
console.log(`SHOTS_EXIT=0`);
