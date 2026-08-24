// R183 Fix-Runde 2 — Acceptance-Beweis.
// Rechnet die Kopf-Landmarken durch die echte object-fit-Geometrie des gerenderten
// <img> und prueft in JEDEM der vier Zustaende, ob beide Koepfe komplett im Band liegen.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:5175';
const OUT = '/tmp/r183b-shots';
fs.mkdirSync(OUT, { recursive: true });

// Am Lineal abgelesen (/tmp/r183b-landmark/*.png), Quelle 2100x900:
const LM = { mannHaar: 115, mannKinn: 495, frauHaar: 285, frauKinn: 525 };
const HEAD_TOP = Math.min(LM.mannHaar, LM.frauHaar);
const HEAD_BOT = Math.max(LM.mannKinn, LM.frauKinn);
const TANZKURSE_HERO = 'kurse-classfreude-hero-2100.webp';

let pass = 0;
let fail = 0;
const ok = (c, msg) => {
  if (c) { pass++; console.log(`PASS ${msg}`); }
  else { fail++; console.log(`FAIL ${msg}`); }
};

const browser = await chromium.launch();

for (const [name, w, h, accept] of [
  ['desktop-cookie-offen', 1440, 730, false],
  ['desktop', 1440, 730, true],
  ['mobile-cookie-offen', 390, 844, false],
  ['mobile', 390, 844, true],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.waitForFunction(
    () => document.querySelectorAll('#kursplan-list button, #kursplan-list a').length > 3,
    { timeout: 20000 },
  ).catch(() => {});
  if (accept) {
    const btn = await page.$('[data-testid=cookie-accept]');
    if (btn) { await btn.click(); await page.waitForTimeout(800); }
  }

  const m = await page.evaluate(() => {
    const img = document.querySelector('[data-schedule-hero-photo] img');
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const accept = document.querySelector('[data-testid=cookie-accept]');
    let banner = accept;
    while (banner && banner !== document.body) {
      const br = banner.getBoundingClientRect();
      if (br.width > window.innerWidth * 0.5) break;
      banner = banner.parentElement;
    }
    const br = banner ? banner.getBoundingClientRect() : null;
    const arrows = [...document.querySelectorAll('#kursplan-list button')]
      .filter((b) => /woche|week/i.test(b.getAttribute('aria-label') || ''))
      .map((b) => Math.round(b.getBoundingClientRect().bottom));
    // Regel 062: H1 und Intro duerfen nicht hinter der schwebenden Nav-Pille liegen.
    const hdr = document.querySelector('header');
    const pill = hdr ? hdr.querySelector('nav') || hdr : null;
    const pillBottom = pill ? Math.round(pill.getBoundingClientRect().bottom) : null;
    const h1Top = Math.round(document.querySelector('[data-schedule-hero] h1').getBoundingClientRect().top);
    const pTop = Math.round(document.querySelector('[data-schedule-hero] p').getBoundingClientRect().top);
    // Bedienbarkeit
    const staffel = [...document.querySelectorAll('#kursplan-list button')]
      .filter((b) => /staffel|term/i.test(b.textContent || '')).length;
    const tage = [...document.querySelectorAll('#kursplan-list button')]
      .filter((b) => /^(Mo|Di|Mi|Do|Fr|Sa|So|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test((b.textContent || '').trim())).length;
    return {
      src: img.getAttribute('src'),
      y: Math.round(r.top), h: Math.round(r.height), bottom: Math.round(r.bottom),
      nw: img.naturalWidth, nh: img.naturalHeight,
      objPos: cs.objectPosition, cssH: cs.height,
      bannerTop: br ? Math.round(br.top) : null,
      arrowBottom: arrows.length ? Math.max(...arrows) : null,
      staffel, tage, pillBottom, h1Top, pTop,
      ctas: [...document.querySelectorAll('[data-schedule-hero] a')].filter((a) => /schnupper/i.test(a.textContent || '')).length,
      headerCta: [...document.querySelectorAll('header a')].filter((a) => /schnupper/i.test(a.textContent || '')).length,
      vw: window.innerWidth,
    };
  });

  // object-cover Geometrie nachrechnen
  const scale = Math.max(m.vw / m.nw, m.h / m.nh);
  const overflowY = m.nh * scale - m.h;
  const posY = parseFloat((m.objPos.split(' ')[1] || '50%')) / 100;
  const offY = overflowY * posY;
  const visTop = offY / scale;
  const visBot = (offY + m.h) / scale;
  const luftOben = (HEAD_TOP - visTop) * scale;
  const luftUnten = (visBot - HEAD_BOT) * scale;
  const stretch = (m.vw / m.h) / (m.nw / m.nh);

  console.log(`\n=== ${name} (${w}x${h}) ===`);
  console.log(`src=${m.src}`);
  console.log(`Band y=${m.y} h=${m.h} bottom=${m.bottom} | css ${m.cssH} | object-position ${m.objPos} | natural ${m.nw}x${m.nh}`);
  console.log(`sichtbar in Quelle y ${visTop.toFixed(0)}..${visBot.toFixed(0)} | Luft ueber Mann-Haar ${luftOben.toFixed(0)}px | Luft unter Frau-Kinn ${luftUnten.toFixed(0)}px`);
  console.log(`Streckung ${stretch.toFixed(3)} | Pfeile bottom=${m.arrowBottom} Cookie top=${m.bannerTop}`);

  // >=4px statt >=0: liegt eine Landmarke exakt auf der Kante, liest sich das
  // wie ein Schnitt. Gefordert ist sichtbare Luft.
  ok(luftOben >= 4, `[${name}] Mann-Haaransatz mit Luft im Band (${luftOben.toFixed(0)}px >= 4)`);
  ok(luftUnten >= 4, `[${name}] Frau-Kinn mit Luft im Band (${luftUnten.toFixed(0)}px >= 4)`);
  ok(stretch < 2.2, `[${name}] Streckung < 2.2 (ist ${stretch.toFixed(3)})`);
  ok(!m.src.includes(TANZKURSE_HERO), `[${name}] Motiv != Tanzkurse-Hero`);
  ok(m.staffel >= 1, `[${name}] Staffel-Wahl bedienbar (${m.staffel})`);
  ok(m.tage >= 5, `[${name}] Wochentage bedienbar (${m.tage})`);
  ok(m.ctas === 0, `[${name}] kein Doppel-CTA im Hero (${m.ctas})`);
  ok(m.headerCta >= 1, `[${name}] Schnupperstunde via Header erreichbar (${m.headerCta})`);
  if (m.pillBottom !== null) {
    ok(m.h1Top >= m.pillBottom, `[${name}] H1 nicht hinter der Nav-Pille (${m.h1Top} >= ${m.pillBottom})`);
    ok(m.pTop >= m.pillBottom, `[${name}] Intro-Text nicht hinter der Nav-Pille (${m.pTop} >= ${m.pillBottom})`);
  }
  if (m.bannerTop !== null && m.arrowBottom !== null) {
    ok(m.arrowBottom <= m.bannerTop, `[${name}] Wochen-Pfeile ueber der Cookie-Leiste (R179: ${m.arrowBottom} <= ${m.bannerTop})`);
  }

  await page.screenshot({ path: `${OUT}/${name}-fold.png` });
  await page.locator('[data-schedule-hero-photo]').screenshot({ path: `${OUT}/${name}-band.png` });
  await page.close();
}

await browser.close();
console.log(`\nALL ASSERTIONS: ${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
