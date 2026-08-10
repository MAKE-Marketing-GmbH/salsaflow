// Runde r14, Messung statt Augenmass: Welche Bauform hat jede Home-Sektion wirklich?
// Zaehlt je Sektion (a) Kopf-Layout, (b) Zahl der von Haarlinien getrennten Zeilen,
// (c) Flaeche/Ton, (d) Inhaltsbreite vs. Shell. Rein lesend.
// Aufruf: node scripts/aaa-r14-pattern.cjs [breite]
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
    const rows = [];
    for (const sec of [...main.children]) {
      const r = sec.getBoundingClientRect();
      const cs = getComputedStyle(sec);
      const h2 = sec.querySelector('h2');
      // Grid-Container mit >1 Spalte im Kopfbereich?
      let headCols = 1;
      if (h2) {
        let n = h2.parentElement;
        for (let i = 0; i < 4 && n && n !== sec; i++) {
          const g = getComputedStyle(n).gridTemplateColumns;
          if (g && g !== 'none' && g.split(' ').length > 1) { headCols = g.split(' ').length; break; }
          n = n.parentElement;
        }
      }
      // Elemente, die eine sichtbare Haarlinie oben ODER unten tragen (= Zeilen-Bauform).
      let hair = 0;
      for (const el of sec.querySelectorAll('*')) {
        const c = getComputedStyle(el);
        const t = parseFloat(c.borderTopWidth), bo = parseFloat(c.borderBottomWidth);
        const rr = el.getBoundingClientRect();
        if (rr.width > 120 && rr.height > 24 && ((t > 0 && t <= 2) || (bo > 0 && bo <= 2))) hair++;
      }
      // Breiteste Inhaltsspur gegen Viewport (Full-bleed-Erkennung).
      let widest = 0;
      for (const el of sec.querySelectorAll('img, figure, div')) {
        const rr = el.getBoundingClientRect();
        if (rr.height > 60) widest = Math.max(widest, Math.round(rr.width));
      }
      rows.push({
        id: sec.id || sec.tagName.toLowerCase(),
        h: Math.round(r.height),
        bg: cs.backgroundColor,
        headCols,
        hairRows: hair,
        widest,
        bleed: widest >= innerWidth - 2 ? 'FULL' : '',
        imgs: sec.querySelectorAll('img').length,
      });
    }
    return { vw: innerWidth, rows };
  });

  console.log(`viewport ${out.vw}`);
  console.log('id'.padEnd(14), 'h'.padStart(6), 'bg'.padEnd(20), 'headCols'.padStart(9), 'hairRows'.padStart(9), 'widest'.padStart(7), 'imgs'.padStart(5), 'bleed');
  for (const r of out.rows) {
    console.log(
      r.id.padEnd(14), String(r.h).padStart(6), r.bg.padEnd(20),
      String(r.headCols).padStart(9), String(r.hairRows).padStart(9),
      String(r.widest).padStart(7), String(r.imgs).padStart(5), r.bleed,
    );
  }
  await b.close();
})();
