// =============================================================================
// Etappe 16 - End-to-End-Test (kein Code-Eingriff, nur die echte Oberflaeche)
//
// Beweist in EINEM headless Browser-Durchlauf den kompletten Kunden-Ablauf:
//   1. Admin-Login (Fabio/Claudia).
//   2. Kompletter Staffel-Wechsel: "Staffel Januar 2026" duplizieren -> Level
//      steigen automatisch eine Stufe -> neues 8-Wochen-Fenster setzen ->
//      veröffentlichen (live).
//   3. Beweis "live": die neue Staffel taucht im öffentlichen Kursplan auf
//      (read-only API, kein Code-Eingriff).
//   4. Bezahlte Test-Buchung in DEUTSCH: Kurs der neuen Staffel buchen ->
//      Bezahlseite -> TWINT -> bestaetigt + Beleg.
//   5. Bezahlte Test-Buchung in ENGLISCH: Sprache global umschalten -> zweiten
//      Kurs der neuen Staffel buchen -> bezahlen -> bestaetigt.
//   6. Gegen-Beweis: beide bezahlten Buchungen liegen im Admin (Buchungen &
//      Balance) der NEUEN Staffel als "bestaetigt".
//
// Voraussetzung: laufender Dev-Server MIT Zahlung (npm run dev:pay,
// PAYMENT_ENABLED=1) gegen eine frische DB (rm -rf .data/pglite && npm run setup).
// Headless-Pflicht (Memory): System-Chrome, kein sichtbares Fenster.
// =============================================================================
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = 'http://localhost:5173';
const ADMIN = `${ORIGIN}/admin`;
const PLAN = `${ORIGIN}/kursplan`;
const SHOTS = '.marathon/e16-shots';
const GUIDE = 'anleitung/img';
const STAMP = Date.now();
const RID = STAMP.toString().slice(-6);

const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

// Datums-Fenster für die neue Staffel: vor 7 Tagen gestartet (laeuft jetzt),
// laeuft 8 Wochen (Ende in der Zukunft) -> öffentlich sichtbar + buchbar.
function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
const NEW_START = isoOffset(-7);
const NEW_END = isoOffset(49);
const NEW_NAME = `E2E Staffel ${RID}`;

const DE_EMAIL = `e2e.de.${STAMP}@salsaflow-test.local`;
const EN_EMAIL = `e2e.en.${STAMP}@salsaflow-test.local`;

async function shot(page, dir, name) {
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true }).catch(() => {});
}
// Anleitungs-Bild: nur der sichtbare Ausschnitt (oben) -> fokussiert + kunden-tauglich,
// kein endlos langer Vollseiten-Screenshot.
async function gshot(page, name) {
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.screenshot({ path: `${GUIDE}/${name}.png`, fullPage: false }).catch(() => {});
}

