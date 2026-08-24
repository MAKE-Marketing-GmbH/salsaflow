// R183 Fix-Runde 2 [kursmodal] — Beweis fuer den Fokus-Anker der OFFENEN KLASSE.
//
// Der Kritiker fand: der isOpen-Zweig mit ref={stepHeadingRef} stand innerhalb von
// {visibleStep === 1 && ...}. Weil visibleStep bei isOpen fest 2 ist, rendert dieser
// Zweig nie. Folge: bt.openClassNote war unsichtbar und Schritt 2 hatte fuer offene
// Klassen gar kein Fokus-Ziel (stepSummaryRef stand hinter !isOpen).
//
// Dieses Skript erzwingt den offenen Zweig ueber page.route (styleKey='heels') und
// prueft am ECHTEN DOM:
//   1. Der Hinweis der offenen Klasse ist sichtbar (war vorher toter Code).
//   2. Nach dem Oeffnen traegt er tabIndex=-1 und ist das Fokus-Ziel.
//   3. Es gibt keinen Schritt 1 (keine Rollen-Kacheln, kein Weiter-Knopf).
//   4. Kein Ueberlauf, keine Touch-Ziele < 40px, Absenden im Viewport.
//
// Aufruf: node worklog/.r183-openclass-focus.mjs --base http://127.0.0.1:5175 --tag nachher-offeneklasse

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
const TAG = args.tag || 'nachher-offeneklasse';
const OUT = args.out || '/root/clients/salsaflow-w1/worklog/shots/r183-kursmodal';
mkdirSync(OUT, { recursive: true });

const VP = { width: 390, height: 844 };
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VP,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

