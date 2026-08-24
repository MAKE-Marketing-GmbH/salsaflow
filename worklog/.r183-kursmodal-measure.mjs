// R183 [kursmodal] — Messung des Buchungs-Dialogs auf 390x844.
//
// Misst genau die vier Acceptance-Punkte:
//   1. Ueberlauf: scrollWidth des Dialogs und jedes Kindes <= Viewport
//   2. Anzahl sichtbarer Elemente auf Schritt 1 (Rolle + Anmeldung)
//   3. Touch-Ziele >= 40px. Versteckte Radios zaehlen ueber die Label-Flaeche.
//   4. prefers-reduced-motion: mit reducedMotion=reduce darf keine Transform-
//      oder Opacity-Animation laufen (Endzustand sofort).
//
// Aufruf: node worklog/.r183-kursmodal-measure.mjs --base http://127.0.0.1:5175 --tag vorher

const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]?.startsWith('--') ? true : arr[i + 1]]);
    return acc;
  }, []),
);
const BASE = args.base || 'http://127.0.0.1:5175';
const TAG = args.tag || 'run';
const OUT = args.out || '/root/clients/salsaflow-w1/worklog/shots/r183-kursmodal';
mkdirSync(OUT, { recursive: true });

const VP = { width: 390, height: 844 };
const browser = await chromium.launch();

/** Oeffnet den Dialog auf /buchung und liefert page + context. */
async function openDialog(reducedMotion) {
  const context = await browser.newContext({
    viewport: VP,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/buchung`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15000 });
  const picks = page.locator('[data-testid^="pick-course-"]');
  const n = await picks.count();
  let opened = false;
  for (let i = 0; i < Math.min(n, 5); i += 1) {
    try {
      await picks.nth(i).click({ timeout: 4000 });
      // Kursseite zeigt zuerst die Detail-Karte; von dort in den Dialog.
      await page.waitForSelector('[data-testid="reserve-spot"]', { timeout: 4000 });
      await page.locator('[data-testid="reserve-spot"]').click();
      await page.waitForSelector('[data-testid="booking-dialog"]', { timeout: 5000 });
      opened = true;
      break;
    } catch {
      /* naechster Kurs */
    }
  }
  if (!opened) throw new Error('Dialog liess sich nicht oeffnen');
  // Warten bis die Verfuegbarkeit da ist (Fusszeile existiert erst dann).
  await page.waitForSelector('[data-testid="booking-next"], [data-testid="booking-submit"]', { timeout: 15000 });
  await page.waitForTimeout(500);
  return { page, context };
}

/** Zaehlt sichtbare, bedeutungstragende Elemente im Dialog. */
const countVisible = (page) =>
  page.evaluate(() => {
    const dlg = document.querySelector('[data-testid="booking-dialog"]');
    if (!dlg) return null;
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0';
    };
    // Sichtbare Elemente = alles, was ein Mensch als eigenes Ding wahrnimmt:
    // Texte mit eigenem Inhalt, Knoepfe, Felder, Ueberschriften.
    const all = [...dlg.querySelectorAll('*')].filter(vis);
    const interactive = all.filter((el) =>
      ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(el.tagName),
    );
    // Textknoten-Traeger: Element hat direkten, nicht-leeren Textinhalt.
    const textBlocks = all.filter((el) => {
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) return false;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    });
    const headings = all.filter((el) => /^H[1-6]$/.test(el.tagName));
    return {
      interactive: interactive.length,
      textBlocks: textBlocks.length,
      headings: headings.length,
      // Ein gemeinsamer Wert, der beides zaehlt und Doppelzaehlung vermeidet.
      meaningful: new Set([...interactive, ...textBlocks]).size,
    };
  });

/** Ueberlauf: Dialog und alle Kinder gegen den Viewport. */
const measureOverflow = (page) =>
  page.evaluate((vw) => {
    const dlg = document.querySelector('[data-testid="booking-dialog"]');
    const docScrollW = document.documentElement.scrollWidth;
    const dlgRect = dlg.getBoundingClientRect();
    let worst = null;
    for (const el of dlg.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const over = Math.max(0, Math.round(r.right - vw), Math.round(-r.left));
      if (over > 1 && (!worst || over > worst.over)) {
        worst = { over, tag: el.tagName, cls: String(el.className).slice(0, 60) };
      }
    }
    return {
      viewport: vw,
      docScrollWidth: docScrollW,
      dialogScrollWidth: dlg.scrollWidth,
      dialogRight: Math.round(dlgRect.right),
      dialogLeft: Math.round(dlgRect.left),
      worstChildOverflow: worst,
    };
  }, VP.width);

/**
 * Touch-Ziele. Ein verstecktes Radio/Checkbox zaehlt ueber sein Label:
 * gemessen wird die Flaeche, die der Finger wirklich trifft.
 */
const measureTargets = (page) =>
  page.evaluate(() => {
    const dlg = document.querySelector('[data-testid="booking-dialog"]');
    const out = [];
    const seen = new Set();
    for (const el of dlg.querySelectorAll('button, a[href], input, textarea, select, label')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      let target = el;
      // Verstecktes oder winziges Eingabefeld: die Label-Flaeche ist das echte Ziel.
      if (['INPUT'].includes(el.tagName)) {
        const r0 = el.getBoundingClientRect();
        const lab = el.closest('label');
        if (lab && r0.height < 40) target = lab;
      }
      if (el.tagName === 'LABEL' && el.querySelector('input')) {
        // Das Label wird schon ueber sein Input erfasst.
        continue;
      }
      const r = target.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const key = `${target.tagName}:${Math.round(r.x)}:${Math.round(r.y)}:${Math.round(r.width)}x${Math.round(r.height)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        tag: el.tagName,
        testid: el.getAttribute('data-testid') || target.getAttribute('data-testid') || '',
        label: (el.getAttribute('aria-label') || target.textContent || '').trim().slice(0, 34),
        w: Math.round(r.width),
        h: Math.round(r.height),
        measuredOn: target === el ? 'self' : 'label',
      });
    }
    return { all: out, tooSmall: out.filter((t) => t.h < 40) };
  });

