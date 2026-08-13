// Headless UI-Smoke (Etappe 7): oeffentlicher Kursplan unter /kursplan.
// Prueft DB-Daten-Anzeige, DE/EN-Umschalter (alle Level-/Stil-Begriffe), Filter
// (laufend/zukuenftig, Tag, Stil, Level) und mobile Sauberkeit. Headless-Pflicht (Memory):
// laeuft headless ueber System-Chrome, kein sichtbares Fenster.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = 'http://localhost:5173/kursplan';
const SHOTS = '.marathon/e7-shots';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function cardCount(page) {
  return page.locator('[data-testid="course-card"]').count();
}
async function allCardsAttr(page, attr) {
  return page.locator('[data-testid="course-card"]').evaluateAll(
    (els, a) => els.map((e) => e.getAttribute(a)),
    attr,
  );
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text());
  });

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 15000 });

    // --- Grunddaten aus der DB sichtbar -----------------------------------
    const baseAll = await cardCount(page);
    ok('Kursplan zeigt Kurse aus der DB', baseAll > 0, `${baseAll} Karten`);
    ok('Titel "Finde deinen Kurs." sichtbar (DE)', await page.getByRole('heading', { name: 'Finde deinen Kurs.' }).isVisible());
    await page.screenshot({ path: `${SHOTS}/01-desktop-de.png`, fullPage: true });

    const bodyDe = await page.locator('body').innerText();

    // --- DE/EN-Umschalter: UI + DB-Begriffe wechseln ----------------------
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.getByRole('heading', { name: 'Find your class.' }).waitFor({ timeout: 8000 });
    const bodyEn = await page.locator('body').innerText();
    await page.screenshot({ path: `${SHOTS}/02-desktop-en.png`, fullPage: true });

    // Aktuelles Design (Slot-Faltung 13.08.2026): KEIN Phasen-Schalter, KEIN day-all,
    // KEINE Level-Chips mehr — ein Tag ist immer aktiv, dazu Stil-Chips.
    ok('UI wechselt DE->EN (Alle Stile -> All styles)',
      bodyDe.includes('Alle Stile') && bodyEn.includes('All styles'),
      'Stil-Chips uebersetzt');
    ok('Level-Begriffe wechseln (Stufe -> Level, DB-getrieben)',
      bodyDe.includes('Stufe') && !bodyEn.includes('Stufe'),
      'kein "Stufe" mehr in EN');
    ok('Wochentag wechselt (Montag -> Monday)',
      bodyDe.includes('Montag') && bodyEn.includes('Monday') && !bodyEn.includes('Montag'),
      'Wochentags-Ueberschrift uebersetzt');
    ok('Status-Chip "frei" uebersetzt (Plätze frei -> Spots available)',
      bodyDe.includes('Plätze frei') && bodyEn.includes('Spots available'));
    // "Ausgebucht" existiert nur, wenn wirklich ALLE Staffeln eines Slots voll sind —
    // datenabhaengig, darum nur bei Vorkommen die Uebersetzung pruefen.
    ok('Status-Chip "voll" uebersetzt, falls vorhanden',
      !bodyDe.includes('Ausgebucht') || bodyEn.includes('Fully booked'),
      bodyDe.includes('Ausgebucht') ? 'full-Kurse vorhanden' : 'keine vollen Kurse im Datenstand');
    ok('Echte Umlaute im DE-UI (keine ASCII-Ersatzschreibung)',
      bodyDe.includes('Wähle') && bodyDe.includes('läuft') && !bodyDe.includes('Waehle'),
      'Regel 069');

    // Zurueck auf DE fuer die Filter-Tests.
    await page.locator('[data-testid="lang-de"]').first().click();
    await page.getByRole('heading', { name: 'Finde deinen Kurs.' }).waitFor({ timeout: 8000 });

    // --- Tag-Tabs: genau ein Tag aktiv, Liste folgt -----------------------
    const dayIds = (await page.locator('[data-testid^="day-"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('data-testid')),
    )).filter(Boolean);
    ok('Tag-Tabs vorhanden (Mo-Sa)', dayIds.length === 6, `${dayIds.length} Tabs`);
    const dayKey = dayIds[1].replace('day-', '');
    await page.locator(`[data-testid="day-${dayKey}"]`).click();
    await page.waitForTimeout(250);
    const dayWeekdays = await allCardsAttr(page, 'data-weekday');
    ok('Tag-Tab zeigt nur den gewaehlten Wochentag',
      dayWeekdays.length > 0 && dayWeekdays.every((w) => w === dayKey),
      `Tag ${dayKey}: ${dayWeekdays.length} Karten`);

    // --- Stil-Filter ------------------------------------------------------
    const dayBase = await cardCount(page);
    const styleIds = (await page.locator('[data-testid^="style-"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('data-testid')),
    )).filter((id) => id && id !== 'style-all');
    // Einen Stil waehlen, der an diesem Tag vorkommt (sonst ist die Liste leer).
    const presentStyles = await allCardsAttr(page, 'data-style');
    const styleKey = styleIds.map((id) => id.replace('style-', '')).find((s) => presentStyles.includes(s));
    await page.locator(`[data-testid="style-${styleKey}"]`).click();
    await page.waitForTimeout(250);
    const styleVals = await allCardsAttr(page, 'data-style');
    ok('Stil-Filter zeigt nur den gewaehlten Stil',
      styleVals.length > 0 && styleVals.every((s) => s === styleKey),
      `Stil ${styleKey}: ${styleVals.length} Karten`);

    // Kombi ist damit implizit gedeckt: Tag-Tab + Stil-Chip aktiv.
    const comboW = await allCardsAttr(page, 'data-weekday');
    ok('Kombi (Tag + Stil) schneidet korrekt',
      comboW.length > 0 && comboW.every((w) => w === dayKey),
      `${comboW.length} Karten`);

    // --- Reset ueber "Alle Stile" -----------------------------------------
    await page.locator('[data-testid="style-all"]').click();
    await page.waitForTimeout(250);
    ok('"Alle Stile" stellt den Tagesplan wieder her', (await cardCount(page)) === dayBase, `${dayBase}`);

    // --- Mobil sauber (iPhone-Breite, kein horizontales Scrollen) ---------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 8000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    ok('Mobil ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-de.png`, fullPage: true });
    // Mobil liegt der Sprachschalter im Burger-Menue: fuer den EN-Shot auf Desktop-Breite
    // umschalten, dann zurueck auf 390.
    await page.setViewportSize({ width: 1280, height: 1600 });
    await page.waitForTimeout(200);
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SHOTS}/04-mobile-en.png`, fullPage: true });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (PUBLIC) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
