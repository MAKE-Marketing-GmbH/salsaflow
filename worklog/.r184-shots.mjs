// R184: Shots der CTA-Hierarchie plus Frische-Wache.
// Am 20.08. belegten PNGs einen Stand, der aelter war als die Quelle. Darum merkt
// sich dieses Skript die Quell-mtime VOR dem Rendern und rechnet jedes Bild danach
// dagegen. Ein Beleg, der aelter ist als der Code, ist kein Beleg.
import pkg from '/usr/lib/node_modules/playwright/index.js';
import { statSync, mkdirSync } from 'node:fs';

const BASE = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R184-home-cta';
const QUELLEN = ['src/public/home/Hero.tsx', 'src/public/site/SiteHeader.tsx'];

mkdirSync(OUT, { recursive: true });
const vorher = Math.max(...QUELLEN.map((f) => statSync(f).mtimeMs));

const browser = await pkg.chromium.launch();
const neu = async (w, h) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  return p;
};

// Wache gegen die falsche Seite: 5173 liefert AlpenEnergie und antwortet ebenfalls 200.
{
  const p = await neu(1440, 730);
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const titel = await p.title();
  if (!/Salsaflow/i.test(titel)) {
    console.error(`ABBRUCH: ${BASE} ist nicht Salsaflow, Titel "${titel}"`);
    await browser.close();
    process.exit(2);
  }
  console.log(`GUARD ${BASE} = "${titel}"`);
  await p.screenshot({ path: `${OUT}/home-1440-fold.png` });
  await p.screenshot({ path: `${OUT}/header-1440.png`, clip: { x: 0, y: 0, width: 1440, height: 120 } });
  await p.close();
}

{
  const p = await neu(390, 844);
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/home-390-fold.png` });
  // Ueberlappung pruefen: der schwebende WhatsApp-Blob sitzt rechts unten und darf
  // den sekundaeren CTA nicht verdecken.
  const kollision = await p.evaluate(() => {
    const link = [...document.querySelectorAll('main a')].find((a) =>
      /schnupperstunde/i.test(a.getAttribute('href') ?? ''),
    );
    const blob = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
    if (!link || !blob) return { messbar: false };
    const l = link.getBoundingClientRect();
    const b = blob.getBoundingClientRect();
    const ueberlappt = !(l.right < b.left || l.left > b.right || l.bottom < b.top || l.top > b.bottom);
    return {
      messbar: true,
      ueberlappt,
      linkHoehe: Math.round(l.height),
      linkRechts: Math.round(l.right),
      blobLinks: Math.round(b.left),
    };
  });
  console.log(`KOLLISION ${JSON.stringify(kollision)}`);

  const schalter = p.locator('header button[aria-controls="mobile-navigation"]').first();
  await schalter.click();
  await p.waitForTimeout(900);
  // Kein fullPage: das offene Menue liegt im Viewport, fullPage rendert die ganze Seite.
  await p.screenshot({ path: `${OUT}/menu-390.png` });
  await p.close();
}

await browser.close();

// Frische-Nachweis: jedes PNG muss juenger sein als die juengste Quelle.
const bilder = ['home-1440-fold.png', 'header-1440.png', 'home-390-fold.png', 'menu-390.png'];
let stale = 0;
for (const b of bilder) {
  const d = (statSync(`${OUT}/${b}`).mtimeMs - vorher) / 1000;
  console.log(`${d > 0 ? 'FRISCH' : 'STALE '} ${d.toFixed(1).padStart(9)}s  ${b}`);
  if (d <= 0) stale += 1;
}
// Kippt die Quelle waehrend des Laufs, sind alle Bilder wertlos.
const nachher = Math.max(...QUELLEN.map((f) => statSync(f).mtimeMs));
if (nachher !== vorher) {
  console.error('ABBRUCH: Quelle hat sich waehrend des Laufs geaendert.');
  process.exit(1);
}
if (stale > 0) {
  console.error(`ABBRUCH: ${stale} PNG(s) aelter als die Quelle — kein gueltiger Beleg.`);
  process.exit(1);
}
console.log(`\n${bilder.length} Belege, alle juenger als die Quelle.`);
