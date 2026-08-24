// Regressionsprobe: Die Home-Regeln haengen an [data-hero-fold] bzw. section:has(...).
// Diese Probe zeigt, dass andere Routen unberuehrt bleiben — inklusive der beiden, die
// den Hinweis seit R189 selbst unter die Navigation setzen (/kursplan, /events).
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4605';
const ROUTES = ['/', '/tanzkurse', '/kursplan', '/events', '/preise', '/team', '/kontakt'];
(async () => {
  const b = await chromium.launch();
  for (const vp of [{t:'m390',width:390,height:844},{t:'d730',width:1440,height:730}]) {
    for (const route of ROUTES) {
      const ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height}, deviceScaleFactor:1 });
      const p = await ctx.newPage();
      await p.goto(BASE + route, { waitUntil:'networkidle' });
      await p.waitForTimeout(900);
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
          hits.push(`${pct}% "${(el.textContent||'').trim().slice(0,28)}"`);
        });
        return { cardBox: `${Math.round(b2.left)}..${Math.round(b2.right)} y${Math.round(b2.top)}`, hits };
      });
      const status = r.none ? 'kein Hinweis' : (r.hits.length ? 'TREFFER: ' + r.hits.join(' | ') : 'frei');
      console.log(`${vp.t} ${route.padEnd(12)} ${r.cardBox ? r.cardBox.padEnd(18) : ''.padEnd(18)} ${status}`);
      await ctx.close();
    }
  }
  await b.close();
})();
