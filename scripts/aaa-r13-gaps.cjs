// Runde r13: Sektionsrhythmus + Totraum je Sektion messen. Rein lesend.
const { chromium } = require('playwright-core');
const W = Number(process.argv[2] || 1440);

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
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

  const rows = await p.evaluate(() => {
    const main = document.querySelector('main');
    // sichtbares Rechteck: an jedem overflow-hidden Vorfahren beschneiden,
    // sonst zaehlen object-cover-Crops als Ueberlauf (falsch positiv).
    const clipped = (el) => {
      let r = el.getBoundingClientRect();
      let box = { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflow === 'visible' && cs.overflowY === 'visible' && cs.overflowX === 'visible') continue;
        const ar = a.getBoundingClientRect();
        box.top = Math.max(box.top, ar.top);
        box.bottom = Math.min(box.bottom, ar.bottom);
        box.left = Math.max(box.left, ar.left);
        box.right = Math.min(box.right, ar.right);
      }
      return box;
    };
    const inkTop = (root) => {
      let min = Infinity, max = -Infinity;
      root.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;
        const hasInk = el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'VIDEO'
          || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasInk) return;
        const r = clipped(el);
        if (r.bottom - r.top < 1 || r.right - r.left < 1) return;
        min = Math.min(min, r.top + scrollY);
        max = Math.max(max, r.bottom + scrollY);
      });
      return [min, max];
    };
    return [...main.children].map((el, i) => {
      const r = el.getBoundingClientRect();
      const [it, ib] = inkTop(el);
      return {
        i, id: el.id || '(kein id)',
        top: Math.round(r.top + scrollY), bot: Math.round(r.bottom + scrollY), h: Math.round(r.height),
        padTop: Math.round(it - (r.top + scrollY)), padBot: Math.round((r.bottom + scrollY) - ib),
        inkTop: Math.round(it), inkBot: Math.round(ib),
      };
    });
  });

  console.log('WIDTH', W);
  console.log('idx  id            hoehe  padTop padBot | Luecke zur naechsten Sektion (Ink->Ink)');
  rows.forEach((s, k) => {
    const next = rows[k + 1];
    const gap = next ? next.inkTop - s.inkBot : null;
    console.log(
      String(s.i).padEnd(4),
      s.id.padEnd(14),
      String(s.h).padEnd(6),
      String(s.padTop).padEnd(6),
      String(s.padBot).padEnd(6),
      '|',
      gap === null ? '-' : gap,
    );
  });

  // Totraum: groesste vertikale Luecke INNERHALB jeder Sektion (nur Spalten-Ebene)
  const dead = await p.evaluate(() => {
    const main = document.querySelector('main');
    const out = [];
    [...main.children].forEach((sec, i) => {
      const sr = sec.getBoundingClientRect();
      // Grid-/Flex-Spalten finden
      sec.querySelectorAll('*').forEach((g) => {
        const cs = getComputedStyle(g);
        if (cs.display !== 'grid' && cs.display !== 'flex') return;
        const kids = [...g.children].filter((c) => c.getBoundingClientRect().height > 40);
        if (kids.length < 2) return;
        const rows2 = kids.map((c) => c.getBoundingClientRect());
        const gh = g.getBoundingClientRect().height;
        rows2.forEach((r, n) => {
          const slack = gh - r.height;
          if (slack > 180 && r.height > 60) {
            out.push({
              sec: i, id: sec.id || '', child: n,
              childH: Math.round(r.height), gridH: Math.round(gh), slack: Math.round(slack),
              cls: (kids[n].className || '').toString().slice(0, 60),
              t: kids[n].textContent.trim().slice(0, 40),
            });
          }
        });
      });
    });
    return out;
  });
  console.log('\nSPALTEN-TOTRAUM (Kind deutlich kuerzer als Grid):');
  const seen = new Set();
  dead.filter((d) => { const k = d.sec + '|' + d.child + '|' + d.childH; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.slack - a.slack).slice(0, 12)
    .forEach((d) => console.log(' ', JSON.stringify(d)));
  await b.close();
})();
