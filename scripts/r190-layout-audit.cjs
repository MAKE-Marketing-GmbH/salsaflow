// R190: Misst die Seitenbreite dort, wo Raphael sie sieht — an der TEXTKANTE.
//
// Warum nicht am Container: die erste Fassung dieses Skripts las das erste Element
// mit einer `max-w`-Klasse und meldete für neun von zehn Sektionen brav dieselbe
// Zahl. Die Seite sah trotzdem kaputt aus. Der Grund: die Shell ist gar nicht das
// Problem — sie sitzt überall gleich. Was springt, ist die Kante des sichtbaren
// TEXTES, weil jede Sektion innerhalb der Shell noch eigenes Padding aufträgt.
//
// Gemessen wird deshalb die erste Überschrift oder der erste Absatz je Sektion.
// Das ist die Linie, an der das Auge die Seitenkante abliest — nicht die
// unsichtbare Containerbox darum.
//
// Ausnahmen (`INSET_OK`): Sektionen, deren Text bewusst AUF einem Foto liegt.
// Dort ist der Einzug Bildkomposition, kein Layoutfehler.
//
// Aufruf:
//   node scripts/r190-layout-audit.cjs          Bericht als JSON
//   node scripts/r190-layout-audit.cjs --gate   Nur PASS/FAIL, Exit 1 bei Fehler
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const GATE = process.argv.includes('--gate');

/** Geprüfte Routen.
 *
 *  Der erste Entwurf prüfte NUR `/`. Das war die Lücke, durch die der schwerste
 *  Fehler der Runde geschlüpft ist: `/kursplan` trug einen eigenen zentrierten
 *  Container (`mx-auto max-w-[1080px] pl-5 pr-24`). Die H1 stand dort auf 52 px,
 *  der ganze Kalender darunter auf 213 px — 161 px Sprung, direkt unter dem Hero.
 *  Das Gate meldete trotzdem PASS, weil es diese Seite nie geöffnet hat.
 *  Zwei unabhängige Bild-Kritiker sahen es sofort.
 *
 *  Gewählt sind darum die drei Seitentypen mit je eigenem Aufbau: die Startseite
 *  (viele verschiedene Sektionen), eine Stil-Unterseite (Vorlage für sechs weitere)
 *  und der Kursplan (eigene Breitenlogik, primäre Aktion der Site).
 *
 *  `heroGap` prüft nur `/`: der dort gemessene Wert hängt an der Kante des
 *  Hero-Fotos (siehe MIN_HERO_GAP). Auf Seiten ohne dieses Foto gilt er nicht. */
const ROUTES = [
  { path: '/', heroGap: true },
  { path: '/tanzkurse/bachata', heroGap: false },
  { path: '/kursplan', heroGap: false },
];

/** Sektionen, deren Text im Bild liegt. Ihr Einzug ist gewollt und wird nicht
 *  gegen die Seitenkante geprüft. Belegt an den Screenshots: der Events-Block
 *  trägt seinen Text auf `party-31-v3.webp`, der Standort-Block auf der Karte. */
const INSET_OK = new Set(['events', 'standort']);

/**
 * Findet die Sektionskante, die ein Besucher wirklich sieht.
 *
 * Zwei Fallen, beide beim ersten Lauf hineingetappt und am DOM belegt:
 *
 *  1. TRANSFORM. Der Blur-Reveal skaliert mit `matrix(1.01, ...)`. Wird währenddessen
 *     gemessen, meldet `#angebot` 45 px statt 52 — ein 7-px-Sprung, der nur im
 *     Zwischenbild existiert und im Ruhezustand nie zu sehen ist.
 *     Gegenmittel: `getBoundingClientRect` am ELTERNKNOTEN ohne Transform lesen.
 *
 *  2. TEXT IN EINER KARTE. Die Sektion ohne id auf Position 6 trägt ihre Überschrift
 *     in einer Box mit `p-12`. Gemessen 98 px — korrekt und gewollt. Die Karte selbst
 *     steht bei 52 px, also genau auf der Linie.
 *     Gegenmittel: die Kette bis zur Shell hochlaufen und die äußerste Box nehmen,
 *     die noch auf oder links von der Textkante beginnt.
 *
 * Gesucht ist also nicht "wo steht der Buchstabe", sondern "wo beginnt der
 * Inhaltsblock dieser Sektion".
 */
