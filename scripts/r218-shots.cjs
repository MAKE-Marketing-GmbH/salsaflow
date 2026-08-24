/* R218: Belegbilder — beanstandete Anker gegen unbeanstandete Kontroll-Anker.
   Wenn #events kaputt ist, muss es sich sichtbar anders verhalten als
   #geschenkgutschein, den niemand gemeldet hat. */
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const BASE = process.env.R218_BASE ?? 'http://127.0.0.1:4753';
const OUT = '/root/clients/salsaflow-w1/worklog/shots/R218';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  for (const h of ['events', 'raumvermietung', 'geschenkgutschein', 'animationen']) {
    for (const w of [1440, 390]) {
      const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
      await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await p.goto(`${BASE}/kontakt#${h}`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1600);
      await p.screenshot({ path: `${OUT}/kontakt-${h}-${w}.png`, animations: 'disabled', caret: 'hide' });
      await p.close();
    }
    console.log(`${OUT}/kontakt-${h}-*.png`);
  }
  await b.close();
})();
