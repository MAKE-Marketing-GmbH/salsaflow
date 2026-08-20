// S8 Team + SIGNATURE — Kunden-Feedback 2026-08-07 neu gebaut.
//
// Kritik war: "Die Team-Sektion mit den Zahlen und dem daneben sieht nicht geil aus."
// Gemeint war die weisse Zahlen-Karte (2018 / 3 / ~40), die per `lg:-mt-14` auf den Fuss des
// gerahmten Teamfotos geschoben war (Beleg /tmp/salsaflow-shots/home-desktop-12-y8400.png).
// Zwei Gruende, warum das nicht trug:
//   - Die Karte lag NICHT auf dem Motiv, sondern auf dem leeren Parkett darunter und sass mit
//     `lg:ml-10` auf keiner Kante der Seite auf — sie schwebte sichtbar beliebig.
//   - Sie war der dritte Zahlen-Block der Seite und wiederholte 1:1 die Zahlen von /team.
//
// Neuer Aufbau, ohne schwebende Karte:
//   1) Intro (Headline + Story)
//   2) Die drei Zahlen als EINE schlichte Zeile in der Typo, direkt unter der Story —
//      Fakt, kein Bauelement. /team traegt dieselben Zahlen jetzt nicht mehr (TeamPage.tsx).
//   3) Das Teamfoto als full-bleed Band ueber die volle Viewportbreite, ohne Radius, ohne
//      Rahmen, ohne Chip. Nichts liegt mehr darauf.
//   4) Die vier Gruender als eigene klare Reihe darunter (FounderCards, /team-konsistent).
//
// Foto: /photos/showcase/hp-29.webp — das ganze Team vor der Salsaflow-Wand, auf der Seite
// sonst ungenutzt (geprueft per grep 2026-08-07). hp-03 bleibt dem /team-Hero.
//
// Motion: ruhiger Fade-up-Takt (Reveal/useReveal), Bild steigt leicht groesser rein.
// Reduced-motion: nur Fade, kein Versatz, kein Scale (via useReveal/useReducedMotion).

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { HOME_V3 } from '@/public/home/content-v3';
import { FounderCards } from '@/public/team/FounderRow';
import { Eyebrow, Shell, BeatMark, CtaArrow } from '@/public/site/primitives';
import { Reveal, useReveal, EASE_OUT, VIEWPORT, useHydrated } from '@/public/home/motion';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

/** Heller Fallback, falls ein Foto fehlt (onError): warme Flaeche statt Broken-Icon. */
function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.style.visibility = 'hidden';
  const parent = img.parentElement;
  // Runde 2, Issue 8: EIN Grundton fuer alle Personen-Kacheln (bg-soft), auch im Fallback.
  if (parent) parent.style.background = 'var(--color-bg-soft)';
}

