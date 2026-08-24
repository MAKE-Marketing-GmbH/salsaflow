const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 730 } });
  await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto('http://127.0.0.1:4753/tanzkurse', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll('a[href*="/kursplan"]')].find(a => a.querySelector('img') && a.querySelector('.type-h3'));
    const pill = [...card.querySelectorAll('span')].find(s => /Stufe/.test(s.textContent) && !s.children.length);
    const sec = card.closest('section');
    return { pill: getComputedStyle(pill).backgroundColor, card: getComputedStyle(card).backgroundColor, sektion: getComputedStyle(sec).backgroundColor };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
