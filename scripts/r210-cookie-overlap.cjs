// R210: Misst, WELCHE Fold-Elemente der Cookie-Hinweis tatsaechlich ueberdeckt — als
// Rechteck-Schnitt im DOM, nicht geschaetzt am Screenshot. Geschaetzte Pixelabstaende aus
// gestitchten Bildern haben in dieser Runde schon einmal neun von zehn Falschbefunden
// erzeugt; hier wird gerechnet.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4599';

// Raphaels Belege nennen 390 und 1440x730. Die 800er-Hoehe kommt dazu, weil sich daran
// zeigt, ob das Problem an der knappen Fold-Hoehe haengt oder generell besteht.
const VIEWPORTS = [
  { tag: 'm390', width: 390, height: 844 },
  { tag: 'd730', width: 1440, height: 730 },
  { tag: 'd800', width: 1440, height: 800 },
  { tag: 'd900', width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    // Frischer Kontext: leerer localStorage, also erscheint der Hinweis wie beim Erstbesuch.
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const res = await page.evaluate(() => {
      const banner = document.querySelector('[data-cookie-banner]');
      if (!banner) return { banner: null, hits: [] };
      // Die gemessene Karte ist das innere Element — der aeussere Wrapper ist
      // pointer-events-none und spannt ueber die volle Breite, ueberdeckt also nichts.
      const card = banner.firstElementChild || banner;
      const b = card.getBoundingClientRect();

      const hits = [];
      // Nur echte Inhalts-Traeger im Fold, keine Layout-Container.
      document.querySelectorAll('a, button, h1, h2, p, dt, dd, span, li, img').forEach((el) => {
        if (card.contains(el) || el.contains(card)) return;
        const r = el.getBoundingClientRect();
        if (r.width < 12 || r.height < 8) return;
        if (r.bottom <= 0 || r.top >= window.innerHeight) return; // ausserhalb des Folds
        // Nur das aeusserste betroffene Element je Kette melden, sonst zaehlt jedes
        // verschachtelte <span> denselben Treffer erneut.
        const ox = Math.min(r.right, b.right) - Math.max(r.left, b.left);
        const oy = Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top);
        if (ox <= 0 || oy <= 0) return;
        const covered = (ox * oy) / (r.width * r.height);
        hits.push({
          tag: el.tagName,
          txt: (el.textContent || '').trim().slice(0, 46),
          coveredPct: Math.round(covered * 100),
          elTop: Math.round(r.top),
          elBottom: Math.round(r.bottom),
        });
      });

      // Verschachtelte Doppelmeldungen zusammenfassen: gleicher Text = ein Treffer.
      const seen = new Map();
      for (const h of hits) {
        const key = h.txt + '|' + h.elTop;
        const prev = seen.get(key);
        if (!prev || h.coveredPct > prev.coveredPct) seen.set(key, h);
      }

      return {
        banner: {
          top: Math.round(b.top),
          bottom: Math.round(b.bottom),
          left: Math.round(b.left),
          right: Math.round(b.right),
          height: Math.round(b.height),
        },
        viewportH: window.innerHeight,
        bodyPad: getComputedStyle(document.body).paddingBottom,
        cssVar: getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-height').trim(),
        hits: [...seen.values()].sort((a, b2) => b2.coveredPct - a.coveredPct),
      };
    });

    console.log(`\n=== ${vp.tag} (${vp.width}x${vp.height}) ===`);
    console.log('Banner:', JSON.stringify(res.banner), 'bodyPad=' + res.bodyPad, 'var=' + res.cssVar);
    if (!res.hits.length) console.log('  keine Ueberdeckung');
    for (const h of res.hits) {
      console.log(`  ${String(h.coveredPct).padStart(3)}%  <${h.tag}> y${h.elTop}-${h.elBottom}  "${h.txt}"`);
    }
    await ctx.close();
  }
  await browser.close();
})();
