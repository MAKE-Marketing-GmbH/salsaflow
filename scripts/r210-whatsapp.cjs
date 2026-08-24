// Kritiker-Befund 2: liegt der WhatsApp-Kreis im WIEDERKEHRER-Zustand auf dem
// sekundaeren CTA? Das waere ein Bestandsproblem, kein Fix-Schaden — aber es muss
// gemessen sein, bevor es als solches gemeldet wird. Zusaetzlich der Vergleich zum
// Zustand VOR dem Fix (git stash waere zu invasiv; stattdessen beide Cookie-Zustaende).
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4602';
(async () => {
  const b = await chromium.launch();
  for (const accepted of [true, false]) {
    const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1 });
    if (accepted) await ctx.addInitScript(() => { try { localStorage.setItem('salsaflow-cookie-ok','1'); } catch {} });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const float = [...document.querySelectorAll('a')].filter(a=>{const cs=getComputedStyle(a);return cs.position==='fixed';}).find(a=>/whatsapp/i.test(a.textContent+' '+(a.getAttribute('aria-label')||'')));
      const link = [...document.querySelectorAll('a')].find(a => a.textContent.includes('Schnupperstunde buchen'));
      if (!float || !link) return { missing: !float ? 'float' : 'link' };
      const f = float.getBoundingClientRect(), l = link.getBoundingClientRect();
      const ox = Math.min(f.right,l.right)-Math.max(f.left,l.left);
      const oy = Math.min(f.bottom,l.bottom)-Math.max(f.top,l.top);
      const pct = (ox>0&&oy>0) ? Math.round((ox*oy)/(l.width*l.height)*100) : 0;
      return { floatBox: `x${Math.round(f.left)}-${Math.round(f.right)} y${Math.round(f.top)}-${Math.round(f.bottom)}`,
               linkBox: `x${Math.round(l.left)}-${Math.round(l.right)} y${Math.round(l.top)}-${Math.round(l.bottom)}`, pct };
    });
    console.log(`${accepted ? 'WIEDERKEHRER (kein Hinweis)' : 'ERSTBESUCH (Hinweis sichtbar) '}: Float ${r.floatBox} | Link ${r.linkBox} | Ueberdeckung ${r.pct}%`);
    await ctx.close();
  }
  await b.close();
})();
