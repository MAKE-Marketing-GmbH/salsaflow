#!/usr/bin/env node
/**
 * Drives the shipped public pages on the local Vite+API stack.
 * Contract:
 *  - /buchung 390: WhatsApp circle is on the right; no in-fold «frei» overlaps it.
 *  - /kursplan 390: WhatsApp circle is on the right; weekday chips stay free of it.
 *  - /tanzkurse, /tanzkurse/salsa, /preise: circle exists, right, not display:none.
 *  - /schnupperstunde 390: circle on the right; Facts-Lead does not overlap it.
 *  - / 390: circle on the right; Ghost-CTA «Kursplan ansehen» does not overlap it.
 * Exit 0 only if every assertion holds.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.SF_BASE || 'http://127.0.0.1:5175';
const OUT = process.env.SF_SHOT_DIR || '/root/clients/salsaflow-w1/worklog/shots/S7-ux121';
mkdirSync(OUT, { recursive: true });

function overlaps(a, b) {
  if (!a || !b) return false;
  return !(a.x + a.width < b.x || a.x > b.x + b.width || a.y + a.height < b.y || a.y > b.y + b.height);
}

async function dismissCookie(page) {
  try {
    const btn = page.locator('button:has-text("Akzeptieren"), button:has-text("Okay"), button:has-text("Accept"), button:has-text("Alle Cookies")').first();
    if (await btn.count()) await btn.click({ timeout: 800 });
  } catch {
    /* no banner */
  }
}

async function measure(page, foldH) {
  return page.evaluate((fold) => {
    const waEl = document.querySelector('.whatsapp-float');
    const wa = waEl ? waEl.getBoundingClientRect() : null;
    const waDisplay = waEl ? getComputedStyle(waEl).display : null;
    const h1 = document.querySelector('h1');
    const h1r = h1 ? h1.getBoundingClientRect() : null;
    const heroImg = document.querySelector('section img[fetchpriority="high"], section picture img');
    const heroImgR = heroImg ? heroImg.getBoundingClientRect() : null;
    const heroObjectPos = heroImg ? getComputedStyle(heroImg).objectPosition : null;
    const heroSrc = heroImg ? (heroImg.currentSrc || heroImg.src || '').replace(location.origin, '') : null;
    const contentImgs = [...document.querySelectorAll('img')].filter((el) => {
      const src = el.currentSrc || el.src || '';
      return !/logo\//.test(src);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        src: (el.currentSrc || el.src || '').replace(location.origin, ''),
        x: r.x, y: r.y, width: r.width, height: r.height,
      };
    });
    const foldContentImg = contentImgs.find((i) => i.y < fold && i.y + i.height > 0 && i.width > 0 && i.height > 0) || null;
    const frei = [...document.querySelectorAll('span, a, button')].filter((el) => {
      const t = (el.textContent || '').trim();
      return t === 'frei' || t === 'Plätze frei';
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.textContent || '').trim() };
    });
    const chips = [...document.querySelectorAll('button, a')].filter((el) => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return /^(Mo|Di|Mi)\b/.test(t);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24) };
    });
    const leads = [...document.querySelectorAll('p')].filter((el) => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return /Keine Verkaufsstunde|Not a sales pitch/.test(t);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.textContent || '').trim().slice(0, 48) };
    });
    const planCtas = [...document.querySelectorAll('a[href="/kursplan"]')].filter((el) => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return /Kursplan ansehen|View schedule|Zum Kursplan/.test(t);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.textContent || '').trim().slice(0, 32) };
    });
    const arrows = [...document.querySelectorAll('button, a, [role="button"]')].filter((el) => {
      const t = (el.textContent || '').replace(/\s+/g, '').trim();
      const al = (el.getAttribute('aria-label') || '').toLowerCase();
      return t === '‹' || t === '›' || t === '<' || t === '>' || /woche|vorher|naechst|nächst/.test(al);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24) };
    });
    // R139 /tanzkurse/heels: die Hero-Bullet-Chips stehen mobil UNTER dem Foto und
    // laufen in die Knopf-Spalte. Ohne diese Liste sieht der Verifier weder die
    // Chip- noch die Foto-Ueberdeckung auf dieser Route.
    const heroBullets = [...document.querySelectorAll('section ul li')].map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 32) };
    }).filter((r) => r.width > 0 && r.height > 0);
    return {
      heroBullets,
      waLabelVisible: waEl ? [...waEl.querySelectorAll('span')].some((s) => getComputedStyle(s).display !== 'none' && (s.textContent || '').trim().length > 0) : null,
      wa: wa ? { x: wa.x, y: wa.y, width: wa.width, height: wa.height, display: waDisplay } : null,
      h1: h1r ? { x: h1r.x, y: h1r.y, width: h1r.width, height: h1r.height, text: (h1.textContent || '').trim().slice(0, 80) } : null,
      frei,
      chips,
      arrows,
      leads,
      planCtas,
      heroPhoto: heroImgR
        ? { x: heroImgR.x, y: heroImgR.y, width: heroImgR.width, height: heroImgR.height, objectPosition: heroObjectPos, src: heroSrc }
        : null,
      foldContentImg,
      fold,
      vw: window.innerWidth,
    };
  }, foldH);
}

