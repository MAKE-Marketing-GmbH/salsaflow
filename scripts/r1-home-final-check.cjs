// Abschlusspruefung Startseite (Fix-Runde 1):
//  1. kein Bild doppelt auf DIESER Seite (DESIGN.md "Kein Bild auf derselben Seite doppelt")
//  2. Foto-Rhythmus: keine drei Sektionen ohne Bild in Folge
//  3. Seitenhoehe / Sektionshoehen
//  4. Kontrast der Hero-Overlay-Typo gegen das echte gerenderte Pixel darunter
const { chromium } = require('playwright-core');
const BASE = 'http://localhost:5173';

const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // ---- Desktop: Duplikate + Rhythmus
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(600);

  const r = await p.evaluate(() => {
    const srcs = Array.from(document.querySelectorAll('main img')).map((i) => i.currentSrc || i.src);
    const counts = {};
    srcs.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    const dupes = Object.entries(counts).filter(([, n]) => n > 1).map(([s, n]) => `${s.split('/').slice(-2).join('/')} x${n}`);
    const sections = Array.from(document.querySelectorAll('main > section')).map((s, i) => ({
      id: s.id || `#${i}`,
      h: Math.round(s.getBoundingClientRect().height),
      imgs: s.querySelectorAll('img').length,
    }));
    return { total: srcs.length, unique: Object.keys(counts).length, dupes, sections, pageH: document.body.scrollHeight };
  });

  console.log('=== DESKTOP 1440 ===');
  console.log(`Seitenhoehe ${r.pageH}px, ${r.total} Bilder, ${r.unique} verschiedene`);
  console.log(r.dupes.length ? `DOPPELT: ${r.dupes.join(', ')}` : 'Kein Bild doppelt auf der Seite.');
  let run = 0, worst = 0;
  r.sections.forEach((s) => { run = s.imgs === 0 ? run + 1 : 0; worst = Math.max(worst, run); });
  console.log(`Laengste Strecke ohne Foto: ${worst} Sektionen in Folge`);
  r.sections.forEach((s) => console.log(`  ${s.id.padEnd(12)} h=${String(s.h).padStart(5)}  imgs=${s.imgs}`));
  await ctx.close();

  // ---- Mobil: Kontrast der Overlay-Typo gegen das echte Pixel darunter
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 });
  await p2.waitForTimeout(700);

  const probes = await p2.evaluate(() => {
    const sec = document.querySelector('main > section');
    const out = {};
    for (const [k, sel] of [['script', 'p.font-script'], ['h1', 'h1']]) {
      const el = sec.querySelector(sel);
      const b = el.getBoundingClientRect();
      out[k] = {
        color: getComputedStyle(el).color,
        // Messpunkte links/mitte/rechts auf der Textmittellinie
        pts: [0.15, 0.5, 0.85].map((f) => [Math.round(b.left + b.width * f), Math.round(b.top + b.height / 2)]),
      };
    }
    return out;
  });

  // Text unsichtbar schalten und die Hintergrundpixel messen (sonst misst man die Schrift selbst)
  await p2.evaluate(() => {
    const sec = document.querySelector('main > section');
    sec.querySelectorAll('p.font-script, h1').forEach((e) => { e.style.visibility = 'hidden'; });
  });
  await p2.waitForTimeout(200);
  const shot = await p2.screenshot();
  const sharp = require('sharp');
  const img = sharp(shot);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const px = ([x, y]) => {
    const o = (y * info.width + x) * info.channels;
    return [data[o], data[o + 1], data[o + 2]];
  };

  console.log('\n=== MOBIL 390: Kontrast Overlay-Typo auf dem Foto ===');
  for (const [k, v] of Object.entries(probes)) {
    const fg = v.color.match(/\d+/g).slice(0, 3).map(Number);
    const rs = v.pts.map((pt) => ratio(fg, px(pt)));
    const min = Math.min(...rs);
    console.log(`  ${k.padEnd(7)} ${v.color} -> Kontrast min ${min.toFixed(2)}:1  ${min >= 4.5 ? 'OK (AA)' : min >= 3 ? 'nur fuer Grosstext' : 'ZU NIEDRIG'}  [${rs.map((x) => x.toFixed(1)).join(', ')}]`);
  }
  await browser.close();
})();
