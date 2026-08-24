// R214: Prueft den Kopf der Sektion "Vom ersten Grundschritt zur sicheren
// Tanzflaeche" auf beiden Routen, auf denen die Komponente laeuft.
//
// Der Befund (Critic 23.08. 23:16): auf Home stand rechts von x>=700 zwischen der
// H2 (y2842) und dem Foto (y3127) 285px lang KEIN Element. Gemessen wird deshalb
// genau das: gibt es rechts von der Seitenmitte ein Ink-Element auf
// Ueberschriftenhoehe, also zwischen H2-Oberkante und H2-Unterkante+Lead?
//
// Zwei Routen, weil CoursePath ZWEIMAL rendert:
//   /            -> <CoursePath />          (standalone, <h2>)
//   /kursaufbau  -> <CoursePath embedded /> (in ScheduleTeaser, <h3>)
// Der Nachbar "Finde deinen naechsten Kurs" laeuft als Gegenprobe mit: seine
// Bauform ist die Vorlage, seine Zahlen sind der Zielkorridor.
//
// Zusaetzlich: der fixe WhatsApp-Knopf. `lg:pr-36` existiert nur, damit der CTA
// nicht in seine Zone laeuft (Critic Runde 15, Item 1). Also wird die reale
// Ueberlappung CTA-rechts vs. FAB-links geprueft statt geglaubt.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4718';

const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '390', width: 390, height: 844 },
];

// Textanfaenge, ueber die die beiden Koepfe gefunden werden. Kein nth-child:
// die Sektion verschiebt sich, der Text nicht.
const HEADS = {
  levels: 'Vom ersten Grundschritt',
  nachbar: 'Finde deinen n',
};

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`\n########## ${vp.tag} (${vp.width}x${vp.height})`);

    for (const route of ['/', '/kursaufbau']) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      // Key am Code nachgeschlagen (CookieBanner.tsx:18/46).
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });

      // Reveal: alles einmal durchscrollen, damit whileInView ausgeloest hat.
      // Sonst misst man versteckte Elemente und haelt sie fuer fehlend.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);

      const res = await page.evaluate((HEADS) => {
        const vis = (el) => {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return false;
          if (Number(s.opacity) < 0.05) return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        };
        // Seitenkoordinaten statt Viewport: die Sektion liegt weit unten.
        const abs = (el) => {
          const r = el.getBoundingClientRect();
          return {
            top: r.top + window.scrollY,
            bottom: r.bottom + window.scrollY,
            left: r.left,
            right: r.right,
          };
        };

        const out = {};

        for (const [key, needle] of Object.entries(HEADS)) {
          const head = [...document.querySelectorAll('h1,h2,h3,h4')].find(
            (el) => (el.textContent || '').trim().startsWith(needle) && vis(el),
          );
          if (!head) {
            out[key] = null;
            continue;
          }
          const h = abs(head);

          // Das Band, in dem laut Befund rechts nichts stand: von der
          // Ueberschriften-Oberkante bis 200px darunter. Der Critic hat 285px
          // Leere gemessen; 200px ist der konservativere Ausschnitt.
          const bandTop = h.top;
          const bandBottom = h.top + 200;
          const mid = window.innerWidth / 2;

          // Ink = etwas, das man sieht: Text, Bild, Rahmen, gefuellte Flaeche.
          // Reine Layout-Container ohne eigene Farbe zaehlen nicht.
          const ink = [];
          document.querySelectorAll('main *').forEach((el) => {
            if (!vis(el)) return;
            const r = abs(el);
            if (r.bottom <= bandTop || r.top >= bandBottom) return;
            if (r.left < mid) return; // nur die rechte Haelfte
            const s = getComputedStyle(el);
            const hasText =
              [...el.childNodes].some(
                (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
              );
            const isMedia = /^(IMG|SVG|VIDEO)$/.test(el.tagName);
            const painted =
              s.backgroundImage !== 'none' ||
              (s.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                s.backgroundColor !== 'transparent');
            if (!hasText && !isMedia && !painted) return;
            ink.push({
              tag: el.tagName,
              text: (el.textContent || '').trim().slice(0, 30),
              left: Math.round(r.left),
              top: Math.round(r.top),
            });
          });
          // Innerste Treffer zuerst, damit nicht der Wrapper das Ergebnis stellt.
          ink.sort((a, b) => a.top - b.top || b.left - a.left);

          out[key] = {
            headTop: Math.round(h.top),
            headLeft: Math.round(h.left),
            headBottom: Math.round(h.bottom),
            bandBottom: Math.round(bandBottom),
            inkCount: ink.length,
            inkFirst: ink[0] || null,
            inkLast: ink[ink.length - 1] || null,
          };
        }

        // Fixer WhatsApp-Knopf: seine linke Kante ist die Sperrlinie.
        const fab = [...document.querySelectorAll('a,button')]
          .filter((el) => {
            if (!vis(el)) return false;
            const s = getComputedStyle(el);
            return s.position === 'fixed' && el.getBoundingClientRect().left > window.innerWidth * 0.6;
          })
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.left - b.left)[0];

        // Der CTA dieser Sektion: der Link auf /kursaufbau bzw. der Textlink.
        const cta = [...document.querySelectorAll('main a')].find(
          (el) => vis(el) && /Welches Level passt|Which level fits/.test(el.textContent || ''),
        );

        return {
          heads: out,
          fabLeft: fab ? Math.round(fab.left) : null,
          ctaRight: cta ? Math.round(cta.getBoundingClientRect().right) : null,
          ctaText: cta ? cta.textContent.trim().slice(0, 30) : null,
        };
      }, HEADS);

      console.log(`  --- ${route}`);
      for (const [key, v] of Object.entries(res.heads)) {
        if (!v) {
          console.log(`    ${key.padEnd(8)} NICHT GEFUNDEN`);
          continue;
        }
        console.log(
          `    ${key.padEnd(8)} h.top=${String(v.headTop).padStart(5)} h.left=${String(v.headLeft).padStart(4)}` +
            `  Band bis ${v.bandBottom}  RECHTS-INK=${v.inkCount}` +
            (v.inkCount === 0 ? '  <<< RECHTE HAELFTE LEER' : ''),
        );
        if (v.inkFirst) {
          console.log(
            `             erstes rechts: <${v.inkFirst.tag}> x=${v.inkFirst.left} y=${v.inkFirst.top} "${v.inkFirst.text}"`,
          );
        }
      }
      const abstand =
        res.fabLeft !== null && res.ctaRight !== null ? res.fabLeft - res.ctaRight : null;
      console.log(
        `    FAB.left=${res.fabLeft}  CTA.right=${res.ctaRight} ("${res.ctaText}")` +
          `  ABSTAND=${abstand === null ? '?' : abstand}` +
          (abstand !== null && abstand < 0 ? '  <<< CTA LAEUFT IN DEN FAB' : ''),
      );

      await ctx.close();
    }
  }
  await browser.close();
})();
