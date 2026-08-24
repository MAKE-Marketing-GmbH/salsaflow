/* R218: welches Anliegen ist nach dem Hash-Aufruf vorbelegt?
   Die Anliegen sind <input type=radio name=topic> in Wahl-Karten (InquiryWizard.tsx:701). */
const { chromium } = require('playwright-core');
const BASE = process.env.R218_BASE ?? 'http://127.0.0.1:4753';
(async () => {
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  for (const h of ['', '#events', '#raumvermietung', '#geschenkgutschein', '#animationen', '#schnupperstunde']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await p.goto(`${BASE}/kontakt${h}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const radios = [...document.querySelectorAll('input[name="topic"]')];
      const an = radios.find((x) => x.checked);
      return {
        radios: radios.length,
        gewaehlt: an ? an.value : null,
        scrollY: Math.round(scrollY),
      };
    });
    console.log(`${(h || '(kein hash)').padEnd(20)} -> ${JSON.stringify(r)}`);
    await p.close();
  }
  await b.close();
})();
