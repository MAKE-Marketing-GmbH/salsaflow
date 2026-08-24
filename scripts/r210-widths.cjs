// Zwischenbreiten: Der Desktop-Teil des Fix greift erst ab lg (1024px). Genau unterhalb
// davon ist der Hero noch einspaltig, aber die Mobil-Regel (< 40rem = 640px) gilt auch
// nicht mehr. Diese Luecke 640..1023 muss geprueft sein, sonst ist "frei" nur fuer die
// drei gemessenen Breiten wahr.
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4605';
const CASES = [
  [360,740],[390,844],[430,932],          // Mobil
  [640,800],[768,1024],[820,1180],[900,700], // Tablet / Zwischenraum
  [1024,700],[1024,800],[1180,720],       // knapp ab lg
  [1280,720],[1440,730],[1600,800],[1920,900],
  [844,390],[932,430],                    // Querformat-Mobil
];
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  for (const [w,h] of CASES) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const card = document.querySelector('[data-cookie-banner]')?.firstElementChild;
      if (!card) return { none:true };
      const b2 = card.getBoundingClientRect();
      const hits = [];
      document.querySelectorAll('a, button, h1, h2, p, dd, dt, li').forEach((el) => {
        if (card.contains(el)) return;
        let n = el, hidden = false;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.05) { hidden=true; break; }
          if (n.getAttribute && n.getAttribute('aria-hidden')==='true') { hidden=true; break; }
          n = n.parentElement;
        }
        if (hidden) return;
        const r2 = el.getBoundingClientRect();
        if (r2.width<12||r2.height<8) return;
        if (r2.bottom<=0||r2.top>=window.innerHeight) return;
        const ox = Math.min(r2.right,b2.right)-Math.max(r2.left,b2.left);
        const oy = Math.min(r2.bottom,b2.bottom)-Math.max(r2.top,b2.top);
        if (ox<=0||oy<=0) return;
        const pct = Math.round((ox*oy)/(r2.width*r2.height)*100);
        if (pct < 5) return;
        hits.push(`${pct}% "${(el.textContent||'').trim().slice(0,26)}"`);
      });
      const btn = document.querySelector('[data-testid="cookie-accept"]').getBoundingClientRect();
      return { hits, cardCut: Math.round(b2.bottom) > window.innerHeight,
               btnOut: Math.round(btn.bottom) > window.innerHeight || Math.round(btn.right) > window.innerWidth };
    });
    const problems = [];
    if (r.hits && r.hits.length) problems.push('VERDECKT: ' + r.hits.join(' | '));
    if (r.cardCut) problems.push('KARTE ANGESCHNITTEN');
    if (r.btnOut) problems.push('KNOPF AUSSERHALB');
    if (problems.length) bad++;
    console.log(`${String(w).padStart(4)}x${String(h).padEnd(4)} ${problems.length ? problems.join(' + ') : 'frei'}`);
    await ctx.close();
  }
  console.log(`\n${bad === 0 ? 'ALLE ' + CASES.length + ' Kombinationen frei' : bad + ' von ' + CASES.length + ' mit Problem'}`);
  await b.close();
})();
