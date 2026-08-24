// R183 Klicktest: der echte Weg, den ein Gast geht.
// Kursplan → Kurskarte → Buchungsseite → Anmeldung. Dazu Header und Kontakt.
// Exit 0 = alles bedienbar.
import pkg from '/usr/lib/node_modules/playwright/index.js';

const B = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
const browser = await pkg.chromium.launch();
let fail = 0;
const ok = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
  if (!cond) fail = 1;
};

const open = async (route, vp) => {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dpr });
  await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto(`${B}${route}`, { waitUntil: 'networkidle' });
  return page;
};
const DESK = { w: 1440, h: 900, dpr: 2 };
const MOB = { w: 390, h: 844, dpr: 3 };

// --- Desktop: Dropdowns oeffnen nach rechts ---
{
  const p = await open('/', DESK);
  for (const label of ['Tanzkurse', 'Events', 'Mehr']) {
    await p.locator('header a, header button', { hasText: new RegExp(`^${label}$`) }).first().hover();
    await p.waitForTimeout(600);
    const box = await p.evaluate((lbl) => {
      const trig = [...document.querySelectorAll('header a, header button')].find((e) => (e.textContent ?? '').trim() === lbl);
      const tr = trig.getBoundingClientRect();
      const panel = [...document.querySelectorAll('header div, header ul')]
        .map((el) => ({ q: el.getBoundingClientRect(), cs: getComputedStyle(el) }))
        .filter(({ q, cs }) => q.top > tr.bottom - 4 && q.height > 40 && q.width > 100 && q.width < 520 && cs.opacity !== '0' && cs.visibility !== 'hidden')
        .sort((a, c) => a.q.top - c.q.top)[0];
      return panel ? { left: Math.round(panel.q.left), trig: Math.round(tr.left) } : null;
    }, label);
    ok(`dropdown-${label}`, box !== null && Math.abs(box.left - box.trig) <= 24,
      box ? `panelLeft ${box.left} = triggerLeft ${box.trig}` : 'kein sichtbares Panel');
  }
  await p.close();
}

// --- Buchungsweg: Kursplan → Karte → Buchung → Anmeldung ---
let buchungUrl = null;
{
  const p = await open('/kursplan', DESK);
  // Auf die Karten warten statt zu raten: sie laden asynchron.
  const karte = p.locator('main a').filter({ hasText: /Stufe|Beginner|Advanced|Intermediate|Open Level/ }).first();
  await karte.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  const n = await p.locator('main a').filter({ hasText: /Stufe|Beginner|Advanced|Intermediate|Open Level/ }).count();
  ok('kursplan-karten', n >= 5, `${n} Kurskarten geladen`);

  const label = (await karte.textContent())?.replace(/\s+/g, ' ').trim().slice(0, 32);
  await karte.scrollIntoViewIfNeeded();
  await karte.click();
  await p.waitForTimeout(1500);
  buchungUrl = p.url();
  ok('karte-fuehrt-zur-buchung', /\/buchung\?kurs=/.test(buchungUrl), `"${label}" → ${buchungUrl.replace(B, '')}`);
  await p.close();
}

