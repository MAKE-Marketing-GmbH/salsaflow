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

  // --hero-photo-h: EINE Zahl fuer die mobile Fotohoehe UND den Textversatz darunter
  // (Rechenweg im Kommentar am Grid). Steht als Arbitrary Property auf der Section, weil
  // Foto und Textblock sie beide als calc()-Basis lesen — laufen die zwei Werte
  // auseinander, zerschneidet die Fotokante die H1.
  /* R188 / SW5 + Absprache 18.08. ("Luft unter dem Hero", im Video als F2 fuer /faq und
     als allgemeiner Wunsch "mehr Platz, weniger gedraengt" wiederholt).
     Gemessen VOR dem Fix (node /tmp/r188-gaps.cjs, Kante = padding-bottom der Sektion
     plus padding-top der naechsten):
       Hero -> #angebot        64px      <- die einzige halbe Kante der Seite
       #angebot -> #kurse     128px
       #kurse -> #community   128px
       ... alle weiteren      128px
     Auf 1440px UND auf 390px derselbe Befund. Der Hero traegt padding-bottom 0, die Luft
     unter ihm kam allein aus dem Kopfpolster der Folgesektion. Der Uebergang von der
     wichtigsten Flaeche der Seite in die naechste war damit der engste der ganzen Seite.
     Der Vorbefund steht ausformuliert in home/TeamBlock.tsx (Kommentar R183, Zeilen 218-232):
     dort wurde nachgewiesen, dass kein Wert aus TeamBlock diese Kante bewegt und der Hebel
     hier liegt. Genau hier sitzt er jetzt.
     pb-16 (64px) bringt die Kante auf 128px und damit auf denselben Wert wie jede andere —
     der Hero bekommt Luft, ohne dass die Seite einen neuen Sonderabstand lernt. lg:pb-14 am
     Grid darunter bleibt unangetastet: das ist der Innenabstand der Textspalte zum
     Sektionsfuss, nicht die Kante. */
  return (
    <section className="relative w-full bg-[var(--color-paper-warm)] pb-16 text-[var(--color-ink)] [--hero-photo-h:68svh]">
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
        {/* MOBIL (< sm): das Foto liegt absolut ab Fensterkante und der Textblock beginnt
            eine feste Strecke VOR seiner Unterkante — dadurch liegen Script-Zeile, Stil-Pills
            und H1 auf dem Foto, Lead/CTA/Trust laufen darunter auf Papier weiter.
            Fotohoehe und der pt des Textes haengen an EINER Zahl: --hero-photo-h. Wer sie
            aendert, verschiebt beide zusammen. Vorher standen zwei abgeleitete Werte im Code,
            und ein Eingriff an einem der beiden verschob die Naht.

            R134/11+12: Die Naht lag bei 58svh (= 490px auf 390x844) mitten IN der H1 —
            gemessen: Zeile 1 "Salsa, Bachata" endete bei y=481, Zeile 2 "und Heels." begann
            bei y=481, die Fotokante lag bei y=490. Ergebnis: eine Ueberschrift in zwei Farben,
            weiss oben auf dem Foto, schwarz unten auf Papier, mit harter Kante quer durch den
            Satz. Das las sich als Layout-Unfall, nicht als Entscheidung (Raphael-Video).
            Die H1 misst vom Anfang bis zum Ende 125px (439..564). Bei 68svh liegt die
            Fotokante auf 574px — also 10px UNTER der letzten H1-Zeile. Die ganze Ueberschrift
            steht damit weiss auf dem Foto, in einer Farbe, und die Kante trennt Ueberschrift
            von Lead statt Wort von Wort. Der Text startet unveraendert 10rem vor der
            Fotokante, also faellt er in derselben Bewegung mit nach unten.

            Warum das Motiv das traegt: der 4:5-Portraitschnitt rendert bei 390px Breite
            487.5px hoch. Bei 574px Boxhoehe (390/574 = 0.679 gegen 0.800) schneidet
            object-cover links und rechts, nicht oben und unten — die Koepfe liegen bei
            x 14..76 % und bleiben drin. object-position 26 % haelt beide Gesichter im Bild
            (Lock R126, unveraendert). */}
        <div className="grid w-full grid-cols-1 items-stretch gap-y-10 pb-0 pt-0 sm:pt-[calc(var(--nav-h)+2.5rem)] lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-2 lg:gap-x-14 lg:pb-14 lg:pt-[calc(var(--nav-h)+3rem)]">
          {/* `data-hero-fold`: Haken fuer die Bodenluft gegen die fixe Cookie-Leiste
              (Befund m-01, Regel in index.css). Der Fold ist viewportgebunden, das
              Dokument-Polster greift hier also nicht. */}
          {/* Der Textblock startet so weit vor der Foto-Unterkante, dass die KOMPLETTE H1
              darueber Platz hat. Gemessen auf 390/360/430: vom Blockanfang bis zum H1-Beginn
              lagen 110px (Script-Zeile + Stil-Pills), die H1 selbst misst 124px. 110+124 =
              234px, plus 16px Luft = 250px = 15.625rem. Der Wert ist der einzige Grund, warum
              die Naht unter dem Satz liegt und nicht in ihm — er darf nicht kleiner werden,
              ohne die H1 neu zu messen. sm+ unveraendert (pt-0).

              R185 (20.08.): Die Stil-Pills sind raus (Begruendung am entfernten Block), damit
              faellt ihr Anteil aus dem Vorlauf. Folge im Screenshot: die ersten zwei
              Lead-Zeilen standen dunkelgrau auf dem dunklen Foto und waren nicht lesbar.
              Gemessen auf 360/390/430 identisch: Lead ragte 48px ins Foto, waehrend die H1
              76px Luft zur Kante hatte.

              Achtung auf das Vorzeichen: der Wert wird von --hero-photo-h ABGEZOGEN. Ein
              groesserer pt schiebt den Block also nach OBEN, nicht nach unten. Erster Versuch
              mit 18.625rem machte es darum schlimmer (96px statt 48px im Foto). Richtig ist
              250px - 48px = 202px = 12.625rem. Die Naht liegt damit wieder zwischen H1 und
              Lead. Wer die Pills je zurueckholt, rechnet zurueck auf 15.625rem. */}
          <div
            data-hero-fold
            className="relative z-10 self-center px-5 pt-[calc(var(--hero-photo-h)-12.625rem)] sm:px-8 sm:pt-0 lg:py-10 lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:pr-0"
          >
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

            {/* R185 (20.08.): Hier standen drei Stil-Pillen Salsa/Bachata/Heels auf
                /tanzkurse/salsa|bachata|heels. Sie sind raus, weil die naechste Sektion
                dieselbe Frage stellt: "Welcher Tanz passt zu dir?" fuehrt auf exakt
                dieselben drei Ziele — dort aber mit Foto, Erklaertext und Niveau, also
                mit echter Entscheidungshilfe.

                Gemessen vorher (live, 5175): Pillen bei y=230, H1 erst y=282, der
                Kursplan-CTA bei y=613. Mobil y=382 gegen y=698. Die erste Aktion im
                Fold war damit eine Stilwahl ohne Hilfe statt des Kursplans. Genau das
                schliesst das Fold-Gate aus: im Fold fuehrt der Kursplan, die Stilwahl
                gehoert in den naechsten Abschnitt.

                Kein Weg geht verloren. Die drei Ziele stehen in der Offer-Sektion und
                zusaetzlich im Header-Dropdown "Tanzkurse". */}
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
                'type-h1 mt-2 text-[var(--color-ink)] max-sm:text-white',
                MEASURE_XL,
              )}
            >
              {/* R134/11: Die drei Zeilen liefen mobil in ZWEI Farben — Zeile 1 weiss auf dem
                  Foto, Zeile 2 und 3 schwarz auf Papier, weil die Fotokante bei y=490 mitten
                  durch den Satz lief. Eine Ueberschrift, zwei Farben, harte Kante quer durch.
                  Die Kante liegt jetzt bei y=574, also 16px UNTER der letzten Zeile (gemessen
                  auf 390/360/430). Alle drei Zeilen stehen damit auf dem Foto und tragen
                  dieselbe Farbe — die H1 der Klasse gibt sie vor (max-sm:text-white). */}
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

            {/* Raphael 20.08.: "Kursplan isch s wichtigschte, Gratis Schnupperstund söll
                absolut im Hintergrund si, schliesslich zahle d lüdd wenn sie wittermache."
                Darum traegt jetzt der KURSPLAN die gefuellte Pille, nicht mehr die
                Schnupperstunde. Das dreht die frueher hier begruendete Reihenfolge um.

                Die Schnupperstunde verschwindet nicht, sie wird leiser: reiner Textlink,
                auch auf Mobil. Die frueher noetige Umriss-Pille unter sm faellt weg — sie
                haette dem sekundaeren Weg dieselbe Flaeche gegeben wie dem primaeren und
                genau die Hierarchie zerstoert, um die es hier geht.

                Trefferflaeche bleibt: min-h-11 (44px) haelt das Tap-Ziel auf Mobil, ohne
                dass der Link wie ein zweiter Button aussieht. DESIGN.md erlaubt genau
                einen gefuellten Primary pro Sektion — der gehoert dem Kursplan. */}
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 max-sm:mt-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-y-2">
              <CtaPill href="/kursplan" className="max-sm:w-full">
                {cta.plan}
              </CtaPill>
              <CtaText
                href="/schnupperstunde"
                className="min-h-11 max-sm:justify-center"
              >
                {de ? 'Schnupperstunde buchen' : 'Book a trial class'}
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
                {/* Quelle vor dem Urteil: das G sagt WOHER die Zahl kommt, die Sterne sagen WIE
                    gut sie ist. Vierfarbiges Original-G auf hellem Grund — Repo-Regel in
                    primitives.tsx:59-62 (einfarbig nur im dunklen Footer). alt="" + sr-only
                    <dt> darunter liest "Google-Bewertung" schon vor. */}
                <img src="/logo/google-g.svg" alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
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
          {/* R134/7+12: Das Foto war auf 1440 links rund und lief rechts hart aus dem
              Viewport — eine Kante rund, die andere abgeschnitten, innerhalb EINES Elements.
              Das ist dieselbe Radius-Inkonsistenz wie beim Teambild, nur enger.
              Entscheidung: eine Linie, nicht zwei. Das Foto traegt ab lg auf allen vier Ecken
              --radius-media und endet in seiner Grid-Spalte, statt an der Fensterkante
              auszulaufen. Damit liegt es auf derselben Radius-Linie wie Offer-Karten,
              Preis-Karte und Teambild.
              Kritik-Fund (home-mobil-390.png gegen home-mobile-04-y1266.png): Auf dem Handy
              war die Radius-Linie damit an der auffaelligsten Stelle der Seite gebrochen —
              das Hero-Foto lief mit harten 90-Grad-Ecken bis an alle vier Bildschirmkanten,
              waehrend Salsa-Karte und Listenbilder darunter klar gerundet sind. Auf dem
              Desktop stimmte es (alle vier Ecken --radius-media).
              Behoben an der Kante, an der der Bruch sichtbar ist: das Foto laeuft oben
              weiter randlos unter Header und Statusleiste durch (dort gibt es keine Ecke,
              nur die Geraetekante), und schliesst UNTEN mit --radius-media gegen das Papier
              ab — dieselbe Rundung wie die Karten darunter. Es bleibt full-bleed und traegt
              weiter die H1; nur die zwei sichtbaren Ecken folgen jetzt der Linie. */}
          <motion.div
            variants={photoItem}
            className="absolute inset-x-0 top-0 z-0 h-[var(--hero-photo-h)] overflow-hidden rounded-b-[var(--radius-media)] sm:relative sm:mx-8 sm:h-auto sm:aspect-[16/9] sm:rounded-[var(--radius-media)] lg:mr-8 lg:aspect-auto lg:h-full lg:min-h-[32rem] lg:rounded-[var(--radius-media)]"
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
                // R126: mobil 38% schnitt Mund/Kinn der Frau. 26% dreht den Crop nach oben
                // (Koepfe bei y 12..50 %, weniger Hals). sm+ unveraendert.
                // lg:object-top statt 18%: bei 1440 sass der Scheitel des Mannes an der
                // Foto-Kante (Critic 13.08.2026).
                className="h-full w-full object-cover object-[50%_26%] sm:object-[50%_32%] lg:object-top"
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
