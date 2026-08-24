const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');

const BASE = 'http://127.0.0.1:5175';

// Normalisiert /photos/premium/offer-bachata-800.webp -> premium/offer-bachata
// damit dasselbe Motiv in zwei Groessen als EINE Doublette zaehlt.
function motif(u) {
  try {
    const p = new URL(u, BASE).pathname;
    if (!p.startsWith('/photos/')) return null;
    return p
      .replace(/^\/photos\//, '')
      .replace(/\.(webp|jpg|jpeg|png|avif)$/i, '')
      .replace(/-(\d{3,4})$/, '')      // Groessen-Suffix
      .replace(/-v\d+$/, '');          // Versions-Suffix
  } catch { return null; }
}

async function measure(vw, vh) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: vw, height: vh } });
  await page.goto(`${BASE}/tanzkurse`, { waitUntil: 'networkidle' });
  // alle Reveals ausloesen
  for (let y = 0; y < 8000; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const out = await page.evaluate(() => {
    const R = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }; };
    const eff = (img) => {
      // effektiver Radius: am Bild ODER am naechsten clippenden Vorfahren
      let n = img, hops = 0;
      while (n && hops < 5) {
        const cs = getComputedStyle(n);
        const br = parseFloat(cs.borderTopLeftRadius) || 0;
        const clips = cs.overflow !== 'visible' || n === img;
        if (br > 0 && clips) return { r: br, at: n === img ? 'img' : n.tagName.toLowerCase() };
        n = n.parentElement; hops++;
      }
      return { r: 0, at: 'none' };
    };
    const imgs = [...document.querySelectorAll('main img')];
    const photos = imgs
      .filter((i) => (i.currentSrc || i.src || '').includes('/photos/'))
      .map((i) => ({ src: i.currentSrc || i.src, ...eff(i), rect: R(i) }));

    const heroImg = document.querySelector('main img[src*="kurse-classfreude"], main img[srcset*="kurse-classfreude"]');
    let hero = null;
    if (heroImg) {
      const cs = getComputedStyle(heroImg);
      let wrap = heroImg.parentElement, wr = 0, wrect = null;
      for (let k = 0; k < 4 && wrap; k++) {
        const w = getComputedStyle(wrap);
        const br = parseFloat(w.borderTopLeftRadius) || 0;
        if (br > 0 && w.overflow !== 'visible') { wr = br; wrect = R(wrap); break; }
        wrap = wrap.parentElement;
      }
      hero = {
        imgRadius: cs.borderTopLeftRadius,
        objectPosition: cs.objectPosition,
        imgRect: R(heroImg),
        wrapRadius: wr, wrapRect: wrect,
      };
    }

    const lvl = document.querySelector('#kursaufbau');
    const txt = lvl ? lvl.innerText.replace(/\s+/g, ' ').trim() : '';

    return {
      photos,
      hero,
      level: { words: txt ? txt.split(' ').length : 0, chars: txt.length },
      docW: document.documentElement.scrollWidth,
    };
  });

  await browser.close();
  return out;
}

const args = process.argv.slice(2);
const vw = Number(args[0] || 1440), vh = Number(args[1] || 730);
const m = await measure(vw, vh);

const counts = {};
for (const p of m.photos) { const k = motif(p.src); if (k) counts[k] = (counts[k] || 0) + 1; }
const dupes = Object.entries(counts).filter(([, n]) => n > 1);
const square = m.photos.filter((p) => p.r === 0).map((p) => new URL(p.src, BASE).pathname);

console.log(JSON.stringify({
  vw, docW: m.docW,
  hero: m.hero,
  level: m.level,
  photoCount: m.photos.length,
  squareCount: square.length,
  square,
  dupes,
  motifs: Object.keys(counts).sort(),
}, null, 2));
