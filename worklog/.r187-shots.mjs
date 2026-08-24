// R187 G62: Browserbilder jeder oeffentlichen Route bei 1440x730 und 390x844.
// Ein Browser je Route (GATES.md: ein Browser ueber viele Seiten stirbt).
// Kein fullPage — der Vertrag nennt feste Viewports.
import pkg from '/usr/lib/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';

const BASE = process.env.R187_BASE || 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R187-resolution';
const ROUTEN = [
  '/', '/tanzkurse', '/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels',
  '/privatstunden', '/kursaufbau', '/preise', '/shows-animationen', '/events',
  '/events-workshops/danceflow-night', '/events-workshops/anniversary-weekend',
  '/events-workshops/floweekend', '/events-workshops/eventkalender', '/team',
  '/fotos', '/kontakt', '/schnupperstunde', '/kontakt/standort-raumvermietung',
  '/mehr/collabs', '/mehr/tanzschuhe', '/mehr/partys', '/faq', '/impressum',
  '/datenschutz', '/kursplan', '/buchung',
  // routes.tsx fuehrt 30 oeffentliche Routen, nicht 27 (131 gesamt minus 100
  // redirectTo minus /admin). Diese drei fehlten.
  '/buchung/erfolg', '/buchung/abbruch', '/404',
];
const VP = [{ n: '1440', w: 1440, h: 730 }, { n: '390', w: 390, h: 844 }];

mkdirSync(OUT, { recursive: true });
const name = (r) => (r === '/' ? 'home' : r.slice(1).replace(/\//g, '-'));
let ok = 0;
const fehler = [];

for (const route of ROUTEN) {
  for (const vp of VP) {
    let fertig = false;
    for (let versuch = 1; versuch <= 3 && !fertig; versuch++) {
      let b = null;
      try {
        b = await pkg.chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
        // deviceScaleFactor 2: das PNG zeigt, was ein Retina-Geraet zeigt.
        // Genau dort faellt weiche Skalierung auf.
        const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
        await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
        await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
        const titel = await p.title();
        if (!/salsaflow/i.test(titel)) throw new Error(`Fremde Seite: "${titel}"`);
        await p.evaluate(async () => {
          const s = Math.max(200, Math.floor(innerHeight * 0.8));
          for (let y = 0; y < document.body.scrollHeight; y += s) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
          scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 300));
          await Promise.all([...document.querySelectorAll('img')].map((el) => { el.loading = 'eager'; return el.complete ? null : el.decode().catch(() => null); }));
        });
        await p.waitForTimeout(400);
        await p.screenshot({ path: `${OUT}/${name(route)}-${vp.n}.png`, animations: 'disabled', caret: 'hide', timeout: 20000 });
        fertig = true; ok++;
        await p.close().catch(() => null);
      } catch (e) {
        if (versuch === 3) fehler.push(`${route} ${vp.n}: ${String(e.message || e).slice(0, 120)}`);
        await new Promise((r) => setTimeout(r, 1200 * versuch));
      } finally {
        if (b) await b.close().catch(() => null);
      }
    }
  }
  process.stdout.write('.');
}
console.log('');
console.log(`R187 SHOTS: ${ok} PNG in ${OUT}, Fehler ${fehler.length}`);
for (const f of fehler) console.error('  FAIL ' + f);
process.exit(fehler.length ? 1 : 0);
