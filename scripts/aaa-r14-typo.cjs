// Runde r14: Typo-Leiter je Sektion (Eyebrow -> H2 -> Lead -> Body) und die laengsten
// Fliesstext-Bloecke (fuer den Mobil-Dichte-Befund). Rein lesend.
// Aufruf: node scripts/aaa-r14-typo.cjs [breite]
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
    const secs = [];
    const longest = [];
    for (const sec of [...main.children]) {
      const id = sec.id || sec.tagName.toLowerCase();
      const h2 = sec.querySelector('h2');
      const h2px = h2 ? Math.round(parseFloat(getComputedStyle(h2).fontSize)) : 0;
      // Erster echter Absatz nach der H2 = Lead.
      let leadPx = 0, leadChars = 0;
      const ps = [...sec.querySelectorAll('p')].filter((el) => (el.textContent || '').trim().length > 30);
      if (ps.length) {
        leadPx = Math.round(parseFloat(getComputedStyle(ps[0]).fontSize));
        leadChars = (ps[0].textContent || '').trim().length;
      }
      // Eyebrow = uppercase-Label mit Tracking.
      let eyePx = 0;
      for (const el of sec.querySelectorAll('span,p,div')) {
        const c = getComputedStyle(el);
        if (c.textTransform === 'uppercase' && parseFloat(c.letterSpacing) >= 1.4) {
          const t = (el.textContent || '').trim();
          if (t && t.length < 40) { eyePx = Math.round(parseFloat(c.fontSize)); break; }
        }
      }
      // Alle Fliesstextbloecke der Sektion (fuer Dichte).
      for (const el of ps) {
        const r = el.getBoundingClientRect();
        const chars = (el.textContent || '').trim().length;
        if (chars >= 120) longest.push({ id, chars, h: Math.round(r.height), text: (el.textContent || '').trim().slice(0, 60) });
      }
      const totalChars = ps.reduce((a, el) => a + (el.textContent || '').trim().length, 0);
      secs.push({ id, eyePx, h2px, leadPx, leadChars, totalChars, h: Math.round(sec.getBoundingClientRect().height) });
    }
    longest.sort((a, b) => b.chars - a.chars);
    return { secs, longest: longest.slice(0, 12) };
  });

  console.log(`--- Typo-Leiter @${W} (eyebrow / H2 / lead) ---`);
  for (const s of out.secs) {
    const step = s.h2px && s.leadPx ? (s.h2px / s.leadPx).toFixed(2) : '-';
    console.log(
      s.id.padEnd(12),
      'eyebrow=' + String(s.eyePx).padStart(2),
      'H2=' + String(s.h2px).padStart(3),
      'lead=' + String(s.leadPx).padStart(2),
      'H2/lead=' + String(step).padStart(5),
      'textChars=' + String(s.totalChars).padStart(5),
      'sekH=' + String(s.h).padStart(5),
    );
  }
  console.log(`\n--- Laengste Fliesstext-Bloecke @${W} ---`);
  for (const l of out.longest) {
    console.log(String(l.chars).padStart(4) + ' Zeichen  ' + String(l.h).padStart(4) + 'px  ' + l.id.padEnd(12) + '  "' + l.text + '..."');
  }
  await b.close();
})();
