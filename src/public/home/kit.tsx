// Home-Kit. Nach der Design-Kritik Runde 1 auf das PAPIER-System der Unterseiten gedreht.
//
// Warum: Home rendert vorher auf #0C0A09 / #141110, alle sieben Unterseiten auf
// #FBFAF8 / #F4F1EC (gemessen an den computed backgroundColor je <section>). Das war
// kein Akzent-Kontrast, sondern ein Systembruch — die warme Papier-Identitaet kam auf
// der wichtigsten Seite nicht vor. Jetzt traegt die Home dieselbe Flaeche wie der Rest,
// und Dunkel ist nur noch ZWEI bewusste Zaesuren: Hero und Danceflow-Night.
//
// Tokens bleiben unangetastet (DESIGN.md LOCKED). Die Werte hier zeigen ausschliesslich
// auf bestehende Variablen:
//   Flaeche  --color-paper-warm #FBFAF8  ·  Wechsel --color-bg-soft #F4F1EC
//   Text     --color-ink #0A0A0A  ·  gedaempft --color-ink-muted #52524E  ·  leise --color-muted #6B6B6B
//   Linie    --color-line #E4E4E1  ·  Rot --color-salsa #AD1827 (einziger Akzent)
//   Dunkel   --color-surface-dark #111 (die EINE dunkle Flaeche laut DESIGN.md)
//
// Meta-Kritik 2026-08-07: hier standen die Eigen-Hexwerte #0C0A09, #141110, #2A2522 und
// #F5F1EB als exportierte Konstanten (NIGHT/NIGHT_UP/HAIRLINE/TEXT_*_D/HAIR_*_D). Nach der
// Umstellung der Home auf Papier hatte sie niemand mehr importiert — sie waren toter Code,
// der vier nicht freigegebene Komponentenfarben am Token-Law vorbei definierte
// ("Token-Law: keine neue Farbe in der Komponente", DESIGN.md). Ersatzlos entfernt; die
// verbliebenen dunklen Stellen laufen auf --color-surface-dark bzw. weiss.

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Shell } from '@/public/site/primitives';

/** Flaechen der Home = dieselben wie auf allen Unterseiten. */
export const PAPER = 'bg-[var(--color-paper-warm)]';
export const PAPER_ALT = 'bg-[var(--color-bg-soft)]';

/** Text-Hierarchie auf Papier. Drei Stufen, alle ueber 4.5:1 auf #FBFAF8/#F4F1EC:
 *  ink #0A0A0A ~19.9:1 · ink-muted #52524E ~7.4:1 · muted #6B6B6B ~5.2:1. */
export const TEXT_HI = 'text-[var(--color-ink)]';
export const TEXT_MID = 'text-[var(--color-ink-muted)]';
export const TEXT_LOW = 'text-[var(--color-muted)]';

/** Typo-Leiter. Drei Stufen mit echtem Abstand (Kritik Runde 1: H2 und die erste Karten-H3
 *  waren beide 46px/-0.92px, die drei Geschwister-H3 fielen auf 32px — die erste Karte hat
 *  damit ihre eigene Sektionsueberschrift ueberstimmt).
 *  Jetzt: H1 ~80 -> H2 56 -> H3 34, und ALLE Karten-H3 gleich gross. */
export const DISPLAY_XL =
  'font-display font-bold leading-[0.92] tracking-[-0.03em] text-[clamp(2.75rem,6.4vw,5rem)]';
export const DISPLAY_L =
  'font-display font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(2.25rem,4.4vw,3.5rem)]';
export const DISPLAY_M =
  'font-display font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(1.5rem,2.6vw,2.125rem)]';

export const BODY_L = 'text-[1.25rem] leading-[1.55]';
/** Die EINE Fliesstext-Rolle. Mobil und Desktop identisch verankert (17px/27px), damit
 *  dieselbe Rolle nicht je Seite zwischen 12 und 20px springt. */
