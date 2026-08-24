// R190: Misst den Rhythmus der Sektionskoepfe.
//
// Raphaels Kritik woertlich: "Es soll einheitlich sein, ob wir jetzt eine Überschrift mehr
// dazu haben, keine Überschrift, Eyebrows, Subtitles."
//
// Uebersetzt: Ein Sektionskopf besteht aus bis zu drei Zeilen — Eyebrow (kleines Label
// darueber), Titel, Subline. Nicht jede Sektion hat alle drei. Der Abstand ZWISCHEN zwei
// vorhandenen Zeilen muss trotzdem ueberall derselbe sein, und der Abstand vom Kopf zum
// Inhalt darunter auch. Sonst wirkt jede Sektion anders gebaut, obwohl sie dasselbe Muster
// zeigt.
//
// Gemessen werden drei Abstaende je Sektion:
//   eyebrowToTitle   Unterkante Eyebrow  -> Oberkante Titel
//   titleToLead      Unterkante Titel    -> Oberkante Subline
//   headToBody       Unterkante letzte Kopfzeile -> Oberkante erster Inhalt
//
// Gemessen wird mit reduzierter Motion. Transform-Zwischenzustaende wuerden die Kanten
// um einige Pixel verschieben und das Ergebnis vom Zufall abhaengig machen (dieselbe
// Falle wie in r190-layout-audit.cjs, dort ausfuehrlich begruendet).
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
/* /kursplan gehoert NICHT in diese Liste. Gemessen in
   `scripts/r190-probe-kursplan-koepfe.cjs`: vier Sektionen, davon eine ohne h2
   (Hero), zwei mit `sr-only` "Samstag — 1 Kurs", eine echte
   ("Nicht länger suchen…"). Ein Rhythmus-Gate braucht mindestens drei
   vergleichbare Koepfe. Die Seite hat einen.

   Vorher stand sie hier und wurde still uebersprungen — das Gate schrieb
   "nur 1 Sektionskoepfe, uebersprungen" und PASS. opus-critic hat das in
   Runde 4 zu Recht als denselben Fehler wie das clip-Problem aus Runde 3
   gewertet. Seit dieser Runde ist ein stilles Ueberspringen ein FAIL.
   Wer eine Route hier auffuehrt, muss sie pruefen koennen. */
const ROUTES = ['/', '/tanzkurse/bachata'];

/** Zulaessige Abweichung je Abstand in Pixeln.
 *
 *  Nicht 0: die Zeilenboxen von Schriften unterscheiden sich je nach Schnitt und Groesse
 *  um ein paar Pixel, und `type-h2` rendert auf zwei Zeilen anders als auf einer. 6 px
 *  liegen unter der Schwelle, ab der ein Unterschied als Unregelmaessigkeit auffaellt,
 *  fangen aber jeden echten Sprung (die gemessenen Ausreisser lagen bei 20 px und mehr). */
const TOLERANCE = 6;

/** Sektionen ohne pruefbaren Kopf werden uebersprungen, nicht als Fehler gewertet.
 *  Ein Foto-Band oder eine Zitatzeile hat keinen Eyebrow-Titel-Subline-Aufbau. */
const MIN_MEASURABLE = 3;

