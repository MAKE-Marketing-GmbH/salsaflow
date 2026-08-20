// R186 (Dom, 20.08.): Der Klickweg, den Dom beschrieben hat, komplett durchlaufen.
// "Wenn me denn drufklickt ... de Kursplan (gfileret) mit em agebot vo dene Tänz wo
// mir hänn sowie d verlinkig zur kursbuechig".
//
// Also: Karte -> Stilseite -> gefilterter Kursplan -> Kursbuchung. Privatstunden
// gehen ihren eigenen Anfrageweg und tauchen im Kursplanfilter nicht auf.
//
// Ein Browser pro Gate war in R183 zu sproede (stirbt er, fallen alle folgenden Gates
// mit "browser has been closed" und das liest sich wie ein Seitenfehler). Dieses Skript
// nutzt EINEN Browser fuer alle Pruefungen, faengt aber jeden Fehler pro Pruefung ab.
//
// R187-Nachtrag 1: Der Schutz griff nicht. Bei vielen parallelen Chrome-Prozessen starb
// der Browser mitten im Lauf, und `neu()` selbst warf — ausserhalb der try-Bloecke.
// Das Skript brach nach Pruefung 10 von 20 ab.
//
// R187-Nachtrag 2: Auch der Neustart reichte nicht. Er prueft `browser.isConnected()`,
// aber eine einzelne Seite kann in einem lebenden Browser sterben. Drei Laeufe gaben
// drei verschiedene FAIL (`buchung-salsa`, `karte-klick-bachata`, `karte-klick-privat`)
// und einmal 20/20 — ein wandernder Fehler ist ein Testfehler, kein Seitenfehler.
// Jetzt bekommt jede Pruefung ihren eigenen Browser, wie in R184 und R185.
// `p.close()` faehrt ihn gleich mit herunter, darum bleibt der Testcode unveraendert.
import pkg from '/usr/lib/node_modules/playwright/index.js';

const BASE = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
const { chromium } = pkg;