function outerEdge(el, shell) {
  // Ohne Shell gibt es keine Bezugslinie — dann zählt die Textkante selbst.
  if (!shell) return Math.round(el.getBoundingClientRect().left);

  let node = el;
  let best = null;
  // Bis DIREKT unter die Shell laufen, die Shell selbst nicht mitnehmen:
  // sie trägt das Gutter und stünde immer bei 20 px.
  while (node && node.parentElement && node !== shell) {
    const style = getComputedStyle(node);
    // Transform-Zwischenzustände (Blur-Reveal skaliert 1.01) verfälschen die
    // Kante um einige Pixel. Solche Knoten übergehen, nicht messen.
    if (style.transform === 'none') {
      const left = Math.round(node.getBoundingClientRect().left);
      if (best === null || left < best) best = left;
    }
    node = node.parentElement;
  }
  return best === null ? Math.round(el.getBoundingClientRect().left) : best;
}

/** Wie weit die linke Textkante zwischen zwei Sektionen abweichen darf.
 *  1 px deckt Rundung durch Zoom und Subpixel ab. Alles darüber sieht man. */
const EDGE_TOLERANCE = 1;

/**
 * Mindestluft zwischen H1-Unterkante und Subline-Oberkante im Hero.
 * Vorher gemessen: 28 px auf Desktop UND Mobil. Raphael will dort mehr.
 *
 * Der Wert unterscheidet sich nach Breite, weil die Ursache sich unterscheidet:
 *
 *  DESKTOP — freier Fluss. Der Abstand ist eine reine Entscheidung, 40 px sind
 *  bequem drin. Erwartet werden deshalb 36 px aufwärts.
 *
 *  MOBIL — gebunden an die Fotokante. Gemessen auf 390x844: die H1 endet bei
 *  y=546, das Hero-Foto endet bei y=574, der Lead beginnt bei y=574. Die 28 px
 *  SIND der Abstand zur Bildkante, keine freie Wahl. Ein größerer Wert schöbe
 *  den Lead nicht nach unten, sondern in das dunkle Foto hinein — dort läuft er
 *  in `--color-ink-muted` (#52524E) auf near-black und ist unlesbar. Genau
 *  dieser Fehler steht in Hero.tsx bereits einmal gemessen im Kommentar.
 *  Die mobile Luft entsteht darum über der H1, nicht unter ihr.
 */
const MIN_HERO_GAP = { desktop: 36, mobil: 26 };

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobil', { width: 390, height: 844 }],
];