/** Bedienbarkeit: Rolle waehlen -> Weiter -> Datenfelder da -> Absenden erreichbar. */
async function checkFlow(page) {
  const steps = {};
  const hasRole = (await page.locator('[data-testid="role-follower"]').count()) > 0;
  steps.roleTilesPresent = hasRole;
  if (hasRole) {
    await page.locator('[data-testid="role-follower"]').click();
    steps.rolePressed =
      (await page.locator('[data-testid="role-follower"]').getAttribute('aria-pressed')) === 'true';
    await page.locator('[data-testid="booking-next"]').click();
    // Schritt 2 rendert erst nach dem State-Commit; auf ein echtes Feld warten,
    // nicht auf eine Pauschal-Pause.
    await page.waitForSelector('[data-testid="bk-firstName"]', { timeout: 10000 });
    await page.waitForTimeout(400);
  }
  steps.firstNameVisible = await page.locator('[data-testid="bk-firstName"]').isVisible();
  steps.emailVisible = await page.locator('[data-testid="bk-email"]').isVisible();
  const submit = page.locator('[data-testid="booking-submit"]');
  steps.submitVisible = await submit.isVisible();
  const sb = await submit.boundingBox();
  steps.submitInViewport = !!sb && sb.y + sb.height <= 844 + 1;
  steps.privacyVisible = await page.locator('[data-testid="booking-privacy"]').isVisible();
  return steps;
}

/** prefers-reduced-motion: Der Dialog steht sofort im Endzustand. */
const measureMotion = (page) =>
  page.evaluate(() => {
    const dlg = document.querySelector('[data-testid="booking-dialog"]');
    const backdrop = document.querySelector('[data-testid="booking-backdrop"]');
    const read = (el) => {
      const cs = getComputedStyle(el);
      return { animationName: cs.animationName, opacity: cs.opacity, transform: cs.transform };
    };
    return {
      reduceQueryMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      dialog: read(dlg),
      backdrop: read(backdrop),
      // Laeuft irgendwo im Dialog noch eine Web-Animation?
      runningAnimations: dlg.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
    };
  });

const report = { tag: TAG, base: BASE, viewport: VP };

