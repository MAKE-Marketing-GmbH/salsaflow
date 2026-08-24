/* R220: misst die tatsaechliche Iframe-Breite der Instagram-Karten auf beiden
   Routen und beiden Viewports. Der Kritiker nennt 360px als Schwelle, ab der
   Instagrams eigener Kopf kollisionsfrei ist — gemessen wird also, wie weit
   die Site darunter liegt.

   Zusaetzlich: Karten-Aussenbreite und Container-Beschnitt, um zu trennen ob
   das Iframe zu schmal IST oder nur zu schmal AUSSIEHT.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R220_BASE ?? 'http://127.0.0.1:4753';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
const SCHWELLE = 360;

const ROUTEN = [
  { pfad: '/', name: 'home (compact)' },
  { pfad: '/fotos', name: 'fotos (voll)' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  // Die Zwischenbreiten sind Pflicht: mit lg:grid-cols-3 war 1024 mit 170px die
  // schmalste Stelle ueberhaupt, schmaler als 390. Wer nur 1440 und 390 misst,
  // sieht den schlimmsten Fall nicht.
  const VIEWPORTS = (process.env.R220_VIEWPORTS ?? '1440,390').split(',').map(Number);
  for (const w of VIEWPORTS) {
    for (const r of ROUTEN) {
      const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(`${BASE}${r.pfad}`, { waitUntil: 'networkidle' });
      // Bis zur Sektion scrollen, sonst laedt das lazy-Iframe nicht.
      await page.locator('[data-component-unit="component.instagram-video-card"]').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);

      const daten = await page.evaluate(() => {
        const karten = [...document.querySelectorAll('[data-component-unit="component.instagram-video-card"]')];
        return karten.map((k) => {
          const frame = k.querySelector('iframe');
          const fb = frame?.getBoundingClientRect();
          const kb = k.getBoundingClientRect();
          // Beschnitt durch einen Vorfahren mit overflow: hidden/auto.
          let cutR = 0;
          let cutB = 0;
          for (let p = k.parentElement; p; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (!/hidden|auto|scroll/.test(cs.overflowX + cs.overflowY)) continue;
            const pb = p.getBoundingClientRect();
            cutR = Math.max(cutR, Math.round(kb.right - pb.right));
            cutB = Math.max(cutB, Math.round(kb.bottom - pb.bottom));
          }
          return {
            iframeW: fb ? Math.round(fb.width) : null,
            karteW: Math.round(kb.width),
            cutR,
            cutB,
          };
        });
      });

      console.log(`\n=== ${r.name} @ ${w} ===`);
      for (const [i, d] of daten.entries()) {
        const fehlt = d.iframeW === null ? '?' : SCHWELLE - d.iframeW;
        const urteil = d.iframeW === null ? 'KEIN IFRAME' : d.iframeW >= SCHWELLE ? 'OK' : `ZU SCHMAL um ${fehlt}px`;
        console.log(`  Karte ${i + 1}: iframe=${d.iframeW}px karte=${d.karteW}px cutR=${d.cutR} cutB=${d.cutB}  -> ${urteil}`);
      }
      await page.close();
    }
  }
  await browser.close();
})();
