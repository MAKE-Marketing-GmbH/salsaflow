/* R217-Beleg: zeigt, dass ein Tailwind-`ring` auf dieser Pille unter 640px
   verschwindet, ein `border` aber haelt.

   Hintergrund: index.css:348-352 setzt
   `main :not(a):not(button)...{ box-shadow: none }` fuer max-width 639px.
   Ein Tailwind-Ring IST ein box-shadow und faellt darum auf 390 still weg —
   mit `ring-1` gemessen: 1440 "rgb(228,228,225) 0px 0px 0px 1px", 390 "none".
   Mit `border` (aktueller Stand) tragen beide Viewports 1px.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R217_BASE ?? 'http://127.0.0.1:4753';

(async () => {
  const b = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
  });
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 844 : 730 } });
    await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await p.goto(`${BASE}/tanzkurse`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    const r = await p.evaluate(() => {
      const card = [...document.querySelectorAll('a[href*="/kursplan"]')].find(
        (a) => a.querySelector('img') && a.querySelector('.type-h3'),
      );
      const pill = [...card.querySelectorAll('span')].find(
        (s) => /Stufe/.test(s.textContent) && !s.children.length,
      );
      const cs = getComputedStyle(pill);
      const bx = pill.getBoundingClientRect();
      return {
        boxShadow: cs.boxShadow,
        border: `${cs.borderColor} ${cs.borderWidth}`,
        w: Math.round(bx.width),
        h: Math.round(bx.height),
      };
    });
    console.log(w, JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
