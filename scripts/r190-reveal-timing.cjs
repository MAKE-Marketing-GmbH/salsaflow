// R190: Beweist, dass Reveals nicht mehr "einploppen".
//
// Was "ploppen" messbar heisst — Raphaels Kritik in eine pruefbare Aussage uebersetzt:
// Ein Element ploppt, wenn es an der Fensterunterkante erscheint und dort noch komplett
// unsichtbar ist. Der Nutzer sieht dann eine leere Flaeche hereinfahren, und erst danach
// springt der Inhalt an. Fuehlt sich an wie Nachladen, nicht wie Animation.
//
// Ein Element ploppt NICHT, wenn sein Reveal schon laeuft, waehrend es hereinkommt.
//
// Geprueft wird in ZWEI Richtungen, weil es zwei Arten gibt, keine Animation zu zeigen:
//   zu spaet ausgeloest  -> Fortschritt 0 an der Kante, das Element ploppt danach herein.
//   zu frueh fertig      -> Fortschritt 1 an der Kante, es gab nie etwas zu sehen.
// Beide fuehlen sich fuer den Betrachter gleich an: es passiert nichts.
//
// Der dritte Teil misst die dazu passende Groesse: den Restweg bei festem ZEITANTEIL.
// Warum nicht an einer festen Stelle, nicht zu einer festen Zeit und nicht bei fester
// Deckkraft — und welche sechs Anlaeufe das gekostet hat — steht ausfuehrlich am Block
// ueber MIN_TRAVEL_LEFT.
//
// Zusaetzlich prueft der zweite Teil die scroll-GEBUNDENEN Elemente: dort muss sich der
// Wert aendern, wenn man scrollt und dazwischen NICHT wartet. Ein Trigger-Effekt liefe in
// derselben Zeit einfach weiter; ein gebundener Effekt steht still, solange nicht gescrollt
// wird. Der Unterschied ist der ganze Punkt.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:5175';
const ROUTES = ['/', '/tanzkurse/bachata'];

/** Wie viele scroll-gebundene Elemente eine Route mindestens tragen muss.
 *  Unter drei bleibt die Seite gefuehlt statisch: einzelne bewegte Stellen gehen
 *  zwischen den Trigger-Reveals unter, und der Eindruck "da folgt etwas meinem
 *  Scrollen" entsteht gar nicht erst. */
const MIN_BOUND_ELEMENTS = 3;

/** Wie weit sich ein gebundenes Element ueber 400 px Scrollstrecke mindestens
 *  bewegen muss. Unter 4 px sieht das niemand — das waere eine Bindung auf dem
 *  Papier, die im Betrieb nichts zeigt. */
const MIN_SCROLL_SHIFT = 4;