// Kein Heels-Kurs im Live-Plan: den offenen Zweig ueber die API erzwingen.
// Jede JSON-Antwort bekommt styleKey='heels' auf allen Kursobjekten.
let patched = 0;
await page.route('**/*', async (route) => {
  const req = route.request();
  if (!/\/api\//.test(req.url())) return route.continue();
  const res = await route.fetch();
  const ct = res.headers()['content-type'] || '';
  if (!ct.includes('application/json')) return route.fulfill({ response: res });
  let body;
  try {
    body = await res.json();
  } catch {
    return route.fulfill({ response: res });
  }
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      if ('styleKey' in node) {
        node.styleKey = 'heels';
        patched += 1;
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(body);
  return route.fulfill({ response: res, body: JSON.stringify(body) });
});

await page.goto(`${BASE}/buchung`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15000 });

const picks = page.locator('[data-testid^="pick-course-"]');
const n = await picks.count();
let opened = false;
for (let i = 0; i < Math.min(n, 5); i += 1) {
  try {
    await picks.nth(i).click({ timeout: 4000 });
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
await page.waitForSelector('[data-testid="booking-next"], [data-testid="booking-submit"]', { timeout: 15000 });
await page.waitForTimeout(600);

const out = { tag: TAG, base: BASE, viewport: VP, patchedCourseObjects: patched };

// --- 1. Ist der offene Zweig wirklich aktiv? ---
out.isOpenBranch = {
  // Offene Klasse hat keinen Schritt 1: keine Rollen-Kacheln, kein Weiter-Knopf.
  roleTilesGone: (await page.locator('[data-testid="role-follower"]').count()) === 0,
  nextButtonGone: (await page.locator('[data-testid="booking-next"]').count()) === 0,
  // Und keine Auswahl-Zeile, die es nur mit Rollen gibt.
  step1SummaryAbsent: (await page.locator('[data-testid="step1-summary"]').count()) === 0,
  // Datenfelder stehen sofort da.
  firstNameVisible: await page.locator('[data-testid="bk-firstName"]').isVisible(),
};

// --- 2. DER KERN (korrigiert in Runde 3, Fund kimi-critic) ---
//
// Bis Runde 2 forderte dieser Test, dass der Satz «Offene Klasse - keine
// Rollenwahl noetig.» sichtbar ist und den Fokus traegt. Beides war falsch:
//   a) Der Satz ist Kurstyp-Information. Absprache 17.08.: die Kursseite
//      traegt die Infos, das Modal traegt Rolle plus Anmeldung.
//   b) Er erklaerte eine Rollenwahl, die dieser Zweig nie zeigt.
//   c) Die Begruendung «Schritt 2 braucht ein Fokus-Ziel» traegt nicht: der
//      Fokus-Effekt haengt an `stepChanged`, und bei offener Klasse gibt es
//      keinen erreichbaren Schrittwechsel (Beleg: .r183-openclass-reach.mjs).
// Der Vertrag lautet jetzt: der Satz ist NICHT da, und der Dialog ist trotzdem
// vollstaendig bedienbar.
const note = page.locator('[data-testid="open-class-note"]');
out.openClassNote = {
  present: (await note.count()) > 0,
  text: (await note.count()) > 0 ? (await note.first().textContent()).trim() : null,
};

// Kein Kurstyp-Satz im Modal — weder ueber die testid noch als roher Text.
out.noCourseTypeCopy = await page.evaluate(() => {
  const dlg = document.querySelector('[data-testid="booking-dialog"]');
  const text = (dlg?.textContent || '').replace(/\s+/g, ' ');
  return {
    mentionsOpenClass: /offene klasse|open class/i.test(text),
    mentionsRoleChoice: /rollenwahl|role selection/i.test(text),
  };
});

// Der Fokus darf nirgends ins Leere laufen: nach dem Oeffnen muss ein echtes
// Element den Fokus halten, nicht <body>.
out.focusAfterOpen = await page.evaluate(() => {
  const active = document.activeElement;
  return {
    onBody: active === document.body,
    activeTestid: active?.getAttribute?.('data-testid') || active?.tagName || null,
  };
});

// --- 3. Ueberlauf + Touch-Ziele + Absenden ---
out.overflow = await page.evaluate((vw) => {
  const dlg = document.querySelector('[data-testid="booking-dialog"]');
  let worst = null;
  for (const el of dlg.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const over = Math.max(0, Math.round(r.right - vw), Math.round(-r.left));
    if (over > 1 && (!worst || over > worst.over)) worst = { over, tag: el.tagName };
  }
  return {
    viewport: vw,
    dialogScrollWidth: dlg.scrollWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    worstChildOverflow: worst,
  };
}, VP.width);

out.touchTargets = await page.evaluate(() => {
  const dlg = document.querySelector('[data-testid="booking-dialog"]');
  const res = [];
  const seen = new Set();
  for (const el of dlg.querySelectorAll('button, a[href], input, textarea, select, label')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    let target = el;
    if (el.tagName === 'INPUT') {
      const r0 = el.getBoundingClientRect();
      const lab = el.closest('label');
      if (lab && r0.height < 40) target = lab;
    }
    if (el.tagName === 'LABEL' && el.querySelector('input')) continue;
    const r = target.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const key = `${target.tagName}:${Math.round(r.x)}:${Math.round(r.y)}:${Math.round(r.width)}x${Math.round(r.height)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    res.push({
      testid: el.getAttribute('data-testid') || '',
      label: (el.getAttribute('aria-label') || target.textContent || '').trim().slice(0, 34),
      h: Math.round(r.height),
    });
  }
  return { tooSmall: res.filter((t) => t.h < 40) };
});

const submit = page.locator('[data-testid="booking-submit"]');
const sb = await submit.boundingBox();
out.submitInViewport = !!sb && sb.y + sb.height <= VP.height + 1;

await page.screenshot({ path: resolve(OUT, `${TAG}.png`) });
out.pageErrors = pageErrors;

await context.close();
await browser.close();

const fails = [];
if (!out.isOpenBranch.roleTilesGone) fails.push('Rollen-Kacheln da: offener Zweig NICHT aktiv, Test wertlos');
if (!out.isOpenBranch.firstNameVisible) fails.push('Datenfelder fehlen');
if (!out.isOpenBranch.step1SummaryAbsent) fails.push('step1-summary faelschlich da');
// KERN (Runde 3): Kurstyp-Copy gehoert auf die Kursseite, nicht ins Modal.
if (out.openClassNote.present) fails.push(`KERN: Kurstyp-Hinweis wieder im Modal ("${out.openClassNote.text}")`);
if (out.noCourseTypeCopy.mentionsOpenClass) fails.push('KERN: Modal nennt den Kurstyp «offene Klasse»');
if (out.noCourseTypeCopy.mentionsRoleChoice)
  fails.push('KERN: Modal erklaert eine Rollenwahl, die dieser Zweig nie zeigt');
if (out.focusAfterOpen.onBody) fails.push('Fokus liegt auf <body> statt auf einem echten Element');
if (out.overflow.dialogScrollWidth > VP.width) fails.push(`Ueberlauf Dialog ${out.overflow.dialogScrollWidth}`);
if (out.overflow.docScrollWidth > VP.width) fails.push(`Ueberlauf Dokument ${out.overflow.docScrollWidth}`);
if (out.overflow.worstChildOverflow) fails.push(`Kind ragt ${out.overflow.worstChildOverflow.over}px raus`);
for (const t of out.touchTargets.tooSmall) fails.push(`Touch-Ziel ${t.h}px < 40 (${t.testid || t.label})`);
if (!out.submitInViewport) fails.push('Absenden nicht im Viewport');
if (pageErrors.length) fails.push(`PAGEERROR: ${pageErrors[0]}`);

out.fails = fails;
writeFileSync(resolve(OUT, `${TAG}.json`), JSON.stringify(out, null, 2));

console.log(`=== OFFENE KLASSE @ 390x844 (${TAG}) ===`);
console.log(`Kursobjekte auf styleKey='heels' gepatcht: ${patched}`);
console.log(`Offener Zweig aktiv: ${JSON.stringify(out.isOpenBranch)}`);
console.log(`Kurstyp-Hinweis (soll weg sein): ${JSON.stringify(out.openClassNote)}`);
console.log(`Kurstyp-Copy im Modal: ${JSON.stringify(out.noCourseTypeCopy)}`);
console.log(`Fokus nach dem Oeffnen: ${JSON.stringify(out.focusAfterOpen)}`);
console.log(`Ueberlauf: dialog=${out.overflow.dialogScrollWidth} doc=${out.overflow.docScrollWidth} viewport=${VP.width}`);
console.log(`Touch < 40px: ${out.touchTargets.tooSmall.length}`);
console.log(`Absenden im Viewport: ${out.submitInViewport} · PageErrors: ${pageErrors.length}`);
console.log(`\nPNG: ${resolve(OUT, `${TAG}.png`)}`);
if (fails.length) {
  console.log(`\nFAILS (${fails.length}):`);
  for (const f of fails) console.log(`  - ${f}`);
  process.exitCode = 1;
} else console.log('\nAlle Checks bestanden.');