export const BODY = 'text-[1.0625rem] leading-[1.588]';
export const META = 'text-[0.9375rem] leading-[1.5]';
/** Legal/Caption-Untergrenze: nie unter 13px (Kritik Runde 1: gemessen 9.92-11.2px). */
export const CAPTION = 'text-[0.8125rem] leading-[1.45]';
/** Eyebrow = EINE Komponente statt sieben Ad-hoc-Varianten: 12px, 0.16em, uppercase, 600. */
export const LABEL = 'text-[0.75rem] font-semibold uppercase tracking-[0.16em]';

/** Radius-Skala, drei Stufen (Quelle: src/index.css @theme). Nie krumme rem-Werte. */
export const R_CHIP = 'rounded-[var(--radius-chip)]';
export const R_CARD = 'rounded-[var(--radius-card)]';
export const R_MEDIA = 'rounded-[var(--radius-media)]';

/* ------------------------------------------------------------------ Zeilenmass (Measure)
 *
 *  Zeilenmass gehoert IMMER auf das Heading selbst, nie auf ein Wrapper-<div>.
 *
 *  Der Bug: `ch` und `em` loesen gegen die font-size des Elements auf, das die Klasse traegt.
 *  Sitzt `max-w-[22ch]` auf einem Wrapper (font-size 16px), werden daraus ~176px, waehrend die
 *  H1 darin mit 66px laeuft — die Headline wird auf Wrapper-Breite zersaegt, obwohl der Text
 *  kurz ist. Genau darum stehen die Werte hier als em-Konstanten und werden per `cn()` auf das
 *  <h1>/<h2>/<h3> gelegt; sie skalieren dann mit clamp()/den sm:-Stufen mit.
 *
 *  Gemessen 2026-08-06 auf der HELLEN Home (Preview 4186, 1440px) VOR dem Fix:
 *    Hero-H1 66px  w=496px  -> 4 Zeilen ("Dein Tanz." / "Mitten in" / "Basel." + Umbruch)
 *    #team-H2 54px w=672px  -> 3 Zeilen mit kurzer Schlusszeile
 *    #events-H2 48px w=576px -> 3 Zeilen
 *    #standort-H2 @390px    -> 3 Zeilen (max-w-md = 448px auf einem 36px-Heading)
 *
 *  Werte gegen die laengsten echten Home-Headlines ausgemessen, nicht geschaetzt. Zu eng ist
 *  genauso ein Bug wie zu weit — Ziel ist 1-3 Zeilen ohne Ein-Wort-Schlusszeile.
 *  `text-balance` gehoert dazu (DESIGN.md fordert es fuer H1/H2/H3) und haengt deshalb fest
 *  an der Konstante, damit es nie vergessen wird. */
/** H1-Groessen (Hero, ~42-66px). */
export const MEASURE_XL = 'text-balance max-w-[13em]';
/** Sektions-H2 (~30-64px). */
export const MEASURE_L = 'text-balance max-w-[15em]';
/** Karten-/Listen-H3 (~20-34px). */
export const MEASURE_M = 'text-balance max-w-[18em]';

/** Sektions-Rhythmus, DREI Stufen.
 *
 *  Y      Standard zwischen zwei Abschnitten — py-16 / lg:py-24 (128px bzw. 192px Summe)
 *  PEAK   NUR fuer den einen Hoehepunkt der Seite — py-20 / lg:py-32
 *  TIGHT  innerhalb EINES Gedankens (zwei Baender, die zusammengehoeren)
 *
 *  Untergrenze ist bewusst py-16/lg:py-24 (DESIGN.md "Sektion-Abstand py-16 bis py-24").
 *  Wer darunter geht, klebt zwei Abschnitte zusammen; wer ueberall PEAK nimmt, erzeugt den
 *  Block-Pause-Block-Takt ohne Absicht. Genau EINE Sektion pro Seite darf PEAK. */
export const SECTION_Y_TIGHT = 'py-10 lg:py-14';
export const SECTION_Y = 'py-16 lg:py-24';
export const SECTION_Y_PEAK = 'py-20 lg:py-32';