const ergebnisse = [];
const merke = (name, ok, beleg) => {
  ergebnisse.push({ name, ok, beleg });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${beleg}`);
};

const starte = () => chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] });
const neu = async (w = 1440, h = 730) => {
  const browser = await starte();
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  const schliessen = p.close.bind(p);
  p.close = async () => { await schliessen().catch(() => null); await browser.close().catch(() => null); };
  return p;
};

// Wache: 5173 liefert AlpenEnergie und antwortet ebenfalls 200. Der Titel entscheidet.
{
  const p = await neu();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const titel = await p.title();
  if (!/Salsaflow/i.test(titel)) {
    console.error(`ABBRUCH: ${BASE} ist nicht Salsaflow, Titel "${titel}"`);
    await p.close();
    process.exit(2);
  }
  merke('guard', true, `${BASE} = "${titel}"`);
  await p.close();
}

const KARTEN = [
  { key: 'salsa', titel: 'Salsa', ziel: '/tanzkurse/salsa' },
  { key: 'bachata', titel: 'Bachata', ziel: '/tanzkurse/bachata' },
  { key: 'heels', titel: 'Heels', ziel: '/tanzkurse/heels' },
  { key: 'privat', titel: 'Privatstunden', ziel: '/privatstunden' },
];

// --- 1. Vier Karten, richtige Reihenfolge, echter Klick ------------------------------
for (const karte of KARTEN) {
  const p = await neu();
  try {
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const link = p.locator(`#angebot a[href="${karte.ziel}"]`).first();
    const anzahl = await link.count();
    if (anzahl === 0) {
      merke(`karte-klick-${karte.key}`, false, `Kein Link auf ${karte.ziel} in #angebot`);
      continue;
    }
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await p.waitForURL(`**${karte.ziel}`, { timeout: 15000 });
    const h1 = (await p.locator('h1').first().textContent())?.trim() ?? '';
    merke(`karte-klick-${karte.key}`, true, `${karte.ziel} geoeffnet, H1 "${h1.slice(0, 60)}"`);
  } catch (err) {
    merke(`karte-klick-${karte.key}`, false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 2. Angebotsreihenfolge Desktop und Mobil ---------------------------------------
for (const [name, w, h, achse] of [['desktop', 1440, 730, 'x'], ['mobil', 390, 844, 'y']]) {
  const p = await neu(w, h);
  try {
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const reihe = await p.evaluate((a) => {
      const sek = document.querySelector('#angebot');
      if (!sek) return null;
      return [...sek.querySelectorAll('a')]
        .filter((el) => el.querySelector('img'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { href: el.getAttribute('href'), pos: Math.round(a === 'x' ? r.left : r.top) };
        })
        .sort((l, r) => l.pos - r.pos)
        .map((el) => el.href);
    }, achse);
    const soll = KARTEN.map((k) => k.ziel);
    const ok = reihe !== null && JSON.stringify(reihe) === JSON.stringify(soll);
    merke(`reihenfolge-${name}`, ok, `nach ${achse} sortiert: ${JSON.stringify(reihe)}`);
  } catch (err) {
    merke(`reihenfolge-${name}`, false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 3. Titel exakt, kein leerer Absatz, WhyGrid weg --------------------------------
{
  const p = await neu();
  try {
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const mess = await p.evaluate(() => {
      const sek = document.querySelector('#angebot');
      const h2 = sek?.querySelector('h2')?.textContent?.trim() ?? null;
      const leer = sek ? [...sek.querySelectorAll('p')].filter((el) => !el.textContent?.trim()).length : -1;
      // WhyGrid trug diese Zeile. Steht sie noch irgendwo im main, ist sie nicht raus.
      const whygrid = /keinen perfekten Moment/i.test(document.querySelector('main')?.textContent ?? '');
      return { h2, leer, whygrid };
    });
    merke('titel-exakt', mess.h2 === 'Salsa, Bachata, Heels.', `H2 = ${JSON.stringify(mess.h2)}`);
    merke('kein-leerer-absatz', mess.leer === 0, `${mess.leer} leere <p> in #angebot`);
    merke('whygrid-raus', mess.whygrid === false, `Zeile "keinen perfekten Moment" im main: ${mess.whygrid}`);
  } catch (err) {
    merke('titel-exakt', false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 4. Angebot folgt direkt auf den Hero -------------------------------------------
{
  const p = await neu();
  try {
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const folge = await p.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return null;
      const sek = [...main.children].filter((el) => el.tagName === 'SECTION' || el.querySelector('h1, h2'));
      return sek.slice(0, 3).map((el) => el.id || el.tagName.toLowerCase());
    });
    // Der Hero traegt kein id-Attribut, das Angebot heisst #angebot. Es muss die
    // erste Sektion MIT id nach dem Hero sein.
    const ok = Array.isArray(folge) && folge.indexOf('angebot') === 1;
    merke('angebot-nach-hero', ok, `erste Bausteine: ${JSON.stringify(folge)}`);
  } catch (err) {
    merke('angebot-nach-hero', false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 5. Drei gefilterte Kursplaene, je aus der Stilseite geklickt -------------------
for (const stil of ['salsa', 'bachata', 'heels']) {
  const p = await neu();
  try {
    await p.goto(`${BASE}/tanzkurse/${stil}`, { waitUntil: 'networkidle' });
    const link = p.locator(`a[href="/kursplan?stil=${stil}"]`).first();
    try {
      await link.waitFor({ state: 'attached', timeout: 20000 });
    } catch {
      merke(`filter-${stil}`, false, `Kein Link /kursplan?stil=${stil} auf der Stilseite (20s gewartet)`);
      continue;
    }
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await p.waitForURL('**/kursplan**', { timeout: 15000 });
    // Wie in Abschnitt 6: auf die Kursliste warten, nicht auf die Uhr.
    // Sonst misst der Test die Ladezeit statt den Filter.
    await p.locator('a[href*="/buchung?kurs="]').first()
      .waitFor({ state: 'attached', timeout: 20000 }).catch(() => null);
    const mess = await p.evaluate(() => {
      const chips = [...document.querySelectorAll('[aria-pressed="true"]')].map((el) => el.textContent?.trim());
      const buchung = [...document.querySelectorAll('a[href*="/buchung?kurs="]')].length;
      // Die Kurstitel verraten, ob wirklich nur ein Stil uebrig ist.
      const titel = [...document.querySelectorAll('h3, h4')].map((el) => el.textContent?.trim()).filter(Boolean);
      return { chips, buchung, titel: titel.slice(0, 12), url: location.search };
    });
    const chipDa = mess.chips.some((c) => new RegExp(stil, 'i').test(c ?? ''));
    // Ein gefilterter Plan darf keinen fremden Stil mehr zeigen.
    const fremde = ['salsa', 'bachata', 'heels']
      .filter((s) => s !== stil)
      .filter((s) => mess.titel.some((t) => new RegExp(s, 'i').test(t)));
    const ok = chipDa && fremde.length === 0 && mess.buchung > 0;
    merke(
      `filter-${stil}`,
      ok,
      `URL ${mess.url} · Chip aktiv ${chipDa} · fremde Stile ${JSON.stringify(fremde)} · ${mess.buchung} Buchungslinks`,
    );
  } catch (err) {
    merke(`filter-${stil}`, false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 6. Drei echte Kursbuchungen ----------------------------------------------------
for (const stil of ['salsa', 'bachata', 'heels']) {
  const p = await neu();
  try {
    await p.goto(`${BASE}/kursplan?stil=${stil}`, { waitUntil: 'networkidle' });
    // Feste 1800ms reichten nicht: die Kursliste kommt asynchron, und welcher Stil
    // rechtzeitig fertig war, wechselte von Lauf zu Lauf. Zwei Laeufe hintereinander
    // meldeten erst "salsa ok, bachata/heels leer", dann genau umgekehrt.
    // Auf das Element warten statt auf die Uhr.
    const link = p.locator('a[href*="/buchung?kurs="]').first();
    try {
      await link.waitFor({ state: 'attached', timeout: 20000 });
    } catch {
      merke(`buchung-${stil}`, false, `Kein /buchung?kurs= im gefilterten Plan (20s gewartet)`);
      continue;
    }
    const href = await link.getAttribute('href');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await p.waitForURL('**/buchung**', { timeout: 15000 });
    await p.waitForTimeout(1800);
    // Erster Versuch suchte hier ein Formularfeld und meldete FAIL. Das war ein
    // Messfehler, kein Seitenfehler: die Buchung laeuft in drei Schritten
    // ("1 · Kurs → 2 · Anmeldung → 3 · Fertig"), die Felder liegen in Schritt 2.
    // Schritt 1 belegt die richtige Buchung ueber den geladenen Kurs.
    const mess = await p.evaluate(() => {
      const main = document.querySelector('main');
      const txt = main?.textContent ?? '';
      return {
        schritte: /1\s*·\s*Kurs/i.test(txt) && /2\s*·\s*Anmeldung/i.test(txt),
        // Ein echter Kurs traegt Wochentag und Uhrzeit.
        kurs: /(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)[^]{0,40}\d{1,2}[:.]\d{2}/i.test(txt),
        auszug: txt.trim().slice(0, 90),
      };
    });
    merke(
      `buchung-${stil}`,
      mess.schritte && mess.kurs,
      `${href} · Schrittleiste ${mess.schritte} · Kurstermin ${mess.kurs} · "${mess.auszug}"`,
    );
  } catch (err) {
    merke(`buchung-${stil}`, false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 7. Privatstunden: Anfrageweg da, nicht im Kursplanfilter -----------------------
{
  const p = await neu();
  try {
    await p.goto(`${BASE}/privatstunden`, { waitUntil: 'networkidle' });
    const wege = await p.evaluate(() => {
      const a = [...document.querySelectorAll('a')].map((el) => el.getAttribute('href') ?? '');
      return {
        kontakt: a.filter((h) => /kontakt|anfrage|wa\.me|whatsapp|mailto/i.test(h)).length,
        h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      };
    });
    merke('privat-anfrageweg', wege.kontakt > 0, `H1 "${wege.h1.slice(0, 50)}" · ${wege.kontakt} Anfragewege`);
  } catch (err) {
    merke('privat-anfrageweg', false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}
{
  const p = await neu();
  try {
    await p.goto(`${BASE}/kursplan`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    const treffer = await p.evaluate(() =>
      [...document.querySelectorAll('h3, h4')]
        .map((el) => el.textContent?.trim() ?? '')
        .filter((t) => /privatstunde/i.test(t)),
    );
    merke('privat-nicht-im-kursplan', treffer.length === 0, `Privatstunden-Kurstitel im Plan: ${JSON.stringify(treffer)}`);
  } catch (err) {
    merke('privat-nicht-im-kursplan', false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// --- 8. R185/R184-Locks: Kursplan bleibt die gefuellte rote Hauptaktion -------------
{
  const p = await neu();
  try {
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const cta = await p.evaluate(() => {
      const roteFlaeche = (el) => {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return false;
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
        return r > 120 && r > g * 1.8 && r > b * 1.8;
      };
      // Der Header traegt ZWEI Links auf /kursplan: den grauen Navigationseintrag
      // und den roten CTA. Der erste Treffer war der Nav-Link — daher meldete der
      // erste Lauf faelschlich "nicht rot". Gesucht ist der CTA, also der Link mit
      // gefuellter Flaeche, nicht der erste mit passender Adresse.
      const header = document.querySelector('header');
      const alle = [...(header?.querySelectorAll('a') ?? [])];
      const kursplanLinks = alle.filter((a) => /^\/kursplan/.test(a.getAttribute('href') ?? ''));
      const schnupper = alle.find((a) => /schnupperstunde/.test(a.getAttribute('href') ?? ''));
      return {
        kursplanAnzahl: kursplanLinks.length,
        kursplanRot: kursplanLinks.some(roteFlaeche),
        schnupperRot: schnupper ? roteFlaeche(schnupper) : null,
      };
    });
    merke(
      'header-kursplan-primaer',
      cta.kursplanRot === true && cta.schnupperRot === false,
      `${cta.kursplanAnzahl} Kursplan-Links, davon einer gefuellt rot: ${cta.kursplanRot} · Schnupperstunde gefuellt rot ${cta.schnupperRot}`,
    );
  } catch (err) {
    merke('header-kursplan-primaer', false, `Fehler ${err.message}`);
  } finally {
    await p.close();
  }
}

// Kein Sammel-close mehr: jede Pruefung schliesst ihren eigenen Browser in p.close().

// R187-Nachtrag 3: Auch mit eigenem Browser je Pruefung starb gelegentlich einer mit
// "Target page, context or browser has been closed". Ursache ist Fremdlast auf der
// Maschine, nicht die Seite: der Fehler wandert bei jedem Lauf auf einen anderen
// Testnamen, und ohne Last laufen alle 20 durch. Ein solcher Abbruch ist eine
// Nichtmessung, kein Befund. Darum zaehlt er nicht als FAIL, sondern als OFFEN.
// Ein OFFEN laesst den Lauf mit Exit 1 enden — nur mit klarer Ansage, was fehlt.
const UMGEBUNG = /Target page, context or browser has been closed|browserContext\.newPage|Target closed/i;
const offen = ergebnisse.filter((e) => !e.ok && UMGEBUNG.test(e.beleg));
if (offen.length > 0) {
  console.error(`\nOFFEN (Umgebung, nicht gemessen): ${offen.map((o) => o.name).join(', ')}`);
  console.error('Lauf bei ruhiger Maschine wiederholen.');
}

const fails = ergebnisse.filter((e) => !e.ok && !UMGEBUNG.test(e.beleg));
const bestanden = ergebnisse.filter((e) => e.ok).length;
console.log(`\n${bestanden}/${ergebnisse.length} PASS, ${fails.length} FAIL, ${offen.length} OFFEN`);
if (fails.length > 0) {
  console.error(`FAIL: ${fails.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
if (offen.length > 0) process.exit(1);
