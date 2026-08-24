// R188 final6 / G3+G4: misst das gerenderte Bildfenster (welcher Ausschnitt des Originals sichtbar ist).
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: true, channel: 'chrome' });
for (const vw of [1440, 390]) {
  const c = await b.newContext({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }));
  await p.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 20000 }).catch(() => {});
  const rows = await p.evaluate(() => {
    const want = ['event-party-dreh', 'team-band', 'offer-bachata', 'hp-26'];
    const out = [];
    for (const im of document.querySelectorAll('img')) {
      const src = (im.currentSrc || '').split('/').pop();
      if (!want.some(w => src.includes(w))) continue;
      const r = im.getBoundingClientRect();
      const nw = im.naturalWidth, nh = im.naturalHeight;
      const cs = getComputedStyle(im);
      // object-cover: Skalierung = max(box/nat), sichtbarer Anteil je Achse
      const s = Math.max(r.width / nw, r.height / nh);
      const visW = (r.width / (nw * s)) * 100;   // % der Originalbreite sichtbar
      const visH = (r.height / (nh * s)) * 100;  // % der Originalhoehe sichtbar
      out.push({ src, box: `${Math.round(r.width)}x${Math.round(r.height)}`, nat: `${nw}x${nh}`, pos: cs.objectPosition, visW: visW.toFixed(1), visH: visH.toFixed(1) });
    }
    return out;
  });
  console.log(`\n=== ${vw}px ===`);
  for (const r of rows) console.log(`${r.src.padEnd(38)} box=${r.box.padEnd(11)} nat=${r.nat.padEnd(10)} pos=${r.pos.padEnd(16)} sichtbar B=${r.visW}% H=${r.visH}%`);
  await c.close();
}
await b.close();