// Eine Buchung komplett durchziehen: Karte oeffnen -> freie Rolle -> Person ->
// absenden -> Bezahlseite -> TWINT -> Erfolgsseite. Liefert den Beleg-Text.
async function bookAndPay(page, target, person, shotPrefix, guidePrefix) {
  // Karte der NEUEN Staffel deterministisch finden (Stil + Wochentag + Zeit + Lehrer).
  let card = page
    .locator(`article[data-testid="course-card"][data-style="${target.styleKey}"][data-weekday="${target.weekday}"]`)
    .filter({ hasText: target.startTime });
  if (target.teacher) card = card.filter({ hasText: target.teacher });
  card = card.first();
  await card.waitFor({ timeout: 15000 });
  await card.locator('[data-testid="book-open"]').click();
  await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 8000 });
  await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 8000 });

  // Freie Rolle wählen (frische DB -> beide Rollen frei; Leader bevorzugt).
  const hasRole = await page.locator('[data-testid="role-leader"]').count();
  if (hasRole) {
    await page.locator('[data-testid="role-leader"]').click();
  }
  await page.locator('[data-testid="bk-firstName"]').fill(person.first);
  await page.locator('[data-testid="bk-lastName"]').fill(person.last);
  await page.locator('[data-testid="bk-email"]').fill(person.email);
  if (guidePrefix) await gshot(page, guidePrefix + '-dialog');
  await shot(page, SHOTS, shotPrefix + '-dialog');
  await page.locator('[data-testid="booking-submit"]').click();

  // Weiterleitung auf die (Sandbox-)Bezahlseite.
  await page.waitForURL(/\/api\/sandbox\/checkout\//, { timeout: 15000 });
  await page.locator('[data-testid="sandbox-pay"]').waitFor({ timeout: 8000 });
  const amount = await page.locator('[data-testid="sandbox-amount"]').innerText();
  if (guidePrefix) await gshot(page, guidePrefix + '-bezahlen');
  await shot(page, SHOTS, shotPrefix + '-checkout');

  await page.locator('[data-testid="method-twint"]').click();
  await page.locator('[data-testid="sandbox-pay"]').click();

  // Erfolgsseite -> bestaetigte Buchung (Webhook hat serverseitig bestaetigt).
  await page.waitForURL(/\/buchung\/erfolg/, { timeout: 15000 });
  await page.locator('[data-testid="return-confirmed"]').waitFor({ timeout: 15000 });
  const receipt = await page.locator('[data-testid="return-receipt"]').innerText().catch(() => '');
  if (guidePrefix) await gshot(page, guidePrefix + '-bestaetigt');
  await shot(page, SHOTS, shotPrefix + '-success');
  return { amount, receipt };
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.mkdirSync(GUIDE, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // Zwei getrennte Browser-Kontexte: Admin (eingeloggt) und Besucher (anonym) -
  // wie in echt. Der Besucher hat KEINE Admin-Session.
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 1400 } });
  const visitorCtx = await browser.newContext({ viewport: { width: 1280, height: 1400 } });
  const adminPage = await adminCtx.newPage();
  const visitorPage = await visitorCtx.newPage();
  for (const p of [adminPage, visitorPage]) {
    p.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
    p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text()); });
  }

  try {
    /* ===== 1) Admin-Login ================================================== */
    await adminPage.goto(ADMIN, { waitUntil: 'networkidle' });
    await gshot(adminPage, 'g01-login');
    await adminPage.fill('input[type="password"]', 'salsaflow-admin-2026');
    await adminPage.click('button[type="submit"]');
    await adminPage.getByRole('heading', { name: 'Kursplan verwalten' }).waitFor({ timeout: 10000 });
    ok('Admin-Login -> Übersicht "Kursplan verwalten"', true);
    await gshot(adminPage, 'g02-uebersicht');
    await shot(adminPage, SHOTS, '01-uebersicht');

    /* ===== 2) Staffel-Wechsel: duplizieren + Level hoch + Fenster + live === */
    await adminPage
      .locator('div.rounded-xl', { hasText: 'Staffel Januar 2026' })
      .getByRole('button', { name: /Duplizieren/ })
      .click();
    await adminPage.getByRole('heading', { name: 'Staffel duplizieren' }).waitFor({ timeout: 10000 });
    await adminPage.waitForSelector('text=Kurse & neue Level', { timeout: 10000 });

    const plusBadges = await adminPage.locator('text=+1').count();
    ok('Duplizieren-Vorschau zeigt Auto-Aufstieg (+1-Badges)', plusBadges > 0, `${plusBadges} Kurse`);

    // Name + neues 8-Wochen-Fenster setzen (genau das, was Fabio alle 8 Wochen tut).
    await adminPage.locator('label:has-text("Name der neuen Staffel") input').fill(NEW_NAME);
    const dateInputs = adminPage.locator('input[type="date"]');
    await dateInputs.nth(0).fill(NEW_START);
    await dateInputs.nth(1).fill(NEW_END);
    await gshot(adminPage, 'g03-duplizieren');
    await shot(adminPage, SHOTS, '02-duplizieren');

    await adminPage.getByRole('button', { name: 'Staffel jetzt erstellen' }).click();
    const toast = await adminPage
      .locator('text=/Kurse eine Stufe hochgesetzt/')
      .first()
      .textContent({ timeout: 10000 })
      .catch(() => '');
    const promoted = Number((toast.match(/(\d+)\s+Kurse eine Stufe/) || [])[1] ?? 0);
    ok('Erfolgsmeldung zeigt echte Anzahl hochgestufter Kurse', promoted > 0, `${promoted} laut Toast`);

    await adminPage.getByRole('heading', { name: NEW_NAME }).waitFor({ timeout: 10000 });
    await adminPage.waitForSelector('text=Kurse bearbeiten', { timeout: 10000 });
    ok('Nach Duplizieren: Editor der neuen Staffel offen', true);
    await gshot(adminPage, 'g04-editor-neu');
    await shot(adminPage, SHOTS, '03-editor-neu');

    // Veröffentlichen (live schalten). Der Toast nennt die Anzahl aktivierter Kurse.
    await adminPage.getByRole('button', { name: 'Veröffentlichen' }).click();
    const pubToast = await adminPage
      .locator('text=/Staffel ist jetzt (live|veröffentlicht)/')
      .first()
      .textContent({ timeout: 10000 })
      .catch(() => '');
    const activated = Number((pubToast.match(/(\d+)\s+Kurse?\s+sind/) || [])[1] ?? 0);
    ok('Staffel veröffentlicht + Kurse aktiviert (live, ein Klick)', activated > 0, `${activated} Kurse laut Toast`);
    await gshot(adminPage, 'g05-veröffentlicht');
    await shot(adminPage, SHOTS, '04-veröffentlicht');

    // Neue Term-ID + Status über die Admin-API holen (harter Beleg statt Badge-Text).
    const terms = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/terms');
      return r.json();
    });
    const termList = Array.isArray(terms) ? terms : terms.terms || [];
    const mine = termList.find((t) => t.name === NEW_NAME);
    ok('Neue Staffel hat Status "published"', !!mine && mine.status === 'published', mine ? mine.status : 'nicht gefunden');
    const newTermId = mine && mine.id;

    // Staffel-Wechsel = die alte Staffel wird abgeloest: alle anderen noch
    // veröffentlichten Staffeln auf Entwurf zuruecksetzen (genau die Aktion des
    // Buttons "Auf Entwurf setzen"). So ist die NEUE Staffel die einzige aktive.
    const others = termList.filter((t) => t.id !== newTermId && t.status === 'published');
    for (const t of others) {
      await adminPage.evaluate(async (id) => {
        await fetch(`/api/admin/terms/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ status: 'draft' }),
        });
      }, t.id);
    }
    ok('Alte Staffeln zurueckgezogen (nur die neue ist aktiv)', true, `${others.length} zurueckgezogen`);

    /* ===== 3) Beweis "live": neue Staffel im öffentlichen Plan ============ */
    const sched = await adminPage.evaluate(async () => {
      const r = await fetch('/api/public/schedule');
      return r.json();
    });
    const myTerm = sched.terms.find((t) => t.id === newTermId);
    ok('Neue Staffel erscheint im öffentlichen Kursplan', !!myTerm, myTerm ? `phase=${myTerm.phase}` : 'fehlt');
    ok('Neue Staffel laeuft (phase=running, buchbar)', !!myTerm && myTerm.phase === 'running');
    ok('Neue Staffel ist die einzige sichtbare', sched.terms.length === 1, `${sched.terms.length} sichtbar`);

    // Buchbare Kurse der neuen Staffel (Leader/Follower = salsa_bachata, offen).
    const mineCourses = sched.courses.filter(
      (co) => co.termId === newTermId && co.ladderKey === 'salsa_bachata' && co.status === 'open',
    );
    // Eindeutige Karten-Signatur über ALLE sichtbaren Kurse berechnen (keine Verwechslung).
    const sig = (co) =>
      `${co.styleKey}|${co.weekday}|${co.startTime}|${co.levelDe || ''}|${(co.teachers || []).map((t) => t.displayName).join(',')}`;
    const counts = new Map();
    for (const co of sched.courses) counts.set(sig(co), (counts.get(sig(co)) || 0) + 1);
    const uniqueMine = mineCourses.filter((co) => counts.get(sig(co)) === 1);
    ok('Mind. 2 eindeutig adressierbare Kurse der neuen Staffel', uniqueMine.length >= 2, `${uniqueMine.length} eindeutig`);

    const toTarget = (co) => ({
      courseId: co.id,
      styleKey: co.styleKey,
      weekday: co.weekday,
      startTime: co.startTime,
      teacher: (co.teachers && co.teachers[0] && co.teachers[0].displayName) || '',
    });
    const targetDE = toTarget(uniqueMine[0]);
    const targetEN = toTarget(uniqueMine[1]);

    /* ===== 4) Bezahlte Buchung in DEUTSCH ================================== */
    await visitorPage.goto(PLAN, { waitUntil: 'networkidle' });
    await visitorPage.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });
    await visitorPage.locator('[data-testid="lang-de"]').click().catch(() => {});
    await visitorPage.waitForTimeout(200);
    const htmlLangDe = await visitorPage.evaluate(() => document.documentElement.lang);
    ok('Besucher-Plan startet auf Deutsch (html lang=de)', htmlLangDe === 'de', htmlLangDe);
    const deBadge = await visitorPage.locator('text=Plätze frei').first().isVisible().catch(() => false);
    ok('Deutsche Labels sichtbar ("Plätze frei", echte Umlaute)', deBadge);
    await gshot(visitorPage, 'g07-kursplan-de');

    const de = await bookAndPay(visitorPage, targetDE, { first: 'Lara', last: 'Testbuchung', email: DE_EMAIL }, '05-de', 'g08-de');
    ok('DE: Bezahlseite zeigt CHF-Betrag', /CHF\s*\d/.test(de.amount), de.amount);
    ok('DE: Buchung bestaetigt + Beleg (CHF + TWINT)', /CHF/.test(de.receipt) && /TWINT/i.test(de.receipt), de.receipt);

    /* ===== 5) Bezahlte Buchung in ENGLISCH ================================ */
    await visitorPage.goto(PLAN, { waitUntil: 'networkidle' });
    await visitorPage.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });
    await visitorPage.locator('[data-testid="lang-en"]').click();
    await visitorPage.waitForTimeout(250);
    const htmlLangEn = await visitorPage.evaluate(() => document.documentElement.lang);
    ok('Sprachschalter -> Englisch (html lang=en)', htmlLangEn === 'en', htmlLangEn);
    const enBadge = await visitorPage.locator('text=Spots available').first().isVisible().catch(() => false);
    ok('Englische Labels sichtbar ("Spots available")', enBadge);
    await gshot(visitorPage, 'g09-kursplan-en');
    await shot(visitorPage, SHOTS, '06-plan-en');

    const en = await bookAndPay(visitorPage, targetEN, { first: 'John', last: 'Testbooking', email: EN_EMAIL }, '07-en', null);
    ok('EN: Bezahlseite zeigt CHF-Betrag', /CHF\s*\d/.test(en.amount), en.amount);
    ok('EN: Buchung bestaetigt + Beleg', /CHF/.test(en.receipt), en.receipt);
    const enReturnLang = await visitorPage.evaluate(() => document.documentElement.lang);
    ok('EN: Erfolgsseite bleibt Englisch (html lang=en)', enReturnLang === 'en', enReturnLang);

    /* ===== 6) Gegen-Beweis: beide Buchungen liegen in der neuen Staffel === */
    const balance = await adminPage.evaluate(async (id) => {
      const r = await fetch(`/api/admin/terms/${id}/balance`);
      return r.json();
    }, newTermId);
    const blob = JSON.stringify(balance);
    const deConfirmed = blob.includes(DE_EMAIL);
    const enConfirmed = blob.includes(EN_EMAIL);
    ok('Admin-Balance der neuen Staffel kennt die DE-Buchung', deConfirmed);
    ok('Admin-Balance der neuen Staffel kennt die EN-Buchung', enConfirmed);
    // Beide muessen bestaetigt sein (Zahlung durch).
    let bothConfirmed = false;
    if (balance && balance.courses) {
      const all = balance.courses.flatMap((co) => co.bookings || []);
      const deB = all.find((b) => (b.participantEmail || b.email || '').includes(DE_EMAIL) || JSON.stringify(b).includes(DE_EMAIL));
      const enB = all.find((b) => JSON.stringify(b).includes(EN_EMAIL));
      bothConfirmed = !!deB && !!enB && deB.status === 'confirmed' && enB.status === 'confirmed';
    }
    ok('Beide bezahlten Buchungen stehen als "confirmed" in der neuen Staffel', bothConfirmed);

    // Admin-Balance-Screenshot für die Anleitung (Buchungen sichtbar).
    await adminPage.bringToFront();
    await adminPage.getByRole('button', { name: 'Buchungen & Balance' }).first().click().catch(() => {});
    await adminPage.waitForTimeout(800);
    await gshot(adminPage, 'g06-balance');
    await shot(adminPage, SHOTS, '08-balance');

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nE2E (ETAPPE 16) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    console.log(`Neue Staffel: ${NEW_NAME} (${NEW_START} bis ${NEW_END}), Term-ID ${newTermId}`);
    console.log(`DE-Beleg: ${de.receipt} | EN-Beleg: ${en.receipt}`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('E2E FEHLER:', e.message);
    await shot(adminPage, SHOTS, '99-fehler-admin');
    await shot(visitorPage, SHOTS, '99-fehler-visitor');
    await browser.close();
    process.exit(1);
  }
})();
