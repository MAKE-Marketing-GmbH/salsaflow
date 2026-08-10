// Runde r13: Kante Team -> PriceSignal ansehen + Ueberlauf-Verursacher finden. Rein lesend.
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = process.argv[3] || '/tmp/r13';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);

  const info = await p.evaluate(() => {
    const team = document.querySelector('#team');
    const tr = team.getBoundingClientRect();
    const secBot = tr.bottom + scrollY;
    const over = [];
    team.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const hasInk = el.tagName === 'IMG' || el.tagName === 'SVG'
        || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasInk) return;
      const r = el.getBoundingClientRect();
      const bot = r.bottom + scrollY;
      if (bot > secBot - 1) {
        over.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 80), bot: Math.round(bot), over: Math.round(bot - secBot), t: el.textContent.trim().slice(0, 40) });
      }
    });
    return { secBot: Math.round(secBot), over };
  });
  console.log(JSON.stringify(info, null, 1));

  const clip = await p.evaluate(() => {
    const t = document.querySelector('#team').getBoundingClientRect();
    return { y: Math.round(t.bottom + scrollY - 220), h: 560 };
  });
  await p.screenshot({ path: `${OUT}/${TAG}-edge-team-preis.png`, fullPage: true, clip: { x: 0, y: clip.y, width: 1440, height: clip.h } });
  console.log('shot', JSON.stringify(clip));
  await b.close();
})();