/* DRITTE PRUEFUNG, R190 nach der zweiten Kritikrunde.
   Die zwei Pruefungen oben messen WANN etwas anfaengt und OB es am Scroll haengt.
   Beide waren gruen, und trotzdem meldeten zwei unabhaengige Kritiker dasselbe:
   Elemente stehen an der Endposition und sind noch halb durchsichtig. Sichtbar
   ist dann kein Gleiten, sondern ein Aufhellen — also genau das Ploppen, das
   dieses Gate ausschliessen soll.

   Die Luecke: keine der beiden Pruefungen sieht den WEG waehrend des Einblendens.
   Eine Kurve kann 79 % der Strecke in 27 % der Zeit zuruecklegen und trotzdem
   beide Tests bestehen.

   Also wird jetzt gemessen: waehrend ein Element sichtbar wird (Deckkraft
   zwischen 0,15 und 0,9), muss noch ein sichtbarer Rest der Geste vor ihm
   liegen. Sonst ist die Bewegung vorbei, bevor man das Element lesen kann.

   DIESE PRUEFUNG HAT VIER ANLAEUFE GEBRAUCHT. Die drei verworfenen stehen hier,
   weil jeder davon gruen gemeldet haette, ohne etwas zu beweisen — und weil der
   naechste, der hier eine Zahl anfasst, die Fallen kennen soll.

   1. SCHWELLE ZU LOCKER. Mit 6 px meldete das Gate auch den ALTEN Zustand
      gruen, also genau den, den zwei Kritiker unabhaengig als kaputt bezeichnet
      haben. Eine Schwelle, die den bekannten Fehlerfall durchlaesst, misst
      nichts. Seitdem gilt: jede Schwelle hier wird gegen den alten Zustand
      gegengeprueft, nicht nur gegen den neuen.

   2. FALSCHE ACHSE. "Restweg in px" passt nicht auf jede Variante. `blur`
      (motion.tsx:341) bewegt sich ueberhaupt nicht — sie stellt scharf
      (3 px -> 0) und skaliert um 1 %. Ihr Versatz ist konstruktionsbedingt 0,
      auch wenn die Geste noch komplett bevorsteht: gemessen 3,00 von 3,00 px
      Restblur bei Deckkraft 0,55. Das Gate warf diese 0 in den Median und zog
      `/` auf FAIL — es meldete ein gesundes Element als kaputt.

   3. MISCHMEDIAN UEBER ALLE VARIANTEN. Von 25 Stichproben auf `/` sind 17
      `letters`, und `letters` misst in BEIDEN Zustaenden exakt 18,0 px: der
      Wert ist eine Konstante (`RevealWords`, distance = 18), die R190 nie
      angefasst hat. Sie zog den Median hoch und verdeckte darunter, dass `rise`
      gefallen war. Alt und neu lagen dadurch auf `/` in derselben Spanne.

   Jede Variante wird deshalb einzeln und an IHRER Achse gemessen:
     rise / letters / clip   Restweg in px      >= MIN_TRAVEL_LEFT
     blur                    Restblur in px     >= MIN_BLUR_LEFT
   Ein Element ohne beide Achsen (weder Weg noch Blur) faellt weiterhin durch —
   das ist der Fall, den Raphael als Ploppen beschreibt.

   4. EIN ZEITPUNKT STATT DES VERLAUFS. Gemessen wurde 120 ms nach dem Sprung.
      Sechs Laeufe gegen UNVERAENDERTEN Code ergaben fuer `rise` Mediane von
      5,88 bis 12 px, waehrend der bekannte Fehlerfall bei 6,5 lag: das Ergebnis
      haengt an der Systemlast, nicht am Code.

   5. RESTWEG OHNE BEZUG AUF DIE DECKKRAFT. Der naechste Versuch tastete den
      Verlauf ab und nahm je Element den groessten Restweg. Stabiler, aber immer
      noch nicht trennscharf: ueber 13 Laeufe lag `rise` alt bei 5,41..9,72 und
      neu bei 9,72..11,82. Die Gruppen beruehren sich bei exakt 9,72 — eine
      Schwelle dazwischen entscheidet per Muenzwurf. Ursache: der Median laeuft
      ueber wenige Elemente, und WELCHE ein Lauf erwischt, haengt am Timing.

   6. RESTWEG BEI FESTER DECKKRAFT — der sechste Versuch, und er war die
      hartnaeckigste Falle, weil er funktionierte und trotzdem nichts mass.
      Gemessen wurde der Restweg in einem schmalen Deckkraft-Fenster. Die Zahlen
      trennten sauber (alt 4,3..5,0 gegen neu 6,1..6,9), die Schwelle 5,5 lag in
      der Luecke, acht Laeufe bestaetigten sie.

      Trotzdem war die Groesse blind. `useReveal` gibt Deckkraft UND Versatz
      dasselbe `transition`-Objekt (motion.tsx:152) — gleiche Kurve, gleiche
      Dauer. Zu jedem Zeitpunkt gilt also mit demselben Fortschritt p:

          opacity = p        y = distance * (1 - p)

      und daraus

          Restweg = distance * (1 - opacity).

      Kurve und Dauer kuerzen sich weg. Die Schwelle 5,5 im Fenster 0,6..0,7
      pruefte in Wahrheit nur `distance >= ~15,7 px`. Die Kalibriertabelle sagte
      es die ganze Zeit mit: alle drei Fenster zeigten Faktor ~1,4, und
      20/14 = 1,4286. Ich habe den Distanz-Quotienten fuer einen Kurven-Effekt
      gehalten. Befund von sol-critic, am Code gezeigt, im Browser nachgeprueft.

   WAS STATTDESSEN GEMESSEN WIRD. Der Restweg bei einem festen ZEITANTEIL der
   Laufzeit (TIME_FRACTION). Das ist die Groesse, aus der motion.tsx ohnehin
   argumentiert ("bei 27 % der Laufzeit"), und sie ist eine Funktion der Kurve:
   verschiedene Kurven stehen zum selben Zeitanteil an verschiedenen Stellen.

   Gelesen wird ueber `Element.getAnimations()`: die Uhr wird auf den Pruefpunkt
   gesetzt, abgelesen, zurueckgestellt. Damit haengt der Wert nicht mehr daran,
   wann der Testlauf zufaellig hinschaut — der Fehler aus Versuch 4 und 5.

   GEGENPROBE, 2x2 im echten Browser (scripts/r190-probe-kurve.cjs), je 5 Laeufe.
   Die Spalten zeigen, worauf die alte und die neue Groesse reagieren:

     Zustand                 alt: @Deckkraft 0,6-0,7   neu: @27 % Laufzeit
     1 alles neu             7,14                      7,80
     2 alles alt             4,82                      2,88
     3 nur Kurve+Dauer alt   6,89                      4,11
     4 nur distance alt      5,00                      5,46

   Zeile 3 ist der Beweis: setzt man genau die Regression zurueck, gegen die A3
   gebaut wurde — die schnelle Kurve —, dann meldet die ALTE Groesse 6,89 und
   damit PASS. Die neue meldet 4,11 und damit FAIL. Faktor 1,9 statt 1,04.
   Streuung ueber je fuenf Laeufe: null, in allen vier Zustaenden.

   Die Schwelle 6,5 faellt beide Regressionen: Zustand 3 (falsche Kurve, 4,11)
   und Zustand 4 (falsche Distanz, 5,46). Der gute Zustand liegt mit 7,80 klar
   darueber.

   GEGENPROBE MIT DEM FERTIGEN GATE, an motion.tsx selbst, nicht am Modell.
   Datei geaendert, Gate gefahren, Datei zurueckgestellt (Pruefsumme vorher und
   nachher 843d57f1...):

     nur EASE_OUT zurueck auf [0.22, 1, 0.36, 1] — Distanz und Dauer unveraendert:
       rise 7,80 -> 4,11 px      FAIL
       letters 7,02 -> 3,70 px   FAIL
       clip 39,01 -> 20,57 %     FAIL
       blur 1,17 -> 0,62 px      FAIL
     nur distance zurueck auf 14 — Kurve und Dauer unveraendert:
       rise 7,80 -> 5,46 px      FAIL
       die drei anderen unveraendert gruen (die Distanz betrifft nur `rise`).

   Alle vier Varianten reagieren auf die Kurve, und jede faellt an ihrer eigenen
   Achse. Das ist genau das, was die Vorgaengerfassung nicht konnte.

   NICHT geprueft wird das Minimum: es trennt nicht und steht nur als
   Protokollwert in der Ausgabe. */
const MIN_TRAVEL_LEFT = 6.5;

/** Der Zeitanteil, an dem gemessen wird — dieselbe Stelle, aus der motion.tsx
 *  argumentiert. Begruendung oben: der Restweg bei festem Zeitanteil ist eine
 *  Funktion der Kurve, der bei fester Deckkraft nicht. */
const TIME_FRACTION = 0.27;

