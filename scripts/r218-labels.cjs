/* R218: alle acht Anliegen-Karten mit ihrer echten Fuellfarbe auflisten. */
const { chromium } = require('playwright-core');
const BASE = process.env.R218_BASE ?? 'http://127.0.0.1:4753';
(async () => {
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  for (const h of ['#events', '#geschenkgutschein']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await p.goto(`${BASE}/kontakt${h}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2000);
    const r = await p.evaluate(() => [...document.querySelectorAll('input[name="topic"]')].map((i) => {
      const lab = i.closest('label');
      return { v: i.value, checked: i.checked, bg: lab ? getComputedStyle(lab).backgroundColor : 'kein label' };
    }));
    console.log(`--- ${h} ---`);
    for (const x of r) console.log(`  ${x.v.padEnd(18)} checked=${String(x.checked).padEnd(5)} bg=${x.bg}`);
    await p.close();
  }
  await b.close();
})();