async function measure(page) {
  // `outerEdge` läuft im Browser, nicht in Node — darum als Quelltext übergeben
  // und dort neu aufgebaut. Ein direkter Verweis wäre im Seiten-Kontext undefiniert.
  return page.evaluate((outerEdgeSource) => {
    const outerEdge = new Function('return ' + outerEdgeSource)();
    const main = document.querySelector('main') || document.body;
    const sections = Array.from(main.querySelectorAll(':scope > *'));

    const edges = sections.map((section, i) => {
      const text = section.querySelector('h1, h2, h3, p');
      // Die Shell ist eindeutig an ihrer Maximalbreite zu erkennen (primitives.tsx).
      // `.mx-auto` allein träfe auch zentrierte Textblöcke innerhalb einer Sektion.
      const shell = text ? text.closest('[class*="max-w-[1400px]"]') : null;
      const rect = text ? text.getBoundingClientRect() : null;
      return {
        i,
        id: section.id || null,
        sample: text ? text.textContent.trim().slice(0, 32) : null,
        left: text ? outerEdge(text, shell) : null,
        textLeft: rect ? Math.round(rect.left) : null,
        right: rect ? Math.round(rect.right) : null,
      };
    });

    const clientW = document.documentElement.clientWidth;
    const overflow = Array.from(document.querySelectorAll('body *'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        if (r.right <= clientW + 2) return false;
        /* Ein waagerechter Slider DARF innen überstehen — das ist sein Zweck, der
           Nutzer erreicht den Rest durch Wischen.

           R190, nach opus-critic Runde 4: `hidden` gehört NICHT in dieselbe Liste.
           Bei `auto`/`scroll` ist der Überstand erreichbar, bei `hidden` ist er
           abgeschnitten und für immer weg. Vorher fielen beide Fälle stumm raus;
           das Gate meldete "Überlauf 0", während bei 390 px Inhalt am Rand fehlte
           (belegt in home-mobil-05-motion.png: "Quereinstieg möglich" halb weg).
           Die Gate-Zeile mass "macht das Dokument breiter", der Haken behauptete
           "ragt über die Kante" — zwei verschiedene Aussagen. */
        let p = el.parentElement;
        while (p && p !== document.body) {
          const ov = getComputedStyle(p).overflowX;
          if (ov === 'auto' || ov === 'scroll') return false;
          p = p.parentElement;
        }
        /* Dekor darf überstehen: ein Radialverlauf hinter dem Inhalt trägt nichts,
           was jemand lesen oder anklicken könnte. Erkannt an drei Merkmalen
           zusammen — nicht anklickbar, hinter dem Inhalt, ohne eigenen Text
           (z. B. StylePage.tsx:283). Eine Klassennamen-Liste wäre hier falsch:
           sie würde beim nächsten Umbenennen still durchlassen. */
        const cs = getComputedStyle(el);
        const dekor =
          cs.pointerEvents === 'none' &&
          parseInt(cs.zIndex, 10) < 0 &&
          !el.textContent?.trim();
        return !dekor;
      })
      .slice(0, 10)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)} right=${Math.round(el.getBoundingClientRect().right)}`);

    const h1 = document.querySelector('h1');
    let heroGap = null;
    if (h1) {
      const hero = h1.closest('section') || h1.parentElement;
      const h1Rect = h1.getBoundingClientRect();
      let subline = null;
      for (const p of hero.querySelectorAll('p')) {
        const r = p.getBoundingClientRect();
        // Die Subline ist der erste Absatz UNTER der H1, der echten Text trägt.
        if (r.top >= h1Rect.bottom - 1 && p.textContent.trim().length > 20) {
          subline = p;
          break;
        }
      }
      heroGap = subline
        ? {
            gap: Math.round(subline.getBoundingClientRect().top - h1Rect.bottom),
            text: subline.textContent.trim().slice(0, 40),
          }
        : null;
    }

    /* Die zwei Seitenränder der Shell, getrennt gemessen.
       Grund: dieses Gate prüfte lange nur die LINKE Textkante. Damit konnte im
       Gates-Protokoll "das Shell-Padding ist symmetrisch" als erledigt stehen,
       während rechts weiterhin der Freiraum für den WhatsApp-Knopf lag — kein
       Messwert hat dem widersprochen, weil keiner ihn gesucht hat.
       Die Zahl ist bewusst KEIN Fehlerfall: die Asymmetrie ist zurzeit gewollt
       (Begründung in GATES-R190.md, A1). Sie steht im Protokoll, damit sie
       sichtbar bleibt und nicht wieder aus Versehen für gelöst gehalten wird. */
    const shellEl = document.querySelector('main [class*="max-w-[1400px]"]');
    let gutters = null;
    if (shellEl) {
      const cs = getComputedStyle(shellEl);
      gutters = {
        left: Math.round(parseFloat(cs.paddingLeft)),
        right: Math.round(parseFloat(cs.paddingRight)),
      };
    }

    return {
      edges,
      overflow,
      heroGap,
      gutters,
      scrollW: document.documentElement.scrollWidth,
      clientW,
    };
  }, outerEdge.toString());
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const report = {};
  const failures = [];

  for (const route of ROUTES) {
  for (const [vpName, viewport] of VIEWPORTS) {
    const name = `${route.path} ${vpName}`;
    /* `reducedMotion: 'reduce'` ist hier KEINE Bequemlichkeit, sondern die einzige
       Art, die Frage überhaupt zu beantworten.

       Gemessen mit laufender Motion meldete `#angebot` 45 px statt 52. Der Grund
       stand im DOM: der Blur-Reveal skaliert seinen Wrapper mit `matrix(1.01, ...)`,
       und 1 % von 1400 px sind eben jene 7 px. Diese Kante gibt es nur im
       Zwischenbild — nach 0,48 s steht die Sektion auf 52 px wie alle anderen.
       Ein Gate, das solche Zwischenbilder misst, prüft die Animation, nicht das
       Layout, und wäre je nach Timing mal rot und mal grün.

       Mit reduzierter Motion fallen alle Transforms weg (Regel A in motion.tsx).
       Übrig bleibt die Geometrie — genau das, was hier zur Debatte steht. Ob sich
       beim Scrollen etwas bewegt, prüft `scripts/r190-reveal-timing.cjs`. */
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE + route.path, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);

    const data = await measure(page);
    report[name] = data;

    // 1) Linke Textkante: eine Linie für alle Sektionen ohne Bild-Einzug.
    const relevant = data.edges.filter((e) => e.left !== null && !INSET_OK.has(e.id));
    const lefts = relevant.map((e) => e.left);
    const min = Math.min(...lefts);
    const max = Math.max(...lefts);
    if (max - min > EDGE_TOLERANCE) {
      const strays = relevant.filter((e) => e.left !== min);
      failures.push(
        `${name}: linke Textkante springt ${min}..${max} px. ` +
          strays.map((s) => `#${s.id ?? s.i}=${s.left}`).join(' '),
      );
    }

    // 2) Kein Element macht das Dokument breiter als das Fenster.
    if (data.overflow.length > 0) {
      failures.push(`${name}: ${data.overflow.length} Element(e) ragen über die Kante: ${data.overflow[0]}`);
    }
    if (data.scrollW > data.clientW + 1) {
      failures.push(`${name}: Dokument ${data.scrollW} px breit bei ${data.clientW} px Fenster.`);
    }

    // 3) Luft unter der Hero-Subline. Nur dort, wo der gemessene Wert gilt.
    if (route.heroGap) {
      const minGap = MIN_HERO_GAP[vpName];
      if (!data.heroGap) {
        failures.push(`${name}: Hero-Subline nicht gefunden.`);
      } else if (data.heroGap.gap < minGap) {
        failures.push(`${name}: H1 zu Subline nur ${data.heroGap.gap} px, erwartet >= ${minGap}.`);
      }
    }

    await context.close();
  }
  }

  await browser.close();

  if (!GATE) {
    console.log(JSON.stringify(report, null, 1));
  }

  for (const [name, data] of Object.entries(report)) {
    const lefts = data.edges.filter((e) => e.left !== null && !INSET_OK.has(e.id)).map((e) => e.left);
    const g = data.gutters;
    console.log(
      `${name}: Textkante ${Math.min(...lefts)}..${Math.max(...lefts)} px, ` +
        `Überlauf ${data.overflow.length}` +
        (data.heroGap ? `, Hero-Luft ${data.heroGap.gap} px` : '') +
        // Kein Urteil, nur die Zahl — siehe Kommentar an `gutters` oben.
        (g ? `, Shell-Rand L${g.left}/R${g.right} px` : ''),
    );
  }

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