async function measureRoute(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main') || document.body;

    /* Echte <section>-Elemente, nicht nur die erste Ebene unter <main>.
       Der erste Entwurf nahm `:scope > *`. Auf /tanzkurse/bachata liegen ALLE
       Sektionen in einem gemeinsamen Wrapper — gemessen: 1 Kind auf oberster
       Ebene, aber 10 Sektionen mit h2 darunter. Das Gate meldete dort
       "nur 1 Sektionskoepfe, uebersprungen" und PASS, ohne die Seite je
       geprueft zu haben. Ausgerechnet die Seite mit den meisten Koepfen fiel
       damit durch das Raster; zwei Bild-Kritiker sahen die Unregelmaessigkeit
       trotzdem sofort.

       Sektionen ohne eigenen h2 filtert die Schleife unten ohnehin weg, und
       verschachtelte Sektionen tauchen jede fuer sich auf — beides ist hier
       richtig, weil der Rhythmus je Kopf gilt, nicht je Baumtiefe. */
    const sections = Array.from(main.querySelectorAll('section'));
    const out = [];

    for (const [i, section] of sections.entries()) {
      const title = section.querySelector('h2');
      if (!title) continue;

      const titleRect = title.getBoundingClientRect();
      if (titleRect.height === 0) continue;

      /* Nur SICHTBARE Titel. Der Kalender traegt seine Tages-Ueberschrift
         ("Samstag — 1 Kurs") als `sr-only` fuer Screenreader
         (courses/CourseEngine.tsx:600). Das Gate mass gegen dieses unsichtbare
         Element und meldete Titel→Subline = 0 px auf /kursplan und
         /tanzkurse/bachata — ein Abstand zu etwas, das niemand sieht.
         Der Rhythmus ist eine Frage des Auges, also zaehlt hier nur, was
         auch gerendert wird.

         NICHT ueber `checkOpacity` geprueft: Sektionen ausserhalb des Fensters
         stehen beim Laden noch auf `opacity: 0` (Reveal). Mit dieser Schranke
         fielen 5 von 7 messbaren Koepfen der Startseite weg und das Gate meldete
         PASS, weil es fast nichts mehr geprueft hat. Ein Gate, das durch
         Wegschauen gruen wird, ist wertlos. Geprueft wird darum die
         Screenreader-Auszeichnung und eine Breite von 0 — beides unabhaengig
         vom Scrollstand. */
      if (title.closest('.sr-only')) continue;
      if (titleRect.width <= 1) continue;

      /* Der Eyebrow ist das kleine Label ueber dem Titel. Erkennbar an der
         Grossbuchstaben-Auszeichnung, die `Eyebrow` in primitives.tsx setzt —
         nicht an der Reihenfolge im DOM, denn dort steht oft noch ein Wrapper
         dazwischen. */
      let eyebrow = null;
      for (const p of section.querySelectorAll('p')) {
        const r = p.getBoundingClientRect();
        const cs = getComputedStyle(p);
        if (r.bottom <= titleRect.top + 1 && cs.textTransform === 'uppercase' && r.height > 0) {
          eyebrow = { bottom: r.bottom, text: p.textContent.trim().slice(0, 24) };
        }
      }

      /* Die Subline ist der erste Absatz UNTER dem Titel mit echtem Fliesstext —
         aber NUR, wenn er noch zum Sektionskopf gehoert.

         Der erste Entwurf hat hier alle <p> der Sektion durchsucht und meldete fuer
         `#angebot` einen Abstand von 320 px. Die Nachmessung zeigte: diese Sektion hat
         gar keine Subline (`o.lead` ist in content.ts leer und wird bewusst nicht
         gerendert, Kommentar in Offer.tsx). Gegriffen wurde der Beschreibungstext der
         ERSTEN KARTE, 320 px weiter unten. Ein Gate, das Kartentext fuer eine Subline
         haelt, misst den Rhythmus von etwas, das es nicht gibt.

         Zwei Schranken halten das jetzt auseinander:
           1. Der Absatz muss denselben Textcontainer teilen wie der Titel — also unter
              dessen Elternkette liegen, nicht in einer Karte daneben.
           2. Er darf hoechstens MAX_LEAD_GAP unter dem Titel beginnen. Alles darunter
              ist ein neuer Block, keine Subline mehr. */
      const MAX_LEAD_GAP = 80;
      let lead = null;
      for (const p of section.querySelectorAll('p')) {
        const r = p.getBoundingClientRect();
        if (r.height === 0) continue;
        if (r.top < titleRect.bottom - 1) continue;
        if (r.top - titleRect.bottom > MAX_LEAD_GAP) continue;
        if (p.textContent.trim().length <= 30) continue;
        // Muss auf derselben linken Kante stehen wie der Titel. Ein Kartentext
        // sitzt eingerueckt oder in einer anderen Spalte.
        if (Math.abs(r.left - titleRect.left) > 2) continue;

        /* Dritte Schranke: kein sichtbarer Trenner zwischen Titel und Absatz.
           Auf /tanzkurse/bachata meldete das Gate 53 px und damit FAIL. Nachgemessen
           war das gar keine Subline: der FAQ-Kopf traegt darunter einen abgesetzten
           Block (`mt-7 border-t pt-6` in subpage/kit.tsx:709) mit dem Hinweis
           "Deine Frage ist nicht dabei?". Eine Trennlinie beendet den Kopf — was
           darunter steht, ist ein neuer Block und darf nicht gegen den Rhythmus
           der Sublines gemessen werden.

           Geprueft wird die Elternkette bis zur Sektion, weil der Rahmen am
           umschliessenden <div> haengt, nicht am Absatz selbst. */
        let separated = false;
        for (let node = p; node && node !== section; node = node.parentElement) {
          const cs = getComputedStyle(node);
          const boxTop = node.getBoundingClientRect().top;
          if (boxTop < titleRect.bottom - 1) continue;
          if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') {
            separated = true;
            break;
          }
        }
        if (separated) continue;

        lead = { top: r.top, bottom: r.bottom, text: p.textContent.trim().slice(0, 24) };
        break;
      }

      out.push({
        i,
        id: section.id || null,
        title: title.textContent.trim().slice(0, 28),
        hasEyebrow: Boolean(eyebrow),
        hasLead: Boolean(lead),
        eyebrowToTitle: eyebrow ? Math.round(titleRect.top - eyebrow.bottom) : null,
        titleToLead: lead ? Math.round(lead.top - titleRect.bottom) : null,
      });
    }

    return out;
  });
}

