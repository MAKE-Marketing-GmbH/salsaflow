// Seiten-Sweep: Overflow, Touch-Ziele, FAB, Bild-Crops. Rein lesend.
// Aufruf: node scripts/aaa-sweep4.cjs [/pfad1 /pfad2 ...] (Default: Runde-11-Seiten)
const { chromium } = require('playwright-core');
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/privatstunden', '/events', '/mehr/partys', '/mehr/collabs'];

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    for (const path of PAGES) {
      const p = await ctx.newPage();
      await p.goto('http://localhost:5173' + path, { waitUntil: 'networkidle' });
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
      await p.evaluate(async () => {
        document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
        const H = document.body.scrollHeight;
        for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await p.waitForTimeout(500);
      const data = await p.evaluate(() => {
        const W = document.documentElement.clientWidth;
        // 1) Overflow: wer ragt raus?
        const over = [];
        if (document.documentElement.scrollWidth > W + 1) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && (r.right > W + 1 || r.left < -1)) {
              const cs = getComputedStyle(el);
              if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
              let parentScrolls = false;
              for (let a = el.parentElement; a; a = a.parentElement) {
                const acs = getComputedStyle(a);
                if (acs.overflowX === 'auto' || acs.overflowX === 'scroll' || acs.overflowX === 'hidden') { parentScrolls = true; break; }
              }
              if (parentScrolls) continue;
              over.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), l: Math.round(r.left), r: Math.round(r.right) });
              if (over.length > 8) break;
            }
          }
        }
        // 2) Touch: interaktive Elemente < 44px (sichtbar)
        const touch = [];
        for (const el of document.querySelectorAll('a,button,[role="button"],input,select')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') continue;
          if (r.height < 43 || r.width < 43) {
            const txt = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30);
            touch.push({ tag: el.tagName, txt, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY) });
          }
        }
        // 3) FAB / fixed Elemente
        const fixed = [];
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' && el.getBoundingClientRect().height > 0) {
            const r = el.getBoundingClientRect();
            fixed.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), y: Math.round(r.top), x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) });
          }
        }
        // 4) Bilder: src + objectPosition (Kopf-Check via Screenshot)
        const imgs = [];
        for (const el of document.querySelectorAll('img')) {
          const r = el.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) continue;
          imgs.push({ src: (el.currentSrc || el.src).split('/').pop().slice(0, 40), pos: getComputedStyle(el).objectPosition, fit: getComputedStyle(el).objectFit, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY) });
        }
        return { sw: document.documentElement.scrollWidth, cw: W, over, touch, fixed, imgs, H: document.body.scrollHeight };
      });
      console.log(`\n===== ${path} @ ${w}px  scrollW=${data.sw}/${data.cw} totalH=${data.H}`);
      if (data.over.length) { console.log('OVERFLOW:'); data.over.forEach((o) => console.log(`  ${o.tag}.${o.cls} l=${o.l} r=${o.r}`)); }
      if (data.touch.length) { console.log('TOUCH<43:'); data.touch.forEach((t) => console.log(`  ${t.tag} "${t.txt}" ${t.w}x${t.h} y=${t.y}`)); }
      console.log('FIXED:'); data.fixed.forEach((f) => console.log(`  ${f.tag}.${f.cls} x=${f.x} y=${f.y} ${f.w}x${f.h}`));
      console.log('IMGS:'); data.imgs.forEach((i) => console.log(`  ${i.src} fit=${i.fit} pos=${i.pos} ${i.w}x${i.h} y=${i.y}`));
      await p.screenshot({ path: `/tmp/sweep4-${path.replace(/\//g, '_')}-${w}.png`, fullPage: true });
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
})();
