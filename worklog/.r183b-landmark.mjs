// Kopf-Landmarken exakt messen statt schaetzen.
// Schneidet schmale senkrechte Streifen durch Mann und Frau aus der Quelle und
// speichert sie STARK vergroessert. Diese Streifen sehe ich mit Read an und lese
// Haaransatz und Kinn direkt ab.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const OUT = '/tmp/r183b-landmark';
fs.mkdirSync(OUT, { recursive: true });
const SRC = '/photos/2026/hero-paar-studiowand-hero-2100.webp';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'networkidle' });

const res = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  // Streifen: Mann um x=430, Frau um x=1100 (aus der Vollansicht)
  const strips = [
    { name: 'mann', x: 380, w: 220 },
    { name: 'frau', x: 1000, w: 220 },
  ];
  const out = [];
  for (const s of strips) {
    const c = document.createElement('canvas');
    // 3x vergroessert, mit Lineal alle 25 Quell-px
    const SC = 3;
    c.width = s.w * SC + 70;
    c.height = H * SC;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, s.x, 0, s.w, H, 70, 0, s.w * SC, H * SC);
    // Lineal
    ctx.font = '26px monospace';
    for (let y = 0; y <= H; y += 25) {
      const yy = y * SC;
      const major = y % 100 === 0;
      ctx.strokeStyle = major ? '#00ff00' : '#ff00ff';
      ctx.lineWidth = major ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(70, yy);
      ctx.lineTo(c.width, yy);
      ctx.stroke();
      ctx.fillStyle = major ? '#00ff00' : '#ff00ff';
      ctx.fillText(String(y), 2, yy + 24);
    }
    out.push({ name: s.name, dataUrl: c.toDataURL('image/png') });
  }
  return { W, H, out };
}, SRC);

console.log(`Quelle ${res.W}x${res.H}`);
for (const o of res.out) {
  const f = `${OUT}/${o.name}.png`;
  fs.writeFileSync(f, Buffer.from(o.dataUrl.split(',')[1], 'base64'));
  console.log(`geschrieben ${f}`);
}
await browser.close();
