/* R221-Belegbilder: die Instagram-Sektion beidseitig des Umschaltpunkts (1140
   Slider / 1150 Raster) plus die Breiten aus dem Watcher-Befund. Zeigt, dass
   weder Waise noch Einspalten-Kolonne bleibt.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R221_BASE ?? 'http://127.0.0.1:4753';
const OUT = process.env.R221_OUT ?? '/root/clients/salsaflow-w1/worklog/shots/R221';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const ROUTEN = [
  { pfad: '/', name: 'home' },
  { pfad: '/fotos', name: 'fotos' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const w of (process.env.R221_SHOT_W ?? '1024,1140,1150,1440').split(',').map(Number)) {
    for (const r of ROUTEN) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(`${BASE}${r.pfad}`, { waitUntil: 'networkidle' });
      const karte = page.locator('[data-component-unit="component.instagram-video-card"]').first();
      await karte.scrollIntoViewIfNeeded();
      await page.waitForTimeout(3000);
      const p = `${OUT}/ig-${r.name}-${w}.png`;
      await page.screenshot({ path: p, animations: 'disabled', caret: 'hide' });
      console.log(p);
      await page.close();
    }
  }
  await browser.close();
})();
