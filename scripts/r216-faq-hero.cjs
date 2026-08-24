// R216: Misst die rechte Haelfte des /faq-Heros auf Ueberschriftenhoehe.
// Befund (Critic 24.08. 00:51): "Rechte Haelfte leer, 96px tote Zone."
// Gemessen wird dieselbe Frage wie in R214 auf der Home: gibt es rechts der
// Seitenmitte ein Ink-Element im Band von der H1-Oberkante bis zum Ende des
// Hero-Textblocks? Der Nachbar-Fix aus R214 ist die Vorlage.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4732';

(async () => {
  const browser = await chromium.launch();
  for (const vp of [
    { tag: '1440x900', width: 1440, height: 900 },
    { tag: '390', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(BASE + '/faq', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1100);

    const r = await page.evaluate(() => {
      const vis = (el) => {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden') return false;
        if (Number(s.opacity) < 0.05) return false;
        const b = el.getBoundingClientRect();
        return b.width > 1 && b.height > 1;
      };
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const hb = h1.getBoundingClientRect();
      const hero = h1.closest('section');
      // Unterkante des Hero-Textblocks = tiefstes Ink-Element im Hero.
      let deepest = hb.bottom;
      let deepestWhat = null;
      hero.querySelectorAll('p, a, button, h1, nav').forEach((el) => {
        if (!vis(el)) return;
        const b = el.getBoundingClientRect();
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasText && el.tagName !== 'NAV') return;
        if (b.bottom > deepest) {
          deepest = b.bottom;
          deepestWhat = (el.textContent || '').trim().slice(0, 30);
        }
      });

      const mid = window.innerWidth / 2;
      const ink = [];
      hero.querySelectorAll('*').forEach((el) => {
        if (!vis(el)) return;
        const b = el.getBoundingClientRect();
        if (b.bottom <= hb.top || b.top >= deepest) return;
        if (b.left < mid) return;
        const s = getComputedStyle(el);
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const isMedia = /^(IMG|SVG|VIDEO|PICTURE)$/.test(el.tagName);
        const painted = s.backgroundImage !== 'none' ||
          (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent');
        if (!hasText && !isMedia && !painted) return;
        ink.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 28), left: Math.round(b.left) });
      });

      // Rechter Rand des breitesten Textelements -> Breite der toten Zone.
      let textRight = 0;
      hero.querySelectorAll('h1, p').forEach((el) => {
        if (!vis(el)) return;
        const b = el.getBoundingClientRect();
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (hasText && b.right > textRight) textRight = b.right;
      });
      const shell = hero.querySelector('div.mx-auto') || hero;
      const shellRight = shell.getBoundingClientRect().right;

      // Media auf der ganzen Seite (Critic: "mediaCount 0").
      const media = [...document.querySelectorAll('main img, section img, main picture, main video')]
        .filter(vis).length;

      return {
        h1Top: Math.round(hb.top),
        h1Bottom: Math.round(hb.bottom),
        heroDeepest: Math.round(deepest),
        deepestWhat,
        bandHoehe: Math.round(deepest - hb.top),
        inkRechts: ink.length,
        inkFirst: ink[0] || null,
        textRight: Math.round(textRight),
        shellRight: Math.round(shellRight),
        toteZone: Math.round(shellRight - textRight),
        mediaAufSeite: media,
      };
    });

    console.log(`\n${vp.tag}:`);
    if (!r) { console.log('  H1 nicht gefunden'); }
    else {
      console.log(`  H1 ${r.h1Top}-${r.h1Bottom}, Hero-Textblock bis ${r.heroDeepest} ("${r.deepestWhat}"), Band ${r.bandHoehe}px`);
      console.log(`  INK RECHTS DER MITTE = ${r.inkRechts}${r.inkRechts === 0 ? '  <<< RECHTE HAELFTE LEER' : ''}`);
      if (r.inkFirst) console.log(`    erstes: <${r.inkFirst.tag}> x=${r.inkFirst.left} "${r.inkFirst.text}"`);
      console.log(`  Text endet bei ${r.textRight}, Shell bei ${r.shellRight} -> TOTE ZONE ${r.toteZone}px`);
      console.log(`  sichtbare Media auf /faq gesamt: ${r.mediaAufSeite}`);
    }
    await ctx.close();
  }
  await browser.close();
})();
