// R183 Fix-Runde 2: Wo liegen die Koepfe im GEKLEMMTEN Band (Cookie offen)?
//
// Methode: kein Pixel-Raten. Wir rendern das ECHTE Quellbild in ein Canvas,
// schneiden exakt das Rechteck heraus, das object-cover + object-position bei
// einer gegebenen Bandhoehe zeigen wuerde, und speichern es als PNG.
// Dieses PNG sehe ich mir selbst mit Read an -> Kopf ganz drin oder nicht.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:5175';
const OUT = '/tmp/r183b-crops';
fs.mkdirSync(OUT, { recursive: true });

const SRC = '/photos/2026/hero-paar-studiowand-hero-2100.webp';
const VIEW_W = 1440;

// Kandidaten: [Bandhoehe px, object-position Y in %]
const CASES = [];
for (const bandH of [224, 288, 416]) {
  for (const posY of [0, 10, 20, 30]) CASES.push([bandH, posY]);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VIEW_W, height: 900 } });
await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle' });

const out = await page.evaluate(
  async ({ src, viewW, cases }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    const results = [];
    for (const [bandH, posY] of cases) {
      // object-cover: skaliere so, dass beide Achsen mindestens die Box fuellen.
      const scale = Math.max(viewW / W, bandH / H);
      const dw = W * scale;
      const dh = H * scale;
      // object-position Y: verteilt den Ueberhang (dh - bandH) nach posY%.
      const overflowY = dh - bandH;
      const offsetY = overflowY * (posY / 100);
      const overflowX = dw - viewW;
      const offsetX = overflowX * 0.5; // center

      // Quellrechteck, das sichtbar bleibt
      const sx = offsetX / scale;
      const sy = offsetY / scale;
      const sw = viewW / scale;
      const sh = bandH / scale;

      const c = document.createElement('canvas');
      c.width = viewW;
      c.height = bandH;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, viewW, bandH);
      const dataUrl = c.toDataURL('image/png');
      results.push({
        bandH,
        posY,
        scale: +scale.toFixed(4),
        srcVisibleY: [Math.round(sy), Math.round(sy + sh)],
        srcHeightPct: +((sh / H) * 100).toFixed(1),
        stretch: +((viewW / bandH) / (W / H)).toFixed(3),
        dataUrl,
      });
    }
    return { W, H, results };
  },
  { src: SRC, viewW: VIEW_W, cases: CASES },
);

console.log(`QUELLE ${SRC}  ${out.W}x${out.H}  (Verhaeltnis ${(out.W / out.H).toFixed(3)})`);
console.log('band  pos   sichtbar-in-Quelle-y   %Quellhoehe  Streckung  datei');
for (const r of out.results) {
  const f = `${OUT}/band${r.bandH}-pos${r.posY}.png`;
  fs.writeFileSync(f, Buffer.from(r.dataUrl.split(',')[1], 'base64'));
  console.log(
    `${String(r.bandH).padStart(4)}  ${String(r.posY).padStart(3)}%  ` +
      `${String(r.srcVisibleY[0]).padStart(4)}-${String(r.srcVisibleY[1]).padEnd(4)}  ` +
      `${String(r.srcHeightPct).padStart(6)}%   ${String(r.stretch).padStart(6)}   ${f}`,
  );
}

await browser.close();
