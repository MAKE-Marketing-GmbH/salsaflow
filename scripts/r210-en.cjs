// Englisch pruefen: die Sprache haengt an localStorage, nicht am Pfad. Der englische
// Hinweistext ist kuerzer ("Necessary cookies only." / "Okay") — die Karte wird damit
// schmaler, und die Fold-Texte sind andere. Beides kann die Ueberdeckung veraendern.
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4602';
(async () => {
  const b = await chromium.launch();
  for (const vp of [{t:'m390',width:390,height:844},{t:'d730',width:1440,height:730},{t:'d800',width:1440,height:800}]) {
    const ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height}, deviceScaleFactor:1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('salsaflow-lang','en'); } catch {} });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(1000);
    const r = await p.evaluate(() => {
      const card = document.querySelector('[data-cookie-banner]')?.firstElementChild;
      if (!card) return { none: true };
      const b2 = card.getBoundingClientRect();
      const hits = [];
      document.querySelectorAll('a, button, h1, h2, p, dd, dt, li').forEach((el) => {
        if (card.contains(el)) return;
        let n = el, hidden = false;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) { hidden = true; break; }
          if (n.getAttribute && n.getAttribute('aria-hidden') === 'true') { hidden = true; break; }
          n = n.parentElement;
        }
        if (hidden) return;
        const r2 = el.getBoundingClientRect();
        if (r2.width < 12 || r2.height < 8) return;
        if (r2.bottom <= 0 || r2.top >= window.innerHeight) return;
        const ox = Math.min(r2.right,b2.right)-Math.max(r2.left,b2.left);
        const oy = Math.min(r2.bottom,b2.bottom)-Math.max(r2.top,b2.top);
        if (ox<=0||oy<=0) return;
        const pct = Math.round((ox*oy)/(r2.width*r2.height)*100);
        if (pct < 5) return;
        hits.push(`${pct}% "${(el.textContent||'').trim().slice(0,30)}"`);
      });
      const btn = [...document.querySelectorAll('[data-testid="cookie-accept"]')][0];
      return { box: `${Math.round(b2.left)}..${Math.round(b2.right)}`, label: btn?.textContent?.trim(), hits };
    });
    console.log(`EN ${vp.t}: Karte ${r.box} Knopf="${r.label}" -> ` + (r.hits.length ? 'TREFFER: ' + r.hits.join(' | ') : 'frei'));
    await p.screenshot({ path: `/tmp/r210/en-${vp.t}.png`, caret:'hide' });
    await ctx.close();
  }
  await b.close();
})();
