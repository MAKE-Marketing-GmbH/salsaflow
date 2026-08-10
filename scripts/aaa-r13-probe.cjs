// Runde r13: Overlap-/Clipping-/Ueberlauf-Probe auf Home. Rein lesend.
// Aufruf: node scripts/aaa-r13-probe.cjs [width]
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

  const out = await p.evaluate((VW) => {
    const res = { overlaps: [], hClip: [], vClip: [], offscreen: [], tiny: [] };
    const leaf = [...document.querySelectorAll('main *')].filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      const txt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      return txt;
    });
    const rect = (el) => el.getBoundingClientRect();

    // 1) Text-Boxen die sich gegenseitig ueberdecken (verschiedene Eltern-Zweige)
    for (let i = 0; i < leaf.length; i++) {
      for (let j = i + 1; j < leaf.length; j++) {
        const a = leaf[i], c = leaf[j];
        if (a.contains(c) || c.contains(a)) continue;
        const ra = rect(a), rc = rect(c);
        if (ra.width < 2 || rc.width < 2) continue;
        const ox = Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left);
        const oy = Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top);
        if (ox > 4 && oy > 4) {
          res.overlaps.push({
            a: a.tagName + '.' + (a.className || '').toString().slice(0, 40) + ' :: ' + a.textContent.trim().slice(0, 34),
            b: c.tagName + '.' + (c.className || '').toString().slice(0, 40) + ' :: ' + c.textContent.trim().slice(0, 34),
            ox: Math.round(ox), oy: Math.round(oy),
            y: Math.round(ra.top + scrollY),
          });
        }
      }
    }

    // 2) horizontal abgeschnittener Text (scrollWidth > clientWidth)
    document.querySelectorAll('main *').forEach((el) => {
      if (el.scrollWidth - el.clientWidth > 2 && el.clientWidth > 0) {
        const cs = getComputedStyle(el);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
        res.hClip.push({ sel: el.tagName + '.' + (el.className || '').toString().slice(0, 50), sw: el.scrollWidth, cw: el.clientWidth, t: el.textContent.trim().slice(0, 40) });
      }
      if (el.scrollHeight - el.clientHeight > 2 && el.clientHeight > 0) {
        const cs = getComputedStyle(el);
        if (cs.overflow === 'hidden' && el.children.length === 0 && el.textContent.trim()) {
          res.vClip.push({ sel: el.tagName + '.' + (el.className || '').toString().slice(0, 50), sh: el.scrollHeight, ch: el.clientHeight, t: el.textContent.trim().slice(0, 40) });
        }
      }
    });

    // 3) Elemente die aus dem Viewport ragen
    leaf.forEach((el) => {
      const r = rect(el);
      if (r.left < -2 || r.right > VW + 2) {
        res.offscreen.push({ sel: el.tagName + '.' + (el.className || '').toString().slice(0, 40), l: Math.round(r.left), r: Math.round(r.right), t: el.textContent.trim().slice(0, 34) });
      }
    });

    return res;
  }, W);

  const dedupe = (arr) => { const s = new Set(); return arr.filter((x) => { const k = JSON.stringify(x); if (s.has(k)) return false; s.add(k); return true; }); };
  console.log('WIDTH', W);
  console.log('OVERLAPS', dedupe(out.overlaps).length);
  dedupe(out.overlaps).slice(0, 40).forEach((o) => console.log(' ', JSON.stringify(o)));
  console.log('HCLIP', out.hClip.length);
  dedupe(out.hClip).slice(0, 20).forEach((o) => console.log(' ', JSON.stringify(o)));
  console.log('VCLIP', out.vClip.length);
  dedupe(out.vClip).slice(0, 20).forEach((o) => console.log(' ', JSON.stringify(o)));
  console.log('OFFSCREEN', out.offscreen.length);
  dedupe(out.offscreen).slice(0, 20).forEach((o) => console.log(' ', JSON.stringify(o)));
  await b.close();
})();
