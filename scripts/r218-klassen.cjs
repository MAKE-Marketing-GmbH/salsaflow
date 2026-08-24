/* R218: welche Klassen traegt die aktive Karte wirklich? */
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto('http://127.0.0.1:4753/kontakt#events', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  const vor = await p.evaluate(() => {
    const i = [...document.querySelectorAll('input[name="topic"]')].find((x) => x.value === 'events');
    const l = i.closest('label');
    return { klassen: l.className, bg: getComputedStyle(l).backgroundColor };
  });
  console.log('VOR KLICK: ', JSON.stringify(vor, null, 1));
  // Gegenprobe: nach echtem Klick muss die Fuellung erscheinen.
  await p.locator('label', { hasText: 'Events & Workshops' }).first().click();
  await p.waitForTimeout(600);
  const nach = await p.evaluate(() => {
    const i = [...document.querySelectorAll('input[name="topic"]')].find((x) => x.value === 'events');
    const l = i.closest('label');
    return { klassen: l.className, bg: getComputedStyle(l).backgroundColor };
  });
  console.log('NACH KLICK:', JSON.stringify(nach, null, 1));
  await b.close();
})();
