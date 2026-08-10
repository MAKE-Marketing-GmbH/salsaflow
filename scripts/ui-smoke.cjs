// Headless UI-Smoke (Etappe 6): spielt den Blind-Flow in der echten Oberflaeche durch.
// Headless-Pflicht (Memory): laeuft headless über System-Chrome, kein sichtbares Fenster.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = 'http://localhost:5173/admin';
const SHOTS = '.marathon/e6-shots';
const RID = Date.now().toString().slice(-5); // eindeutig pro Lauf (keine Namens-Kollisionen)
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text());
  });

  try {
    // --- Login -------------------------------------------------------------
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.fill('input[type="password"]', 'salsaflow-admin-2026');
    await page.click('button[type="submit"]');
    await page.getByRole('heading', { name: 'Kursplan verwalten' }).waitFor({ timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/01-uebersicht.png`, fullPage: true });
    ok('Nach Login: Übersicht "Kursplan verwalten" sichtbar', true);

    const januarCard = page.locator('div', { hasText: 'Staffel Januar 2026' }).last();
    ok('Staffel Januar 2026 wird angezeigt', await januarCard.isVisible());

    // --- Szenario B: Duplizieren (Auto-Aufstieg) ---------------------------
    // Duplizieren-Button GEZIELT auf der Januar-Karte (deterministisch).
    await page
      .locator('div.rounded-xl', { hasText: 'Staffel Januar 2026' })
      .getByRole('button', { name: /Duplizieren/ })
      .click();
    await page.getByRole('heading', { name: 'Staffel duplizieren' }).waitFor({ timeout: 10000 });
    await page.waitForSelector('text=Kurse & neue Level', { timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/02-duplizieren-vorschau.png`, fullPage: true });

    // Banner mit Auto-Aufstieg-Erklaerung vorhanden?
    const bannerText = await page.locator('text=automatisch eine Stufe hochgesetzt').first().isVisible();
    ok('Vorschau erklaert Auto-Aufstieg', bannerText);

    // Es muss mindestens eine Zeile geben, in der ein altes Level zu einem hoeheren wechselt.
    // Pruefe über die +1-Badges (changed-Kurse).
    const plusBadges = await page.locator('text=+1').count();
    ok('Vorschau zeigt hochgestufte Kurse (+1-Badges)', plusBadges > 0, `${plusBadges} Kurse`);

    // Konkreter Beleg: irgendwo "Beginner Stufe" gefolgt von Pfeil zu naechster Stufe.
    const hasBeginner = await page.locator('text=/Beginner Stufe/').first().isVisible().catch(() => false);
    ok('Vorschau zeigt Level-Bezeichnungen', hasBeginner);

    // Pruefe ein konkretes Dropdown: ein hochgestuftes Salsa/Bachata-Level steht als ausgewaehlt.
    const selects = page.locator('select');
    const selCount = await selects.count();
    let promotedSelectFound = false;
    for (let i = 0; i < selCount; i++) {
      const val = await selects.nth(i).inputValue();
      const txt = await selects.nth(i).locator(`option[value="${val}"]`).textContent().catch(() => '');
      if (txt && /Stufe \d+/.test(txt)) {
        promotedSelectFound = true;
        break;
      }
    }
    ok('Neues Level ist pro Kurs vorausgewaehlt (Dropdown)', promotedSelectFound);

    // Name für das Duplikat eindeutig machen, dann erstellen.
    const dupName = 'UISMOKE Duplikat ' + RID;
    await page.locator('label:has-text("Name der neuen Staffel") input').fill(dupName);
    await page.getByRole('button', { name: 'Staffel jetzt erstellen' }).click();

    // Erfolgsmeldung muss eine ECHTE Anzahl hochgestufter Kurse zeigen (nicht 0).
    const toast = await page
      .locator('text=/Kurse eine Stufe hochgesetzt/')
      .first()
      .textContent({ timeout: 8000 })
      .catch(() => '');
    const promotedNum = Number((toast.match(/(\d+)\s+Kurse eine Stufe/) || [])[1] ?? 0);
    ok('Erfolgsmeldung zeigt echte Anzahl hochgestufter Kurse', promotedNum > 0, `${promotedNum} laut Toast`);

    // Landet im Editor der neuen Staffel.
    await page.getByRole('heading', { name: dupName }).waitFor({ timeout: 10000 });
    await page.waitForSelector('text=Kurse bearbeiten', { timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/03-duplikat-editor.png`, fullPage: true });
    ok('Nach Duplizieren: Editor der neuen Staffel offen', true);

    // Editor zeigt Kurse (gruppiert nach Wochentag) -> Beleg, dass dupliziert wurde.
    const editorHasCourses = await page.locator('text=/\\d{2}:\\d{2}-\\d{2}:\\d{2}/').first().isVisible();
    ok('Duplikat-Editor zeigt übernommene Kurse', editorHasCourses);

    // Vorschau-Tab im Editor funktioniert.
    await page.getByRole('button', { name: 'Vorschau' }).click();
    await page.waitForSelector('text=So sieht der Kursplan später aus', { timeout: 8000 });
    await page.screenshot({ path: `${SHOTS}/04-editor-vorschau.png`, fullPage: true });
    ok('Editor-Vorschau (read-only Plan) funktioniert', true);

    // --- Szenario A: Neue Staffel anlegen ----------------------------------
    // Zurück zur Übersicht.
    await page.getByRole('button', { name: 'Zurück zur Übersicht' }).click();
    await page.getByRole('heading', { name: 'Kursplan verwalten' }).waitFor({ timeout: 8000 });
    await page.getByRole('button', { name: '+ Neue Staffel anlegen' }).click();
    await page.getByRole('heading', { name: 'Neue Staffel anlegen' }).waitFor({ timeout: 8000 });
    const newName = 'UISMOKE Neue Staffel ' + RID;
    await page.locator('label:has-text("Name der Staffel") input').fill(newName);
    await page.screenshot({ path: `${SHOTS}/05-neue-staffel-dialog.png`, fullPage: true });
    await page.getByRole('button', { name: 'Staffel anlegen', exact: true }).click();
    await page.getByRole('heading', { name: newName }).waitFor({ timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/06-neue-staffel-editor.png`, fullPage: true });
    ok('Neue Staffel anlegen -> leerer Editor', true);

    const emptyNote = await page.locator('text=Noch keine Kurse').first().isVisible();
    ok('Neue Staffel ist leer (Hinweis sichtbar)', emptyNote);

    // --- Kurs hinzufügen (Kurs-Verwaltung) --------------------------------
    await page.getByRole('button', { name: '+ Kurs hinzufügen' }).click();
    await page.getByRole('heading', { name: 'Kurs hinzufügen' }).waitFor({ timeout: 8000 });
    await page.screenshot({ path: `${SHOTS}/07-kurs-formular.png`, fullPage: true });
    // Speichern (Footer-Button im Dialog heisst exakt "Kurs hinzufügen").
    await page.getByRole('button', { name: 'Kurs hinzufügen', exact: true }).click();
    await page.waitForSelector('text=/\\d{2}:\\d{2}-\\d{2}:\\d{2}/', { timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/08-kurs-angelegt.png`, fullPage: true });
    ok('Kurs liess sich anlegen', true);

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
