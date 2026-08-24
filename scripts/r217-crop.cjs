/* R217: Nahaufnahme einer Level-Pille auf 390, damit der Ring nicht nur im
   DOM steht, sondern auch im Bild belegt ist. */
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto('http://127.0.0.1:4753/tanzkurse', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const pill = p.locator('a[href*="/kursplan"] span', { hasText: /Stufe/ }).first();
  await pill.scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  const box = await pill.boundingBox();
  await p.screenshot({
    path: '/root/clients/salsaflow-w1/worklog/shots/R217/pille-390-nah.png',
    clip: { x: box.x - 12, y: box.y - 24, width: 240, height: 70 },
    animations: 'disabled', caret: 'hide',
  });
  console.log('ok');
  await b.close();
})();
