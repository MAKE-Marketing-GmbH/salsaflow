// R188 final6 / G1: misst den Farbstich (Mittelwert Rot minus Blau) je Offer-Kartenbild.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }));
await p.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 20000 }).catch(() => {});
const out = await p.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll('#angebot img, [id*=angebot] img'));
  const res = [];
  for (const im of imgs) {
    const cv = document.createElement('canvas');
    cv.width = 160; cv.height = 160;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    try { ctx.drawImage(im, 0, 0, 160, 160); } catch { res.push({ src: im.currentSrc, err: 'draw' }); continue; }
    let d;
    try { d = ctx.getImageData(0, 0, 160, 160).data; } catch { res.push({ src: im.currentSrc, err: 'taint' }); continue; }
    let r = 0, g = 0, bl = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; bl += d[i + 2]; n++; }
    res.push({ src: im.currentSrc.split('/').pop(), r: r / n, g: g / n, b: bl / n });
  }
  return res;
});
for (const o of out) {
  if (o.err) { console.log('ERR', o.err, o.src); continue; }
  console.log(`${o.src.padEnd(42)} R=${o.r.toFixed(1)} G=${o.g.toFixed(1)} B=${o.b.toFixed(1)}  R-B=${(o.r - o.b).toFixed(1)}`);
}
await b.close();
