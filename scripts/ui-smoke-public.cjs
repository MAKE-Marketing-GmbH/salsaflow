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
    await page.locator('[data-testid="lang-en"]').click();
    await page.getByRole('heading', { name: 'Find your course.' }).waitFor({ timeout: 8000 });
    const bodyEn = await page.locator('body').innerText();
    await page.screenshot({ path: `${SHOTS}/02-desktop-en.png`, fullPage: true });

    ok('UI wechselt DE->EN (Laufende Kurse -> Ongoing courses)',
      bodyDe.includes('Laufende Kurse') && bodyEn.includes('Ongoing courses'),
      'Phasen-Schalter uebersetzt');
    ok('Level-Begriffe wechseln (Stufe -> Level, DB-getrieben)',
      bodyDe.includes('Stufe') && !bodyEn.includes('Stufe'),
      'kein "Stufe" mehr in EN');
    ok('Wochentag wechselt (Montag -> Monday)',
      bodyDe.includes('Montag') && bodyEn.includes('Monday') && !bodyEn.includes('Montag'),
      'Wochentags-Ueberschrift uebersetzt');
    ok('Status-Chip "frei" uebersetzt (Plätze frei -> Spots available)',
      bodyDe.includes('Plätze frei') && bodyEn.includes('Spots available'));
    ok('Status-Chip "voll" sichtbar + uebersetzt (Ausgebucht -> Fully booked)',
      bodyDe.includes('Ausgebucht') && bodyEn.includes('Fully booked'),
      'full-Kurse vorhanden');
    ok('Echte Umlaute im DE-UI (keine ASCII-Ersatzschreibung)',
      bodyDe.includes('zukünftig') && bodyDe.includes('möglich') && !bodyDe.includes('zukuenftig'),
      'Regel 069');

    // Zurueck auf DE fuer die Filter-Tests.
    await page.locator('[data-testid="lang-de"]').click();
    await page.getByRole('heading', { name: 'Finde deinen Kurs.' }).waitFor({ timeout: 8000 });

    // --- Phasen-Filter: laufend / zukuenftig ------------------------------
    await page.locator('[data-testid="phase-upcoming"]').click();
    await page.waitForTimeout(250);
    const upCount = await cardCount(page);
    const upPhases = await allCardsAttr(page, 'data-phase');
    ok('Filter "Neu & zukuenftig" zeigt nur zukuenftige Kurse',
      upCount > 0 && upPhases.every((p) => p === 'upcoming'),
      `${upCount} Karten, alle upcoming`);

    await page.locator('[data-testid="phase-running"]').click();
    await page.waitForTimeout(250);
    const runCount = await cardCount(page);
    const runPhases = await allCardsAttr(page, 'data-phase');
    ok('Filter "Laufende Kurse" zeigt nur laufende Kurse',
      runCount > 0 && runPhases.every((p) => p === 'running'),
      `${runCount} Karten, alle running`);

    await page.locator('[data-testid="phase-all"]').click();
    await page.waitForTimeout(250);
    ok('Phasen-Filter "Alle" stellt vollen Plan wieder her', (await cardCount(page)) === baseAll, `${baseAll}`);

    // --- Tag-Filter -------------------------------------------------------
    const dayChips = page.locator('[data-testid^="day-"]');
    const dayIds = (await dayChips.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')))).filter(
      (id) => id && id !== 'day-all',
    );
    const dayKey = dayIds[0].replace('day-', '');
    await page.locator(`[data-testid="day-${dayKey}"]`).click();
    await page.waitForTimeout(250);
    const dayWeekdays = await allCardsAttr(page, 'data-weekday');
    ok('Tag-Filter zeigt nur den gewaehlten Wochentag',
      dayWeekdays.length > 0 && dayWeekdays.every((w) => w === dayKey),
      `Tag ${dayKey}: ${dayWeekdays.length} Karten`);
    await page.locator('[data-testid="day-all"]').click();
    await page.waitForTimeout(200);

    // --- Stil-Filter ------------------------------------------------------
    const styleChips = page.locator('[data-testid^="style-"]');
    const styleIds = (await styleChips.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')))).filter(
      (id) => id && id !== 'style-all',
    );
    const styleKey = styleIds[0].replace('style-', '');
    await page.locator(`[data-testid="style-${styleKey}"]`).click();
    await page.waitForTimeout(250);
    const styleVals = await allCardsAttr(page, 'data-style');
    ok('Stil-Filter zeigt nur den gewaehlten Stil',
      styleVals.length > 0 && styleVals.every((s) => s === styleKey),
      `Stil ${styleKey}: ${styleVals.length} Karten`);
    await page.locator('[data-testid="style-all"]').click();
    await page.waitForTimeout(200);

    // --- Level-Filter (nach Kategorie) ------------------------------------
    const levelChips = page.locator('[data-testid^="level-"]');
    const levelIds = (await levelChips.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')))).filter(
      (id) => id && id !== 'level-all',
    );
    if (levelIds.length > 0) {
      const before = await cardCount(page);
      await page.locator(`[data-testid="${levelIds[0]}"]`).click();
      await page.waitForTimeout(250);
      const lvCount = await cardCount(page);
      ok('Level-Filter grenzt den Plan ein', lvCount > 0 && lvCount <= before, `${lvCount}/${before} Karten`);
    } else {
      ok('Level-Filter vorhanden', false, 'keine Level-Chips gefunden');
    }

    // --- Kombi-Filter (Tag + Stil) ---------------------------------------
    await page.locator('[data-testid="reset-filters"]').click();
    await page.waitForTimeout(200);
    await page.locator(`[data-testid="day-${dayKey}"]`).click();
    await page.locator(`[data-testid="style-${styleKey}"]`).click();
    await page.waitForTimeout(250);
    const comboW = await allCardsAttr(page, 'data-weekday');
    const comboS = await allCardsAttr(page, 'data-style');
    ok('Kombi-Filter (Tag + Stil) schneidet korrekt',
      comboW.every((w) => w === dayKey) && comboS.every((s) => s === styleKey),
      `${comboW.length} Karten`);

    // --- Reset ------------------------------------------------------------
    await page.locator('[data-testid="reset-filters"]').click();
    await page.waitForTimeout(250);
    ok('Filter zuruecksetzen stellt vollen Plan wieder her', (await cardCount(page)) === baseAll, `${baseAll}`);

    // --- Mobil sauber (iPhone-Breite, kein horizontales Scrollen) ---------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 8000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    ok('Mobil ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-de.png`, fullPage: true });
    await page.locator('[data-testid="lang-en"]').click();
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