/* Restblur-Schwelle fuer die `blur`-Variante. Der Effekt startet bei 3 px
   (motion.tsx:341); die Geste ist vorbei, sobald der Text scharf steht.

   DIESE SCHWELLE TRENNT SCHWACH, und das steht hier, statt sie passend zu
   machen. `blur` hat von R190 nur die flachere Kurve bekommen; Dauer (0,48 s)
   und Blur-Weite (3 px) blieben gleich. Der Effekt der Kurve ist damit der
   einzige Unterschied, und er ist auf einer 3-px-Achse klein.

   Der Wert steht deshalb auf 1,0 und wirkt als Untergrenze gegen den einen
   Fall, der wirklich kaputt waere: ein `blur`-Reveal, das schon scharf steht,
   waehrend die Geste laufen sollte. Er ist KEIN Beleg dafuer, dass R190 hier
   etwas verbessert hat — diesen Beleg gibt es nicht.
   Zusaetzlich greift MIN_PER_VARIANT: die Seite traegt genau eine
   `blur`-Ueberschrift, pro Lauf kommt also eine einzige Messung an. Die
   Variante wird damit ausgewiesen, aber nie bewertet. */
const MIN_BLUR_LEFT = 1.0;

/* Der Schwellenwert fuer `clip` steht weiter unten bei `leseTokens()`: er wird aus
   Dauer und Startvorhang der Quelle gerechnet, nicht hier gesetzt. */

/** Wie viele Elemente die Probe mindestens erwischen muss, damit die Aussage
 *  etwas wert ist. Ein Gate, das nichts findet und deshalb gruen meldet, ist
 *  genau der Fehler, den diese Pruefung beheben soll. */
const MIN_TRAVEL_SAMPLES = 3;

/** Wie viele Stichproben eine EINZELNE Variante braucht, bevor ueber sie
 *  geurteilt wird. Unter drei entscheidet ein Ausreisser das Ergebnis.
 *  Varianten darunter werden ausgewiesen, aber nicht bewertet — lieber eine
 *  offene Zahl im Protokoll als ein Urteil auf einer Messung. */
const MIN_PER_VARIANT = 3;

/** Die vier Varianten aus motion.tsx. Fehlt eine davon in der Messung, ist das ein
 *  Befund und kein Nebensatz — siehe Begruendung an der Auswertung unten. */
const ERWARTETE_VARIANTEN = ['rise', 'clip', 'blur', 'letters'];

/* Die drei Werte, die den Reveal ausmachen, aus der QUELLE gelesen statt hier
   dupliziert. Eine Kopie waere wertlos: sie bliebe stehen, waehrend jemand
   motion.tsx zurueckdreht, und das Gate meldete weiter PASS. So faellt es. */
function leseTokens() {
  const quelle = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'public', 'home', 'motion.tsx'),
    'utf8',
  );
  const treffer = {
    ease: /export const EASE_OUT = \[([^\]]+)\]/.exec(quelle),
    riseDistance: /const distance = opts\?\.distance \?\? ([\d.]+)/.exec(quelle),
    riseDuration: /const duration = opts\?\.duration \?\? ([\d.]+)/.exec(quelle),
    lettersDistance: /distance = ([\d.]+),\n\s*duration,/.exec(quelle),
    lettersDuration: /const WORD_DURATION = ([\d.]+)/.exec(quelle),
    /* R190, Lueckenschluss nach opus-critic Runde 4: diese zwei Werte standen nur
       als Kommentar in dieser Datei. Wer `clip: 0.72` auf 2.5 setzt, bekam weiter
       PASS — das Gate mass 27 % einer Dauer, die es sich selbst ausgedacht hatte,
       waehrend die Flaeche 1,8 s leer stand. `clip` bewegt den groessten
       Flaechenanteil; ausgerechnet dort fehlte der Selbstschutz, den `rise` hat. */
    clipDuration: /const VARIANT_DURATION = \{[\s\S]*?clip: ([\d.]+),/.exec(quelle),
    clipStart: /hidden: \{ opacity: ([\d.]+), clipPath: 'inset\(0% 0% ([\d.]+)% 0%\)' \}/.exec(quelle),
    riseHidden: /hydrated \? \{ opacity: ([\d.]+), y:/.exec(quelle),
  };
  const fehlend = Object.entries(treffer)
    .filter(([, t]) => !t)
    .map(([name]) => name);
  if (fehlend.length) {
    throw new Error(
      `motion.tsx: ${fehlend.join(', ')} nicht gefunden. Das Gate misst dann gegen ` +
        'erfundene Werte statt gegen die echten — lieber abbrechen.',
    );
  }
  const ease = treffer.ease[1].split(',').map((x) => parseFloat(x));
  return {
    rise: {
      ease,
      distance: parseFloat(treffer.riseDistance[1]),
      duration: parseFloat(treffer.riseDuration[1]),
    },
    letters: {
      ease,
      distance: parseFloat(treffer.lettersDistance[1]),
      duration: parseFloat(treffer.lettersDuration[1]),
    },
    clip: {
      ease,
      duration: parseFloat(treffer.clipDuration[1]),
      opacity: parseFloat(treffer.clipStart[1]),
      start: parseFloat(treffer.clipStart[2]),
    },
    riseHiddenOpacity: parseFloat(treffer.riseHidden[1]),
  };
}
const TOKENS = leseTokens();

/* Die clip-Schwelle wird jetzt aus den Quellwerten GERECHNET statt gesetzt.
   Bei 27 % der Laufzeit steht EASE_OUT auf rund 61 % Fortschritt; vom
   Startvorhang bleiben also rund 39 % stehen. Zwei Drittel davon ist die
   Untergrenze — so faellt das Gate, wenn jemand die Dauer aufblaeht oder den
   Vorhang flacher macht, und es haengt an keiner Zahl in dieser Datei. */
const MIN_CLIP_LEFT = Math.round(TOKENS.clip.start * 0.39 * 0.67 * 10) / 10;
/* grok-worker Runde 6: MIN_CLIP_LEFT skaliert mit dem Startvorhang. Start 0 %
   ergibt Schwelle 0 und PASS. Ein Vorhang, der nie da ist, darf nicht gruen
   sein. Unter 30 % Start ist der Effekt kein Vorhang mehr, sondern ein Fade. */
const MIN_CLIP_START = 30;
const MIN_RISE_HIDDEN_OPACITY = 0.4;

