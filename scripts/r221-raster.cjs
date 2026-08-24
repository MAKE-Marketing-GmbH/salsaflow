/* R221: prueft die ZEILENBILDUNG der Instagram-Karten auf Desktop.
   R220 hat den Embed-Kopf lesbar gemacht und dabei das Raster zerlegt: 2+1-Waise
   ab 1440, Einspalten-Kolonne bei 1024-1280. Gemessen wird deshalb pro Breite:

   - Spuren des Rasters (grid-template-columns) und wie viele davon leer bleiben
   - Zeilen: wie viele Karten je Zeile, und wie viel Totraum rechts daneben
   - die Iframe-Breite, damit der R220-Fix nicht still zurueckgedreht wird
     (Schwelle 360px, Karte traegt 1px Rand pro Seite)

   PASS heisst: keine Waisen-Zeile, keine leere Spur, kein Iframe unter 360px.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R221_BASE ?? 'http://127.0.0.1:4753';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
const SCHWELLE = 360;
/* Ab hier traegt die Shell drei Karten in einer Zeile: 3x362 + 2x16 = 1118px, und
   die Shell gibt innen min(vw,1400) - 32. Darunter ist der Slider das gewollte
   Verhalten, nicht ein Befund — bei 1024 stuenden auch ohne jeden Rand nur 992px
   zur Verfuegung. Muss mit dem Wert im Bauteil uebereinstimmen. */
const GRID_AB = 1150;

const ROUTEN = ['/', '/fotos'];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const breiten = (process.env.R221_VIEWPORTS ?? '1024,1180,1280,1440,1600,1920').split(',').map(Number);
  let fehler = 0;

  for (const pfad of ROUTEN) {
    for (const w of breiten) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(`${BASE}${pfad}`, { waitUntil: 'networkidle' });
      await page.locator('[data-component-unit="component.instagram-video-card"]').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);

      const d = await page.evaluate(() => {
        const karten = [...document.querySelectorAll('[data-component-unit="component.instagram-video-card"]')];
        const raster = karten[0].parentElement.parentElement;
        const rb = raster.getBoundingClientRect();
        const cs = getComputedStyle(raster);
        const istSlider = cs.display !== 'grid';
        const spuren = cs.gridTemplateColumns.split(' ').filter(Boolean);

        // Karten nach ihrer y-Position in Zeilen buendeln.
        const zeilen = new Map();
        for (const k of karten) {
          const b = k.getBoundingClientRect();
          const key = Math.round(b.top);
          if (!zeilen.has(key)) zeilen.set(key, []);
          zeilen.get(key).push({ rechts: b.right, breite: b.width });
        }
        const zeilenListe = [...zeilen.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([, karten]) => ({
            n: karten.length,
            // Totraum = was rechts der letzten Karte im Raster noch frei steht.
            totRechts: Math.round(rb.right - Math.max(...karten.map((k) => k.rechts))),
          }));

        const iframes = karten.map((k) => Math.round(k.querySelector('iframe')?.getBoundingClientRect().width ?? 0));
        return {
          istSlider,
          rasterW: Math.round(rb.width),
          spuren: spuren.length,
          spurListe: spuren.map((s) => Math.round(parseFloat(s))).join('/'),
          zeilen: zeilenListe,
          iframes,
          nKarten: karten.length,
        };
      });

      const probleme = [];
      // Unter GRID_AB reicht die Shell fuer drei Karten nicht (Rechnung im Bauteil):
      // dort ist der Slider das gewollte Verhalten. Geprueft wird dann nur, dass er
      // wirklich ein Slider ist und die Karten ihre Breite behalten.
      if (d.istSlider) {
        if (w >= GRID_AB) probleme.push(`SLIDER STATT RASTER (ab ${GRID_AB}px erwartet)`);
        if (d.zeilen.length > 1) probleme.push(`SLIDER UMGEBROCHEN (${d.zeilen.length} Zeilen)`);
      } else {
        if (w < GRID_AB) probleme.push(`RASTER ZU FRUEH (erst ab ${GRID_AB}px tragfaehig)`);
        // Eine Waise ist eine letzte Zeile, die weniger Karten traegt als die erste
        // UND rechts daneben Platz fuer mindestens eine weitere Karte frei laesst.
        const erste = d.zeilen[0]?.n ?? 0;
        const letzte = d.zeilen.at(-1);
        if (d.zeilen.length > 1 && letzte.n < erste && letzte.totRechts >= SCHWELLE) {
          probleme.push(`WAISE (${letzte.n} statt ${erste}, ${letzte.totRechts}px tot)`);
        }
        if (d.spuren > d.nKarten) probleme.push(`LEERE SPUR (${d.spuren} Spuren, ${d.nKarten} Karten)`);
        if (d.spuren === 1 && d.nKarten > 1) probleme.push('EINSPALTEN-KOLONNE');
      }
      // Die R220-Schwelle gilt in beiden Modi.
      if (d.iframes.some((i) => i < SCHWELLE)) probleme.push(`IFRAME ZU SCHMAL (${Math.min(...d.iframes)}px)`);
      if (probleme.length) fehler++;

      const zeilenText = d.istSlider
        ? `slider(${d.nKarten} Karten)`
        : d.zeilen.map((z) => `${z.n}er(tot ${z.totRechts})`).join(' + ');
      console.log(
        `${pfad.padEnd(7)} ${String(w).padStart(4)}  raster=${String(d.rasterW).padStart(4)}  spuren=${(d.istSlider ? '-' : d.spurListe).padEnd(20)}  ${zeilenText.padEnd(28)}  iframe=${d.iframes.join(',')}  ${probleme.length ? probleme.join(' | ') : 'OK'}`,
      );
      await page.close();
    }
  }

  await browser.close();
  console.log(fehler ? `\n${fehler} Faelle mit Befund.` : '\nAlle Faelle sauber.');
  process.exitCode = fehler ? 2 : 0;
})();