const fails = [];
function check(name, ok, detail) {
  if (!ok) fails.push(`${name}: ${detail}`);
  console.log(ok ? `PASS ${name}` : `FAIL ${name} ${detail}`);
}

const launchOpts = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
let browser = await chromium.launch(launchOpts);

async function shot(name, w, h, path) {
  let last;
  for (let attempt = 0; attempt < 4; attempt++) {
    let page;
    try {
      if (!browser.isConnected()) browser = await chromium.launch(launchOpts);
      page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('#main h1', { timeout: 45000 });
      await dismissCookie(page);
      await page.waitForTimeout(400);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const info = await measure(page, h);
      const file = `${OUT}/${name}.png`;
      await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
      await page.close();
      return { info, file };
    } catch (err) {
      last = err;
      try {
        await page?.close();
      } catch {
        /* ignore */
      }
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
      browser = await chromium.launch(launchOpts);
    }
  }
  throw last;
}

const buchungMob = await shot('buchung-mobil-390', 390, 844, '/buchung');
const buchungDsk = await shot('buchung-desktop-1440', 1440, 730, '/buchung');
const kursplanMob = await shot('kursplan-mobil-390', 390, 844, '/kursplan');
const kursplanDsk = await shot('kursplan-desktop-1440', 1440, 730, '/kursplan');

const bm = buchungMob.info;
check('buchung-h1', Boolean(bm.h1 && bm.h1.y < 844 && bm.h1.text), JSON.stringify(bm.h1));
check('buchung-wa-present', Boolean(bm.wa), String(bm.wa));
check('buchung-wa-right', Boolean(bm.wa && bm.wa.x > 195), JSON.stringify(bm.wa));
const buchungHits = (bm.frei || []).filter((f) => f.y < 844 && f.y + f.height > 0 && overlaps(f, bm.wa));
check('buchung-frei-frei', buchungHits.length === 0, JSON.stringify(buchungHits));

const bd = buchungDsk.info;
check('buchung-dsk-wa-right', Boolean(bd.wa && bd.wa.x > 720), JSON.stringify(bd.wa));

const km = kursplanMob.info;
check('kursplan-h1', Boolean(km.h1 && km.h1.y < 844 && km.h1.text), JSON.stringify(km.h1));
check('kursplan-wa-right', Boolean(km.wa && km.wa.x > 195), JSON.stringify(km.wa));
const chipHits = (km.chips || []).filter((c) => c.y < 844 && overlaps(c, km.wa));
check('kursplan-chips-frei', chipHits.length === 0, JSON.stringify(chipHits));
const arrowHits = (km.arrows || []).filter((c) => c.y < 844 && overlaps(c, km.wa));
check('kursplan-pfeile-frei', arrowHits.length === 0, JSON.stringify({ wa: km.wa, arrowHits, arrows: km.arrows }));

const kd = kursplanDsk.info;
check('kursplan-dsk-wa-right', Boolean(kd.wa && kd.wa.x > 720), JSON.stringify(kd.wa));

function checkSitewide(slug, mob, dsk) {
  check(`${slug}-wa-present`, Boolean(mob.wa), JSON.stringify(mob.wa));
  check(`${slug}-wa-visible`, Boolean(mob.wa && mob.wa.display !== 'none' && mob.wa.width > 0), JSON.stringify(mob.wa));
  check(`${slug}-wa-right`, Boolean(mob.wa && mob.wa.x > 195), JSON.stringify(mob.wa));
  check(`${slug}-dsk-wa-present`, Boolean(dsk.wa), JSON.stringify(dsk.wa));
  check(`${slug}-dsk-wa-visible`, Boolean(dsk.wa && dsk.wa.display !== 'none' && dsk.wa.width > 0), JSON.stringify(dsk.wa));
  check(`${slug}-dsk-wa-right`, Boolean(dsk.wa && dsk.wa.x > 720), JSON.stringify(dsk.wa));
}

const tanzMob = await shot('tanzkurse-mobil-390', 390, 844, '/tanzkurse');
const tanzDsk = await shot('tanzkurse-desktop-1440', 1440, 730, '/tanzkurse');
const salsaMob = await shot('salsa-mobil-390', 390, 844, '/tanzkurse/salsa');
const salsaDsk = await shot('salsa-desktop-1440', 1440, 730, '/tanzkurse/salsa');
const preiseMob = await shot('preise-mobil-390', 390, 844, '/preise');
const preiseDsk = await shot('preise-desktop-1440', 1440, 730, '/preise');