/** Standardstufe NUR fuer die Startseite (Kritiker final-2, Issue 2: "mehr Weissraum zwischen
 *  den verbleibenden Sektionen").
 *
 *  Warum eine eigene Konstante statt SECTION_Y anzuheben: SECTION_Y haengt ueber
 *  `subpage/kit.tsx:830` (SECTION_PAD) an ALLEN Unterseiten. Die Kritik betrifft die Startseite;
 *  ein Griff an SECTION_Y haette sieben ungepruefte Seiten mitverschoben.
 *
 *  Wert py-20 / lg:py-24: py-20 ist eine der drei in DESIGN.md ("Sektion py-16 / py-20 / py-24")
 *  ausdruecklich erlaubten Stufen — der Lock wird eingehalten, nicht gedehnt. Auf Mobil steigt
 *  der Abstand zwischen zwei Sektionen damit von 128px auf 160px, und genau dort war der Stapel
 *  am dichtesten (home-390.png mass 16989px). Auf Desktop bleibt lg:py-24 die Obergrenze des
 *  Locks; der zusaetzliche Luftgewinn kommt dort aus den zwei entfallenen Kapitelgrenzen.
 *  SECTION_Y_PEAK (TeamBlock) bleibt mit lg:py-32 klar darueber und damit weiter der EINE
 *  Hoehepunkt. */
/*  Kritiker-FAIL Runde 2026-08-09, "tote Weiss-/Cremeflaechen zwischen Sektionen straffen":
 *  gemessen mit `node scripts/aaa-r9-gaps.cjs 1440` auf dem Stand davor lagen 1804px der
 *  11610px Seitenhoehe (15.5%) in Baendern ohne JEDES Inhaltselement, davon acht Kanten mit
 *  exakt 192px = 96px Sektionsfuss + 96px Sektionskopf (lg:py-24 trifft lg:py-24). Der
 *  Kapitelwechsel wird auf dieser Seite zusaetzlich schon durch den Flaechenwechsel
 *  paper-warm <-> bg-soft getragen; die doppelte 96er-Stufe war Redundanz, kein Rhythmus.
 *  Neu lg:py-20 -> 160px je Kante. py-20 ist die mittlere der drei in DESIGN.md
 *  ausdruecklich erlaubten Stufen ("Sektion py-16 / py-20 / py-24"), der Lock wird also
 *  eingehalten und nicht gedehnt. Mobil bleibt py-20 unveraendert (dort war der Stapel nie
 *  der Befund). SECTION_Y_PEAK (TeamBlock, lg:py-32) bleibt der EINE Hoehepunkt und gewinnt
 *  durch die gesenkte Grundstufe sogar an Kontrast. */
/*  Kritiker-FAIL 2026-08-09 (zweiter Anlauf), "Content-Density an Boutique-AAA anheben —
 *  weniger Luft, engere Section-Staffelung".
 *  Nachgemessen mit `node scripts/aaa-measure.cjs` auf dem Stand davor: ACHT der zehn
 *  Sektionskanten lagen bei exakt 160px totem Band (80px Fuss + 80px Kopf), auf Desktop
 *  wie auf Mobil derselbe Wert — der Rhythmus hatte also gar keine Staffelung, nur eine
 *  einzige Stufe, die zehnmal wiederholt wurde. Zusammen mit dem Flaechenwechsel
 *  paper-warm <-> bg-soft, der die Kapitelgrenze ohnehin allein traegt, ist das doppelt
 *  markiert: der Leser sieht die Grenze an der Farbe und wartet danach noch 160px auf Inhalt.
 *  Neu py-16 (64px je Kante, 128px je Grenze). py-16 ist die unterste der drei in DESIGN.md
 *  ausdruecklich erlaubten Stufen ("Sektion py-16 / py-20 / py-24") — der Lock wird
 *  eingehalten und nicht unterschritten. Desktop spart das ueber acht Kanten 512px, ohne
 *  dass eine Zeile Inhalt faellt. Der EINE Hoehepunkt (TeamBlock) liegt mit lg:py-24 weiter
 *  klar darueber und gewinnt durch die gesenkte Grundstufe an Kontrast. */
