// R205: Voll-Sweep aller echten Routen. Full-Page settled + Fold, drei Viewports.
// Sammelt Console-Errors und Pageerrors je Route nach fertig/r205/console-log.json.
const { chromium } = require('playwright-core');
const fs = require('fs');
const { execSync } = require('child_process');

const BASE = process.env.BASE || 'http://127.0.0.1:5173';
const OUT = 'fertig/r205';
// ONLY="/kursplan,/fotos" beschraenkt den Lauf auf einzelne Routen (Reshoot nach Fixes).
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
// VP="m390,m360" beschraenkt den Lauf auf einzelne Viewports (Nachfahren nach Abbruch).
const VP = process.env.VP ? process.env.VP.split(',') : null;
const ROUTES = [
  '/', '/tanzkurse', '/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels',
  '/privatstunden', '/kursaufbau', '/preise', '/shows-animationen', '/events',
  '/events-workshops/danceflow-night', '/events-workshops/anniversary-weekend',
  '/events-workshops/floweekend', '/events-workshops/eventkalender',
  '/team', '/fotos', '/kontakt', '/schnupperstunde',
  '/kontakt/standort-raumvermietung', '/mehr/collabs', '/mehr/tanzschuhe',
  '/mehr/partys', '/faq', '/impressum', '/datenschutz', '/kursplan', '/buchung',
];
const VIEWPORTS = [
  ['d1440', { width: 1440, height: 900 }],
  ['m390', { width: 390, height: 844 }],
  ['m360', { width: 360, height: 780 }],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const consoleLog = {};
  let count = 0;

  for (const [vpName, viewport] of VIEWPORTS) {
    if (VP && !VP.includes(vpName)) continue;
    // Browser je Viewport frisch: lange Läufe haben den Chrome sonst gekillt (Zygote-Reap).
    const browser = await chromium.launch({ headless: true, channel: 'chrome' });
    for (const route of ROUTES) {
      if (ONLY && !ONLY.includes(route)) continue;
      try {
      const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
      page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e).slice(0, 300)));
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
      } catch (e) {
        errs.push('GOTO-FAIL: ' + e.message.slice(0, 200));
      }
      await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
      // Auf /buchung sitzt der Banner bewusst im Fluss vor dem Footer (index.css R117);
      // Playwright scrollt beim Klick dorthin — fuer den Fold-Shot zurueck nach oben.
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(600);
      const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '_');
      await page.screenshot({ path: `${OUT}/${slug}-${vpName}-fold.png` });
      // Einmal komplett durchscrollen, damit alle Reveals gefeuert haben, dann Full-Page.
      await page.evaluate(async () => {
        const step = innerHeight * 0.8;
        for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
          scrollTo({ top: y, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 120));
        }
        scrollTo({ top: 0, behavior: 'instant' });
      });
      // Erst wenn ALLE Bilder fertig geladen sind, ist die Full-Page beweisfähig:
      // lazy-Images unterhalb des Folds erzeugten sonst Löcher im PNG (/fotos R205).
      // Mit 8s-Deckel: lazy-Images ausserhalb des vertikalen Scrollwegs (z. B. in
      // horizontalen Scrollern) laden nie — ohne Deckel hing der Sweep unbegrenzt.
      await page.evaluate(() => Promise.race([
        Promise.all(
          Array.from(document.images).filter((im) => !im.complete)
            .map((im) => new Promise((r) => { im.onload = r; im.onerror = r; })),
        ),
        new Promise((r) => setTimeout(r, 8000)),
      ])).catch(() => {});
      await page.waitForTimeout(900);
      // KEIN fullPage:true — Playwrights captureBeyondViewport setzte auf /fotos 94 von
      // 122 whileInView-Kacheln zurück (gemessen 23.08.). Stattdessen: Viewport auf die
      // volle Seitenhöhe ziehen (stabil, 0 unsichtbar), normaler Shot, Viewport zurück.
      // Full-Shot durch SEGMENT-STITCHING statt Viewport-Aufziehen. Grund (R205 Runde 4,
      // gemessen): der Home-Hero traegt --hero-photo-h in vh UND nutzt die Var im
      // padding-top des Textblocks. Beim Aufziehen auf Dokumenthoehe explodiert die Var
      // (Sektion 906 -> 9856px), Hoehen-Pinning heilt das Padding nicht — die Hero-Copy
      // rutschte 9000px tief in die Preissektion (Kimi/Grok-BLOCKER, reines Artefakt).
      // Stitching mutiert NICHTS: echter Viewport, Segmente scrollen, magick -append.
      await page.evaluate(() => {
        // Der fixe WhatsApp-Knopf und der sticky Header wuerden in jedem Segment
        // wiederholt; der Knopf ist in den Fold-Shots belegt, der Header in Segment 1.
        for (const a of document.querySelectorAll('a')) {
          if (/wa\.me|whatsapp/i.test(a.href || '') && getComputedStyle(a).position === 'fixed') {
            a.style.visibility = 'hidden';
          }
        }
      });
      const docH = await page.evaluate(() => document.documentElement.scrollHeight);
      const segH = viewport.height;
      const segPaths = [];
      for (let y = 0, i = 0; y === 0 || y < docH; y += segH, i++) {
        const top = Math.max(0, Math.min(y, docH - segH));
        await page.evaluate((t) => scrollTo({ top: t, behavior: 'instant' }), top);
        if (i === 1) {
          // Header ab Segment 2 ausblenden (fixed/sticky wiederholt sich sonst oben).
          await page.evaluate(() => {
            const h = document.querySelector('header');
            if (h && ['fixed', 'sticky'].includes(getComputedStyle(h).position)) h.style.visibility = 'hidden';
          });
        }
        await page.waitForTimeout(220);
        const seg = `${OUT}/.seg-${i}.png`;
        await page.screenshot({ path: seg });
        // Das letzte Segment ueberlappt das vorletzte um (y - top): oben wegschneiden.
        const overlap = Math.round(y - top);
        if (overlap > 0) {
          execSync(`convert ${seg} -crop ${viewport.width}x${segH - overlap}+0+${overlap} +repage ${seg}`);
        }
        segPaths.push(seg);
        if (top >= docH - segH) break;
      }
      execSync(`convert ${segPaths.join(' ')} -append ${OUT}/${slug}-${vpName}-full.png`);
      for (const seg of segPaths) fs.unlinkSync(seg);
      await page.evaluate(() => {
        const h = document.querySelector('header');
        if (h) h.style.visibility = '';
      });
      count += 2;
      if (errs.length) consoleLog[`${route} ${vpName}`] = errs;
      await context.close();
      } catch (e) {
        consoleLog[`${route} ${vpName}`] = ['SWEEP-FAIL: ' + e.message.slice(0, 200)];
      }
    }
    await browser.close().catch(() => {});
  }

  fs.writeFileSync(`${OUT}/console-log.json`, JSON.stringify(consoleLog, null, 2));
  console.log(`${count} Screenshots unter ${OUT}; Routen mit Console-Fehlern: ${Object.keys(consoleLog).length}`);
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