checkSitewide('tanzkurse', tanzMob.info, tanzDsk.info);
checkSitewide('salsa', salsaMob.info, salsaDsk.info);
checkSitewide('preise', preiseMob.info, preiseDsk.info);

const schnupperMob = await shot('schnupper-mobil-390', 390, 844, '/schnupperstunde');
const schnupperDsk = await shot('schnupper-desktop-1440', 1440, 730, '/schnupperstunde');
const sm = schnupperMob.info;
check('schnupper-wa-right', Boolean(sm.wa && sm.wa.x > 195 && sm.wa.display !== 'none'), JSON.stringify(sm.wa));
const leadHits = (sm.leads || []).filter((c) => c.y < 844 && overlaps(c, sm.wa));
check('schnupper-lead-frei', leadHits.length === 0, JSON.stringify({ wa: sm.wa, leadHits, leads: sm.leads }));
const sd = schnupperDsk.info;
check('schnupper-dsk-wa-right', Boolean(sd.wa && sd.wa.x > 720), JSON.stringify(sd.wa));

const homeMob = await shot('home-mobil-390', 390, 844, '/');
const homeDsk = await shot('home-desktop-1440', 1440, 730, '/');
const hm = homeMob.info;
check('home-wa-right', Boolean(hm.wa && hm.wa.x > 195 && hm.wa.display !== 'none'), JSON.stringify(hm.wa));
const planHits = (hm.planCtas || []).filter((c) => c.y < 844 && overlaps(c, hm.wa));
check('home-kursplan-frei', planHits.length === 0, JSON.stringify({ wa: hm.wa, planHits, planCtas: hm.planCtas }));
const hp = hm.heroPhoto;
const yMatch = hp && /26%/.test(String(hp.objectPosition || ''));
check(
  'home-kinn-sichtbar',
  Boolean(hp && hp.height >= 450 && hp.y <= 0 && yMatch && hm.h1 && hm.h1.y < 844),
  JSON.stringify({ heroPhoto: hp, h1: hm.h1 }),
);
const hd = homeDsk.info;
check('home-dsk-wa-right', Boolean(hd.wa && hd.wa.x > 720), JSON.stringify(hd.wa));

/* R139 /tanzkurse/heels. Diese Route fehlte hier komplett — der Lauf gab 28x PASS,
   keiner davon auf heels, und liess dadurch eine Foto-Ueberdeckung durch
   (Sol-Fund R139). Zwei Faelle, mobil hart auf Ueberdeckung, desktop auf den Kreis. */
const heelsMob = await shot('heels-mobil-390', 390, 844, '/tanzkurse/heels');
const heelsDsk = await shot('heels-desktop-1440', 1440, 730, '/tanzkurse/heels');
const hem = heelsMob.info;
check('heels-wa-right', Boolean(hem.wa && hem.wa.x > 195 && hem.wa.display !== 'none'), JSON.stringify(hem.wa));
// Der Knopf darf das Hero-Foto nicht beruehren: er sass bei 3/2 mitten auf der
// zweiten Taenzerin. Geloest ueber die mobile Bild-Ratio 21/9 in HeelsView.tsx.
const heelsPhotoHit = hem.heroPhoto && overlaps(hem.heroPhoto, hem.wa);
check('heels-foto-frei', heelsPhotoHit === false, JSON.stringify({ wa: hem.wa, heroPhoto: hem.heroPhoto }));
// Und er darf keinen Bullet-Chip im Fold ueberdecken (R138 Fund 8).
const heelsChipHits = (hem.heroBullets || []).filter((c) => c.y < 844 && overlaps(c, hem.wa));
check('heels-chips-frei', heelsChipHits.length === 0, JSON.stringify({ wa: hem.wa, heelsChipHits, heroBullets: hem.heroBullets }));
// Crop-Lock aus heels-content.ts muss am gerenderten Bild ankommen (Brief Punkt 3).
check(
  'heels-crop-wirkt',
  Boolean(hem.heroPhoto && /12%/.test(String(hem.heroPhoto.objectPosition || ''))),
  JSON.stringify(hem.heroPhoto),
);
const hed = heelsDsk.info;
check('heels-dsk-wa-right', Boolean(hed.wa && hed.wa.x > 720), JSON.stringify(hed.wa));
// Desktop auf dieser Route: Kreis ohne Text (Brief Punkt 4). Die Pille war 121px breit.
check('heels-dsk-wa-kreis', Boolean(hed.wa && hed.wa.width < 70 && hed.waLabelVisible === false), JSON.stringify({ wa: hed.wa, labelVisible: hed.waLabelVisible }));

