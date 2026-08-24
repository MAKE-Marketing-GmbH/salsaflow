// R213-Nachzieh: Die 40px Luft oben schieben das Band nach unten. Der Crop ist laut
// R159/R187/R190 auf Scheitel (25.1% src) und Schuhe (80.0% src) kalibriert — also
// pruefen, welcher Quellausschnitt im 730er-Fold noch sichtbar ist. Ein Kopf, der
// unter die Fold-Kante rutscht, waere ein selbstgemachter Folgefehler.
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4718';
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ w: 1440, h: 730 }, { w: 1440, h: 900 }, { w: 390, h: 844 }]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await p.goto(BASE + '/team', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1100);
    const r = await p.evaluate(() => {
      const img = [...document.querySelectorAll('main img, section img')]
        .filter((e) => e.getBoundingClientRect().width > window.innerWidth * 0.9)
        .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top)[0];
      if (!img) return null;
      const box = img.getBoundingClientRect();
      const natW = img.naturalWidth, natH = img.naturalHeight;
      // object-cover: Skalierung ist das Maximum beider Achsen.
      const scale = Math.max(box.width / natW, box.height / natH);
      const rendW = natW * scale, rendH = natH * scale;
      const posY = parseFloat(getComputedStyle(img).objectPosition.split(' ')[1]) || 50;
      const overflowY = rendH - box.height;
      const offsetY = overflowY * (posY / 100);
      const srcTop = (offsetY / rendH) * 100;
      const srcBot = ((offsetY + box.height) / rendH) * 100;
      // Wie viel des Bands liegt ueber der Fold-Kante?
      const sichtbar = Math.max(0, Math.min(box.bottom, window.innerHeight) - box.top);
      const srcFold = ((offsetY + sichtbar) / rendH) * 100;
      return {
        bandTop: Math.round(box.top), bandH: Math.round(box.height),
        natW, natH, objectPosition: getComputedStyle(img).objectPosition,
        srcFenster: `${srcTop.toFixed(1)}%..${srcBot.toFixed(1)}%`,
        sichtbarImFold: Math.round(sichtbar),
        srcBisFoldkante: srcFold.toFixed(1) + '%',
      };
    });
    console.log(`\n=== ${vp.w}x${vp.h} ===`);
    console.log(' ', JSON.stringify(r, null, 2).replace(/\n/g, '\n  '));
    await ctx.close();
  }
  await b.close();
})();