// --- Lauf A: normale Motion, Schritt 1 messen, dann Fluss durchspielen ---
{
  const { page, context } = await openDialog('no-preference');
  report.step1 = {
    visible: await countVisible(page),
    overflow: await measureOverflow(page),
    targets: await measureTargets(page),
  };
  await page.screenshot({ path: resolve(OUT, `${TAG}-390-step1.png`) });

  report.flow = await checkFlow(page);
  report.step2 = {
    visible: await countVisible(page),
    overflow: await measureOverflow(page),
    targets: await measureTargets(page),
  };
  await page.screenshot({ path: resolve(OUT, `${TAG}-390-step2.png`) });
  await context.close();
}

// --- Lauf B: prefers-reduced-motion ---
{
  const { page, context } = await openDialog('reduce');
  report.motion = await measureMotion(page);
  await page.screenshot({ path: resolve(OUT, `${TAG}-390-reduced.png`) });
  await context.close();
}

await browser.close();

const fails = [];
for (const key of ['step1', 'step2']) {
  const o = report[key].overflow;
  if (o.dialogScrollWidth > VP.width) fails.push(`${key}: Dialog scrollWidth ${o.dialogScrollWidth} > ${VP.width}`);
  if (o.docScrollWidth > VP.width) fails.push(`${key}: Dokument scrollWidth ${o.docScrollWidth} > ${VP.width}`);
  if (o.worstChildOverflow) fails.push(`${key}: Kind ragt ${o.worstChildOverflow.over}px raus (${o.worstChildOverflow.tag})`);
  for (const t of report[key].targets.tooSmall) {
    fails.push(`${key}: Touch-Ziel ${t.h}px < 40 (${t.testid || t.label || t.tag})`);
  }
}
for (const [k, v] of Object.entries(report.flow)) if (v !== true) fails.push(`flow: ${k} = ${v}`);
if (report.motion.runningAnimations > 0) fails.push(`motion: ${report.motion.runningAnimations} Animationen laufen trotz reduce`);
if (report.motion.dialog.opacity !== '1') fails.push(`motion: Dialog-Opacity ${report.motion.dialog.opacity} statt 1`);

report.fails = fails;
writeFileSync(resolve(OUT, `${TAG}.json`), JSON.stringify(report, null, 2));

console.log(`=== ${TAG} @ 390x844 ===`);
console.log(`Schritt 1 sichtbar: interaktiv ${report.step1.visible.interactive} · Textbloecke ${report.step1.visible.textBlocks} · Ueberschriften ${report.step1.visible.headings} · GESAMT ${report.step1.visible.meaningful}`);
console.log(`Schritt 2 sichtbar: interaktiv ${report.step2.visible.interactive} · Textbloecke ${report.step2.visible.textBlocks} · Ueberschriften ${report.step2.visible.headings} · GESAMT ${report.step2.visible.meaningful}`);
console.log(`Ueberlauf S1: dialog.scrollWidth=${report.step1.overflow.dialogScrollWidth} doc.scrollWidth=${report.step1.overflow.docScrollWidth} viewport=${VP.width}`);
console.log(`Ueberlauf S2: dialog.scrollWidth=${report.step2.overflow.dialogScrollWidth} doc.scrollWidth=${report.step2.overflow.docScrollWidth} viewport=${VP.width}`);
console.log(`Touch < 40px S1: ${report.step1.targets.tooSmall.length} · S2: ${report.step2.targets.tooSmall.length}`);
for (const t of [...report.step1.targets.tooSmall, ...report.step2.targets.tooSmall]) console.log(`   - ${t.h}px ${t.testid || t.label} (${t.measuredOn})`);
console.log(`Fluss: ${JSON.stringify(report.flow)}`);
console.log(`Reduced-Motion: query=${report.motion.reduceQueryMatches} laufendeAnimationen=${report.motion.runningAnimations} opacity=${report.motion.dialog.opacity}`);
console.log(`\nJSON: ${resolve(OUT, `${TAG}.json`)}`);
if (fails.length) {
  console.log(`\nFAILS (${fails.length}):`);
  for (const f of fails) console.log(`  - ${f}`);
  process.exitCode = 1;
} else console.log('\nAlle Checks bestanden.');
