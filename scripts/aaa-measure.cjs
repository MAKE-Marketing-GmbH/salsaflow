// Mess-Skript fuer die Home-Vertikalrhythmik (Kritiker-FAIL d-03/d-09).
// Misst pro <main>-Kind: Sektionshoehe, Abstand von Sektionskante bis zum ersten/letzten
// ECHTEN Inhalt (Text/Media) und daraus das tote Weissraum-Band zwischen zwei Sektionen.
const { chromium } = require('/usr/lib/node_modules/playwright');

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(600);
    const data = await p.evaluate(() => {
      const secs = [...document.querySelectorAll('main > *')];
      function extent(root) {
        let top = Infinity, bot = -Infinity;
        const walk = (el) => {
          for (const c of el.children) {
            const cs = getComputedStyle(c);
            if (cs.display === 'none' || cs.visibility === 'hidden' || c.getAttribute('aria-hidden') === 'true') { continue; }
            const r = c.getBoundingClientRect();
            const hasText = [...c.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            const isMedia = /^(IMG|VIDEO|SVG|CANVAS)$/.test(c.tagName);
            if ((hasText || isMedia) && r.height > 0) { top = Math.min(top, r.top + scrollY); bot = Math.max(bot, r.bottom + scrollY); }
            walk(c);
          }
        };
        walk(root);
        return [top, bot];
      }
      return {
        H: document.body.scrollHeight,
        out: secs.map((s) => {
          const r = s.getBoundingClientRect();
          const [ct, cb] = extent(s);
          return {
            id: s.id || s.tagName + '.' + String(s.className || '').slice(0, 24),
            top: Math.round(r.top + scrollY),
            h: Math.round(r.height),
            padTop: Math.round(ct - (r.top + scrollY)),
            padBot: Math.round(r.bottom + scrollY - cb),
          };
        }),
      };
    });
    console.log('=== ' + w + 'px  total=' + data.H);
    let prev = null;
    for (const s of data.out) {
      const gap = prev ? prev.padBot + s.padTop : s.padTop;
      console.log(
        String(s.id).padEnd(34) + ' y=' + String(s.top).padEnd(6) + ' h=' + String(s.h).padEnd(5) +
        ' padT=' + String(s.padTop).padEnd(4) + ' padB=' + String(s.padBot).padEnd(4) + ' DEADGAP=' + gap,
      );
      prev = s;
    }
  }
  await b.close();
})();
