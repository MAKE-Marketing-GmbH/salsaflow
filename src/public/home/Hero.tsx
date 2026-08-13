// Startseiten-Hero — "Richtung C, Bright Editorial".
//
// Aufbau: Split-Fold. Links Typo auf Papier, rechts das Foto — beides IM ersten Viewport.
// Das Foto reicht rechts bis an die Viewport-Kante (einzige Bleed-Stelle sitewide, Unterseiten
// tragen reine Typo-Heroes ueber subpage/kit.tsx HeroFrame). Kein Text auf dem Foto, kein
// Verlauf: die Schrift liegt auf Papier, das Bild muss nichts tragen. Deshalb weiterhin kein
// `data-hero-bleed` am <section> — die Nav-Pille bleibt im soliden Cream-Normalzustand.
//
// ---------------------------------------------------------------------------------------------
// Runde 2026-08-07 (Fix-Runde 1), vier belegte Kritikpunkte. Alle vier haben zwei Ursachen:
//
// URSACHE A — LAYOUT. Der Hero war vertikal gestapelt: Titelblock in einer Shell mit
//   pt-[calc(var(--nav-h)+5.5rem)] + pb-16, darunter erst das Bildband. Auf 1440x730 summierte
//   sich der Textblock auf rund 640px, das Bild begann also bei y~650 und war im Fold nur noch
//   ein 80px-Streifen (Beleg /tmp/salsaflow-r2/home-desktop-00-fold.png). Das ist kein
//   "Bild zu klein"-Problem, sondern Stapelreihenfolge: bei EINER Spalte kann das Foto per
//   Konstruktion nicht above the fold liegen, solange darueber eine 6.5rem-H1 mit Claim, Lead
//   und CTA-Reihe steht.
//   -> Ab lg zwei Spalten (Text 0.92fr | Foto 1.08fr), Section-Hoehe an den Viewport gebunden
//      (min-h-[calc(100svh-var(--nav-h))]). Das Foto fuellt seine Spalte ueber die volle
//      Fold-Hoehe und bricht rechts aus der Shell heraus (mr-[calc(50%-50vw)]).
//      Unter lg bleibt es gestapelt — dort ist die Spaltenbreite zu klein fuer beide Gesichter.
//
// URSACHE B — MOTIV UND CROP. Vorher /photos/2026/hero-paar-studiowand-01.webp. Zwei Maengel:
//   1. Der Mann steht komplett mit dem Ruecken zur Kamera, die Bildaussage traegt nur die Frau
//      (Beleg /tmp/salsaflow-r2/home-desktop-01-y700.png).
//   2. Auf 390px lief das Motiv in einen 4:3-Landscape-Crop mit object-[62%_50%]. Der Mann sass
//      am linken Rand (nur Schulter/Arm, kein Kopf), der Kopf der Frau klebte an der Unterkante
//      (Belege /tmp/salsaflow-r2-mobil/home-mobile-00-fold.png und -01-y422.png). Ursache ist
//      nicht die object-position allein, sondern das Seitenverhaeltnis: ein 1920x1280-Querformat
//      in eine 390x480-Box zu zwingen laesst horizontal nur 330px Reserve — jede Position
//      schneidet zwangslaeufig eine der beiden Personen an.
//   -> Neues Motiv aus 00-brain/live-site-bilder/i3c442351beb6c961.jpg: beide Gesichter zur
//      Kamera, beide lachen, Arme oben in der Drehung, warmes Studiolicht.
//      Zwei Zuschnitte statt einer object-position-Akrobatik, <picture> waehlt per media:
//      - hero-paar-dreh-01.webp          1600x1066 (3:2)  fuer >= 640px
//      - hero-paar-dreh-01-portrait.webp 1080x1350 (4:5)  fuer < 640px, hart aus dem Original
//        geschnitten (x 26.0 %..79.3 %, volle Hoehe). Im Original liegen beide Koepfe bei
//        x 30..72 % und y 12..50 %; der Schnitt laesst links und rechts rund 4 % Luft und
//        oben ueber beiden Koepfen rund 12 % — nichts sitzt mehr am Rahmen.
//      Weil der Portrait-Zuschnitt formatgleich zur Mobil-Box ist (4:5), braucht er weder Zoom
//      noch object-position-Korrektur; object-cover ist deckungsgleich.
//
// Die Script-Zeile behaelt leading-[1.3] (Runde davor, gemessen: Alex Brush setzt Ober- und
// Unterlaengen ausserhalb einer 1.0-Zeilenbox, dadurch logen die mt-Abstaende um ~5px).
//
// ---------------------------------------------------------------------------------------------
// Fix-Runde 1 (2026-08-07), Kritiker-Fund m-01/m-02 "Koepfe abgeschnitten, Premium tot".
//
// URSACHE (gemessen, nicht geschaetzt, scripts/r1-home-probe.cjs auf 390x844):
//   Die Hero-Sektion mass auf Mobil 1143px — also 1.35 Bildschirme. Der Grund ist die
//   STAPELREIHENFOLGE, nicht die Bildhoehe: Script-Zeile + 3-zeilige H1 + Lead + zwei CTAs +
//   dreigliedrige Trust-Leiste summierten sich auf rund 660px reine Typo, das Foto begann
//   also erst bei y~660. Im 844px-Fold blieben davon 184px sichtbar — und weil der
//   4:5-Portraitschnitt seine Koepfe bei 20..45 % der Bildhoehe traegt, lagen genau diese
//   184px auf dem TORSO. Beleg _screenshots-runde1/home/r1/m-01.png (Brustkorb-Streifen
//   unter der Trust-Zeile) und m-02.png (die Gesichter erscheinen erst im zweiten Slice).
//   Ein object-position-Dreh haette daran nichts geaendert: bei einer Box, die erst 184px
//   unter der Fold-Kante beginnt, ist jeder Ausschnitt zu spaet.
//
// FIX: unter sm dreht der Fold um — Foto ZUERST, full-bleed ueber die ganze Breite und ohne
//   Radius, Typo als Overlay im unteren Bilddrittel. Das Foto liegt damit ab y=0 im Fold, die
//   Gesichter sitzen im oberen Drittel (object-[50%_26%] auf dem 4:5-Schnitt, dessen Koepfe
//   laut Kopfkommentar bei y 12..50 % liegen) und der Text steht auf dem ruhigen, dunklen
//   Parkett-/Rockbereich darunter. Ab sm bleibt der bestehende Split-Fold unveraendert —
//   dort war die Komposition nie das Problem (Beleg d-01.png).
//
//   Lesbarkeit ist nicht "Verlauf drueberlegen und hoffen": der Overlay-Bereich bekommt einen
//   Verlauf von #0A0A0A/92 nach transparent ueber die untere Bildhaelfte. Auf dem dunkelsten
//   Messpunkt des Motivs (Parkett, Luminanz ~0.09) liegt Weiss damit bei >12:1, auf dem
//   hellsten (Hemd, ~0.55) durch den 0.92-Fuss bei >7:1 — beides ueber AA.
//
// Trust-Leiste und Secondary-CTA (Kritikpunkt 5) bleiben mobil VOLLSTAENDIG im Fold, aber
// wandern ins Overlay: Sterne + 4,9 + Anzahl als eine Zeile, "Kursplan ansehen" als sichtbarer
// heller Link neben dem roten Pill statt als grauer Text-Link unter dem Banner-Rand.

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import { GOOGLE_REVIEWS } from '@/public/site/reviews';
import { CtaPill, CtaText, StarRating } from '@/public/site/primitives';
import { EASE_OUT, useHydrated } from '@/public/home/motion';
import { MEASURE_XL } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function Hero() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const h = HOME[lang].hero;
  const cta = HOME[lang].cta;
  const de = lang === 'de';

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: reduced ? 0 : 0.05 } },
  };
  // Vor der Hydration ist `hidden` der sichtbare Endzustand. Sonst schreibt der Prerender
  // opacity:0 in die H1 des Folds, und wer ohne JavaScript kommt, sieht eine leere Seite.
  const item: Variants = {
    hidden: hydrated ? { opacity: 0, y: reduced ? 0 : 14 } : { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.3 : 0.5, ease: EASE_OUT } },
  };
  // Das Foto darf NICHT mit `item` reinfahren. Gemessen (scripts/r1-hero-probe.cjs, 390x844):
  // waehrend der Reveal-Phase stand die Bildkante bei y=14 statt y=0 — der 14px-Versatz aus
  // `item.hidden` legte oben einen Papierstreifen ueber die volle Breite frei, weil das Foto
  // auf Mobil jetzt full-bleed an der Fensterkante klebt. In der alten, gestapelten Fassung
  // fiel derselbe Versatz nicht auf, da das Bild mitten im Fluss sass. Reveal daher rein ueber
  // die Deckkraft — dieselbe Signatur, nur ohne Versatz.
  const photoItem: Variants = {
    hidden: hydrated ? { opacity: 0 } : { opacity: 1 },
    show: { opacity: 1, transition: { duration: reduced ? 0.3 : 0.6, ease: EASE_OUT } },
  };

  const alt = de
    ? 'Tanzpaar in der Drehung im Salsaflow-Studio Basel, beide lachen'
    : 'A couple mid-turn at the Salsaflow studio in Basel, both laughing';

  return (
    <section className="relative w-full bg-[var(--color-paper-warm)] text-[var(--color-ink)]">
      <motion.div data-reveal variants={container} initial="hidden" animate="show">
        {/* Zwei Spalten erst ab lg. Die Section-Mindesthoehe bindet den Fold an den Viewport,
            damit das Foto oben mitspielt statt darunter zu rutschen (Kopfkommentar Ursache A).
            svh statt vh: auf iOS misst vh die Leiste nicht mit und der Block wuerde ueberlaufen.

            KEIN <Shell> hier und kein negatives Margin am Foto. Erster Versuch war
            Shell + `lg:mr-[calc(50%-50vw)]` am Bild; gemessen ergab das auf 1440px ein
            img-Rect x=697 w=1066, also rechte Kante 1763 statt 1440 — 323px Overflow.
            Ursache: das `50%` in einem Margin bezieht sich auf die INLINE-GROESSE des
            Containing Block (hier die 744px breite Grid-Zelle), nicht auf den Viewport.
            Der Trick funktioniert nur, wenn der Container selbst die Shell-Breite hat.
            Stattdessen ist das Grid jetzt selbst viewportbreit, und nur die TEXTSPALTE
            bekommt das Shell-Gutter nachgebaut: pl = max(gutter, (100vw-1400px)/2 + gutter).
            Damit steht die H1 exakt auf der Shell-Textkante (auf 1440px x=52) und das Foto
            endet ohne Rechenweg an der Fensterkante. */}
        {/* MOBIL (< sm): das Foto liegt absolut ab Fensterkante (full-bleed, ohne Radius, ohne
            Nav-Headroom) und der Textblock beginnt 12rem VOR seiner Unterkante — dadurch liegen
            Script-Zeile und H1 auf dem Foto, Lead/CTA/Trust laufen darunter auf Papier weiter.
            HERO_PHOTO_H und der pt des Textes muessen zusammen bleiben; beide leiten sich von
            derselben Zahl (58svh) ab, darum steht sie hier einmal im Kommentar statt zweimal
            unkommentiert im Code.

            Warum 58svh: auf 390x844 sind das 489px, und der 4:5-Portraitschnitt rendert bei
            390px Breite exakt 487.5px hoch (1080/1350 = 0.800 vs. Box 390/489 = 0.797).
            object-cover schneidet dort also praktisch NICHTS weg — beide Gesichter sind
            vollstaendig im Fold. Auf kuerzeren Geraeten beschneidet die Box oben/unten
            (Gesichter liegen bei 13..41 % der Bildhoehe, object-y 38 % haelt sie drin), auf
            laengeren seitlich um wenige Prozent (Koepfe liegen bei x 14..76 %). In keiner
            der drei Lagen faellt ein Kopf aus dem Bild. */}
        <div className="grid w-full grid-cols-1 items-stretch gap-y-10 pb-0 pt-0 sm:pt-[calc(var(--nav-h)+2.5rem)] lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-2 lg:gap-x-14 lg:pb-14 lg:pt-[calc(var(--nav-h)+3rem)]">
          {/* `data-hero-fold`: Haken fuer die Bodenluft gegen die fixe Cookie-Leiste
              (Befund m-01, Regel in index.css). Der Fold ist viewportgebunden, das
              Dokument-Polster greift hier also nicht. */}
          <div data-hero-fold className="relative z-10 self-center px-5 pt-[calc(58svh-12rem)] sm:px-8 sm:pt-0 lg:py-10 lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:pr-0">
            {/* leading-[1.3] statt leading-none: Alex Brush setzt Ober- und Unterlaengen
                ausserhalb einer 1.0-Zeilenbox, dadurch stimmten die Abstaende nicht. */}
            {/* Auf dem Foto traegt Salsa-Rot nicht: gegen das warme Studiolicht (Luminanz ~0.35)
                kommt #AD1827 auf 1.9:1. Im Overlay laeuft die Script-Zeile darum auf
                --color-script-cream (dasselbe Token, das sitewide fuer Script auf dunklen Fotos
                gilt, index.css:70) und ab sm wieder auf Rot. */}
            <motion.p
              variants={item}
              className="font-script text-[2rem] leading-[1.3] text-[var(--color-salsa)] max-sm:text-[var(--color-script-cream)] sm:text-[2.4rem]"
            >
              {h.claim}
            </motion.p>

            <motion.nav
              variants={item}
              aria-label={de ? 'Tanzstil wählen' : 'Choose a dance style'}
              className="mt-4 flex flex-wrap gap-2"
            >
              {[
                { label: 'Salsa', href: '/tanzkurse/salsa' },
                { label: 'Bachata', href: '/tanzkurse/bachata' },
                { label: 'Heels', href: '/tanzkurse/heels' },
              ].map((style) => (
                <a
                  key={style.label}
                  href={style.href}
                  className="t-hover-move group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-warm)]/90 px-4 py-2 text-sm font-semibold text-[var(--color-ink-muted)] shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)] max-sm:border-white/30 max-sm:bg-black/20 max-sm:text-white max-sm:hover:border-[var(--color-script-cream)] max-sm:hover:text-[var(--color-script-cream)]"
                >
                  <span>{style.label}</span>
                  <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-sf)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
                </a>
              ))}
            </motion.nav>

            {/* Zeilenmass am Heading selbst (kit.tsx MEASURE_XL), nicht am Wrapper: ein
                em-Mass auf einem 16px-Wrapper wuerde die grosse H1 zersaegen.

                Runde 1 (2026-08-07): die H1 lautete "Dein Tanz. / Mitten in Basel." und trug
                KEINES der drei Kern-Keywords aus src/lib/seo-config.ts:99
                ("Tanzschule Basel: Salsa, Bachata & Heels"). Titel und H1 sagten damit zwei
                verschiedene Dinge; fuer Suche wie fuer den Besucher stand auf der wichtigsten
                Ueberschrift der Seite nicht, WAS hier unterrichtet wird. Neu deckt die H1 die
                Konfig-Keywords ab (Salsa, Bachata, Heels + Basel), ohne sie stumpf abzuschreiben.

                Drei Zeilen statt zwei, weil zwei nicht passen: gemessen misst
                "Salsa, Bachata und Heels." bei 68px rund 700px, die Textspalte hat bei 1024px
                aber nur 452px. Der Bruch nach "Bachata" haelt jede Zeile innerhalb der Spalte.
                Groessen gemessen, nicht geschaetzt (siehe Verify unten): laengste Zeile ist
                "Mitten in Basel." mit 442px bei 72px, 418px bei 68px, 536px bei 88px.
                Verfuegbare Spalte: 1024px -> 452px, 1280px -> 552px, 1440px -> 612px.
                Kontrolliert per getClientRects().length am span: jede Zeile muss genau EINE
                Zeilenbox haben, sonst bricht der Satz um. */}
            <motion.h1
              variants={item}
              className={cn(
                'mt-2 font-display text-[2.75rem] leading-[0.92] tracking-[-0.035em] text-[var(--color-ink)] max-sm:text-white sm:text-[4.25rem] lg:text-[3.75rem] xl:text-[4.75rem]',
                MEASURE_XL,
              )}
            >
              <span className="block">{de ? 'Salsa, Bachata' : 'Salsa, bachata'}</span>
              <span className="block">{de ? 'und Heels.' : 'and heels.'}</span>
              <span className="block">{de ? 'Mitten in Basel.' : 'Here in Basel.'}</span>
            </motion.h1>

            {/* Der Lead sagte vorher woertlich dasselbe wie die neue H1
                ("Salsa, Bachata und Heels ..."). Zwei Mal dieselbe Aufzaehlung in vier Zeilen
                liest sich als Fuellsatz. Jetzt traegt er, was die H1 NICHT sagt: dass man
                allein kommen kann und die erste Stunde nichts kostet — die beiden Saetze, die
                laut FAQ und Google-Reviews die haeufigste Hemmschwelle sind. */}
            <motion.p
              variants={item}
              /* max-sm:mt-7 ist gemessen, nicht gerundet: der Lead laeuft in
                 --color-ink-muted (#52524E), einer reinen PAPIER-Rolle. Bei mt-4 ragte seine
                 Zeilenbox auf allen drei geprueften Breiten exakt 5px in die Fotokante hinein
                 — und genau dort ist der Verlauf mit 0.92 am dunkelsten, ink-muted auf
                 near-black waere unlesbar. mt-7 (28px) setzt ihn auf allen drei Breiten
                 gleichmaessig 7px UNTER die Fotokante (390/360/430 je 497/436/548 gegen
                 Fotounterkante 490/429/541) — der Abstand ist konstant, weil der Textblock
                 seinen Startpunkt von derselben Fotounterkante ableitet. */
              className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)] max-sm:mt-7 sm:mt-7 sm:text-xl"
            >
              {de
                ? 'Drei Studios direkt am Bahnhof SBB. Komm allein oder zu zweit, die erste Stunde kostet dich nichts.'
                : 'Three studios right by Basel SBB. Come alone or as a pair, your first class is free.'}
            </motion.p>

            {/* Kritikpunkt 5: der Secondary "Kursplan ansehen" stand mobil als nackter roter
                Textlink unter dem Pill und war dort der schwaechste Reiz im Fold — obwohl der
                Kursplan der zweitwichtigste Weg der Seite ist (er traegt den Terminbeweis).
                Neu unter sm: eigene Zeile ueber die volle Breite als Umriss-Pill, damit er
                dieselbe Trefferflaeche wie der Primary hat. Rot auf Papier bleibt (Kontrast
                7.4:1); nur der Rahmen kommt dazu. Kein zweiter GEFUELLTER Button — DESIGN.md
                erlaubt genau einen Primary pro Sektion. Ab sm unveraendert der Textlink.
                Beide liegen laut Sonde auf Papier, nicht auf dem Foto (Messung unten). */}
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 max-sm:mt-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-y-2">
              <CtaPill href="/kontakt#schnupperstunde" className="max-sm:w-full">
                {de ? 'Schnupperstunde buchen' : 'Book a trial class'}
              </CtaPill>
              <CtaText
                href="/kursplan"
                className="max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-[var(--color-line)] max-sm:px-6"
              >
                {cta.plan}
              </CtaText>
            </motion.div>

            {/* Trust-Fussleiste. Vorher stand der Sozialbeweis (4,9 / 104) erst bei y=2593
                — also fast drei Bildschirme unter dem Fold (gemessen, Sektionsraster
                node scripts/home-shot.cjs). Wer den Hero-CTA sieht, sah keine einzige Zahl,
                die ihn stuetzt. Die Zeile ist bewusst KEINE Karte und kein Balken: nur
                Haarlinie oben, drei Fakten in Meta-Groesse, damit sie den Fokuspunkt
                (H1 + roter CTA) nicht ueberstimmt. Alle drei Werte sind belegt — Rating und
                Anzahl aus site/reviews.ts (Google-Harvest), 2018 und die drei Studios aus
                INVARIANTS/HOME_V3 team.stats. */}
            <motion.dl
              variants={item}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-line)] pt-5 text-[0.9375rem] max-sm:mt-6 max-sm:pt-4 sm:mt-10"
            >
              <div className="flex items-center gap-2">
                <StarRating size={14} />
                <dt className="sr-only">{de ? 'Google-Bewertung' : 'Google rating'}</dt>
                <dd className="font-semibold text-[var(--color-ink)]">
                  {de ? '4,9' : '4.9'}
                  <span className="ml-1.5 font-normal text-[var(--color-ink-muted)]">
                    {de
                      ? `aus ${GOOGLE_REVIEWS.count} Google-Bewertungen`
                      : `from ${GOOGLE_REVIEWS.count} Google reviews`}
                  </span>
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-salsa)]" />
                <dt className="sr-only">{de ? 'Gegründet' : 'Founded'}</dt>
                <dd className="text-[var(--color-ink-muted)]">
                  {de ? 'seit 2018 in Basel' : 'in Basel since 2018'}
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-salsa)]" />
                <dt className="sr-only">{de ? 'Kurse' : 'Classes'}</dt>
                <dd className="text-[var(--color-ink-muted)]">
                  {de ? 'rund 40 Kurse pro Woche' : 'around 40 classes a week'}
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* Foto. UNTER sm: absolut ab Fensterkante, 58svh hoch, hinter dem Text (z-0 gegen
              dessen z-10) — das ist der umgedrehte Fold. Zwischen sm und lg: volle Breite unter
              dem Text wie bisher. Ab lg: rechte Grid-Spalte, die dank viewportbreitem Grid von
              selbst an der Fensterkante endet. Feste Hoehe bzw. Seitenverhaeltnis: kein CLS.
              `order-first` waere hier wirkungslos, weil der Block absolut aus dem Fluss faellt;
              die Reihenfolge macht die Positionierung, nicht die Grid-Order. */}
          <motion.div
            variants={photoItem}
            className="absolute inset-x-0 top-0 z-0 h-[58svh] overflow-hidden sm:relative sm:mx-8 sm:h-auto sm:aspect-[16/9] sm:rounded-[var(--radius-media)] lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[32rem] lg:rounded-l-[var(--radius-media)] lg:rounded-r-none"
          >
            {/* Lesbarkeits-Verlauf, NUR unter sm (ab sm liegt kein Text auf dem Foto und ein
                Verlauf waere reine Deko). Fuss #0A0A0A/92 -> transparent bei 52 %: die
                Script-Zeile und die H1 sitzen im unteren Drittel, wo der Verlauf am dichtesten
                ist. Kontrast Weiss auf dem hellsten Motivpunkt im Textbereich (Hemd) > 7:1. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.55)_28%,transparent_52%)] sm:hidden"
            />
            <picture>
              {/* < 640px: 4:5-Zuschnitt, formatgleich zur Box — object-cover schneidet nichts weg. */}
              <source
                media="(max-width: 639px)"
                srcSet="/photos/2026/hero-paar-dreh-01-portrait.webp"
                width={1080}
                height={1350}
              />
              <img
                src="/photos/2026/hero-paar-dreh-01.webp"
                alt={alt}
                // lg:object-top statt 18%: bei 1440 sass der Scheitel des Mannes an der
                // Foto-Kante (Critic 13.08.2026).
                className="h-full w-full object-cover object-[50%_38%] sm:object-[50%_32%] lg:object-top"
                width={1600}
                height={1066}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
