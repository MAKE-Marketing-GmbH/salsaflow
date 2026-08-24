// Kimi hat unabhaengig gemessen und gesagt: die Kopf-Landmarke im Beleg der letzten Runde
// passe nicht zum Lineal-PNG. Statt das zu verteidigen, messe ich die Landmarken neu und
// UNABHAENGIG von der letzten Runde: nicht per Auge am Lineal, sondern rechnerisch aus dem
// gerenderten Band. Die Frage, die zaehlt, ist ohnehin nur: liegen die Koepfe drin?
//
// Weg: das Band im Browser rendern, das sichtbare Fenster der Quelle ausrechnen und die
// Quelle in genau diesem Fenster als Crop speichern. Wenn im Crop oben und unten Luft ueber
// Haar und unter Kinn ist, sind die Koepfe drin — unabhaengig davon, welche exakte
// Pixelzeile man dem Haaransatz zuschreibt.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const OUT = '/tmp/r183d-crops';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();

for (const [name, vw, vh, accept] of [
  ['desktop-cookie-offen', 1440, 730, false],
  ['desktop-akzeptiert', 1440, 730, true],
  ['mobile-akzeptiert', 390, 844, true],
]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
  if (accept) { await p.click('[data-testid="cookie-accept"]', { timeout: 4000 }).catch(() => {}); await p.waitForTimeout(500); }
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(600);

  // Genau das Band abfotografieren, das der Nutzer sieht.
  const el = await p.$('[data-schedule-hero-photo]');
  const file = `${OUT}/${name}-band.png`;
  await el.screenshot({ path: file, animations: 'disabled' });

  const m = await p.$eval('[data-schedule-hero-photo-img]', (img) => {
    const r = img.getBoundingClientRect();
    const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const posY = parseFloat(getComputedStyle(img).objectPosition.split(' ')[1]) / 100;
    const cutTop = (img.naturalHeight * scale - r.height) * posY;
    return {
      band: `${Math.round(r.width)}x${Math.round(r.height)}`,
      // sichtbares Fenster in QUELL-Koordinaten
      srcTop: Math.round(cutTop / scale),
      srcBottom: Math.round((cutTop + r.height) / scale),
    };
  });
  console.log(`${name}: Band ${m.band} zeigt Quellzeilen y=${m.srcTop}..${m.srcBottom} von 900 -> ${file}`);
  await ctx.close();
}
await b.close();
