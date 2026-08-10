// Hero-Sonde (Fix-Runde 1): liegt auf Mobil jedes Hero-Element im Fold, und liegt es auf
// dem Foto oder auf Papier? Gegen Raten: jede Box wird mit der Foto-Box verglichen.
const { chromium } = require('playwright-core');
const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }, { width: 430, height: 932 }]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(600);

    const r = await p.evaluate((vh) => {
      const sec = document.querySelector('main > section');
      const img = sec.querySelector('img');
      const ib = img.getBoundingClientRect();
      const pick = (sel) => {
        const el = sec.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { t: Math.round(b.top), b: Math.round(b.bottom), h: Math.round(b.height) };
      };
      const boxes = {
        photo: { t: Math.round(ib.top), b: Math.round(ib.bottom), w: Math.round(ib.width), h: Math.round(ib.height) },
        script: pick('p.font-script'),
        h1: pick('h1'),
        lead: pick('h1 ~ p'),
        pill: pick('a[href="/kontakt#schnupperstunde"]'),
        plan: pick('a[href="/kursplan"]'),
        trust: pick('dl'),
      };
      // Foto-Naturmasse und wieviel object-cover wegschneidet
      const natural = { w: img.naturalWidth, h: img.naturalHeight };
      const boxAR = ib.width / ib.height;
      const natAR = natural.w / natural.h;
      let crop;
      if (natAR > boxAR) {
        const shownW = natural.h * boxAR;
        crop = { axis: 'horizontal', shownFrac: +(shownW / natural.w).toFixed(3) };
      } else {
        const shownH = natural.w / boxAR;
        crop = { axis: 'vertical', shownFrac: +(shownH / natural.h).toFixed(3) };
      }
      return {
        sectionH: Math.round(sec.getBoundingClientRect().height),
        viewportH: vh,
        boxes,
        natural,
        crop,
        srcUsed: img.currentSrc.split('/').pop(),
      };
    }, vp.height);

    console.log(`\n===== ${vp.width}x${vp.height} =====`);
    console.log(`Hero-Sektion h=${r.sectionH}  Bild=${r.srcUsed} natural=${r.natural.w}x${r.natural.h}`);
    console.log(`object-cover schneidet ${r.crop.axis}: sichtbar ${(r.crop.shownFrac * 100).toFixed(1)}% der Datei`);
    const ph = r.boxes.photo;
    for (const [k, v] of Object.entries(r.boxes)) {
      if (!v || k === 'photo') continue;
      const onPhoto = v.t < ph.b && v.b > ph.t;
      const inFold = v.b <= r.viewportH;
      console.log(
        `  ${k.padEnd(7)} y ${String(v.t).padStart(4)}..${String(v.b).padStart(4)}  ${onPhoto ? 'AUF FOTO' : 'auf Papier'}  ${inFold ? 'im Fold' : 'UNTER FOLD'}`,
      );
    }
    console.log(`  photo   y ${ph.t}..${ph.b} (w=${ph.w} h=${ph.h})`);
    await ctx.close();
  }
  await browser.close();
})();
