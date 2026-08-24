/* Warum findet das Rhythmus-Gate auf /kursplan nur 1 Kopf, obwohl CoursesPage.tsx
   drei h2 traegt (Zeilen 442, 689, 1021)? */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(900);

  const koepfe = await page.evaluate(() =>
    [...document.querySelectorAll('main section')].map((section, i) => {
      const h2 = section.querySelector('h2');
      if (!h2) return { i, id: section.id || null, grund: 'kein h2' };
      const r = h2.getBoundingClientRect();
      return {
        i,
        id: section.id || null,
        text: h2.textContent.trim().slice(0, 40),
        hoehe: Math.round(r.height),
        breite: Math.round(r.width),
        srOnly: Boolean(h2.closest('.sr-only')),
      };
    }),
  );
  for (const k of koepfe) console.log(JSON.stringify(k));
  await browser.close();
})();