export const SECTION_Y_HOME = 'py-16 lg:py-16';
/** Alt-Name, zeigt auf die Standardstufe (die "Lead"-Sektion war nie der Hoehepunkt). */
export const SECTION_Y_LEAD = SECTION_Y;

/** Die EINE Motion der Seite: opacity + 16px, 600ms, einmal. */
export function Rise({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section';
}) {
  const reduced = useReducedMotion();
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <M
      data-reveal
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: reduced ? 0.3 : 0.6, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Foto-Rahmen. `tone` bestimmt, wohin der Fuss verlaeuft — auf Papier waere ein
 *  Schwarz-Verlauf ein Fremdkoerper. `flat` schaltet den Verlauf ganz ab. */
export function Photo({
  children,
  className,
  flat = false,
  tone = 'paper',
}: {
  children: ReactNode;
  className?: string;
  flat?: boolean;
  tone?: 'paper' | 'night';
}) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <div className="absolute inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:[filter:saturate(0.96)_contrast(1.03)]">
        {children}
      </div>
      {!flat && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0',
            tone === 'night'
              ? 'bg-[linear-gradient(to_top,var(--color-surface-dark)_0%,transparent_45%)]'
              : 'bg-[linear-gradient(to_top,rgba(10,10,10,0.55)_0%,transparent_48%)]',
          )}
        />
      )}
    </div>
  );
}

/** Haarlinie — der einzige erlaubte Trenner (statt Karten). */
export const HAIR_T = 'border-t border-[var(--color-line)]';
export const HAIR_B = 'border-b border-[var(--color-line)]';

/** Der EINE gefuellte Button pro Screen (Rot). Radius voll. */
export function BtnPrimary({
  href,
  children,
  className,
  onNight = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNight?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-[52px] items-center justify-center rounded-full bg-[var(--color-salsa)] px-8 text-base font-semibold text-white',
        'transition-colors duration-200 hover:bg-[var(--color-salsa-500)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        onNight
          ? 'focus-visible:ring-white focus-visible:ring-offset-[var(--color-surface-dark)]'
          : 'focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-[var(--color-paper-warm)]',
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Sekundaerer Weg: reiner Textlink mit wachsendem Unterstrich. KEIN Pfeil (Audit). */
export function BtnLink({
  href,
  children,
  className,
  onNight = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNight?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex h-[52px] items-center text-base font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        onNight
          ? 'text-white hover:text-[var(--color-script-cream)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-surface-dark)]'
          : 'text-[var(--color-ink)] hover:text-[var(--color-salsa)] focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-[var(--color-paper-warm)]',
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-100 bg-[var(--color-salsa)] transition-transform duration-[var(--dur-base)] ease-out motion-safe:scale-x-0 motion-safe:group-hover:scale-x-100"
        />
      </span>
    </a>
  );
}

/** Geteilte Seitenbreite. Full-bleed-Sektionen nutzen sie NICHT.
 *
 *  Design-Kritik Runde 2: die Site lief auf DREI parallelen Rastern — Home 1200px/px-6 lg:px-12,
 *  Unterseiten 1400px/px-5 sm:px-8 (site/primitives.tsx Shell), Footer max-w-6xl (1152px).
 *  Gemessen auf 1440px: Nav-Pille x=35, H1 x=55, Footer-Inhalt x=168. Die linke Kante wanderte
 *  beim Scrollen. `Wrap` ist ab jetzt nur noch ein duenner Alias auf die EINE Shell — der Name
 *  bleibt, damit die 12 Home-Sektionen unveraendert weiter darauf zeigen. */
export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return <Shell className={className}>{children}</Shell>;
}
