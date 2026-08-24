// R183 Fix-Runde 3 — Sol-Befund messen, nicht glauben:
// "Der /schnupperstunde-CTA ist im Fold geloescht; der Header-Button liegt auf
//  Mobil hinter dem Burger-Menue."
// Gemessen wird: Ist auf 390px ein /schnupperstunde-Ziel SICHTBAR (ohne Klick)?
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const b = await chromium.launch();

for (const [name, vw, vh] of [['desktop', 1440, 730], ['mobile', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(600);

  // Alle Links auf /schnupperstunde, plus ob sie OHNE Interaktion sichtbar sind.
  const links = await p.$$eval('a[href="/schnupperstunde"]', (as) =>
    as.map((a) => {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      const inHeader = !!a.closest('header');
      const inMobileNav = !!a.closest('#mobile-navigation');
      return {
        text: (a.textContent || '').trim().slice(0, 40),
        inHeader,
        inMobileNav,
        display: cs.display,
        visibility: cs.visibility,
        w: Math.round(r.width),
        h: Math.round(r.height),
        y: Math.round(r.top),
        // sichtbar = hat Flaeche, ist nicht display:none/hidden
        rendered: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden',
      };
    }),
  );
  const visible = links.filter((l) => l.rendered);
  const inFold = visible.filter((l) => l.y >= 0 && l.y < vh);
  console.log(`\n[${name} ${vw}x${vh}] /schnupperstunde-Links total=${links.length} sichtbar=${visible.length} davon im Fold=${inFold.length}`);
  for (const l of links) {
    console.log(`   ${l.rendered ? 'SICHTBAR' : 'VERSTECKT'} y=${l.y} ${l.w}x${l.h} display=${l.display} header=${l.inHeader} mobileNav=${l.inMobileNav} "${l.text}"`);
  }
  await ctx.close();
}
await b.close();
