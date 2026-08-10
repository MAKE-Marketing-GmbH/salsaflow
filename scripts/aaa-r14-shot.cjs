// Runde r14: Home Desktop-Full + Mobile-Full + Sektionsraster. Rein lesend.
// Aufruf: node scripts/aaa-r14-shot.cjs <tag> [outdir]
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = process.argv[3] || '/tmp/aaa-r14';
fs.mkdirSync(OUT, { recursive: true });

async function shoot(b, { w, h, label }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({
    content:
      '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}',
  });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => {
      i.loading = 'eager';
    });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);

  const secs = await p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    return [...main.children].map((el, i) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        i,
        id: el.id || el.tagName.toLowerCase(),
        bg: cs.backgroundColor,
        top: Math.round(r.top + scrollY),
        h: Math.round(r.height),
      };
    });
  });
  console.log(`--- ${label} (${w}x${h}) ---`);
  console.log(JSON.stringify(secs));

  const H = await p.evaluate(() => document.body.scrollHeight);
  // Full page in Kacheln, damit nichts an Chrome-Limits scheitert.
  const TILE = 4000;
  let n = 0;
  for (let y = 0; y < H; y += TILE) {
    const hh = Math.min(TILE, H - y);
    await p.screenshot({
      path: `${OUT}/${TAG}-${label}-${String(n).padStart(2, '0')}.png`,
      fullPage: true,
      clip: { x: 0, y, width: w, height: hh },
    });
    n++;
  }
  console.log(`${label}: total=${H}px, tiles=${n}`);
  await ctx.close();
}

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  await shoot(b, { w: 1440, h: 900, label: 'd' });
  await shoot(b, { w: 390, h: 844, label: 'm' });
  await b.close();
})();