export function TeamBlock() {
  const { lang } = useLang();
  const de = lang === 'de';
  const reduced = useReducedMotion();
  const t = HOME_V3[lang].team;
  const { item } = useReveal();

  // Bild-Reveal: Fade + leichter Anstieg + minimales Grosswerden (wie im Hero-Anker).
  const hydrated = useHydrated();
  const imgReveal: Variants = {
    hidden: hydrated ? { opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.99 } : { opacity: 1, y: 0, scale: 1 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_OUT } },
  };

  return (
    <section
      id="team"
      // Sektions-Variante 3 von 3: full-bleed Foto-Band zwischen zwei Shell-Bloecken (Typo oben,
      // Gruender unten). Zugleich der EINE Hoehepunkt der Seite — die Betonung kommt aus dem
      // randlosen Foto ueber die volle Viewportbreite, nicht aus einem groesseren Sektionsrand.
      // Kritiker-Runde 3, Befund d-07 ("tote weisse Totzone unter dem Dark-Block"): gemessen
      // lagen zwischen dem letzten Inhalt im dunklen Events-Band und der ersten Team-Zeile
      // 244px (1440px) bzw. 180px (390px) — 96px dunkler Sektionsfuss PLUS 128px heller
      // Sektionskopf, die an der Hell-Dunkel-Kante aufeinander stapelten. Der Farbwechsel ist
      // die Kapitelgrenze; sie braucht den doppelten Abstand nicht. Der Kopf laeuft an dieser
      // EINEN Kante auf die normale Stufe zurueck, der Fuss bleibt SECTION_Y_PEAK — der
      // Hoehepunkt-Rhythmus der Sektion bleibt damit erhalten.
      // Kritiker-FAIL 2026-08-09, "Abstand Reviews->Team/Pricing stark reduzieren":
      // `node scripts/aaa-measure.cjs` mass an der Kante team -> PriceSignal DEADGAP=225px —
      // der groesste tote Streifen der ganzen Seite (alle anderen Kanten lagen bei 160px).
      // Ursache ist der Sektionsfuss: SECTION_Y_PEAK gibt lg:py-32 (128px), waehrend die
      // Nachbarsektion mit 97px anschliesst. Der Kopf lief hier schon lange auf einer eigenen,
      // kleineren Stufe (pt-12 lg:pt-16) — der Fuss blieb als einziger Wert auf PEAK stehen
      // und war damit nicht mehr Betonung, sondern eine Luecke.
      // Neu laeuft der Fuss auf der Grundstufe der Seite: pb-16 (64px), gemessen identisch zu
      // den Nachbarkanten. Die Sektion bleibt mit ihrem full-bleed Foto-Band und knapp 2000px
      // Hoehe weiterhin der EINE Hoehepunkt der Seite — die Betonung traegt das Bild, nicht
      // der leere Rand darunter.
      // R183 Fix-Runde 3: Der Sektionskopf lief als einziger Wert der Seite von Hand
      // (`pt-12 pb-16 lg:pt-16`) statt ueber den geteilten Token. Gemessen
      // (worklog/.r183c-scan.mjs) kostete das mobil 16px: die Kante events -> team lag bei
      // 112px (64 Fuss + 48 Kopf), waehrend JEDE andere Kante der Home 128px traegt.
      // SECTION_Y_HOME ist py-16 lg:py-16 und der Wert, den Offer, EventsTeaser, Faq,
      // LocationBand und WhyGrid schon benutzen. Damit steht der Kopf auf 64px an beiden
      // Breakpoints und die Kante auf den 128px des Seitenrhythmus.
      className={cn(
        'relative isolate scroll-mt-24 overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]',
        SECTION_Y_HOME,
      )}
    >
      {/* Der Gegenstueck-Gradient oben links ist mit demselben Befund geloescht wie der im
          EventsTeaser (DESIGN.md: Rot nie als Deko-Flaeche, keine Gradient-Schwemme). Er lag
          bei 0.06 Alpha ohnehin unter der Wahrnehmungsschwelle auf paper-warm — er kostete
          nur eine Regel, ohne etwas zu zeigen. */}
      <Shell>
        {/* 1) Intro.
            Kritiker-Befund 2026-08-09: "Textblock steht mit ~50% leerem Rechtsraum".
            Gemessen: der Intro-Block war `max-w-2xl` = 672px in einer 1400px-Shell, also 728px
            (52%) leer — und zwar ueber die volle Hoehe von 418px, weil Eyebrow, Headline, Story
            und Zahlenzeile alle untereinander an der linken Kante hingen.
            Die Sektion hat aber schon vier Bloecke; ein fuenfter (Foto/Zahl rechts) waere ein
            weiterer Stapel. Statt dessen wird der VORHANDENE Block auf die Shell verteilt:
            Headline links, Story rechts daneben (an der Grundlinie ausgerichtet), die
            Zahlenzeile als durchgehende Haarlinie ueber die ganze Shell darunter. Kein Wort
            Copy kommt dazu oder faellt weg. Dieselbe Zweispalten-Bauform wie #einstieg und
            #faq auf derselben Seite — kein neuer Dialekt. Unter lg bleibt der Stapel. */}
        <Reveal>
          {/* Titel und Story gestapelt statt H2 links / Story rechts (Split-Header-Ban,
              Critic 13.08.2026). */}
          <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-16">
            <div>
              <motion.div variants={item}>
                <Eyebrow>{t.eyebrow}</Eyebrow>
              </motion.div>
              <motion.h2
                variants={item}
                className={cn(
                  'type-h2 mt-5',
                  MEASURE_L,
                )}
              >
                {t.title}
              </motion.h2>
            </div>
            <motion.p
              variants={item}
              className="mt-5 max-w-[65ch] text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg lg:mt-0"
            >
              {t.story}
            </motion.p>
          </div>

          {/* 2) Die drei Zahlen als schlichte Inline-Zeile (Ersatz fuer die frueher schwebende
              Karte), getrennt nur durch eine Haarlinie — Fakt statt Bauelement. Die Linie laeuft
              jetzt ueber die ganze Shell statt ueber 672px und schliesst das Intro als Zeile ab.
              Kein `flex-wrap`: das ergab auf 390px ein 2+1-Raster mit verwaister dritter Zeile.
              Mobil daher drei volle Zeilen (Zahlenspalte fix breit, damit die Labels auf einer
              Kante stehen), ab md drei gleich breite Spalten. */}
          <motion.dl
            variants={item}
            className="mt-8 grid grid-cols-1 gap-y-3 border-t border-[var(--color-line)] pt-5 md:grid-cols-3 md:gap-x-8 md:gap-y-0"
          >
            {t.stats.map((s) => (
              <div key={s.l} className="flex items-baseline gap-2.5">
                <dt className="w-16 shrink-0 font-display text-2xl font-extrabold leading-none tracking-[-0.02em] text-[var(--color-ink)] tabular-nums sm:w-auto sm:text-[1.75rem]">
                  {s.v}
                </dt>
                <dd className="text-sm leading-snug text-[var(--color-ink-muted)]">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </Reveal>
      </Shell>

      {/* 3) Das Teamfoto als breites Band: ohne Rahmen, ohne Chip — nichts liegt mehr
          darauf (das war die Kritik).
          R134/7: Das Band lief vorher hart bis x=0 durch, waehrend Preis-Karte, Offer-Karten
          und Hero-Foto auf derselben Seite 24px Radius tragen. Raphael-Video 01:32: "ueberall
          abgerundet, ein Vollbreiten-Bild ist eckig." Das Band traegt jetzt denselben
          --radius-media-Token wie jede andere Medienflaeche.
          Der Auftrag war GENAU der Radius. Ein zwischenzeitlicher `<Shell>`-Wrapper hat mehr
          geaendert als das: Shell erzwingt max-w-[1400px] und px-5 sm:px-8, das Band verlor
          also Viewport-Breite — und weil die Hoehe ab sm ueber `sm:aspect-[9/4]` aus der
          Breite folgt, wurde es zugleich niedriger. Der Wrapper ist wieder weg. Das Band
          bleibt full-bleed; nur die vier Ecken sind rund. Motiv, Hoehe, Seitenverhaeltnis und
          object-position sind damit unveraendert.
          Dieselbe Geste wie die Foto-Baender
          der Unterseiten-Heroes (subpage/kit.tsx), damit die Sprache sitewide dieselbe ist.
          Feste Bandhoehen statt `h-auto`: sonst waere das 1800x1200-Motiv auf 1440px ueber
          950px hoch und wuerde die Sektion allein tragen.

          Kritiker-Befund 2026-08-09: "Wand-Logo + Koepfe der hinteren Reihe werden angeschnitten".
          Bestaetigt — aber die Ursache ist die BANDHOEHE, nicht die object-position. Gemessen:
            - Motiv (Schwellwertsuche in hp-29.webp, 1800x1200): das Salsaflow-Logo beginnt bei
              18.2% der Bildhoehe, die unterste Gruppenkante (Haende/Arme) liegt bei 81.1%. Der
              Inhalt braucht also 62.9% der Bildhoehe am Stueck.
            - Band vorher (`node scripts/aaa-r11-probe.cjs 1440`): 1440x480px. object-cover
              skaliert ueber die Breite (Faktor 0.8), das Motiv rendert 960px hoch, sichtbar sind
              480px = 50% der Bildhoehe. 50% < 62.9% — dieser Ausschnitt KANN Logo und Gruppe
              nicht zugleich fassen, egal wohin object-position ihn schiebt. Bei 70% lag das
              Fenster auf 35%..85%: Logo oben ab, hintere Kopfreihe an der Bandkante.
          Der Wert kann keine feste px-Hoehe sein: derselbe `sm:h-[22rem]` ergab bei 640px
          Viewport 82% sichtbar, bei 1023px aber nur 52%. Sichtbarer Anteil = Bandhoehe /
          (Breite x 2/3), haengt also an der Breite — die Loesung muss deshalb ein
          Seitenverhaeltnis sein, kein Pixelwert.
          `sm:aspect-[9/4]` zeigt bei JEDER Breite ab 640px exakt 66.7% der Bildhoehe, und
          object-center legt das Fenster auf 16.7%..83.3%: Logo-Oberkante (18.2%) und
          Gruppen-Unterkante (81.1%) liegen mit 1.5 bzw. 2.2 Prozentpunkten Luft darin.
          Unter sm bleibt die feste Hoehe (240px): dort rendert das Motiv nur 260px hoch, das
          Band zeigt ohnehin 92% — nichts ist angeschnitten. */}
      {/* R183 (Raphael 20.08.): "Das Teamfoto ist rund und klebt an der Kante."
          Gemessen vorher (worklog/.r183-team-measure.mjs, 1440px): figure left=0, right=1440,
          also Innenabstand 0 links UND rechts — bei gleichzeitig border-radius 24px. Genau das
          ist der Fehler: ein Radius liest sich nur dann als Karte, wenn Rand um ihn herum
          liegt. Bei Innenabstand 0 haben die runden Ecken keinen Platz, in dem sie sitzen
          koennen; sie wirken wie ein Zufalls-Anschnitt an der Fensterkante (die vier
          paper-warm-Kerben im Beleg-Shot home-desktop-09-y6000.png).
          Entschieden ist die KARTE, nicht das ehrliche Full-bleed. Begruendung per Zaehlung:
          jede andere runde Flaeche der Seite (Preis-Karte, Offer-Karten, Event-Kacheln) sitzt
          eingerueckt in einer <Shell>; dieses Band war das EINZIGE full-bleed Element mit
          Radius (grep "w-full overflow-hidden" ueber src/public/home/*.tsx: genau ein Treffer).
          Full-bleed haette den Radius loeschen muessen — und damit die R134/7-Entscheidung
          von oben (Video 01:32) wieder aufgerissen. Die Karte haelt beide Vorgaben.
          Die Shell traegt dieselben Kanten wie Intro und Gruenderreihe darueber/darunter, das
          Band steht damit auf der Textkante der Sektion statt daneben.
          Das Seitenverhaeltnis bleibt unangetastet: `sm:aspect-[9/4]` zeigt bei JEDER Breite
          66.7% der Bildhoehe (Rechnung oben), das Band wird durch die schmalere Shell nur
          proportional niedriger — Logo-Oberkante und Gruppen-Unterkante bleiben im Fenster.

          NICHT geaendert wird hier der Abstand ueber dem Band. Ein erster Versuch hatte ihn auf
          mt-16/lg:mt-24 (96px) hochgezogen, um den Auftragssatz "unter dem Hero mehr Luft" zu
          erfuellen. Dieser Abstand sitzt zwischen Zahlenzeile und Foto, also INNERHALB dieser
          Sektion — er kann die Hero-Kante nicht bewegen. Er ist zurueckgebaut und bleibt auf
          mt-12/lg:mt-16, dem Wert der Nachbarkanten.

          Zur Hero-Unterkante gehoert ein Befund, der NICHT in diese Datei gehoert, aber
          festgehalten sein muss, damit die naechste Runde ihn nicht erneut hier sucht:
            - Die Kante ist echt zu eng. Gemessen (worklog/.r183c-scan.mjs, 1440px) traegt die
              Hero-Sektion padding-bottom 0 und #angebot padding-top 64px. Die Kante
              Hero -> #angebot liegt damit bei 64px, waehrend JEDE andere Sektionskante der
              Home 128px traegt. Der Hero ist die einzige Kante auf halbem Seitenrhythmus.
            - Sie ist aus TeamBlock.tsx mechanisch nicht erreichbar. Beleg
              worklog/.r183c-lever.mjs: #team und ALLE seine Kinder auf 400px Margin gesetzt,
              Hero-Unterkante davor y=847, danach y=847, Kante davor 0px, danach 0px.
              Kein Wert dieser Datei bewegt die Hero-Kante um einen Pixel.
            - Der Fix gehoert an Hero.tsx (padding-bottom) oder Offer.tsx (SECTION_Y_HOME auf
              den Kopf). Beide sind in diesem Item tabu und deshalb unangetastet.
          Der frueher hier notierte Wert "134px" war zu optimistisch gemessen: er lief bis zur
          H2 INNERHALB von #angebot, also inklusive deren Sektionspolster, nicht bis zur
          Sektionskante. Die Kante selbst ist 64px. */}
      <Shell>
        <motion.figure
          data-reveal
          className="relative mt-12 w-full overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] lg:mt-16"
          variants={imgReveal}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <img
            src="/photos/showcase/hp-29.webp"
            onError={onImgError}
            alt={de ? 'Das ganze Salsaflow-Team liegt lachend vor der Salsaflow-Wand im Studio.' : 'The whole Salsaflow team lying and laughing in front of the studio wall.'}
            /* Unter sm: festes 240px-Band mit object-position 70%. Dort rendert das Motiv nur
               260px hoch (390px Viewport), sichtbar sind 92% — der Versatz holt nur die letzte
               Parkettzeile weg. Ab sm traegt das Seitenverhaeltnis (siehe Kommentar oben) und
               object-center zentriert die 66.7%, in denen Logo UND Gruppe komplett liegen. */
            className="h-[15rem] w-full object-cover object-[center_70%] sm:aspect-[9/4] sm:h-auto sm:object-center"
            width={1800}
            height={1200}
            loading="lazy"
          />
        </motion.figure>
      </Shell>

      <Shell>
        {/* 4) Die vier Gruender als eigene klare Reihe unter dem Band (FounderCards,
            /team-konsistent). Kein Reveal/whileInView hier (Watchdog-Fix 2026-07-08):
            Gruender-Fotos + Namen hingen im mobilen Scrollshot in der opacity-0-Zwischenphase
            fest (halbtransparent, grau, wirkte unfertig). Echte Personenfotos muessen sofort
            satt sichtbar sein. */}
        <div className="mt-12 lg:mt-16">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            <BeatMark />
            {lang === 'de' ? 'Die Gründer' : 'The founders'}
          </p>
          <FounderCards className="mt-6" />
          <a
            href="/team"
            className="group mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--color-ink)] underline decoration-[var(--color-salsa)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-salsa)]"
          >
            {t.teamLink}
            <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
          </a>
        </div>
      </Shell>
    </section>
  );
}
