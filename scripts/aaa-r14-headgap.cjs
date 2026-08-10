// Runde r14: Innenabstaende im Sektionskopf (Eyebrow -> H2 -> Lead -> erster Inhalt).
// Belegt oder widerlegt den Befund "Mittel-Sektionen: Abstaende enger, Stufung klarer".
// Rein lesend. Aufruf: node scripts/aaa-r14-headgap.cjs [breite]
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
      const id = sec.id || sec.tagName.toLowerCase();
      const sr = sec.getBoundingClientRect();
      const abs = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + scrollY, bot: r.bottom + scrollY, h: r.height };
      };
      const secTop = sr.top + scrollY;
      const h2 = sec.querySelector('h2');
      if (!h2) { res.push({ id, note: 'keine H2' }); continue; }
      const H = abs(h2);
      // Eyebrow: uppercase-Label OBERHALB der H2
      let eye = null;
      for (const el of sec.querySelectorAll('span,p,div')) {
        const c = getComputedStyle(el);
        if (c.textTransform !== 'uppercase' || parseFloat(c.letterSpacing) < 1.4) continue;
        const t = (el.textContent || '').trim();
        if (!t || t.length > 40) continue;
        const a = abs(el);
        if (a.bot <= H.top + 4) { eye = a; break; }
      }
      // Lead: erster laengerer Absatz, dessen Oberkante unter der H2-Oberkante liegt
      let lead = null;
      for (const el of sec.querySelectorAll('p')) {
        if ((el.textContent || '').trim().length < 40) continue;
        const a = abs(el);
        if (a.top >= H.bot - 4) { lead = a; break; }
        if (a.top > H.top && a.top < H.bot) { lead = a; break; } // Lead rechts daneben
      }
      res.push({
        id,
        padTop: Math.round(H.top - secTop),
        eyeToH2: eye ? Math.round(H.top - eye.bot) : null,
        h2ToLead: lead ? Math.round(lead.top - H.bot) : null,
        h2h: Math.round(H.h),
      });
    }
    return res;
  });

  console.log(`--- Kopf-Innenabstaende @${W} ---`);
  for (const r of out) {
    if (r.note) { console.log(r.id.padEnd(12), r.note); continue; }
    console.log(
      r.id.padEnd(12),
      'sektionskopf->H2=' + String(r.padTop).padStart(4),
      'eyebrow->H2=' + String(r.eyeToH2 === null ? '-' : r.eyeToH2).padStart(4),
      'H2->lead=' + String(r.h2ToLead === null ? '-' : r.h2ToLead).padStart(4),
      'H2hoehe=' + String(r.h2h).padStart(4),
    );
  }
  await b.close();
})();
