/* R220-Belegbilder: die Instagram-Sektion auf beiden Routen und beiden Viewports,
   plus eine Nahaufnahme der ersten Karte bei deviceScaleFactor 3. Die Kollision
   spielt sich in ~20px Kopfhoehe ab — im Seitenbild ist sie kaum zu beurteilen.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R220_BASE ?? 'http://127.0.0.1:4753';
const OUT = process.env.R220_OUT ?? '/root/clients/salsaflow-w1/worklog/shots/R220';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const ROUTEN = [
  { pfad: '/', name: 'home' },
  { pfad: '/fotos', name: 'fotos' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const w of [1440, 390]) {
    for (const r of ROUTEN) {
      // Uebersicht der Sektion.
      const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(`${BASE}${r.pfad}`, { waitUntil: 'networkidle' });
      const karte = page.locator('[data-component-unit="component.instagram-video-card"]').first();
      await karte.scrollIntoViewIfNeeded();
      await page.waitForTimeout(3000);
      const p1 = `${OUT}/${r.name}-${w}.png`;
      await page.screenshot({ path: p1, animations: 'disabled', caret: 'hide' });
      console.log(p1);
      await page.close();

      // Nahaufnahme des Kopfes: nur die oberen 90px der ersten Karte, dreifach.
      const zoom = await browser.newPage({
        viewport: { width: w, height: w === 390 ? 844 : 900 },
        deviceScaleFactor: 3,
      });
      await zoom.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await zoom.goto(`${BASE}${r.pfad}`, { waitUntil: 'networkidle' });
      const k2 = zoom.locator('[data-component-unit="component.instagram-video-card"]').first();
      await k2.scrollIntoViewIfNeeded();
      await zoom.waitForTimeout(3000);
      const box = await k2.boundingBox();
      const p2 = `${OUT}/${r.name}-${w}-kopf.png`;
      await zoom.screenshot({
        path: p2,
        animations: 'disabled',
        caret: 'hide',
        // Volle Kartenbreite, nicht bis zur Viewportkante beschnitten. Eine erste
        // Fassung nahm hier min(box.width, w - box.x) — das schnitt den
        // "Profil ansehen"-Knopf im BILD ab, obwohl er real ganz sichtbar ist,
        // und haette einen Fehler vorgetaeuscht, den es nicht gibt.
        clip: { x: box.x, y: box.y, width: box.width, height: 90 },
      });
      console.log(p2);
      await zoom.close();
    }
  }
  await browser.close();
})();
