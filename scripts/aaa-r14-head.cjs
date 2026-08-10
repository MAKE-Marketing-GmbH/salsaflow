// Runde r14: Wie sieht der KOPF jeder Sektion aus, und wie sieht der KOERPER aus?
// Ziel: die behauptete "Template-Monotonie" belegen oder widerlegen — mit Zahlen,
// nicht mit Augenmass. Rein lesend.
// Aufruf: node scripts/aaa-r14-head.cjs [breite]
const { chromium } = require('playwright-core');
const W = Number(process.argv[2] || 1440);

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const p = await (await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 })).newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);

  const out = await p.evaluate(() => {
    const main = document.querySelector('main');
    const res = [];
    for (const sec of [...main.children]) {
      const sr = sec.getBoundingClientRect();
      const h2 = sec.querySelector('h2');
      let head = null;
      if (h2) {
        const hr = h2.getBoundingClientRect();
        const hs = getComputedStyle(h2);
        // Steht ein Fliesstext RECHTS daneben (gleiche Zeile) oder DARUNTER?
        let sideLead = false;
        for (const el of sec.querySelectorAll('p')) {
          const pr = el.getBoundingClientRect();
          if (pr.height < 10) continue;
          const vOverlap = Math.min(hr.bottom, pr.bottom) - Math.max(hr.top, pr.top);
          if (vOverlap > 8 && pr.left > hr.right - 40) { sideLead = true; break; }
        }
        head = {
          size: Math.round(parseFloat(hs.fontSize)),
          x: Math.round(hr.left),
          top: Math.round(hr.top + scrollY - sr.top - scrollY),
          w: Math.round(hr.width),
          sideLead,
        };
      }
      // Gleich breite Kacheln nebeneinander (= "Karten-Reihe")?
      const tileRows = [];
      for (const el of sec.querySelectorAll('*')) {
        const g = getComputedStyle(el).gridTemplateColumns;
        if (!g || g === 'none') continue;
        const parts = g.split(' ').filter(Boolean);
        if (parts.length < 3) continue;
        const px = parts.map((v) => Math.round(parseFloat(v)));
        if (px.some((v) => !isFinite(v))) continue;
        const equal = px.every((v) => Math.abs(v - px[0]) < 3);
        const r = el.getBoundingClientRect();
        if (equal && r.height > 90) tileRows.push({ n: px.length, colW: px[0], h: Math.round(r.height) });
      }
      // Eyebrow-Vorkommen (uppercase-Label ueber der Headline)
      let eyebrows = 0;
      for (const el of sec.querySelectorAll('span,p,div')) {
        const c = getComputedStyle(el);
        if (c.textTransform === 'uppercase' && parseFloat(c.letterSpacing) >= 1.4 && el.getBoundingClientRect().height > 6) {
          const txt = (el.textContent || '').trim();
          if (txt && txt.length < 40 && el.children.length <= 1) eyebrows++;
        }
      }
      res.push({ id: sec.id || sec.tagName.toLowerCase(), h: Math.round(sr.height), head, tileRows, eyebrows });
    }
    return res;
  });

  for (const s of out) {
    const h = s.head;
    console.log(
      s.id.padEnd(12),
      'h=' + String(s.h).padStart(5),
      h ? `H2 ${String(h.size).padStart(3)}px x=${String(h.x).padStart(4)} w=${String(h.w).padStart(4)} leadRechts=${h.sideLead ? 'JA ' : 'nein'}` : 'H2 —'.padEnd(44),
      'gleichbreiteKachelreihen=' + (s.tileRows.length ? s.tileRows.map((t) => `${t.n}x${t.colW}px/h${t.h}`).join(',') : '-'),
      'eyebrows=' + s.eyebrows,
    );
  }
  await b.close();
})();
