// Runde-5-Captures: artefaktfreie Screenshots aller Surfaces.
// Methode (Erkenntnis aus Runde 4): fullPage-Shots NUR nach komplettem Durchscrollen
// (IntersectionObserver-Reveals feuern sonst nicht -> "leere Platzhalter"), plus
// Viewport-Shots an 3 Scrollpositionen (Cookie-Leiste/Sticky-CTA-Verhalten echt sichtbar).
// Buchung zusaetzlich mit geoeffnetem Dialog (Backdrop-Check).
const { chromium } = require('playwright-core');
const fs = require('fs');
const BASE = 'http://localhost:5173';
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1';
// ROUND=r6 node scripts/r5-capture.cjs  -> schreibt nach <surface>/r6/.
// SURFACES=kursplan,buchung schraenkt auf einzelne Flaechen ein.
const ROUND = process.env.ROUND || 'r5';

const ALL_SURFACES = [
  { key: 'home', path: '/' },
  { key: 'kursplan', path: '/kursplan' },
  { key: 'tanzkurse', path: '/tanzkurse' },
  { key: 'stil-salsa', path: '/tanzkurse/salsa' },
  { key: 'team', path: '/team' },
  { key: 'buchung', path: '/buchung', dialog: true },
];
const only = (process.env.SURFACES || '').split(',').filter(Boolean);
const SURFACES = only.length ? ALL_SURFACES.filter((s) => only.includes(s.key)) : ALL_SURFACES;

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const paths = [];

  const scrollThrough = async (p) => {
    await p.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
    });
    await p.waitForTimeout(700);
  };

  const snap = async (p, file) => { await p.screenshot({ path: file }); paths.push(file); };

  for (const s of SURFACES) {
    const dir = `${OUT}/${s.key}/${ROUND}`;
    fs.mkdirSync(dir, { recursive: true });
    for (const [tag, vp, mobile] of [['d', { width: 1440, height: 900 }, false], ['m', { width: 390, height: 844 }, true]]) {
      const p = await b.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
      await p.goto(BASE + s.path, { waitUntil: 'networkidle' });
      await scrollThrough(p);
      // Fullpage nach Reveals; Cookie-Leiste ist nach Scroll abgeraeumt -> echtes Bild.
      await p.screenshot({ path: `${dir}/${tag}-full.png`, fullPage: true });
      paths.push(`${dir}/${tag}-full.png`);
      // Frischer Zustand fuer Erstbesuch-Ansicht (Cookie-Leiste sichtbar): top-Shot ohne Scroll.
      const p2 = await b.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
      await p2.goto(BASE + s.path, { waitUntil: 'networkidle' });
      await p2.waitForTimeout(1200);
      await snap(p2, `${dir}/${tag}-top.png`);
      await p2.close();
      // Mittlere + tiefe Scrollposition (Overlap-Check im echten Nutzerfluss).
      for (const [name, frac] of [['mid', 0.45], ['deep', 0.8]]) {
        await p.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), frac);
        await p.waitForTimeout(500);
        await snap(p, `${dir}/${tag}-${name}.png`);
      }
      // Buchungs-Dialog oeffnen: erste Kurszeile anklicken (Zeilen sind Buttons/Links
      // mit Kursnamen, kein "Platz sichern"-Label auf /buchung).
      if (s.dialog) {
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.waitForTimeout(400);
        for (const r of await p.$$('main a, main button')) {
          const t = (await r.textContent()) || '';
          if (/Stufe|Salsa|Bachata/.test(t)) { await r.click(); break; }
        }
        await p.waitForTimeout(900);
        if (await p.$('[aria-modal="true"], [data-testid="booking-dialog"]')) {
          await snap(p, `${dir}/${tag}-dialog.png`);
        }
      }
      await p.close();
    }
  }
  await b.close();
  console.log(paths.join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
