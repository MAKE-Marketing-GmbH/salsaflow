/* R190: Trennt "Restweg bei festem ZEITANTEIL" die Kurve, wo "Restweg bei fester
   DECKKRAFT" es nicht tut?

   Anlass: sol-critic hat am Code gezeigt, dass die bisherige Gate-Groesse blind
   fuer Kurve und Dauer ist. `useReveal` gibt Deckkraft und Versatz EIN gemeinsames
   `transition`-Objekt (motion.tsx:152). Also gilt zu jedem Zeitpunkt

       opacity = p        y = distance * (1 - p)

   mit demselben Fortschritt p. Daraus folgt

       Restweg = distance * (1 - opacity)

   — Kurve und Dauer kuerzen sich weg. Die alte Schwelle MIN_TRAVEL_LEFT = 5.5 im
   Fenster 0,6..0,7 pruefte in Wahrheit nur `distance >= ~15,7 px`. Die eigene
   Kalibriertabelle des Gates bestaetigt das ungewollt: alle drei Fenster zeigten
   Faktor ~1,4, und 20/14 = 1,4286.

   Diese Sonde vergleicht beide Kandidaten am ECHTEN Browser, nicht im Modell:
     A) Restweg bei Deckkraft 0,60..0,70   (die alte, blinde Groesse)
     B) Restweg bei 27 % der Laufzeit      (die neue, kurvenabhaengige Groesse)

   Gefahren werden vier Zustaende, damit sichtbar wird, WORAUF jede Groesse
   reagiert — genau die 2x2, die in Runde 3 gefehlt hat:
     1 alles neu          Kurve neu, distance 20, Dauer 0,58
     2 alles alt          Kurve alt, distance 14, Dauer 0,45
     3 nur Kurve+Dauer alt, distance bleibt 20
     4 nur distance alt (14), Kurve+Dauer bleiben neu

   Erwartung, falls die neue Groesse taugt: B trennt 1 von 3 (die Kurve ist der
   Unterschied), A nicht. Umgekehrt trennt A nur 1 von 4.

   Die Sonde AENDERT motion.tsx nicht. Sie injiziert die vier Zustaende zur
   Laufzeit als eigene Animation auf einem Testelement mit denselben Werten.
   Grund: der Branch soll waehrend der Messung stillstehen. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';

const ZUSTAENDE = [
  ['1 alles neu           ', [0.33, 1, 0.68, 1], 20, 580],
  ['2 alles alt           ', [0.22, 1, 0.36, 1], 14, 450],
  ['3 nur Kurve+Dauer alt ', [0.22, 1, 0.36, 1], 20, 450],
  ['4 nur distance alt    ', [0.33, 1, 0.68, 1], 14, 580],
];

const ZEITANTEIL = 0.27; // dieselbe Stelle, aus der motion.tsx argumentiert
const FENSTER = [0.6, 0.7];
const WIEDERHOLUNGEN = 5;

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(600);

  console.log(`Zeitanteil ${ZEITANTEIL}, Deckkraft-Fenster ${FENSTER[0]}..${FENSTER[1]}, ${WIEDERHOLUNGEN} Laeufe je Zustand\n`);
  console.log('Zustand                  A: Restweg @Deckkraft 0,6-0,7   B: Restweg @27 % Laufzeit');

  for (const [name, ease, distance, dauer] of ZUSTAENDE) {
    const a = [];
    const b = [];
    for (let i = 0; i < WIEDERHOLUNGEN; i += 1) {
      const r = await page.evaluate(
        async ({ ease, distance, dauer, zeitanteil, fenster }) => {
          const el = document.createElement('div');
          el.style.cssText =
            'position:fixed;left:-9999px;top:0;width:100px;height:20px;will-change:transform,opacity';
          document.body.appendChild(el);
          const cb = `cubic-bezier(${ease.join(',')})`;
          const anim = el.animate(
            [
              { opacity: 0, transform: `translate3d(0,${distance}px,0)` },
              { opacity: 1, transform: 'translate3d(0,0,0)' },
            ],
            { duration: dauer, easing: cb, fill: 'both' },
          );

          const lies = () => {
            const cs = getComputedStyle(el);
            const m = new DOMMatrixReadOnly(cs.transform);
            return { opacity: parseFloat(cs.opacity), weg: Math.abs(m.m42) };
          };

          // B: exakt bei 27 % der Laufzeit, ueber die Animations-Uhr statt ueber
          // setTimeout — dadurch haengt der Wert nicht an der Systemlast.
          anim.pause();
          anim.currentTime = dauer * zeitanteil;
          const beiZeit = lies().weg;

          // A: Verlauf abtasten und alle Proben im Deckkraft-Fenster sammeln.
          const imFenster = [];
          for (let t = 0; t <= dauer; t += dauer / 60) {
            anim.currentTime = t;
            const s = lies();
            if (s.opacity >= fenster[0] && s.opacity <= fenster[1]) imFenster.push(s.weg);
          }
          anim.cancel();
          el.remove();
          const median = (xs) => {
            if (!xs.length) return null;
            const s = [...xs].sort((x, y) => x - y);
            const m = Math.floor(s.length / 2);
            return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
          };
          return { beiZeit, beiDeckkraft: median(imFenster) };
        },
        { ease, distance, dauer, zeitanteil: ZEITANTEIL, fenster: FENSTER },
      );
      a.push(r.beiDeckkraft);
      b.push(r.beiZeit);
    }
    const fmt = (xs) => xs.map((x) => (x === null ? ' -- ' : x.toFixed(2))).join(' · ');
    console.log(`${name}   ${fmt(a).padEnd(30)}  ${fmt(b)}`);
  }

  await browser.close();
})();
