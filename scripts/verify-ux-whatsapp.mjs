#!/usr/bin/env node
/**
 * Drives the shipped public pages on the local Vite+API stack.
 * Contract:
 *  - /buchung 390: WhatsApp circle is on the right; no in-fold «frei» overlaps it.
 *  - /kursplan 390: WhatsApp circle is on the right; weekday chips stay free of it.
 *  - /tanzkurse, /tanzkurse/salsa, /preise: circle exists, right, not display:none.
 *  - /schnupperstunde 390: circle on the right; Facts-Lead does not overlap it.
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
    const arrows = [...document.querySelectorAll('button, a, [role="button"]')].filter((el) => {
      const t = (el.textContent || '').replace(/\s+/g, '').trim();
      const al = (el.getAttribute('aria-label') || '').toLowerCase();
      return t === '‹' || t === '›' || t === '<' || t === '>' || /woche|vorher|naechst|nächst/.test(al);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24) };
    });
    return {
      wa: wa ? { x: wa.x, y: wa.y, width: wa.width, height: wa.height, display: waDisplay } : null,
      h1: h1r ? { x: h1r.x, y: h1r.y, width: h1r.width, height: h1r.height, text: (h1.textContent || '').trim().slice(0, 80) } : null,
      frei,
      chips,
      arrows,
      leads,
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

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function shot(name, w, h, path) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });
  await dismissCookie(page);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const info = await measure(page, h);
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
  await page.close();
  return { info, file };
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
  files: [
    buchungMob.file, buchungDsk.file, kursplanMob.file, kursplanDsk.file,
    tanzMob.file, tanzDsk.file, salsaMob.file, salsaDsk.file, preiseMob.file, preiseDsk.file,
    schnupperMob.file, schnupperDsk.file,
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
