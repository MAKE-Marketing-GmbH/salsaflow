// Headless UI-Smoke (Etappe 13): Team-Seite /team + Fotos-Galerie /fotos.
// Prueft: Team nach Rollen (5 Gruppen + Anzahl), echte Einzelportraits (geladen), Rollen-Bios,
// Galerie funktioniert (Manifest-Fotos, Filter, Lightbox auf/zu + weiter), DE/EN-Umschalter,
// mobile Sauberkeit. Headless-Pflicht (Memory): laeuft headless ueber System-Chrome.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = 'http://localhost:5173';
const SHOTS = '.marathon/e13-shots';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function noHOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const errors = [];
  const failedImgs = [];

  // ======================================================== TEAM-SEITE ====
  // reducedMotion: die gespeicherten Screenshots sind so verlaesslich (Scroll-Reveal startet
  // sonst opacity:0 und ein zu frueher Vollseiten-Shot wirkt faelschlich leer, Regel 006/034).
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 }, reducedMotion: 'reduce' });
  page.on('pageerror', (e) => errors.push('TEAM ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push('TEAM ' + m.text()));
  page.on('requestfailed', (r) => /\/photos\//.test(r.url()) && failedImgs.push(r.url()));

  try {
    await page.goto(`${BASE}/team`, { waitUntil: 'networkidle' });
    const bodyDe = await page.locator('main').innerText();

    // Team nach Rollen: alle 5 Rollengruppen
    ok('Rolle: Inhaber und Lehrer', bodyDe.includes('Inhaber und Lehrer'));
    ok('Rolle: Lehrer und Pushflower', bodyDe.includes('Lehrer und Pushflower'));
    ok('Rolle: Lehrer in Ausbildung', bodyDe.includes('Lehrer in Ausbildung'));
    ok('Rolle: Pushflowers', bodyDe.includes('Pushflowers'));
    ok('Rolle: DJ/Eventmanager/Allrounder',
      bodyDe.includes('DJ') && bodyDe.includes('Eventmanager') && bodyDe.includes('Allrounder'));
    // Anzahl pro Rolle (4/17/2/11/3)
    ok('Rollen-Anzahl sichtbar (4,17,2,11,3)',
      ['4', '17', '2', '11', '3'].every((n) => bodyDe.includes(n)));
    // Rollen-Bios (echte Beschreibungen)
    ok('Rollen-Bios vorhanden', bodyDe.includes('Pushflower auf der Tanzfläche') || bodyDe.includes('gegründet haben'));
    // Geschichte (vier Freunde)
    ok('Geschichte: vier Freunde', bodyDe.toLowerCase().includes('vier freunde'));
    // Copy-Standard (Regel 069): echte Umlaute, keine ASCII-ae/oe/ue in sichtbaren DE-Texten
    ok('Echte Umlaute (kein ae/oe/ue) in DE-Texten',
      /[äöü]/.test(bodyDe) && !/(Tanzflaeche|gehoerst|groesstes|naechsten|gegruendet|fuehren|fuehlt)/.test(bodyDe));

    // Echte Einzelportraits: die 5 echten benannten Coaches (Aleksandra, Anina, Jelena, Maarten,
    // Tobias), alle geladen. Frueher >=7, aber es gibt real nur 5 benannte Coaches - keine
    // erfundenen Identitaeten dazuerfinden (Geil-Pass v2, Fakten-Invariante).
    const portraits = await page.locator('img[src^="/photos/team/"]').evaluateAll((els) =>
      els.map((e) => ({ src: e.getAttribute('src'), w: e.naturalWidth })));
    const uniquePortraits = [...new Set(portraits.map((p) => p.src))];
    ok('Echte Einzelportraits vorhanden (>=5 benannte Coaches)', uniquePortraits.length >= 5, `${uniquePortraits.length} Portraits`);
    ok('Alle Portraits geladen (naturalWidth>0)', portraits.length > 0 && portraits.every((p) => p.w > 0));

    await page.screenshot({ path: `${SHOTS}/team-desktop-de.png`, fullPage: true });

    // DE/EN-Umschalter
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.waitForTimeout(350);
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    const bodyEn = await page.locator('main').innerText();
    ok('DE/EN schaltet (html lang=en)', htmlLang === 'en');
    ok('DE/EN schaltet Inhalt (Owners and teachers)', bodyEn.includes('Owners and teachers'));
    await page.locator('[data-testid="lang-de"]').first().click();
    await page.waitForTimeout(250);

    // Mobil
    await page.setViewportSize({ width: 390, height: 2600 });
    await page.waitForTimeout(300);
    ok('Team mobil: kein horizontaler Ueberlauf (390px)', await noHOverflow(page));
    await page.screenshot({ path: `${SHOTS}/team-mobile-de.png`, fullPage: true });
  } catch (e) {
    ok('Team-Seite laedt ohne Fehler', false, e.message);
  }
  await page.close();

  // ======================================================= FOTOS-SEITE ====
  const gp = await browser.newPage({ viewport: { width: 1280, height: 2400 }, reducedMotion: 'reduce' });
  gp.on('pageerror', (e) => errors.push('FOTOS ' + e.message));
  gp.on('console', (m) => m.type() === 'error' && errors.push('FOTOS ' + m.text()));
  gp.on('requestfailed', (r) => /\/photos\//.test(r.url()) && failedImgs.push(r.url()));

  try {
    await gp.goto(`${BASE}/fotos`, { waitUntil: 'networkidle' });
    await gp.locator('[data-testid="gallery-photo"]').first().waitFor({ timeout: 15000 });

    // Galerie-Fotos aus dem Manifest geladen
    const photos = await gp.locator('[data-testid="gallery-photo"] img').evaluateAll((els) =>
      els.map((e) => ({ src: e.getAttribute('src'), w: e.naturalWidth })));
    const fromGallery = photos.filter((p) => p.src && p.src.includes('/photos/gallery/'));
    ok('Galerie nutzt Manifest-Fotos (/photos/gallery/)', fromGallery.length >= 12, `${fromGallery.length} Galerie-Fotos`);
    ok('Alle Galerie-Fotos geladen (naturalWidth>0)', photos.length > 0 && photos.every((p) => p.w > 0), `${photos.length} total`);

    // Filter-Chips
    const bodyG = await gp.locator('main').innerText();
    ok('Filter: Alben (Danceflow + Kurse)',
      bodyG.includes('Danceflow Nights') && bodyG.includes('Kurse und Unterricht'));
    ok('Kein Buehnen-Album (Wasserzeichen entfernt)', !bodyG.includes('Shows und Buehne'));

    await gp.screenshot({ path: `${SHOTS}/fotos-desktop-de.png`, fullPage: true });

    // Filter funktioniert: nur Kurse zeigen
    const totalBefore = await gp.locator('[data-testid="gallery-photo"]').count();
    await gp.locator('[data-testid="gallery-filter-kurse"]').click();
    await gp.waitForTimeout(300);
    const afterKurse = await gp.locator('[data-testid="gallery-photo"]').count();
    ok('Filter reduziert Auswahl (Kurse < Alle)', afterKurse > 0 && afterKurse < totalBefore, `${afterKurse} von ${totalBefore}`);
    await gp.locator('[data-testid="gallery-filter-all"]').click();
    await gp.waitForTimeout(250);

    // Lightbox funktioniert: oeffnen, weiter, schliessen
    await gp.locator('[data-testid="gallery-photo"]').first().click();
    await gp.waitForTimeout(300);
    const dialog = gp.locator('[role="dialog"][aria-modal="true"]');
    ok('Lightbox oeffnet (role=dialog)', (await dialog.count()) === 1);
    const firstSrc = await dialog.locator('img').getAttribute('src');
    await gp.screenshot({ path: `${SHOTS}/fotos-lightbox.png` });
    // Weiter (Pfeiltaste)
    await gp.keyboard.press('ArrowRight');
    await gp.waitForTimeout(250);
    const secondSrc = await dialog.locator('img').getAttribute('src');
    ok('Lightbox: weiter wechselt das Bild', firstSrc && secondSrc && firstSrc !== secondSrc);
    // Schliessen (ESC)
    await gp.keyboard.press('Escape');
    await gp.waitForTimeout(250);
    ok('Lightbox schliesst (ESC)', (await gp.locator('[role="dialog"][aria-modal="true"]').count()) === 0);

    // DE/EN
    await gp.locator('[data-testid="lang-en"]').first().click();
    await gp.waitForTimeout(300);
    const bodyGEn = await gp.locator('main').innerText();
    ok('Galerie DE/EN schaltet (Courses and classes)', bodyGEn.includes('Courses and classes'));
    await gp.locator('[data-testid="lang-de"]').first().click();
    await gp.waitForTimeout(200);

    // Mobil
    await gp.setViewportSize({ width: 390, height: 2600 });
    await gp.waitForTimeout(300);
    ok('Fotos mobil: kein horizontaler Ueberlauf (390px)', await noHOverflow(gp));
    await gp.screenshot({ path: `${SHOTS}/fotos-mobile-de.png`, fullPage: true });
  } catch (e) {
    ok('Fotos-Seite laedt ohne Fehler', false, e.message);
  }
  await gp.close();

  // ============================================================= GLOBAL ====
  ok('Keine Konsolen-/Page-Fehler', errors.length === 0, errors.slice(0, 4).join(' | '));
  ok('Keine fehlgeschlagenen Foto-Requests', failedImgs.length === 0, failedImgs.slice(0, 3).join(' | '));

  await browser.close();
  const passed = results.filter((r) => r.cond).length;
  console.log(`\nVERDICT: ${passed === results.length ? 'PASS' : 'FAIL'} (${passed}/${results.length})`);
  process.exit(passed === results.length ? 0 : 1);
})();