/* R190, Lueckenschluss nach opus-critic Runde 4.
   Die Weg-Achse wird an einem Referenzelement mit den Tokens aus motion.tsx
   gemessen (Teil 3b, Begruendung dort: Framer Motion schreibt `transform` an der
   Web-Animations-API vorbei, der Restweg ist am echten Element nicht stellbar).
   Damit prueft das Gate die Tokens — aber nicht, ob eine Komponente sie
   ueberschreibt. `useReveal(opts)` erlaubt das, und es wird genutzt.

   Gemessen beim Einbau dieser Pruefung: Faq.tsx:23 `distance: 12`,
   MehrPage.tsx:102 `distance: 14`, PartysPage 3x `distance: 14` — alle deutlich
   unter dem Token 20. Genau diese Seiten ploppen weiter, und die Referenzmessung
   sieht sie nie. Die Quelle ist hier der einzige Ort, an dem das auffaellt. */
function pruefeUeberschreibungen() {
  const wurzel = path.join(__dirname, '..', 'src');
  const untergrenze = TOKENS.rise.distance * 0.75;
  const funde = [];
  const sammle = (verzeichnis) => {
    for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
      const voll = path.join(verzeichnis, eintrag.name);
      if (eintrag.isDirectory()) sammle(voll);
      else if (eintrag.name.endsWith('.tsx')) {
        const text = fs.readFileSync(voll, 'utf8');
        const zeilen = text.split('\n');
        for (const [i, zeile] of zeilen.entries()) {
          if (!/useReveal(Variant)?\(/.test(zeile)) continue;
          const d = /distance:\s*([\d.]+)/.exec(zeile);
          if (d && parseFloat(d[1]) < untergrenze) {
            funde.push(`${path.relative(wurzel, voll)}:${i + 1} distance ${d[1]}`);
          }
        }
      }
    }
  };
  sammle(wurzel);
  return { funde, untergrenze };
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const failures = [];
  if (TOKENS.clip.start < MIN_CLIP_START) {
    failures.push(
      `clip-Startvorhang ${TOKENS.clip.start} % (erwartet >= ${MIN_CLIP_START}). ` +
        'Ohne Vorhang ist clip nur ein Fade, und MIN_CLIP_LEFT waere 0.',
    );
  }
  if (TOKENS.clip.opacity > 0.95 && TOKENS.clip.start > 50) {
    failures.push(
      `clip startet bei Deckkraft ${TOKENS.clip.opacity} und Vorhang ${TOKENS.clip.start} %. ` +
        'Das ist eine leere Flaeche, die aufklappt.',
    );
  }
  if (TOKENS.riseHiddenOpacity < MIN_RISE_HIDDEN_OPACITY) {
    failures.push(
      `rise startet bei Deckkraft ${TOKENS.riseHiddenOpacity} (erwartet >= ${MIN_RISE_HIDDEN_OPACITY}). ` +
        'Ein 416-px-Raster steht dann unsichtbar im Bild — opus-critic Runde 6.',
    );
  }
  /** Stichproben je Reveal-Variante, ueber ALLE Routen gesammelt. Siehe die
   *  Begruendung an MIN_TRAVEL_LEFT: pro Route sind es zu wenige, und der
   *  Mischmedian ueber alle Varianten misst die falsche Sache. */
  const perVariant = {};
  const lines = [];

  for (const route of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(600);

    /* --- Teil 1: haengt der Reveal am Scroll? ------------------------------------------
     *
     * WARUM NICHT MEHR DER AUSLOESEZEITPUNKT GEMESSEN WIRD. Ein frueherer Entwurf hat
     * genau das versucht: Element an die Fensterkante scrollen, Fortschritt lesen,
     * fordern dass er zwischen 0 und 1 liegt. Zwei Laeufe mit `margin: '12%'` und
     * `margin: '0px'` haben gezeigt, dass die Frage so nicht zu beantworten ist —
     * derselbe `clip`-Reveal mass 0.000 auf `/` und 1.000 auf `/tanzkurse/bachata`.
     * Der Grund liegt in der Sache: ein `whileInView`-Effekt laeuft nach dem Zuenden
     * auf EIGENER Uhr. Was man an einer festen Scrollposition misst, haengt davon ab,
     * wie viele Millisekunden seit dem Zuenden vergangen sind, nicht davon, wie gut
     * die Animation ist. Ein Gate darauf zu bauen heisst, Rauschen zu messen.
     *
     * Die Frage, die Raphael stellt, ist ohnehin eine andere. "Es soll ein smooth
     * Scroll drin sein" heisst: die Bewegung soll dem Finger folgen. Das ist keine
     * Frage des Zeitpunkts, sondern der BINDUNG — und die laesst sich sauber pruefen:
     * zweimal scrollen, dazwischen messen, danach ohne Scrollen nochmal messen.
     *   gebunden  -> Wert aendert sich beim Scrollen, steht still ohne Scrollen.
     *   Timer     -> Wert laeuft ohne Scrollen weiter.
     * Genau das macht Teil 2. Teil 1 stellt nur noch sicher, dass ueberhaupt
     * scroll-gebundene Elemente da sind und nicht alles am Timer haengt. */
    const boundCount = await page.locator('[data-scroll-motion]').count();
    const revealCount = await page.locator('[data-reveal]').count();
    lines.push(`${route}: ${boundCount} scroll-gebunden, ${revealCount} Trigger-Reveals`);
    if (boundCount < MIN_BOUND_ELEMENTS) {
      failures.push(
        `${route}: nur ${boundCount} scroll-gebundene Elemente, erwartet >= ${MIN_BOUND_ELEMENTS}. ` +
          'Ohne Bindung folgt keine Bewegung dem Scrollen.',
      );
    }

    /* --- Teil 2: folgt die Bewegung wirklich dem Scrollen? -----------------------------
     * Drei Messungen je Element:
     *   a  an einer Ausgangsposition
     *   b  nach 400 px Scrollen        -> muss sich geaendert haben (Bindung wirkt)
     *   c  nach 500 ms OHNE Scrollen   -> darf sich NICHT geaendert haben (kein Timer)
     * Der Vergleich b/c ist der eigentliche Beweis. Ein `whileInView`-Effekt liefe in
     * diesen 500 ms weiter; eine echte Bindung steht still, weil der Finger stillsteht. */
    const boundEls = await page.locator('[data-scroll-motion]').all();
    for (const bound of boundEls) {
      const name = (await bound.getAttribute('data-scroll-motion')) || '?';
      const box = await bound.boundingBox().catch(() => null);
      if (!box) continue;

      const read = () =>
        bound.evaluate((el) => {
          const t = getComputedStyle(el).transform;
          const shift = t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42;
          // Auch clip-basierte Reveals mitnehmen, sonst misst man bei ihnen dauerhaft 0.
          const clipMatch = /inset\(([^)]+)\)/.exec(getComputedStyle(el).clipPath || '');
          const clip = clipMatch ? parseFloat(clipMatch[1].trim().split(/\s+/)[2] ?? '0') : 0;
          return shift + clip;
        });

      /* Die zwei Messpunkte muessen INNERHALB der Strecke liegen, auf der sich der
         Effekt bewegt — sonst misst man zweimal denselben Anschlag.

         Beim ersten Lauf ist genau das passiert: `team-band` und `location-photo`
         meldeten 18.0 -> 18.0 und 20.0 -> 20.0, also "bewegt sich nicht". Eine
         Abtastung ueber die volle Sichtbarkeit zeigte das Gegenteil, beide laufen
         sauber durch (team-band 18.00 -> -1.59, location-photo 20.00 -> -3.80).
         Der Fehler lag im Gate: `box.y - 700` traf bei diesen zwei Elementen einen
         Punkt, an dem der Parallax noch am oberen Anschlag stand, und 400 px weiter
         stand er dort immer noch.

         Der Messbereich eines Parallax ist "Oberkante betritt das Fenster von unten"
         bis "Unterkante verlaesst es oben" (SECTION_OFFSET in motion.tsx). Die Mitte
         dieser Strecke ist die Stelle mit der groessten Aenderung pro Scrollpixel.
         Von dort aus wird gemessen. */
      const absY = box.y + (await page.evaluate(() => window.scrollY));
      const viewportH = 900;
      // Mitte der Sichtbarkeitsstrecke: das Element steht mittig im Fenster.
      const middle = Math.max(0, Math.round(absY - viewportH / 2 + box.height / 2));

      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.max(0, middle - 200));
      await page.waitForTimeout(300);
      const a = await read();

      await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
      await page.waitForTimeout(300);
      const b = await read();

      await page.waitForTimeout(500);
      const c = await read();

      lines.push(`${route} ${name}: ${a.toFixed(1)} -> ${b.toFixed(1)} -> ${c.toFixed(1)} (ohne Scroll)`);
      if (Math.abs(b - a) < MIN_SCROLL_SHIFT) {
        failures.push(
          `${route}: "${name}" bewegt sich beim Scrollen kaum (${a.toFixed(1)} -> ${b.toFixed(1)}, ` +
            `erwartet >= ${MIN_SCROLL_SHIFT} px Unterschied).`,
        );
      }
      if (Math.abs(c - b) > 1) {
        failures.push(
          `${route}: "${name}" bewegt sich OHNE Scroll weiter (${b.toFixed(1)} -> ${c.toFixed(1)}) — ` +
            'das ist ein Timer, keine Bindung.',
        );
      }
    }

    /* Dritte Pruefung: der Restweg bei festem ZEITANTEIL der Laufzeit.
       Vorgehen: an eine noch ungezeigte Stelle springen, die laufenden
       Animationen abfragen und ihre Uhr auf TIME_FRACTION setzen. Die
       Begruendung steht oben an MIN_TRAVEL_LEFT: nur diese Groesse ist eine
       Funktion der Kurve. Der Restweg bei fester Deckkraft ist es nicht — er
       kuerzt Kurve und Dauer weg und misst allein die Distanz.

       Kein Abtasten mehr: die Uhr wird gesetzt statt abgewartet. Damit haengt
       das Ergebnis nicht daran, wie schnell die Maschine an diesem Tag ist. */
    /* FRISCHE SEITE. Teil 1 und 2 scrollen die Route bereits durch, und die Reveals
       laufen mit `once: true` (VIEWPORT in motion.tsx). Nach dem ersten Durchgang
       sind sie verbraucht und zuenden nie wieder — auf der alten Seite gemessen
       lieferte `rise` deshalb Restweg 0,00 bei Deckkraft 1,00, und `clip` fiel ganz
       aus der Messung. Ein Zurueckscrollen hilft nicht; `once` ist der Punkt. */
    const travelContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'no-preference',
    });
    const travelPage = await travelContext.newPage();
    await travelPage.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await travelPage.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await travelPage.waitForTimeout(600);
    await travelPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await travelPage.waitForTimeout(400);
    const travelSamples = [];
    const maxY = await travelPage.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 720; y <= maxY; y += 720) {
      await travelPage.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      // Kurz warten, bis die Reveals dieses Sprungs ueberhaupt gestartet sind.
      await travelPage.waitForTimeout(120);
      const found = await travelPage.evaluate((anteil) => {
        const out = [];
        for (const el of document.querySelectorAll('[data-reveal] *, [data-reveal-variant]')) {
          const box = el.getBoundingClientRect();
          if (box.top < 0 || box.top > innerHeight || box.height < 4) continue;
          /* Die laufende Animation direkt befragen, statt auf einen Zustand zu warten.
             `getAnimations()` liefert die Uhr; wir setzen sie auf den Pruefzeitpunkt,
             lesen ab und geben sie zurueck. Der gelesene Wert haengt damit an der
             Kurve, nicht an der Systemlast — genau der Fehler, der die Versuche 4
             und 5 (oben) unbrauchbar machte. */
          /* ALLE Animationen des Elements, nicht die erste. Framer Motion legt pro
             Eigenschaft eine eigene Animation an. Wer nur `getAnimations()[0]` stellt,
             erwischt oft die Opacity-Uhr und liest danach eine andere Eigenschaft, die
             niemand bewegt hat.

             ACHTUNG, GRENZE DIESER MESSUNG: nur was ueber die Web-Animations-API
             laeuft, laesst sich so stellen. Framer Motion nutzt WAAPI, wo es kann, und
             schreibt sonst direkt in den Style. Nachgemessen auf `/`: `clipPath`,
             `filter`, `opacity` und `scale` laufen ueber WAAPI, der `transform` der
             `rise`-Elemente NICHT. Fuer die Weg-Achse taugt diese Stelle deshalb
             nicht — sie liefert dort den Zufallszustand beim Hinschauen. Weg wird
             darum gegen ein Referenzelement gemessen (Teil 3b weiter unten), Vorhang
             und Schaerfe hier am echten Element. */
          const anims = el.getAnimations().filter((a) => a.effect && a.playState === 'running');
          if (!anims.length) continue;
          /* `getComputedTiming().duration` liefert eine Zahl oder den String 'auto'.
             `parseFloat` macht daraus an dieser einen Stelle einen Zahlenwert oder
             NaN — danach wird nur noch mit Zahlen gerechnet. */
          const gestellt = [];
          for (const a of anims) {
            const dauer = parseFloat(a.effect.getComputedTiming().duration);
            if (!Number.isFinite(dauer) || dauer <= 0) continue;
            gestellt.push({ anim: a, vorher: a.currentTime });
            a.pause();
            a.currentTime = dauer * anteil;
          }
          if (!gestellt.length) continue;
          const cs = getComputedStyle(el);
          const matrix = cs.transform.match(/matrix\([^)]*,\s*([-\d.]+)\)$/);
          const blurMatch = /blur\(([\d.]+)px\)/.exec(cs.filter || '');
          const opacity = parseFloat(cs.opacity);
          /* Dritte Achse: `clip` bewegt nichts und blurrt nicht, es faehrt einen
             Vorhang (`inset(0% 0% 100% 0%)` -> `inset(0% 0% 0% 0%)`, motion.tsx:332).
             Ohne diese Zeile fiel die Variante durch alle Achsen und wurde gar nicht
             gemessen. Der Restwert ist der noch verdeckte Anteil, in Prozent. */
          const insetMatch = /inset\(([^)]*)\)/.exec(cs.clipPath || '');
          const insetTeile = insetMatch ? insetMatch[1].trim().split(/\s+/) : [];
          const vorhang = insetTeile.length >= 3 ? parseFloat(insetTeile[2]) : 0;
          // Die Variante steht am naechsten Vorfahren, der sie traegt. `rise` kommt
          // ohne Attribut vor (Kinder eines `data-reveal`-Containers) und ist der
          // Default — dieselbe Vorbelegung wie in motion.tsx.
          const host = el.closest('[data-reveal-variant]');
          const variant = host ? host.getAttribute('data-reveal-variant') : 'rise';
          /* NUR das Element, das die Variante selbst traegt — nicht seine Kinder.
             R190, gefunden durch die neue Einzelmessungs-Pruefung: `closest()` gab
             jedem Nachfahren eines clip-Elements die Variante clip. Diese Kinder
             haben keinen eigenen `clip-path`, liefern also Vorhang 0,00 und zogen
             das Minimum auf null. Der Median verdeckte es, die Einzelgrenze nicht.
             Das war ein Fehler der Messung, nicht der Seite. */
          if (host && host !== el) {
            for (const g of gestellt) {
              g.anim.currentTime = g.vorher;
              g.anim.play();
            }
            continue;
          }
          /* Nur die Varianten, deren Achse hier ehrlich messbar ist. `rise` und
             `letters` bewegen `transform` an WAAPI vorbei (Begruendung oben) und
             wuerden hier Rauschen liefern. Sie kommen in Teil 3b dran. */
          if (variant !== 'clip' && variant !== 'blur') {
            for (const g of gestellt) {
              g.anim.currentTime = g.vorher;
              g.anim.play();
            }
            continue;
          }
          out.push({
            left: Math.abs(matrix ? parseFloat(matrix[1]) : 0),
            blur: blurMatch ? parseFloat(blurMatch[1]) : 0,
            vorhang: Number.isFinite(vorhang) ? vorhang : 0,
            variant,
            opacity,
          });
          // Zustand zuruecksetzen: die Seite soll nach der Messung weiterlaufen.
          for (const g of gestellt) {
            g.anim.currentTime = g.vorher;
            g.anim.play();
          }
        }
        return out;
      }, TIME_FRACTION);
      travelSamples.push(...found);
    }

    /* --- Teil 3b: die Weg-Achse gegen ein Referenzelement -------------------------------
     * `rise` und `letters` bewegen ihren Versatz an der Web-Animations-API vorbei
     * (Begruendung in Teil 3). Am laufenden Reveal ist der Restweg deshalb nicht
     * stellbar, und jede Messung dort liefert den Zufallszustand beim Hinschauen —
     * gemessen: derselbe unveraenderte Code ergab Wege von 0,00 bis 20,00 px.
     *
     * Geprueft wird die Weg-Achse darum an einem Element, das die ECHTEN Tokens aus
     * motion.tsx benutzt. Die Werte werden aus der Quelldatei gelesen, nicht hier
     * dupliziert: dreht jemand `EASE_OUT`, `distance` oder `duration` zurueck, faellt
     * dieses Gate. Genau das ist der Zweck von A3.
     *
     * Belegt in scripts/r190-probe-kurve.cjs, 2x2 im echten Browser, je 5 Laeufe:
     *   alles neu 7,80 · nur Kurve+Dauer alt 4,11 · nur distance alt 5,46 · alles alt 2,88.
     * Streuung null, Trennung Faktor 1,9. */
    for (const variante of ['rise', 'letters']) {
      const token = TOKENS[variante];
      const referenz = await travelPage.evaluate(
        ({ ease, distance, dauerMs, anteil }) => {
          const el = document.createElement('div');
          el.style.cssText = 'position:fixed;left:-9999px;top:0;width:100px;height:20px';
          document.body.appendChild(el);
          const anim = el.animate(
            [
              { opacity: 0, transform: `translate3d(0,${distance}px,0)` },
              { opacity: 1, transform: 'translate3d(0,0,0)' },
            ],
            { duration: dauerMs, easing: `cubic-bezier(${ease.join(',')})`, fill: 'both' },
          );
          anim.pause();
          anim.currentTime = dauerMs * anteil;
          const cs = getComputedStyle(el);
          const matrix = cs.transform.match(/matrix\([^)]*,\s*([-\d.]+)\)$/);
          const wert = {
            left: Math.abs(matrix ? parseFloat(matrix[1]) : 0),
            opacity: parseFloat(cs.opacity),
          };
          anim.cancel();
          el.remove();
          return wert;
        },
        {
          ease: token.ease,
          distance: token.distance,
          dauerMs: token.duration * 1000,
          anteil: TIME_FRACTION,
        },
      );
      lines.push(
        `${route} Referenzweg ${variante} bei ${Math.round(TIME_FRACTION * 100)} % der Laufzeit: ` +
          `${referenz.left.toFixed(2)} px von ${token.distance} px ` +
          `(Kurve [${token.ease.join(', ')}], Dauer ${token.duration} s)`,
      );
      travelSamples.push({ ...referenz, blur: 0, vorhang: 0, variant: variante });
    }

    await travelContext.close();
    if (travelSamples.length < MIN_TRAVEL_SAMPLES) {
      failures.push(
        `${route}: nur ${travelSamples.length} Element(e) beim Einblenden erwischt ` +
          `(mindestens ${MIN_TRAVEL_SAMPLES}). Ohne Stichprobe sagt die Weg-Messung nichts.`,
      );
    } else {
      // Je Variante sammeln, aber HIER noch nicht urteilen. Die Bewertung laeuft
      // ueber beide Routen zusammen (siehe unten), weil eine einzelne Route pro
      // Variante zu wenige Stichproben liefert.
      for (const sample of travelSamples) {
        (perVariant[sample.variant] ||= []).push(sample);
      }
      const counts = Object.entries(
        travelSamples.reduce((acc, s) => ({ ...acc, [s.variant]: (acc[s.variant] || 0) + 1 }), {}),
      )
        .map(([v, n]) => `${v}=${n}`)
        .join(' ');
      lines.push(
        `${route} bei ${Math.round(TIME_FRACTION * 100)} % der Laufzeit: ` +
          `${travelSamples.length} Messungen (${counts})`,
      );
    }

    await context.close();

    /* --- Teil 4: `prefers-reduced-motion` neutralisiert ALLES ---------------------------
     * Regel A aus motion.tsx, und die einzige der drei Regeln dort, die bisher kein Gate
     * hatte. Sie ist leicht zu brechen, ohne dass es auffaellt: wer eine neue Variante
     * baut und den `reduced`-Zweig vergisst, sieht davon nichts — die Seite sieht fuer
     * ihn ja richtig aus. Betroffen waeren Nutzer, die Bewegung aus gutem Grund
     * abgeschaltet haben (Migraene, Schwindel, Reisekrankheit).
     * Geprueft wird im selben Durchlauf, nur mit `reducedMotion: 'reduce'`: kein Element
     * eines Reveals darf dann Versatz, Blur oder einen geschlossenen Clip tragen.
     * Erlaubt bleibt genau eines: Fade. */
    const reducedContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await reducedPage.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await reducedPage.waitForTimeout(600);
    const reducedMax = await reducedPage.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    );
    const moving = new Set();
    for (let y = 0; y <= reducedMax; y += 700) {
      await reducedPage.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await reducedPage.waitForTimeout(150);
      const hits = await reducedPage.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll(
          '[data-reveal] *, [data-reveal-variant], [data-scroll-motion]',
        )) {
          /* `sr-only` traegt per Definition `clip-path: inset(50%)` — die
             Standard-Technik fuer "fuer Screenreader da, optisch weg". Ohne diese
             Ausnahme meldet die Probe 13 Treffer, von denen keiner einer ist.
             (Selbst hineingelaufen, bevor dieser Teil hier stand.) */
          if (el.closest('.sr-only') || String(el.className).includes('sr-only')) continue;
          const cs = getComputedStyle(el);
          const matrix = cs.transform.match(/matrix\([^)]*,\s*([-\d.]+)\)$/);
          const shift = matrix ? Math.abs(parseFloat(matrix[1])) : 0;
          const blurMatch = /blur\(([\d.]+)px\)/.exec(cs.filter || '');
          const clipped = /inset\([^)]*[1-9][\d.]*%/.test(cs.clipPath || '');
          if (shift > 1 || (blurMatch && parseFloat(blurMatch[1]) > 0.1) || clipped) {
            out.push(
              `${el.tagName} shift=${shift.toFixed(1)}px ` +
                `blur=${blurMatch ? blurMatch[1] : 0}px clip=${clipped}`,
            );
          }
        }
        return out;
      });
      for (const hit of hits) moving.add(hit);
    }
    await reducedContext.close();

    lines.push(`${route} reduced-motion: ${moving.size} Elemente mit Bewegung (erwartet 0)`);
    if (moving.size > 0) {
      failures.push(
        `${route}: ${moving.size} Element(e) bewegen sich trotz prefers-reduced-motion — ` +
          `${[...moving].slice(0, 3).join(' | ')}. Regel A aus motion.tsx verlangt reines Fade.`,
      );
    }
  }

  await browser.close();

  /* Bewertung je Variante, ueber beide Routen zusammen.
     `blur` wird am Restblur gemessen, alle anderen am Restweg — die Achse
     haengt daran, WIE der Effekt gebaut ist (motion.tsx, variantItem). */
  const medianOf = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

  /* Eine Variante, die GAR KEINE Messung liefert, taucht in `perVariant` nicht auf
     und loeste vorher nichts aus: ein kaputtes `clip`- oder `letters`-Reveal konnte
     dieses Gate nicht rot machen, und sein Fehlen war in der Ausgabe unsichtbar.
     Befund von sol-critic. Die Seite traegt alle vier Varianten, also ist eine
     fehlende Variante immer ein Befund — entweder ist die Messung kaputt oder die
     Variante wird nicht mehr benutzt. Beides gehoert gemeldet. */
  for (const variant of ERWARTETE_VARIANTEN) {
    if (!perVariant[variant]) {
      failures.push(
        `Variante ${variant}: keine einzige Messung. Entweder rendert die Seite sie ` +
          'nicht mehr, oder die Probe erwischt sie nicht. In beiden Faellen prueft ' +
          'dieses Gate sie nicht — stilles Durchfallen ist kein PASS.',
      );
    }
  }

  for (const [variant, samples] of Object.entries(perVariant)) {
    /* Drei Achsen, weil die vier Varianten drei verschiedene Dinge bewegen
       (motion.tsx, variantItem): rise und letters einen Weg, blur die Schaerfe,
       clip einen Vorhang. Eine Variante an der falschen Achse zu messen ergibt
       strukturell 0 — genau daran fiel `clip` vorher stumm durch. */
    const achse =
      variant === 'blur' ? 'blur' : variant === 'clip' ? 'clip' : 'weg';
    const axis = { blur: 'Restblur', clip: 'Restvorhang', weg: 'Restweg' }[achse];
    const einheit = achse === 'clip' ? '%' : 'px';
    const limit = { blur: MIN_BLUR_LEFT, clip: MIN_CLIP_LEFT, weg: MIN_TRAVEL_LEFT }[achse];
    const value = (s) => (achse === 'blur' ? s.blur : achse === 'clip' ? s.vorhang : s.left);
    const median = medianOf(samples.map(value));
    const worst = samples.reduce((a, b) => (value(a) < value(b) ? a : b));

    /* `rise` und `letters` kommen aus der Referenzmessung (Teil 3b) und sind
       deterministisch: gleiche Tokens, gleiche Uhr, gleicher Wert. Eine Stichprobe
       je Route reicht dort, waehrend `clip` und `blur` am echten Element gemessen
       werden und die Streuung ueber mehrere Messungen brauchen. */
    const referenzVariante = achse === 'weg';
    if (!referenzVariante && samples.length < MIN_PER_VARIANT) {
      lines.push(
        `Variante ${variant}: nur ${samples.length} Messung(en), ${axis}-Median ` +
          `${median.toFixed(2)} ${einheit} — zu wenig fuer ein Urteil, nicht bewertet.`,
      );
      continue;
    }
    lines.push(
      `Variante ${variant}: ${axis}-Median ${median.toFixed(2)} ${einheit}, Minimum ` +
        `${value(worst).toFixed(2)} ${einheit} (Deckkraft dort ${worst.opacity.toFixed(2)}), ` +
        `${samples.length} Messungen, Schwelle ${limit}`,
    );
    if (median < limit) {
      failures.push(
        `Variante ${variant}: beim Einblenden bleiben im Median nur ${median.toFixed(2)} ` +
          `${einheit} ${axis} (erwartet >= ${limit}). Die Geste ist vorbei, bevor man das ` +
          'Element lesen kann — sichtbar ist dann ein Aufhellen an Ort und Stelle.',
      );
    }
    /* R190, DIE Pruefung fuer Raphaels Punkt 1, gefunden durch opus-critic Runde 4.
       `clip` fuhr vorher `opacity: 1` in BEIDEN Zustaenden. Eine 416 px hohe Sektion
       stand damit voll sichtbar im Bild und war zu 100 % leer — ein graues Rechteck,
       das dann aufklappt. Das ist woertlich "das ploppt einfach ein".

       Die Vorhang-Achse allein sieht das NICHT: der alte Stand liefert Restvorhang
       39,01 % und kaeme durch. Gemessen als Gegenprobe beim Einbau dieser Zeilen,
       mit zurueckgedrehtem motion.tsx — das Gate meldete PASS.
       Der Unterschied steht in der Deckkraft: alt 1,00, neu 0,82.

       Ein Element, das voll deckend dasteht und dabei fast ganz verdeckt ist, ist
       eine leere Flaeche. Beides zusammen ist der Befund, keins allein. */
    if (achse === 'clip') {
      const leerFlaeche = samples.filter((s) => s.opacity > 0.95 && s.vorhang > 50);
      if (leerFlaeche.length > 0) {
        failures.push(
          `Variante clip: ${leerFlaeche.length} Element(e) stehen bei voller Deckkraft ` +
            `(> 0,95) und sind dabei zu mehr als der Haelfte verdeckt (bis ` +
            `${Math.max(...leerFlaeche.map((s) => s.vorhang)).toFixed(1)} %). ` +
            'Sichtbar ist eine leere Flaeche, die danach aufklappt — genau das Ploppen.',
        );
      }
    }
    /* R190, Lueckenschluss nach opus-critic Runde 4: das Minimum wurde gemeldet und
       nicht bewertet. Bei 13 clip-Messungen durften damit sechs bei 0 stehen, ohne
       dass das Gate faellt — und eine einzelne Messung bei 0 IST der Ploppen-Fall,
       den dieses Gate finden soll. Die Einzelgrenze liegt bei der Haelfte des
       Medianlimits: Streuung am echten Element ist normal, ein Totalausfall nicht. */
    if (!referenzVariante && value(worst) < limit / 2) {
      failures.push(
        `Variante ${variant}: eine Einzelmessung steht bei ${value(worst).toFixed(2)} ` +
          `${einheit} ${axis} (erwartet >= ${(limit / 2).toFixed(2)}). Dieses eine Element ` +
          'ploppt, auch wenn der Median stimmt.',
      );
    }
  }

  const { funde, untergrenze } = pruefeUeberschreibungen();
  lines.push(
    `Komponenten mit eigenem distance unter ${untergrenze.toFixed(1)} px ` +
      `(Token ${TOKENS.rise.distance}): ${funde.length}`,
  );
  for (const fund of funde) lines.push(`  ${fund}`);
  if (funde.length > 0) {
    failures.push(
      `${funde.length} Komponente(n) ueberschreiben distance unter ${untergrenze.toFixed(1)} px: ` +
        `${funde.join(', ')}. Dort greift die neue Kurve nicht — die Referenzmessung ` +
        'sieht diese Elemente nicht, weil sie eigene Werte setzen.',
    );
  }

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
