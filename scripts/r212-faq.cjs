// R212: Belegt, dass der FAQ-Hero kein Bild mehr traegt — und misst mit, ob dabei ein
// Loch entstanden ist. Ein Screenshot zeigt nur, dass ich hingesehen habe; die Zahlen
// unten zeigen, dass das Home-Motiv nirgends im Hero uebrig blieb und die Fold-Elemente
// noch stehen, wo sie hingehoeren.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4712';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R212-nachher';

const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '1440x730', width: 1440, height: 730 },
  { tag: '390', width: 390, height: 844 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    // Key und Wert am Code nachgeschlagen (CookieBanner.tsx:18/46), nicht geraten.
    await page.addInitScript(() => {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    });
    await page.goto(BASE + '/faq', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    await page.screenshot({ path: `${OUT}/faq-${vp.tag}-fold0.png`, caret: 'hide' });

    const res = await page.evaluate(() => {
      const hero = document.querySelector('main section');
      const r = hero ? hero.getBoundingClientRect() : null;

      // Jedes Bild im Hero-Abschnitt — egal welches Motiv.
      const heroImgs = hero
        ? [...hero.querySelectorAll('img')].map((el) => ({
            src: el.getAttribute('src'),
            w: Math.round(el.getBoundingClientRect().width),
            h: Math.round(el.getBoundingClientRect().height),
          }))
        : [];

      // Das Home-Motiv irgendwo auf der ganzen Seite?
      const homeMotiv = [...document.querySelectorAll('img, source')]
        .map((el) => el.getAttribute('src') || el.getAttribute('srcSet') || '')
        .filter((s) => s.includes('hero-paar-dreh-01'));

      // Endet der Hero im Fold, oder faellt der Nutzer in eine leere Flaeche?
      const h1 = document.querySelector('h1');
      const cta = document.querySelector('main section a[href]');
      const faqSection = document.querySelector('#faq');
      const rect = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.top + window.scrollY), bottom: Math.round(b.bottom + window.scrollY) };
      };

      return {
        heroBottom: r ? Math.round(r.bottom + window.scrollY) : null,
        heroImgs,
        homeMotiv,
        h1: rect(h1),
        h1Text: h1 ? h1.textContent.trim() : null,
        faqTop: rect(faqSection),
        viewportH: window.innerHeight,
      };
    });

    console.log(`\n=== ${vp.tag} (${vp.width}x${vp.height}) ===`);
    console.log('  Bilder im Hero:', res.heroImgs.length, JSON.stringify(res.heroImgs));
    console.log('  hero-paar-dreh-01 auf der Seite:', res.homeMotiv.length);
    console.log('  H1:', res.h1Text, JSON.stringify(res.h1));
    console.log('  Hero-Unterkante:', res.heroBottom, '| Viewport-Hoehe:', res.viewportH);
    console.log('  FAQ-Grid beginnt:', res.faqTop ? res.faqTop.top : 'nicht gefunden');
    console.log('  FAQ-Grid im Fold sichtbar:', res.faqTop ? res.faqTop.top < res.viewportH : false);

    await ctx.close();
  }
  await browser.close();
})();
