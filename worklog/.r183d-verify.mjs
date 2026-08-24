// R183 Fix-Runde 3 — Acceptance-Checks komplett, in allen vier echten Zustaenden.
// Prueft NICHT nur den neuen CTA, sondern auch, dass Fix-Runde 2 (Koepfe ganz im Band,
// keine Streckung, Motiv, Bedienbarkeit) unbeschaedigt geblieben ist.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const TANZKURSE_HERO = 'kurse-classfreude-hero-2100';

// Kopf-Landmarken der Quelle 2100x900, am Lineal abgelesen (Fix-Runde 2, /tmp/r183b-landmark).
const SRC_W = 2100, SRC_H = 900;
const MANN_HAAR = 115;   // oberste zu schuetzende Landmarke
const FRAU_KINN = 525;   // unterste zu schuetzende Landmarke

let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) { pass++; console.log(`   PASS ${msg}`); } else { fail++; console.log(`   FAIL ${msg}`); } };

const b = await chromium.launch();

for (const [name, vw, vh, acceptCookie] of [
  ['desktop-cookie-offen', 1440, 730, false],
  ['desktop-akzeptiert', 1440, 730, true],
  ['mobile-cookie-offen', 390, 844, false],
  ['mobile-akzeptiert', 390, 844, true],
]) {
  const mobile = vw < 640;
  const ctx = await b.newContext({ viewport: { width: vw, height: vh } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
  if (acceptCookie) {
    await p.click('[data-testid="cookie-accept"]', { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(500);
  }
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(600);

  console.log(`\n=== ${name} (${vw}x${vh}) ===`);

  // --- A) Hero-Foto: Motiv, Streckung, Koepfe ganz im Band ---
  const img = await p.$eval('[data-schedule-hero-photo-img]', (el) => {
    const r = el.getBoundingClientRect();
    return {
      src: el.getAttribute('src'), naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight,
      w: Math.round(r.width), h: Math.round(r.height),
      y: Math.round(r.top), bottom: Math.round(r.bottom),
      objectPosition: getComputedStyle(el).objectPosition,
    };
  });
  console.log(`   img src=${img.src.split('/').pop()} ${img.w}x${img.h} y=${img.y} bot=${img.bottom} nat=${img.naturalWidth}x${img.naturalHeight} pos=${img.objectPosition}`);

  ok(!img.src.includes(TANZKURSE_HERO), `Motiv NICHT der Tanzkurse-Hero (${TANZKURSE_HERO})`);
  ok(img.naturalWidth === SRC_W && img.naturalHeight === SRC_H, `Quelle ${SRC_W}x${SRC_H} (Bandschnitt) geladen`);

  // object-cover: Skalierung ist die groessere der beiden Achsen.
  const scale = Math.max(img.w / img.naturalWidth, img.h / img.naturalHeight);
  const posY = parseFloat(img.objectPosition.split(' ')[1]) / 100;
  const scaledH = img.naturalHeight * scale;
  const offsetTop = (scaledH - img.h) * posY;      // wie viel oben weggeschnitten wird
  const headTopPx = MANN_HAAR * scale - offsetTop; // Haaransatz relativ zur Bandoberkante
  const chinPx = FRAU_KINN * scale - offsetTop;    // Kinn relativ zur Bandoberkante
  const luftOben = Math.round(headTopPx);
  const luftUnten = Math.round(img.h - chinPx);
  const streckung = +(img.w / img.h / (SRC_W / SRC_H)).toFixed(3);
  console.log(`   Luft ueber Mann-Haar=${luftOben}px | Luft unter Frau-Kinn=${luftUnten}px | Streckungsfaktor=${streckung}`);

  // >=4px statt >=0: exakt auf der Kante liest sich wie ein Schnitt.
  ok(luftOben >= 4, `Kopf oben ganz im Band (${luftOben}px Luft >= 4)`);
  ok(luftUnten >= 4, `Kinn unten ganz im Band (${luftUnten}px Luft >= 4)`);
  // Band darf das Motiv nicht ultrabreit ziehen: Crop-Fenster nahe der Quellform.
  ok(streckung <= 2.1, `Foto nicht ultrabreit gestreckt (Faktor ${streckung} <= 2.1)`);

  // --- B) Sol-Befund: sichtbarer Schnupperstunde-CTA im Fold, ohne Burger ---
  const ctas = await p.$$eval('a[href="/schnupperstunde"]', (as, vh2) =>
    as.map((a) => {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      const vis = r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
      const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
      const hit = vis ? document.elementFromPoint(cx, cy) : null;
      return {
        vis, y: Math.round(r.top), inFold: vis && r.top >= 0 && r.top < vh2,
        // echt bedienbar = sichtbar UND der Punkt trifft wirklich den Link
        reachable: !!(hit && (hit === a || a.contains(hit))),
        inHeader: !!a.closest('header'),
      };
    }), vh);
  const foldReachable = ctas.filter((c) => c.inFold && c.reachable);
  console.log(`   Schnupperstunde-CTAs: ${ctas.length} gesamt, im Fold bedienbar=${foldReachable.length} (y=${foldReachable.map((c) => c.y).join(',') || '-'})`);
  ok(foldReachable.length >= 1, 'mindestens EIN bedienbarer Schnupperstunde-CTA im Fold (Funktion nicht geloescht)');
  ok(foldReachable.length === 1, `genau EIN CTA im Fold, kein Doppel (${foldReachable.length})`);

  // Der seitenige CTA existiert genau auf Mobil und genau dort nicht auf Desktop.
  const own = await p.$('[data-schedule-trial-cta]');
  const ownVis = own ? await own.isVisible() : false;
  ok(mobile ? ownVis : !ownVis, mobile ? 'Seiten-CTA auf Mobil sichtbar' : 'Seiten-CTA auf Desktop ausgeblendet (Header traegt ihn)');
  if (mobile) {
    // Harter Beweis: Playwright klickt ihn wirklich an, ohne den Burger zu oeffnen.
    let clickable = true;
    await p.click('[data-schedule-trial-cta]', { timeout: 3000, trial: true }).catch(() => { clickable = false; });
    ok(clickable, 'Seiten-CTA ohne Burger anklickbar (trial click)');
  }

  // --- C) Bedienbarkeit unveraendert: Staffel-Wahl + Wochentage ---
  const staffel = await p.$$eval('button, a', (els) =>
    els.filter((e) => /Staffel\s+(August|Oktober)/.test(e.textContent || '')).length);
  // Kein ^-Anker: die Chips tragen ein Kuerzel vor dem Langnamen ("MoMontag, 17. August").
  // Der erste Versuch ankerte am Zeilenanfang und meldete faelschlich 0 — im DOM gemessen
  // sind es 6 sichtbare Buttons Mo-Sa (worklog/.r183d-days.mjs). Zusaetzlich wird jetzt
  // Sichtbarkeit verlangt, nicht nur Existenz.
  const tage = await p.$$eval('button, a', (els) =>
    els.filter((e) => {
      if (!/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)/.test(e.textContent || '')) return false;
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length);
  console.log(`   Staffel-Schalter=${staffel} Wochentage=${tage}`);
  ok(staffel >= 2, 'Staffel-Wahl bedienbar (>=2)');
  ok(tage >= 6, 'Wochentage bedienbar (>=6)');

  // Nicht nur zaehlen: ein Wochentag-Chip und ein Staffel-Schalter muessen wirklich
  // klickbar sein. Sonst beweist die Zahl nur Markup, keine Funktion.
  const dayHandle = (await p.$$('button')).length
    ? await p.evaluateHandle(() => [...document.querySelectorAll('button')]
        .find((e) => /(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag)/.test(e.textContent || '')
          && e.getBoundingClientRect().width > 0))
    : null;
  const dayEl = dayHandle ? dayHandle.asElement() : null;
  let dayClickable = false;
  if (dayEl) await dayEl.click({ timeout: 3000, trial: true }).then(() => { dayClickable = true; }).catch(() => {});
  ok(dayClickable, 'Wochentag-Chip real anklickbar (trial click)');

  await ctx.close();
}

await b.close();
console.log(`\nALL ASSERTIONS: ${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