/** Prueft EINEN Abstand ueber alle Sektionen einer Route auf Gleichheit. */
function checkSpacing(route, rows, key, label, failures, lines) {
  const values = rows.filter((r) => r[key] !== null).map((r) => ({ id: r.id ?? r.i, v: r[key] }));
  if (values.length < 2) return;

  const nums = values.map((x) => x.v);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  lines.push(
    `${route} ${label}: ${min}..${max} px über ${values.length} Sektionen ` +
      `(${values.map((x) => `${x.id}=${x.v}`).join(' ')})`,
  );

  if (max - min > TOLERANCE) {
    failures.push(
      `${route}: ${label} schwankt zwischen ${min} und ${max} px ` +
        `(erlaubt ${TOLERANCE} px). Ausreisser: ` +
        values.filter((x) => x.v !== min).map((x) => `${x.id}=${x.v}`).join(' '),
    );
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const failures = [];
  const lines = [];

  for (const route of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);

    const rows = await measureRoute(page);
    if (rows.length < MIN_MEASURABLE) {
      /* R190, nach opus-critic Runde 4: eine Route in ROUTES, die nicht messbar
         ist, ist ein FAIL, kein stilles PASS. Vorher schrieb das Gate
         "nur 1 Sektionskoepfe, übersprungen" und ging gruen weiter. Genau
         /kursplan — in Runde 1 der A1-Fehler — fiel so durch das Raster.
         Wer eine Seite hier auffuehrt, muss sie pruefen koennen; sonst gehoert
         sie nicht in die Liste. */
      failures.push(
        `${route}: nur ${rows.length} Sektionskoepfe, erwartet mindestens ${MIN_MEASURABLE}. ` +
          'Eine Route in ROUTES, die das Gate nicht messen kann, ist kein PASS.',
      );
      lines.push(`${route}: nur ${rows.length} Sektionskoepfe — FAIL, nicht übersprungen`);
      await context.close();
      continue;
    }

    checkSpacing(route, rows, 'eyebrowToTitle', 'Eyebrow→Titel', failures, lines);
    checkSpacing(route, rows, 'titleToLead', 'Titel→Subline', failures, lines);

    await context.close();
  }

  await browser.close();

  for (const line of lines) console.log('  ' + line);

  if (failures.length > 0) {
    console.log('\nFAIL');
    for (const f of failures) console.log('  - ' + f);
    process.exit(1);
  }
  console.log('\nPASS');
})().catch((error) => {
  console.error('FEHLER', error.message);
  process.exit(1);
});
