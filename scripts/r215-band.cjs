// R215: Wo endet das Fotoband, und was ist im 730er-Fold noch zu sehen?
// Die Bandhoehe wurde gekuerzt, damit 64px Luft ueber dem Band passen, ohne dass
// das Band unter den Fold rutscht (Raphael 24.08.: "Luft, Band schrumpfen").
// Gemessen wird deshalb: Band-Top, Band-Unterkante, sichtbarer Anteil im 730er
// Fenster — und der Bildausschnitt, damit die Kopfreihe nicht angeschnitten ist.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4732';

(async () => {
  const browser = await chromium.launch();
  for (const vp of [
    { tag: '1440x730', width: 1440, height: 730 },
    { tag: '1440x900', width: 1440, height: 900 },
    { tag: '390', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const r = await page.evaluate(() => {
      const img = [...document.querySelectorAll('section img')].find(
        (el) => el.getBoundingClientRect().width > window.innerWidth * 0.9,
      );
      if (!img) return null;
      const b = img.getBoundingClientRect();
      const s = getComputedStyle(img);
      // Welcher Teil des Quellbildes liegt im Fenster? object-position in Prozent
      // plus natuerliche Masse ergeben den sichtbaren Quell-Y-Bereich.
      const natW = img.naturalWidth;
      const natH = img.naturalHeight;
      const scale = b.width / natW; // object-cover, Breite fuellt
      const scaledH = natH * scale;
      const posY = parseFloat(s.objectPosition.split(' ')[1]) || 0;
      const overflow = scaledH - b.height;
      const offset = (overflow * posY) / 100;
      return {
        top: Math.round(b.top),
        bottom: Math.round(b.bottom),
        height: Math.round(b.height),
        visibleInFold: Math.round(Math.min(b.bottom, window.innerHeight) - b.top),
        cutBelowFold: Math.round(Math.max(0, b.bottom - window.innerHeight)),
        natW,
        natH,
        objectPosition: s.objectPosition,
        quellY: `${Math.round(offset / scale)}–${Math.round((offset + b.height) / scale)} von ${natH}`,
      };
    });

    console.log(`\n${vp.tag}:`);
    if (!r) {
      console.log('  Band nicht gefunden');
    } else {
      console.log(
        `  Band top=${r.top} bottom=${r.bottom} hoehe=${r.height}` +
          `  im Fold sichtbar=${r.visibleInFold}` +
          `  unter dem Fold=${r.cutBelowFold}${r.cutBelowFold > 0 ? ' <<< RAGT UNTER DEN FOLD' : ''}`,
      );
      console.log(
        `  Quelle ${r.natW}x${r.natH}, object-position ${r.objectPosition}, sichtbar Quell-Y ${r.quellY}`,
      );
    }
    await ctx.close();
  }
  await browser.close();
})();