function checkMoreRoute(slug, mob, dsk, srcNeedle) {
  checkSitewide(slug, mob, dsk);
  check(
    `${slug}-dsk-wa-kreis`,
    Boolean(dsk.wa && Math.abs(dsk.wa.width - dsk.wa.height) < 2 && dsk.wa.width < 70 && dsk.waLabelVisible === false),
    JSON.stringify({ wa: dsk.wa, labelVisible: dsk.waLabelVisible }),
  );
  const dskImg = dsk.foldContentImg || dsk.heroPhoto;
  const mobImg = mob.foldContentImg || mob.heroPhoto;
  check(
    `${slug}-dsk-fold-img`,
    Boolean(dskImg && dskImg.width > 0 && dskImg.height > 0 && dskImg.y < 730 && (srcNeedle ? String(dskImg.src || '').includes(srcNeedle) : true)),
    JSON.stringify(dskImg),
  );
  check(
    `${slug}-mob-fold-img`,
    Boolean(mobImg && mobImg.width > 0 && mobImg.height > 0 && mobImg.y < 844),
    JSON.stringify(mobImg),
  );
}

const collabsMob = await shot('collabs-mobil-390', 390, 844, '/mehr/collabs');
const collabsDsk = await shot('collabs-desktop-1440', 1440, 730, '/mehr/collabs');
checkMoreRoute('collabs', collabsMob.info, collabsDsk.info, 'hp-27');

const tanzschuheMob = await shot('tanzschuhe-mobil-390', 390, 844, '/mehr/tanzschuhe');
const tanzschuheDsk = await shot('tanzschuhe-desktop-1440', 1440, 730, '/mehr/tanzschuhe');
checkMoreRoute('tanzschuhe', tanzschuheMob.info, tanzschuheDsk.info, 'heels-shoes');

const partysMob = await shot('partys-mobil-390', 390, 844, '/mehr/partys');
const partysDsk = await shot('partys-desktop-1440', 1440, 730, '/mehr/partys');
checkMoreRoute('partys', partysMob.info, partysDsk.info, 'party-31');
const partysHero = partysDsk.info.heroPhoto || partysDsk.info.foldContentImg;
check(
  'partys-dsk-band-in-fold',
  Boolean(partysHero && partysHero.y + partysHero.height <= 731 && partysHero.height >= 300),
  JSON.stringify(partysHero),
);
{
  const NAT_W = 2048;
  const NAT_H = 1360;
  const VIEW_W = 1440;
  const CROWN_Y = 95;
  const CHIN_Y = 540;
  const pos = String(partysHero?.objectPosition || '');
  const pct = pos.match(/([\d.]+)%\s+([\d.]+)%/);
  const yPct = pct ? Number(pct[2]) / 100 : 0.5;
  const scale = VIEW_W / NAT_W;
  const scaledH = NAT_H * scale;
  const boxH = partysHero ? partysHero.height : 0;
  const overflow = Math.max(0, scaledH - boxH);
  const srcTop = overflow * yPct / scale;
  const srcBottom = srcTop + boxH / scale;
  check(
    'partys-dsk-heads-in-window',
    Boolean(partysHero && srcTop <= CROWN_Y && srcBottom >= CHIN_Y),
    JSON.stringify({ srcTop, srcBottom, yPct, boxH, pos, y: partysHero?.y }),
  );
}

const report = {
  fails,
  buchungMob: bm,
  buchungDsk: bd,
  kursplanMob: km,
  kursplanDsk: kd,
  tanzkurseMob: tanzMob.info,
  tanzkurseDsk: tanzDsk.info,
  salsaMob: salsaMob.info,
  salsaDsk: salsaDsk.info,
  preiseMob: preiseMob.info,
  preiseDsk: preiseDsk.info,
  schnupperMob: sm,
  schnupperDsk: sd,
  homeMob: hm,
  homeDsk: hd,
  collabsMob: collabsMob.info,
  collabsDsk: collabsDsk.info,
  tanzschuheMob: tanzschuheMob.info,
  tanzschuheDsk: tanzschuheDsk.info,
  partysMob: partysMob.info,
  partysDsk: partysDsk.info,
  files: [
    buchungMob.file, buchungDsk.file, kursplanMob.file, kursplanDsk.file,
    tanzMob.file, tanzDsk.file, salsaMob.file, salsaDsk.file, preiseMob.file, preiseDsk.file,
    schnupperMob.file, schnupperDsk.file,
    homeMob.file, homeDsk.file,
    collabsMob.file, collabsDsk.file, tanzschuheMob.file, tanzschuheDsk.file, partysMob.file, partysDsk.file,
  ],
};
const reportPath = `${OUT}/verify-report.json`;
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('REPORT', reportPath);
await browser.close();
if (fails.length) {
  console.error('FAILED', fails.length);
  process.exit(1);
}
console.log('VERDICT PASS');
process.exit(0);