// --- Buchungsseite auf Mobil: Schritte, Formular, keine Ueberlaeufe ---
if (buchungUrl) {
  const p = await browser.newPage({ viewport: { width: MOB.w, height: MOB.h }, deviceScaleFactor: MOB.dpr });
  await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto(buchungUrl, { waitUntil: 'networkidle' });
  // Der Kursname steht als h2. Schritt 1 zeigt nur die Kursdaten; die Felder
  // kommen erst in Schritt 2 (Absprache 17.08.: Seite traegt Infos, dann Anmeldung).
  await p.waitForSelector('main h2', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(800);

  const kopf = await p.evaluate(() => ({
    titel: document.querySelector('main h2')?.textContent?.trim().slice(0, 50) ?? null,
    schritte: /1\s*·\s*KURS/i.test(document.querySelector('main')?.innerText ?? ''),
  }));
  ok('buchung-laedt', kopf.titel !== null && kopf.schritte, `Kurs "${kopf.titel}", Schrittleiste da`);

  // Weiter zu Schritt 2: dort liegt das Anmeldeformular.
  const weiter = p.locator('main button').filter({ hasText: /platz reservieren|platz sichern|weiter|anmeld/i }).first();
  if (await weiter.count()) {
    await weiter.scrollIntoViewIfNeeded();
    await weiter.click();
    await p.waitForTimeout(1500);
  }
  ok('buchung-schritt2', (await p.locator('main input').count()) > 0, `${await p.locator('main input').count()} Eingabefelder in Schritt 2`);

  // Bis ans Seitenende scrollen, damit alle Felder gemessen werden.
  await p.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
  });
  await p.waitForTimeout(800);

  const form = await p.evaluate(() => {
    const felder = [...document.querySelectorAll('main input, main select, main textarea, main button')]
      .filter((e) => e.getBoundingClientRect().width > 0);
    const klein = felder.filter((e) => {
      const own = e.getBoundingClientRect();
      if (own.height >= 40) return false;
      const lab = e.closest('label') ?? (e.id ? document.querySelector(`label[for="${e.id}"]`) : null);
      return (lab ? lab.getBoundingClientRect().height : own.height) < 40;
    });
    return {
      felder: felder.length,
      klein: klein.length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    };
  });
  ok('buchung-mobil-kein-ueberlauf', !form.overflow, `scrollWidth ${form.scrollW}/${form.vw}`);
  ok('buchung-mobil-touchziele', form.klein === 0, `${form.felder} Felder, davon zu klein ${form.klein}`);

  // Der Wizard hat mehrere Stufen (Rolle, Zustimmung, dann Kontaktdaten).
  // Bis zum ersten Textfeld weiterklicken, hoechstens vier Stufen.
  const textFeld = () => p.locator('main input[type="text"], main input[type="email"], main input:not([type])').first();
  // Stufe "Anmeldung" verlangt eine Rolle und Allein/Als Paar
  // (Absprache 17.08.: Modal nur Rolle plus Anmeldung). Ohne Wahl bleibt Weiter tot.
  for (let stufe = 0; stufe < 4 && (await textFeld().count()) === 0; stufe += 1) {
    for (const wahl of [/^(Follower|Leader)$/, /^(Allein|Als Paar)$/]) {
      const knopf = p.locator('main button').filter({ hasText: wahl }).first();
      if (await knopf.count()) {
        await knopf.scrollIntoViewIfNeeded();
        await knopf.click().catch(() => {});
        await p.waitForTimeout(400);
      }
    }
    const pflicht = p.locator('main input[type="checkbox"], main input[type="radio"]').first();
    if (await pflicht.count()) await pflicht.check({ force: true }).catch(() => {});
    const next = p.locator('main button').filter({ hasText: /^(weiter|nächster|anmelden|absenden|senden)/i }).first();
    if ((await next.count()) === 0) break;
    await next.scrollIntoViewIfNeeded();
    await next.click().catch(() => {});
    await p.waitForTimeout(1300);
  }
  const feld = textFeld();
  if (await feld.count()) {
    await feld.scrollIntoViewIfNeeded();
    await feld.fill('Testeingabe');
    ok('buchung-tippen', (await feld.inputValue()) === 'Testeingabe', 'Eingabe kommt an');
  } else {
    ok('buchung-tippen', false, 'kein Textfeld im Wizard erreichbar');
  }
  await p.close();
}

// --- Mobil-Header: auf und zu ---
{
  const p = await open('/', MOB);
  await p.waitForTimeout(700);
  // Die Links stehen auch geschlossen im DOM. Gemessen wird die Hoehe des
  // Navigationspanels selbst: zu = 0, offen = ausgeklappt.
  const sichtbar = () => p.evaluate(() => {
    const nav = document.querySelector('#mobile-navigation');
    if (!nav) return -1;
    const q = nav.getBoundingClientRect();
    const cs = getComputedStyle(nav);
    return cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0' ? 0 : Math.round(q.height);
  });
  // Ueber aria-controls zielen: `header button` .last() trifft sonst einen Knopf
  // hinter dem geoeffneten Overlay.
  const schalter = p.locator('header button[aria-controls="mobile-navigation"]').first();
  const zu = await sichtbar();
  await schalter.click();
  await p.waitForTimeout(900);
  const auf = await sichtbar();
  ok('mobil-menue-auf', auf > zu, `Panel-Hoehe ${zu}px → ${auf}px`);
  const expanded = await schalter.getAttribute('aria-expanded');
  ok('mobil-schalter-zustand', expanded === 'true', `aria-expanded ${expanded}`);
  await schalter.click();
  await p.waitForTimeout(900);
  const wieder = await sichtbar();
  ok('mobil-menue-zu', wieder < auf, `Panel-Hoehe ${auf}px → ${wieder}px`);
  await p.close();
}

// --- Kontakt-Formular auf Mobil ---
{
  const p = await open('/kontakt', MOB);
  await p.waitForTimeout(1200);
  // Der Assistent startet mit der Anliegen-Wahl. Erst danach kommen die Textfelder.
  const feldEins = () => p.locator('main input[type="text"], main input[type="email"], main input:not([type])').first();
  for (let stufe = 0; stufe < 3 && (await feldEins().count()) === 0; stufe += 1) {
    const radio = p.locator('main input[type="radio"]').first();
    if (await radio.count()) await radio.check({ force: true }).catch(() => {});
    const next = p.locator('main button').filter({ hasText: /^(weiter|anfrage starten|nächster)/i }).first();
    if ((await next.count()) === 0) break;
    await next.scrollIntoViewIfNeeded();
    await next.click().catch(() => {});
    await p.waitForTimeout(1200);
  }
  const feld = feldEins();
  if (await feld.count()) {
    await feld.scrollIntoViewIfNeeded();
    await feld.fill('Testeingabe');
    ok('kontakt-tippen', (await feld.inputValue()) === 'Testeingabe', 'Eingabe kommt an');
  } else {
    ok('kontakt-tippen', false, 'kein Textfeld im Kontakt-Assistenten erreichbar');
  }
  const of = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  ok('kontakt-kein-ueberlauf', !of, `Ueberlauf ${of}`);
  await p.close();
}

await browser.close();
console.log(fail ? '\nKLICKTEST FAIL' : '\nKLICKTEST PASS');
process.exit(fail);
