// Geteilte Bausteine fuer die V3-Copyplan-Unterseiten (Salsa, Bachata, Heels, Privatstunden,
// Kursaufbau, Preise, Danceflow Night, Anniversary, Floweekend, Eventkalender, Collabs,
// Tanzschuhe, Partys, FAQ, Standort). EIN Design-System sitewide: gleiche Shell, Eyebrow,
// TitleAccent, Reveal-Takt und CTA-Look wie Startseite + Tanzkurse (src/public/CoursesPage.tsx).
//
// Regeln (BUILD-V3-COPYPLAN.md): hell (paper-warm <-> bg-soft im Wechsel), Rot #AD1827 sparsam,
// echte Umlaute, CH-ss, keine erfundenen Zahlen. Bilder echt, KI nur laut 03_KI_BILD_LUECKEN.
//
// JSON-LD (BreadcrumbList / FAQPage) steht direkt im HTML und ist damit auch ohne JavaScript lesbar.

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { Seo, type SeoKey } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import {
  Shell,
  Eyebrow,
  TitleAccent,
  CtaArrow,
  CtaPill,
  CtaText,
  BeatMark,
  sectionTitle,
  sectionLead,
} from '@/public/site/primitives';
import {
  Reveal,
  useReveal,
  useRevealVariant,
  RevealWords,
} from '@/public/home/motion';
import { SECTION_Y } from '@/public/home/kit';

// EIN CTA-Ziel sitewide (Master-Plan): Schnupperstunden-Anker auf /kontakt.
export const SCHNUPPER_HREF = '/schnupperstunde';

/* ----------------------------------------------------------------- Zeilenmass (Measure)
 * Vorbild: src/public/home/kit.tsx (MEASURE_XL/MEASURE_L, Home-Redesign 2026-08).
 *
 * Regel: Das Zeilenmass gehoert IMMER auf das Heading selbst, nie auf ein Wrapper-<div>.
 * `ch` und `em` loesen gegen die Schriftgroesse des Elements auf, das die Klasse traegt.
 * Sitzt `max-w-[22ch]` auf einem Wrapper (font-size 16px), wird daraus 176px, waehrend die
 * H1 darin mit 57px laeuft — genau der Grund fuer zersaegte Headlines. Die em-Werte hier
 * haengen an der jeweiligen Display-Groesse und skalieren mit dem clamp()/den sm:-Stufen mit.
 *
 * Gemessen 2026-08-06 auf 1440px vor dem Fix: /kontakt H1 3 Zeilen mit Waisenwort "Schritt.",
 * /team H1 3 Zeilen mit kurzer Mittelzeile, /tanzkurse/heels H1 4 Zeilen.
 *
 * Die Werte sind nicht geschaetzt, sondern gegen die laengsten echten Headlines ausgemessen
 * (scratch-probe, 1440px). Zu eng ist genauso ein Bug wie zu weit:
 *   H1 54px "Tanze Heels mit Haltung, Technik und Selbstvertrauen"
 *     11em -> 4 Zeilen [292,315,81,283] (Waisenzeile "und")  ·  13em -> 3 Zeilen [461,232,283]
 *   H2 44px "Bachata passt, wenn du Flow suchst, aber trotzdem Struktur brauchst"
 *     13em -> 4 Zeilen [548,413,162,153]  ·  15em -> 3 Zeilen [548,574,153]
 * Darum XL=13em (H1-Groessen) und L=15em (sectionTitle). */
/** `text-balance` ist Teil des Zeilenmasses, nicht Kosmetik.
 *
 *  DESIGN.md fordert es fuer H1/H2/H3 ("keine Ein-Wort-Schlusszeile"), aber der geteilte
 *  `sectionTitle` aus site/primitives.tsx bringt es nicht mit — deshalb haengt es hier an den
 *  MEASURE-Konstanten, damit beides immer zusammen gesetzt wird.
 *
 *  Warum es hier besonders zaehlt: `TitleAccent` rendert das Akzentwort in font-script auf
 *  1.22em. Ohne Balance greedy-umbrochen landet genau dieses eine breite Wort allein auf der
 *  Schlusszeile. Gemessen 2026-08-06 auf 1440px (Schlusszeile / Elementbreite):
 *    /tanzkurse/bachata "Das lernst du im Bachata-Kurs"      110px / 576px -> mit balance 283px
 *    /tanzkurse/heels   "... dich sicher zu bewegen"         124px / 660px -> mit balance 380px
 *    /preise            "Privatstunden fuer ... Fokus"       110px / 576px -> mit balance 359px */
export const MEASURE_XL = 'text-balance max-w-[13em]';
export const MEASURE_L = 'text-balance max-w-[15em]';
export const MEASURE_M = 'text-balance max-w-[18em]';
const SITE_ORIGIN = 'https://www.salsaflow-dc.com';

/* ----------------------------------------------------------------- Seiten-Rahmen */
/** Standard-Rahmen jeder Unterseite: Seo + fixe Navbar + main + Footer.
 *
 *  Design-Kritik Runde 3, Issue 7 ("Doppelter Abbinder ohne Hoehepunkt"): jede Unterseite
 *  schloss mit ihrem eigenen zentrierten Abschluss (ClosingInvite / ClosingSection) UND
 *  direkt darunter mit dem immer gleichen Footer-Streifen "Bereit fuer deinen ersten Tanz?"
 *  — zwei Schluss-Aufforderungen hintereinander, beide mit demselben Ziel
 *  (/kontakt#schnupperstunde). Die Seite hoerte zweimal auf.
 *
 *  Die Home hatte diesen Fall schon geloest (HomePage.tsx: `entryCta={false}`, weil dort
 *  bereits ein Closer steht) — die Unterseiten haben die Loesung nur nie geerbt. Jetzt gilt
 *  fuer alle Unterseiten dasselbe: EIN Abbinder, und zwar der seitenspezifische mit echtem
 *  Text. Der generische Streifen mit dem 90px-Thumbnail faellt weg.
 *
 *  `entryCta` bleibt als Schalter fuer die wenigen Seiten OHNE eigenen Closer (z.B. reine
 *  Listen-/Rechtsseiten), die den Streifen als einzigen Abschluss brauchen. */
export function SubPageShell({
  seo,
  children,
  entryCta = false,
}: {
  seo: SeoKey;
  children: ReactNode;
  /** true nur, wenn die Seite KEINEN eigenen Schluss-CTA rendert. */
  entryCta?: boolean;
}) {
  return (
    <>
      <Seo page={seo} />
      <SiteHeader />
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter entryCta={entryCta} />
    </>
  );
}

/* ----------------------------------------------------------------- CTAs
 * Runde 2, Issue 2 + 3: beide Stufen leben jetzt in site/primitives.tsx (CtaPill / CtaText).
 * `PrimaryCta` und `GhostCta` bleiben als Namen bestehen, damit die 15 Unterseiten
 * unveraendert weiter darauf zeigen — sie sind nur noch duenne Adapter auf die EINE
 * Definition. So kann keine Seite mehr eine dritte Button-Variante erfinden. */
/** Stufe 1 (primaer): roter Pill mit Pfeil. Kein Glow (siehe primitives.tsx). */
export function PrimaryCta({ href, children }: { href: string; children: ReactNode }) {
  return <CtaPill href={href}>{children}</CtaPill>;
}

/** Stufe 2 (tertiaer): roter Textlink mit Pfeil und Hover-Unterstrich. */
export function GhostCta({ href, children, down = false }: { href: string; children: ReactNode; down?: boolean }) {
  return (
    <CtaText href={href} down={down}>
      {children}
    </CtaText>
  );
}

/* ----------------------------------------------------------------- JSON-LD */
function JsonLd({ id, data }: { id: string; data: unknown }) {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c');
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/* ----------------------------------------------------------------- Breadcrumb */
export type Crumb = { label: string; href: string };

/** Sichtbare Breadcrumb-Spur + BreadcrumbList-JSON-LD (Plan-Schema). `trail` ohne Home;
 *  Home wird automatisch vorangestellt. Letzter Eintrag ist die aktuelle Seite (nicht verlinkt).
 *  `compact` (R71-Nachzieh, nur /tanzkurse/bachata via HeroFrame-tight): hebt die
 *  Mindest-Tap-Hoehe der Anker von 44px auf 20px ab, damit das Foto-Band in den
 *  730er-Fold rueckt. Ausnahme zu Critic Runde 8 Item 4, bewusst nur hier. */
export function Breadcrumb({ trail, compact = false }: { trail: Crumb[]; compact?: boolean }) {
  const { lang } = useLang();
  const home: Crumb = { label: lang === 'de' ? 'Start' : 'Home', href: '/' };
  const full = [home, ...trail];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: full.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: SITE_ORIGIN + c.href,
    })),
  };
  return (
    <>
      <JsonLd id="ld-breadcrumb" data={schema} />
      <nav aria-label={lang === 'de' ? 'Brotkrümelnavigation' : 'Breadcrumb'} className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--color-ink-muted)]">
        {full.map((c, i) => {
          const last = i === full.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-semibold text-[var(--color-ink)]">
                  {c.label}
                </span>
              ) : (
                // min-h-11: die Crumb-Anker massen 20px — zu kleines Tap-Ziel
                // (Critic Runde 8, Item 4). compact (nur bachata-Hero) nimmt das
                // Polster wieder raus, damit das Foto-Band in den Fold kommt.
                <a href={c.href} className={cn('t-hover inline-flex min-w-6 items-center hover:text-[var(--color-salsa)]', compact ? 'min-h-6' : 'min-h-11')}>
                  {c.label}
                </a>
              )}
              {/* --color-line (#E4E4E1) mass als Textfarbe 1.22:1 auf Papier — als Trenner
                  unsichtbar. Der Separator traegt jetzt die gedaempfte Textfarbe. */}
              {!last && <span aria-hidden className="text-[var(--color-ink-muted)]">/</span>}
            </li>
          );
        })}
      </ol>
      </nav>
    </>
  );
}

/* ----------------------------------------------------------------- Sub-Hero */
export type HeroCta = { label: string; href: string };

/* Design-Kritik Runde 2, Issue 1 ("Es gibt keinen einzigen Hero-Moment auf der ganzen Site").
 *
 * Befund im 6-up-Vergleich (/tmp/slices/z_hero_grid.jpg): tanzkurse, events, preise, team,
 * salsa und heels oeffnen mit exakt derselben Bauform — Eyebrow, Headline links, Body,
 * Pill-CTA, drei rote Stat-Zahlen, Foto rechts im gerundeten Rahmen. Sechsmal dasselbe
 * Mittelmass; keine Seite ist wiedererkennbar, am wenigsten die Startseite.
 *
 * Ursache: der Foto-Split IST das Template. Solange jede Unterseite ein Hero-Foto neben dem
 * Text bekommt, sieht jede Unterseite gleich aus — egal wie die Copy lautet. Ein anderes
 * Bild loest das nicht, nur eine andere Struktur.
 *
 * Fix in zwei Teilen:
 *  1. Der Foto-Hero gehoert ab jetzt GENAU EINER Seite: der Startseite (home/Hero.tsx,
 *     full-bleed bis an die Viewport-Kanten). Sie ist damit unverwechselbar.
 *  2. Die Unterseiten bekommen einen reinen TYPO-Hero — und zwar mit unterschiedlicher
 *     Achse je Seite, damit sie sich untereinander ebenfalls nicht gleichen:
 *
 *       'split'   H1 links, Lead + CTA in der rechten Schiene   (tanzkurse, events, standort)
 *       'left'    alles linksbuendig gestapelt, schmales Mass   (salsa, bachata, floweekend)
 *       'center'  Headline zentriert ueber dem Inhalt darunter  (preise, heels, faq)
 *       'wide'    H1 ueber die volle Shell, Meta in einer Zeile (team, eventkalender)
 *
 * Das Hero-Foto faellt damit weg. Wo das Motiv inhaltlich traegt (Team-Gruppenfoto,
 * Event-Fotos), laeuft es als full-bleed Band UNTER dem Typo-Block weiter — randlos,
 * ohne Radius, ohne Rahmen. Das ist bewusst dieselbe Geste wie auf der Startseite, nur
 * ohne Text darauf: die Hierarchie Home > Unterseite bleibt sichtbar. */
export type HeroAxis = 'split' | 'left' | 'center' | 'wide';

/** Reiner Typo-Hero jeder Unterseite. Kein Hero-Foto (siehe Kommentar oben) — das Bild
 *  gehoert der Startseite. `axis` setzt die Achse, `media` haengt optional ein full-bleed
 *  Band unter den Typo-Block. */
export function SubHero({
  seoCrumbs,
  title,
  titleAccent,
  lead,
  primary,
  secondary,
  microcopy,
  facts,
  axis = 'split',
  media,
  dense = false,
  tightBottom = false,
  leadColumnTop = false,
  airAboveTitle = false,
  airBelowCta = false,
  underTitle,
  children,
}: {
  seoCrumbs: Crumb[];
  title: string;
  titleAccent?: string;
  lead: string;
  primary?: HeroCta;
  secondary?: HeroCta;
  microcopy?: string;
  facts?: [string, string][];
  axis?: HeroAxis;
  /** Optionales full-bleed Band unter dem Typo-Block (randlos, ohne Radius).
   *  positionClass: responsive object-position (z. B. Gruppenfoto, das je Breite anders
   *  schneiden muss) — gewinnt gegen `position`, weil Inline-Style keine Breakpoints kann. */
  media?: { src: string; alt: string; position?: string; positionClass?: string; heightClass?: string };
  /** Kuerzerer Hero, damit ein kurzes Bildband noch in den 730er-Fold passt. */
  dense?: boolean;
  /** R84 (nur /schnupperstunde): kuerzt das Shell-Padding unten (Default pb-14/lg:pb-20),
      damit der Anfrage-Block #anfrage in den 730er-Fold rueckt. Reiner Abstand-Hebel,
      Default false = alle anderen Seiten unveraendert. */
  tightBottom?: boolean;
  /** R207: richtet die beiden Spalten der split-Achse oben statt unten aus.
   *  Nur fuer Heroes, deren rechte Spalte eine hohe Karte traegt (siehe HeroFrame). */
  leadColumnTop?: boolean;
  /** R215: durchgereicht an HeroFrame. Beide Flags existierten dort seit R208/R213,
      waren ueber SubHero aber nicht erreichbar — die Seiten, die sie bisher nutzen
      (/team, /events), bauen ihren Hero mit eigenem Code direkt auf HeroFrame.
      /mehr/partys geht ueber SubHero und brauchte deshalb die Durchreichung.
      Doku der Wirkung steht an den HeroFrame-Props, nicht doppelt hier. */
  airAboveTitle?: boolean;
  airBelowCta?: boolean;
  /** R216: durchgereicht an HeroFrame — Zusatzinhalt in der LINKEN Split-Spalte
      unter der H1 (bisher einziger Nutzer: /schnupperstunde, siehe HeroFrame). */
  underTitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <HeroFrame
      axis={axis}
      media={media}
      dense={dense}
      tightBottom={tightBottom}
      leadColumnTop={leadColumnTop}
      airAboveTitle={airAboveTitle}
      airBelowCta={airBelowCta}
      crumbs={seoCrumbs}
      title={title}
      titleAccent={titleAccent}
      lead={lead}
      primary={primary}
      secondary={secondary}
      microcopy={microcopy}
      facts={facts}
      underTitle={underTitle}
    >
      {children}
    </HeroFrame>
  );
}

/* Die eigentliche Bauform. Als eigene Komponente exportiert, damit die Seiten mit eigenem
   Hero-Code (tanzkurse, events, team, salsa, heels) dieselbe EINE Definition nutzen statt
   sich wieder je eine Variante zu bauen — genau so ist die Sechsfach-Dopplung entstanden. */
export function HeroFrame({
  axis = 'split',
  crumbs,
  title,
  titleAccent,
  lead,
  primary,
  secondary,
  microcopy,
  facts,
  media,
  dense = false,
  liftMedia = false,
  airBelowCta = false,
  airAboveTitle = false,
  tightBottom = false,
  leadColumnTop = false,
  underTitle,
  children,
}: {
  axis?: HeroAxis;
  crumbs?: Crumb[];
  title: ReactNode;
  titleAccent?: string;
  lead?: string;
  primary?: HeroCta;
  secondary?: HeroCta;
  microcopy?: string;
  facts?: [string, string][];
  media?: { src: string; alt: string; position?: string; positionClass?: string; heightClass?: string };
  /** Kuerzerer Hero, damit ein kurzes Bildband noch in den 730er-Fold passt. */
  dense?: boolean;
  /** R73-Nachzieh (nur /tanzkurse/salsa): hebt den Band-Top, indem der Typo-Block
      ueber dem Band gestrafft wird (Section-Top, Lead-Zeilenhoehe, Microcopy-Abstand).
      Kein negatives Band-Margin (wuerde Chips/CTA ueberdecken), keine neue Copy,
      Crop und Band-Hoehe bleiben. Wirkt nur zusammen mit dense+media. */
  liftMedia?: boolean;
  /** R208 (Raphael 23.08. 17:14, "UEBER UNS - unter dem Button viel zu wenig Platz"):
      gibt dem Band unter der CTA-Reihe Papier-Luft statt der 24px aus `pb-6`.
      Opt-in und nicht global, weil derselbe Zweig /preise, /mehr/tanzschuhe und
      /mehr/collabs traegt — dort sitzt unter dem CTA eine Zahlen- bzw. Preisleiste,
      die den Abstand schon selbst mitbringt (R70). Auf /team steht der Button nackt
      auf der Bandkante. */
  airBelowCta?: boolean;
  /** R213 (Raphael 23.08. 22:33, "Ueber-uns-Hero Luft oben und unten"): gibt der H1
      Papier-Luft unter der Navigations-Pille.

      Gemessen am laufenden DOM (scripts/r213-team-hero.cjs, gegen den Produktions-Build)
      lag /team als EINZIGE Route bei 8px (Desktop) bzw. 7px (390) zwischen Pillen-
      Unterkante und H1-Oberkante. Zum Vergleich in derselben Messung: /events 40,
      /tanzkurse 61, /preise 84, die tight-Schwestern salsa/bachata/heels 68.

      Die Ursache ist nicht der tight-Zweig selbst, sondern eine FEHLENDE Breadcrumb:
      tight setzt `paddingTop: var(--nav-h)` und `pt-0`, der Abstand zur H1 entsteht auf
      den Schwesterseiten allein aus dem `mb-1` der Crumb-Zeile. /team traegt keine Crumb,
      also faellt dieser Puffer ersatzlos weg und die H1 startet exakt auf var(--nav-h) —
      76px, waehrend die Pille (`.t-acc`) erst bei 68px endet und mit ihrer Rundung
      optisch noch tiefer reicht. Deshalb liest sich der Fold als Ueberlappung.

      Opt-in statt Aenderung am tight-Zweig: derselbe Zweig traegt /tanzkurse/salsa,
      /bachata, /heels und /mehr/partys, deren Band-Crop laut R71/R159/R174 auf
      Kinnlinien kalibriert ist. Ein globaler Griff dort verschoebe vier fremde Crops
      fuer einen Fehler, den nur /team hat. */
  airAboveTitle?: boolean;
  /** R84 (nur /schnupperstunde): kuerzt das Shell-Padding unten, damit #anfrage in den
      730er-Fold rueckt. Reiner Abstand-Hebel, Default false = andere Seiten unveraendert. */
  tightBottom?: boolean;
  /** R207 (nur /schnupperstunde): richtet die beiden Spalten der split-Achse OBEN aus
      statt an der Unterkante.

      Die Achse steht sonst auf `lg:items-end`, und das ist fuer ihren Normalfall richtig:
      links eine grosse H1, rechts Lead + CTA + Microcopy — beide Bloecke teilen sich die
      Grundlinie, die Typo sitzt auf einer Linie. Genau diese Ausrichtung kippt aber, sobald
      die rechte Spalte statt drei Textzeilen eine hohe Karte traegt.

      Gemessen auf der Live-Seite (scratch-Probe 28.08., 1440x900): das Formular begann bei
      y=216, die H1 «Erste Stunde. Gratis.» erst bei y=460 — 372px leeres Papier darueber,
      und der Besucher las das Formular, bevor er wusste, wofuer er es ausfuellt. Auf Mobil
      (390x844) stimmte die Reihenfolge dagegen (H1 y=102), weil dort einspaltig gestapelt
      wird und `items-end` gar nicht greift. Der Fehler war also reiner Desktop.

      Opt-in statt Aenderung an `lg:items-end`: fuenf weitere Routen nutzen `axis="split"`
      (standort, vorbereiten, collabs, faq, kursplan) und keine davon setzt eine Karte in
      den children-Slot — fuer sie ist die Grundlinien-Ausrichtung korrekt und bliebe es. */
  leadColumnTop?: boolean;
  /** R216 (nur /schnupperstunde): Zusatzinhalt in der LINKEN Split-Spalte unter der H1.
      Gemessen (Sweep 28.08., 1440x900): die kurze H1 «Erste Stunde. Gratis.» laesst neben
      der hohen Formular-Karte ~300px leeres Papier. Ein Trust-Block fuellt die Spalte,
      ohne die Formular-Reihenfolge (R207: Versprechen vor Handlung) anzutasten.
      Nur ab lg gerendert — mobil stapeln die Spalten und der Block wuerde das Formular
      unter den Fold druecken. */
  underTitle?: ReactNode;
  /** Zusatzinhalt unter dem CTA-Block (z. B. Chip-Reihe auf den Stilseiten). */
  children?: ReactNode;
}) {
  /* Der Above-the-fold-Hero bleibt weitgehend statisch. Der Seitenstamm besitzt bereits
     die eine dokumentuebergreifende Eintrittschoreografie; ein zweiter H1-/CTA-/Bild-Reveal
     wuerde denselben Inhalt doppelt bewegen und die Seite fast eine Sekunde lang unfertig
     halten. Below-the-fold-SectionHeads und Karten behalten ihre gestaffelten Reveals.
     R-Scroll, EINE Ausnahme: die H1-Woerter laufen als sehr schnelle Welle (stagger 0.03,
     distance 14, sofortiger Start ueber initial/animate statt whileInView — die H1 ist
     above the fold und darf nicht auf einen Viewport-Trigger warten). Nur wenn `title`
     ein reiner String OHNE titleAccent ist: RevealWords braucht einen String zum
     Schneiden, und TitleAccent haengt am gemeinsamen Zeilenumbruch (siehe SectionHead).
     Reduced Motion handled RevealWords selbst (distance 0, stagger 0). */
  const center = axis === 'center';
  const wide = axis === 'wide';
  const split = axis === 'split';
  /* R71-Nachzieh: /tanzkurse/bachata (dense+media, Achse left, ohne facts) braucht den
     Band-Top um ~110px hoeher, damit im 730er-Fold zwei GESICHTER inkl. Kinn liegen
     statt nur Haar. Gemessen 16.08.2026 live: Band-Top 667, sichtbar 63px. Zusammen mit
     der Band-Hoehe 18rem->11rem (content.ts) landet der Top bei ~445 und das Fenster
     traegt das Motiv bis Kinn (Quell-y 462/1080, Crop 17%).
     Konditioniert auf dense+media+!facts+!split, damit /preise (facts+pb-6 aus R70) und
     die split-Seiten unveraendert bleiben. tight hebt zusaetzlich die Mindest-Tap-Hoehe
     der Crumb-Anker auf (44px -> 20px, Critic Runde 8 Item 4, prop compact auf
     Breadcrumb) und strafft den Section-Top (0.5rem -> 0) — nur auf bachata. */
  const tight = Boolean(dense && media && !(facts && facts.length) && !split);
  /* R73-Nachzieh: liftMedia (nur salsa) zieht den Section-Top auf var(--nav-h) — wie
     tight, aber unabhaengig davon geschaltet, damit bachata (tight) unveraendert bleibt. */
  const lift = Boolean(liftMedia && dense && media);
  /* R213: `airAboveTitle` steht bewusst VOR dem tight/lift-Zweig — genau wie R208 es bei
     `airBelowCta` lernen musste. /team erfuellt `tight` (dense+media, keine facts, nicht
     split) und landete deshalb auf dem nackten `var(--nav-h)`; ein Flag HINTER dem Zweig
     waere wirkungslos geblieben.
     +2.5rem = 40px sind kein runder Wunschwert, sondern der gemessene Korridor der
     Schwesterseiten: /events 40, salsa/bachata/heels 68, /tanzkurse 61. 40px hebt die H1
     auf y116 (Desktop) bzw. y106 (390) und damit 48px bzw. 47px unter die Pillen-
     Unterkante — knapp ueber /events, deutlich unter /preise. Mehr waere Platz, den das
     Band im 730er-Fold braucht. */
  const topPad = airAboveTitle
    ? 'calc(var(--nav-h) + 2.5rem)'
    : tight || lift || tightBottom
      ? 'var(--nav-h)'
      : dense
        ? 'calc(var(--nav-h) + 0.5rem)'
        : 'calc(var(--nav-h) + 1.5rem)';

  /* R-Scroll: Die H1-Welle laeuft nur, wenn `title` ein reiner String ohne titleAccent
     ist — RevealWords schneidet an Leerzeichen, und der Accent haengt am gemeinsamen
     Zeilenumbruch (Begruendung wie in SectionHead). `immediate` startet die Welle beim
     Mount statt auf den Viewport-Trigger: die H1 ist above the fold. */
  // `title` ist als ReactNode deklariert; nur ein reiner String laesst sich an
  // Leerzeichen in Wort-Spans zerlegen — der typeof-Check IST hier die Boundary.
  // oxlint-disable-next-line anti-slop/no-runtime-typeof
  const wave = typeof title === 'string' && !titleAccent;
  const headingClass = cn(
    // .type-h1 = die EINE H1-Groesse (src/index.css). `wide` behaelt seine groessere
    // Stufe: dort traegt die H1 die volle Shell allein, das ist Seiten-Charakter,
    // keine Abweichung von der Ebene.
    'type-h1 text-[var(--color-ink)]',
    wide
      ? 'text-[2.7rem] leading-[0.98] sm:text-[4rem] lg:text-[5rem] max-w-[16em]'
      /* R205 Runde 2 (Grok, /preise m390): bei 41.6px blieb die Script-Accent-Zeile
         «Privatstunden.» allein als letzte Zeile stehen — sie war breiter als jede
         mögliche Mitzeile. Eine Stufe kleiner auf Mobil laesst «und» davor passen. */
      : cn(MEASURE_XL, 'max-sm:text-[2.25rem] max-sm:leading-[1.06]'),
    center && 'mx-auto',
  );
  /* R206: `data-fold` benennt die Fold-Rollen fuer die Seitenwechsel-Choreografie.
     index.css haengt daran je einen view-transition-name, damit Crumbs, Titel, Lead, CTA
     und Medium beim Routenwechsel um 60ms versetzt hereinkommen statt als ein Block.
     Die Marker wirken AUSSCHLIESSLICH waehrend eines dokumentuebergreifenden Uebergangs
     — beim Erstaufruf und beim Reload existieren die ::view-transition-Pseudos nicht, der
     Fold steht also weiterhin ab Frame 1 (R209). Kein Styling haengt daran. */
  const heading = wave ? (
    <RevealWords
      as="h1"
      // SAFETY: `wave` garantiert `typeof title === 'string'` (Zeile darueber).
      text={title as string}
      className={headingClass}
      data-fold="title"
      stagger={0.04}
      distance={14}
      duration={0.52}
      immediate
    />
  ) : (
    <h1 className={headingClass} data-fold="title">
      {title} {titleAccent ? <TitleAccent>{titleAccent}</TitleAccent> : null}
    </h1>
  );

  /* `mt-0` hebt das `mt-4` aus `sectionLead` gezielt auf.
   *
   * Diese Subline ist Flex-Kind (siehe die beiden Achsen unten, `gap-2.5`/`gap-4`/
   * `gap-6` bzw. `gap-6` in der Split-Schiene). Dort traegt der Gap den Abstand,
   * ein zusaetzlicher Rand addiert sich einfach dazu. Gemessen am gerenderten DOM
   * mit dem Rand: H1→Lead stand auf /preise bei 40 px, /team 36 px,
   * /tanzkurse/salsa 32 px — drei Werte fuer dieselbe Rolle auf drei Seiten.
   * Ohne ihn liegt der Abstand wieder allein am Gap der jeweiligen Achse und ist
   * damit pro Achse eine einzige Entscheidung.
   *
   * `sectionLead` bleibt trotzdem die Quelle fuer Schriftgroesse, Zeilenhoehe und
   * Farbe — nur der Abstand kommt hier aus dem Layout statt aus der Rolle. */
  const leadEl = lead ? (
    <p
      data-fold="lead"
      className={cn('text-pretty', sectionLead, 'mt-0', center ? 'mx-auto max-w-2xl' : 'max-w-xl')}
      // R73-Nachzieh: auf salsa (lift) die Lead-Zeilenhoehe dichter, damit das Band
      // hoeher sitzt und die Koepfe Luft unter dem Kinn bekommen. Nur Anzeige-Straffung.
      style={lift ? { lineHeight: 1.32 } : undefined}
    >
      {lead}
    </p>
  ) : null;

  const ctas =
    primary || secondary ? (
      <div
        data-fold="cta"
        className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', center && 'sm:justify-center')}
      >
        {primary ? <PrimaryCta href={primary.href}>{primary.label}</PrimaryCta> : null}
        {secondary ? (
          <GhostCta href={secondary.href} down={secondary.href.startsWith('#')}>
            {secondary.label}
          </GhostCta>
        ) : null}
      </div>
    ) : null;

  const micro = microcopy ? (
    <p
      className={cn('text-sm leading-relaxed text-[var(--color-ink-muted)]', center && 'mx-auto max-w-xl')}
      // R73-Nachzieh: Microcopy-Abstand zum CTA-Block auf salsa (lift) leicht kuerzen.
      style={lift ? { marginTop: '-0.25rem' } : undefined}
    >
      {microcopy}
    </p>
  ) : null;

  /* Die Zahlen-Leiste. Sie war im alten Hero dreimal dieselbe rote 3er-Reihe; jetzt haengt
     ihre Form an der Achse (Schiene rechts / Zeile unter der Haarlinie / zentriert). */
  const factList =
    facts && facts.length ? (
      <dl
        className={cn(
          // R52: unter md eine Spalte (Preise auf 390 quetschten in einer Zeile: Zahl eng an
          // Zahl, Label klein). Ab md bleibt es drei Spalten — Desktop unveraendert.
          'grid grid-cols-1 gap-5 border-t border-[var(--color-line)] pt-6 md:grid-cols-3 md:gap-4',
          split ? 'max-w-xl' : wide ? 'max-w-3xl' : center ? 'mx-auto max-w-2xl' : 'max-w-xl',
        )}
      >
        {facts.map(([value, label]) => (
          <div key={label}>
            <dt className="font-display text-2xl font-extrabold leading-none text-[var(--color-salsa)] sm:text-3xl">
              {value}
            </dt>
            {/* text-balance + hyphens-none: lange Labels (z. B. "Studios am Bahnhof SBB")
                sollen nicht als alleinstehendes "SBB" unter "Bahnhof" umbrechen. */}
            <dd className="mt-2 text-xs leading-snug text-balance text-[var(--color-ink-muted)] [overflow-wrap:normal] [word-break:keep-all]">
              {label}
            </dd>
          </div>
        ))}
      </dl>
    ) : null;

  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      style={{ paddingTop: topPad }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      <Shell className={cn(
        dense ? (tight ? 'pt-0' : 'pt-2 lg:pt-3') : 'pt-6 lg:pt-10',
        // R51-Nachzieh: bei dense+media den Restabstand zum Band kuerzen. R70-Nachzieh:
        // pb-2 (8px) legte die grauen Preis-Unterzeilen AUF die Bandkante — pb-6 (24px)
        // gibt ihnen Papier-Luft, ohne das Band aus dem 730-Fold zu schieben (gemessen:
        // Labels y572, Band-Top y590, Band 224px -> 140px Koepfe im Fold). Betrifft nur
        // dense+media-Seiten (/preise, /mehr/tanzschuhe, /mehr/collabs, /events).
        // R71-Nachzieh: auf bachata (tight) pb-0 — die Chips schliessen fast an der
        // Falz ab, Papier-Luft kommt dort aus dem freien Band, nicht aus Padding.
        // R77: Ausnahme fuer tight-Seiten MIT Microcopy (/mehr/partys): ohne Abstand
        // klebt der Satz exakt auf der Foto-Naht (microBottom 481 = bandTop 481,
        // kaum lesbar). tight+media+microcopy -> pb-8 (32px Papier-Luft, gemessen
        // microToBand 0 -> 32, Koepfe bleiben im Fold: sichtbar 217px, zwei Koepfe
        // vorn inkl. Kinn). salsa/bachata/heels (tight) haben keine Microcopy ->
        // bleiben pb-0. Tanzschuhe/Collabs (dense+media, nicht tight) behalten pb-6.
        // R208: `airBelowCta` (/team, /events) gibt dem Band Papier-Luft unter der
        // CTA-Reihe. Es steht bewusst VOR dem `tight`-Zweig: /team und /events erfuellen
        // `tight` (dense+media, keine facts, nicht split) und landeten deshalb auf `pb-0`.
        // Am laufenden DOM gemessen (1440x900) waren es 3px zwischen der Unterkante des
        // sekundaeren Textlinks und der Bandoberkante — der erste Anlauf dieser Runde
        // setzte das Flag hinter `tight` und blieb damit wirkungslos. Gemessen wird ab
        // dem TIEFSTEN Element der CTA-Reihe, nicht ab der Pill: der Textlink daneben
        // reicht weiter nach unten als der Button.
        media
          ? (dense
              ? (airBelowCta ? 'pb-14 lg:pb-16' : tight ? (microcopy ? 'pb-8' : 'pb-0') : 'pb-6 sm:pb-6')
              : 'pb-10 sm:pb-12')
          : (tightBottom ? 'pb-6 lg:pb-8' : 'pb-14 sm:pb-16 lg:pb-20'),
      )}>
        <div
          data-hero-static
          className={center ? 'text-center' : undefined}
        >
          {crumbs ? (
            <div
              data-fold="crumbs"
              className={cn(dense ? (tight || tightBottom ? 'mb-1' : 'mb-3') : 'mb-6', center && 'flex justify-center')}
            >
              {/* R84: tightBottom (nur /schnupperstunde) schaltet die Crumb auf compact
                  (Tap-Hoehe 44->20px), damit #anfrage mit erster Zeile in den 730er-Fold
                  rueckt. Reiner Abstand-Hebel, Default false = andere Seiten unveraendert. */}
              <Breadcrumb trail={crumbs} compact={tight || tightBottom} />
            </div>
          ) : null}
          {/* Kein Hero-Eyebrow mehr (Meta-Kritik 2026-08-07). Er stand hier auf JEDER Unterseite
              und erzeugte denselben Einstieg: roter Takt-Marker, versale gesperrte Kleinzeile,
              dann eine uebergrosse H1 — Kursplan, Team, FAQ, Salsa, Preise sahen oberhalb der
              Falz identisch aus. Der Text war ausserdem meist eine Wiederholung der Headline
              oder des Breadcrumbs ("FAQ" ueber "Unsicher ist normal", "Salsa Kurse in Basel"
              ueber "Lerne Salsa so, dass..."). Er ist ersatzlos raus statt umgestaltet: die H1
              traegt die Hierarchie allein, das ist der Fokuspunkt, den DESIGN.md fordert.
              Der Marker bleibt Kapitelgrenze INNERHALB einer Seite (SectionHead). */}

          {split ? (
            /* Achse 1: H1 links, alles Erklaerende in der rechten Schiene. Die Schiene sitzt
               an der Grundlinie der Headline (items-end), damit die beiden Bloecke unten
               abschliessen statt mittig zu schweben. */
            <div className={cn(
              'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16',
              leadColumnTop ? 'lg:items-start' : 'lg:items-end',
            )}>
              <div>
                {heading}
                {underTitle ? <div className="mt-8 hidden lg:block">{underTitle}</div> : null}
              </div>
              <div className="flex flex-col gap-6 border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:pt-0">
                {leadEl}
                {ctas}
                {micro}
                {children}
              </div>
            </div>
          ) : (
            /* R190, zweite Kritikrunde: dieser Gap traegt den Abstand H1->Lead, weil
               `leadEl` daneben auf `mt-0` steht. Er hing aber an einer fuenffachen
               Bedingung aus `center`, `dense`, `tight` und `wide`. Gemessen ergab das
               H1->Lead: /preise 24 px, /tanzkurse/salsa 24 px, /team 20 px — `/team`
               ist die einzige Route mit `axis="wide" dense` und landete auf `gap-5`.
               Der Lead-Abstand hing damit an einer LAYOUT-Achse statt an seiner Rolle,
               und das ist Raphaels Punkt (3) wortwoertlich.
               `wide` bekommt jetzt denselben Wert wie der Normalfall; `dense`
               (24 -> 16 px) und `tight` (10 px) bleiben, das sind bewusste
               Verdichtungen mit eigener Begruendung weiter unten. */
            <div className={cn('flex flex-col', center ? 'items-center gap-6' : (dense ? (tight ? 'gap-2.5' : 'gap-4') : 'gap-6'), wide && (dense ? 'gap-6' : 'gap-7'))}>
              {heading}
              {leadEl}
              {ctas}
              {micro}
              {children}
            </div>
          )}

          {/* R70: bei dense 24px statt 40px ueber den Zahlen — sonst schneidet das Foto-Band
              im 730-Fold die grauen Unterzeilen der Preis-Leiste ab. Nur /preise nutzt
              dense+facts, alle anderen Achsen unveraendert. */}
          {factList ? <div className={dense ? 'mt-6' : 'mt-10'}>{factList}</div> : null}
        </div>
      </Shell>

      {media ? (
        /* Full-bleed Band: bewusst OHNE Shell, ohne Radius, ohne Rahmen — das Motiv laeuft
           bis an beide Viewport-Kanten. Es steht unter der Typo, nicht daneben, und traegt
           deshalb keine Schrift (die gehoert dem Home-Hero).
           heightClass: Seiten mit Cookie-Ueberdeckung (z. B. /tanzkurse) koennen das Band
           hoeher ziehen, damit unter den Stats mehr als ein Kopfstreifen bleibt.

           Das Bild bleibt im Above-the-fold statisch. Der Wrapper bewahrt die kalibrierte
           Crop-Geometrie; die gemeinsame Seitenchoreografie bewegt bereits den ganzen Stamm. */
        <div data-fold="media" className="relative w-full overflow-hidden">
          <img
            src={media.src}
            alt={media.alt}
            className={cn(
              'w-full object-cover',
              media.heightClass ?? 'h-[16rem] sm:h-[22rem] lg:h-[30rem]',
              media.positionClass,
            )}
            style={media.positionClass ? undefined : { objectPosition: media.position ?? 'center 40%' }}
            width={2048}
            height={1152}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      ) : null}
    </section>
  );
}

/* ----------------------------------------------------------------- Section-Kopf */
/** Wiederkehrender Sektions-Kopf (Eyebrow + H2 mit optionalem Akzentwort + Lead). */
export function SectionHead({
  eyebrow,
  title,
  titleAccent,
  lead,
  center = false,
  className,
  tight = false,
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  lead?: string;
  center?: boolean;
  className?: string;
  /** R84 (nur /schnupperstunde): kuerzt den Abstand ueber der H2 (mt-5 -> mt-0) und zum
      Lead (mt-4 -> mt-2), damit #anfrage mit erster Zeile in den 730er-Fold rueckt.
      Reiner Abstand-Hebel, Default false = alle anderen Seiten unveraendert. */
  tight?: boolean;
}) {
  /* Nur fuer den Akzent-Fall (siehe Kommentar am Heading unten). Der Haken laeuft
     bedingungslos, weil React-Hooks nicht hinter einem `if` stehen duerfen. */
  const reducedMotion = useReducedMotion() === true;
  const { item: headBlur } = useRevealVariant('blur', {
    distance: reducedMotion ? 0 : 24,
  });
  return (
    <div className={cn(center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow ? (
        <div className={center ? 'flex justify-center' : undefined}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      {/* R189 Motion-Rollen: die Sektions-H2 staffelt Wort fuer Wort statt als ein Block
          mit dem Eyebrow zu steigen. Das ist der groesste Hebel dieser Datei — SectionHead
          traegt die H2 auf allen Unterseiten, und bisher fuhr sie im exakt gleichen rise
          wie Lead, Liste und Karte darunter.

          Zwei Faelle, und die Fallunterscheidung ist keine Bequemlichkeit:

          OHNE Akzent ist `title` ein reiner String — genau das, was RevealWords braucht,
          um an Leerzeichen zu schneiden. Klassenliste und Tag bleiben identisch, die
          Komponente rendert `<h2 className=...>` selbst.

          MIT Akzent bleibt das <h2> unveraendert stehen. `TitleAccent` rendert eigenes
          Markup in font-script auf 1.22em; wuerde man den Akzent aus dem Heading
          herausziehen, um den Rest zu staffeln, braeche der gemeinsame Zeilenumbruch —
          und genau darauf sind MEASURE_L und text-balance ausgemessen (Kommentar oben,
          Messwerte 2026-08-06). Statt das Layout fuer einen Effekt zu opfern, bekommt
          dieser Fall den blur-Eingang: scharfstellen statt hereinsteigen. Auch das ist
          eine andere Rolle als der rise darunter, und es kostet keinen Umbruch. */}
      {titleAccent ? (
        <motion.h2
          variants={headBlur}
          data-reveal-variant="blur"
          className={cn(tight ? 'mt-0' : 'mt-5', sectionTitle, MEASURE_L, center && 'mx-auto')}
        >
          {title} <TitleAccent>{titleAccent}</TitleAccent>
        </motion.h2>
      ) : (
        <RevealWords
          as="h2"
          text={title}
          className={cn(tight ? 'mt-0' : 'mt-5', sectionTitle, MEASURE_L, center && 'mx-auto')}
        />
      )}
      {/* R190: Der Normalabstand steckt in `sectionLead` (primitives.tsx) und wird hier
          nicht wiederholt. `tight` bleibt als bewusste Ausnahme und muss deshalb NACH
          `sectionLead` stehen — `cn` ist tailwind-merge, dort gewinnt die spaetere
          Klasse. Stuende `mt-2` davor, waere die Ausnahme wirkungslos. */}
      {lead ? <p className={cn('text-pretty', sectionLead, tight && 'mt-2')}>{lead}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- Bullet-Liste */
/** Check-Bullets im Preis-/Feature-Look (roter Haken in weichem Kreis). */
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('grid gap-2.5', className)}>
      {items.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)]"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
            <Check size={13} strokeWidth={3} aria-hidden />
          </span>
          <span className="leading-snug">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- FAQ */
export type Faq = { q: string; a: string };

/* Begleit-Text der FAQ-Schiene. Eigene Mini-Komponenten, weil FaqBlock selbst kein
   `lang` zieht (es bekommt fertige Strings) — hier wird der Hook lokal geholt. */
function FaqAsideCopy() {
  const { lang } = useLang();
  return (
    <>
      {lang === 'de'
        ? 'Deine Frage ist nicht dabei? Schreib uns kurz, wir antworten persönlich.'
        : 'Your question is not here? Send us a short message, we answer personally.'}
    </>
  );
}

function FaqAsideCta() {
  const { lang } = useLang();
  return <>{lang === 'de' ? 'Frag uns direkt' : 'Ask us directly'}</>;
}

/** Zugaengliches FAQ-Accordion (native <details>) + FAQPage-JSON-LD (Plan-Schema). */
export function FaqBlock({
  eyebrow,
  title,
  titleAccent,
  items,
  id = 'faq',
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  items: Faq[];
  id?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <section id={id} className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <JsonLd id="ld-faq" data={schema} />
      <Shell>
        {/* Design-Kritik Runde 3, Issue 5 ("Tote rechte Spalten"): der Kopf lief ueber die
            volle Shell, die Fragenliste darunter aber auf max-w-3xl — rechts blieben rund
            43% der Breite leeres Papier ohne Funktion (gemessen auf /preise, /salsa, /heels).

            Jetzt dieselbe Zweispalten-Schiene wie die Startseiten-FAQ (home/Faq.tsx): links
            der Kopf, der beim Scrollen mitlaeuft (lg:sticky), rechts das Accordion. Der
            Weissraum rechts wird damit zu Lesebreite links — und die tote Spalte bekommt
            unten einen echten Job: den Weg fuer alles, was in keiner Frage steht. */}
        <div className="grid gap-y-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-x-16 xl:gap-x-24">
          <Reveal className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <SectionHead eyebrow={eyebrow} title={title} titleAccent={titleAccent} />
            <div className="mt-7 border-t border-[var(--color-line)] pt-6">
              <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                <FaqAsideCopy />
              </p>
              {/* GhostCta bringt px-4 mit (Pill-Geometrie). Hier steht der Link an einer
                  Textkante, darum wird das linke Padding aufgehoben, damit er auf derselben
                  Achse wie Headline und Absatz beginnt. */}
              <div className="mt-2 -ml-4">
                <GhostCta href={SCHNUPPER_HREF}>
                  <FaqAsideCta />
                </GhostCta>
              </div>
            </div>
          </Reveal>

          {/* Trennlinien statt Box (Runde 2), Layout jetzt volle Spaltenbreite. */}
          <Reveal className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {items.map((f) => (
              <details key={f.q} className="group py-1">
                {/* lg:pr-32: der fixe WhatsApp-FAB (rechte ~140px-Zone) lag beim Scrollen
                    genau auf dem Chevron der untersten sichtbaren Frage (Sweep 14.08.2026,
                    /tmp/r7-fab-faq.png — auf /privatstunden, /shows-animationen und
                    /kursaufbau gemessen). Nur der Zeileninhalt rueckt ein, Klickflaeche und
                    Trennlinien bleiben voll breit. */}
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left type-h3 text-[var(--color-ink)] marker:content-none lg:pr-32 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className="shrink-0 text-[var(--color-salsa)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-[62ch] pb-5 pr-8 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Risikoabbau-Band */
/** Die drei wiederkehrenden Risikoabbau-Karten (Mutmacher / Kein Partner / Level) aus
 *  01_GLOBAL_COPY_DESIGN_SYSTEM.md. Sitewide gleicher Wortlaut, hier als ruhiges Karten-Band. */
export function ReassuranceBand({ variant = 'soft' }: { variant?: 'soft' | 'warm' }) {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const cards: [string, string][] = de
    ? [
        ['Du musst noch nichts können', 'Du musst nur den ersten Schritt machen. Den Rest zeigen wir dir in Ruhe.'],
        ['Du kannst alleine kommen', 'Melde dich auch ohne Tanzpartner an. Wir achten auf eine gute Balance und helfen beim Einstieg.'],
        ['Dein Level ist kein Problem', 'Wenn du dein Level nicht kennst, gibt es Schnupperstunden, Level-Hilfe und eine ehrliche Empfehlung.'],
      ]
    : [
        ['You do not need to know anything yet', 'You only need to take the first step. We show you the rest calmly.'],
        ['You can come on your own', 'Sign up even without a dance partner. We watch the balance and help you get started.'],
        ['Your level is no problem', 'If you do not know your level, there are trial classes, level help and an honest recommendation.'],
      ];
  return (
    <section className={cn('py-16 sm:py-20', variant === 'warm' ? 'bg-[var(--color-paper-warm)]' : 'bg-[var(--color-bg-soft)]')}>
      <Shell>
        {/* Design-Kritik Runde 2: das waren drei weisse Schatten-Karten mit je einem
            Deko-Chip ("Kein Druck") darin — Kartensystem statt Editorial. Jetzt drei
            Spalten unter EINER Oberkante, getrennt durch 1px-Linien wie auf der Home
            (vgl. src/public/home/CoursePath.tsx). Der Chip ist weg: er stand dreimal
            identisch und war Deko, kein Filter. Der rote Takt-Marker bleibt als Anker. */}
        <Reveal className="grid border-t border-[var(--color-line)] md:grid-cols-3" stagger={0.08}>
          {cards.map(([t, b]) => (
            <motion.div
              key={t}
              variants={item}
              className="border-b border-[var(--color-line)] py-7 md:border-b-0 md:border-r md:px-7 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <BeatMark />
              <h3 className="type-h3 mt-4 text-[var(--color-ink)]">{t}</h3>
              <p className="mt-3 max-w-[42ch] text-pretty text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">{b}</p>
            </motion.div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Schluss-CTA
 *
 * Design-Kritik Runde 2, Issue 9: "es gibt vier verschiedene Schluss-CTA-Muster sitewide
 * (Home: grosse Split-Card; Salsa/Heels: zentrierter Glow-Block; Kontakt: schmale Leiste mit
 * Mini-Thumbnail; Tanzkurse: normale Sektion)". Fix-Vorgabe: "Ein einziger Schluss-CTA als
 * Komponente fuer alle Seiten."
 *
 * Ursache: `ClosingInvite` gab es zwar, konnte aber keinen Sekundaer-CTA. Jede Seite, die
 * zwei Wege am Schluss brauchte, hat sich deshalb eine eigene `FinalCta`/`ClosingSection`
 * gebaut — gezaehlt 15 Stueck, davon mehrere Byte-fuer-Byte identisch (PartysPage vs.
 * TanzschuhePage). Die fehlende Prop war der Grund fuer die Musterspaltung, nicht der
 * Geschmack der Seiten.
 *
 * `secondary`, `titleNode` und `surface` schliessen diese Luecke: die drei Gruende, aus denen
 * sich Seiten bisher abgespalten haben (zweiter Weg, Akzent mitten im Titel, andere
 * Flaechenfarbe als die Sektion darueber). Damit koennen alle Seiten auf die EINE Komponente
 * zeigen, und die naechste Seite kann keine siebzehnte Variante mehr erfinden. */
export type ClosingSurface = 'paper' | 'soft' | 'night';

/** Der EINE Schluss-CTA sitewide. */
export function ClosingInvite({
  eyebrow,
  title,
  titleAccent,
  titleNode,
  body,
  ctaLabel,
  ctaHref = SCHNUPPER_HREF,
  secondary,
  note,
  trust,
  surface = 'paper',
  nightImage,
  glow = false,
  dense = false,
}: {
  eyebrow?: string;
  /** Einfacher Fall: Titel + optionaler Akzent am Ende. Wird von `titleNode` ueberstimmt. */
  title?: string;
  titleAccent?: string;
  /** Fuer Titel, bei denen der rote Akzent MITTEN im Satz steht (z. B. /privatstunden, /shows). */
  titleNode?: ReactNode;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  /** Zweiter, ruhigerer Weg (Stufe 2 der Link-Skala). */
  secondary?: HeroCta;
  note?: string;
  /** Kompakte Trust-Zeile unter den CTAs (z. B. "Gratis · 60 Min · Ohne Partner"). */
  trust?: string[];
  /** Flaeche unter dem Abbinder — muss zur Sektion darueber passen, damit keine Kante entsteht. */
  surface?: ClosingSurface;
  /** Nur fuer `surface="night"`: das dunkle Foto gehoert laut Issue 5 in ein dunkles Band. */
  nightImage?: { src: string; width: number; height: number };
  /** Rosa Radial-Schein. Runde 3, Issue 7: hoechstens EINE Seite sitewide, Default aus. */
  glow?: boolean;
  /** Engerer Sektions-Takt (z. B. /tanzkurse: keine halbe Viewport-Leere vor dem Abbinder). */
  dense?: boolean;
}) {
  const { item } = useReveal();
  /* R189: der Abbinder ist der letzte Fokuspunkt der Seite. Seine H2 bekommt denselben
     blur-Eingang wie die Hero-H1, damit Anfang und Ende dieselbe Geste tragen — und
     nicht denselben rise wie die drei Zeilen darunter. `titleNode` darf ReactNode sein
     (Akzent mitten im Satz), Wort-Stagger scheidet hier also aus. */
  const { item: headBlur } = useRevealVariant('blur');
  const night = surface === 'night';
  return (
    <section
      className={cn(
        'relative isolate',
        night
          ? 'overflow-hidden bg-[var(--color-surface-dark)] text-white'
          : surface === 'soft'
            ? 'bg-[var(--color-bg-soft)]'
            : 'bg-[var(--color-paper-warm)]',
        dense ? 'py-10 lg:py-14' : SECTION_Y,
      )}
    >
      {night && nightImage ? (
        <>
          <img
            src={nightImage.src}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30"
            width={nightImage.width}
            height={nightImage.height}
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(17,17,17,0.9)_0%,rgba(17,17,17,0.78)_50%,rgba(17,17,17,0.95)_100%)]"
          />
        </>
      ) : null}
      <Shell>
        {/* Design-Kritik Runde 2: der Schluss-CTA sass in einer eigenen Box mit Radius und
            Schatten mitten auf der Papierflaeche. Die Box ist raus — der Abschluss steht
            jetzt frei auf dem Papier, gefasst nur von einer Oberkante (Haarlinie) und
            Weissraum. Der warme Rot-Schein bleibt, er ist Licht und kein Container. */}
        <Reveal
          className={cn(
            'relative isolate mx-auto max-w-3xl border-t px-0 text-center',
            dense ? 'pt-8 sm:pt-10' : 'pt-14 sm:pt-16',
            night ? 'border-white/15' : 'border-[var(--color-line)]',
          )}
        >
          {/* Root-Cause Overflow-Fix (Runde 3): dieser Schein hing an einem Container, der
              in Runde 2 seine Box UND damit sein overflow-hidden verloren hat. Ein 448px
              breiter Kreis, zentriert auf einem 350px-Container, ragt links und rechts je
              49px heraus — auf 390px war die Seite dadurch messbar 419px breit.
              w-[min(28rem,100%)] laesst den Schein auf Desktop unveraendert und deckelt ihn
              auf schmalen Viewports auf die Containerbreite. Bewusst NICHT ueber
              overflow-x:clip am Seiten-Wrapper geloest: clip erzeugt einen Scroll-Container
              und wuerde die lg:sticky-Spalten (Home-FAQ, /preise FitSection, /team) toeten. */}
          {/* Design-Kritik Runde 3, Issue 7 ("Sechsmal derselbe Abbinder"): der rosa
              Radial-Schein lief bisher auf JEDER hellen Abbinder-Sektion mit — auf Preise,
              Tanzkurse, Salsa, Heels, Events und Team dieselbe Flaeche mit demselben Glow.
              Als Set gelesen wirkte er dadurch beliebig statt besonders. Er ist jetzt
              Opt-in (`glow`) und laut Kritik auf EINE Seite beschraenkt; Default aus. */}
          {night || !glow ? null : (
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[28rem] w-[min(28rem,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.08)_0%,transparent_66%)]"
            />
          )}
          {eyebrow ? (
            <motion.div variants={item} className="flex justify-center">
              <Eyebrow dark={night}>{eyebrow}</Eyebrow>
            </motion.div>
          ) : null}
          <motion.h2
            variants={headBlur}
            data-reveal-variant="blur"
            className={cn(
              'type-h2 mx-auto mt-5',
              night ? 'text-white' : 'text-[var(--color-ink)]',
              MEASURE_L,
            )}
          >
            {titleNode ?? (
              <>
                {title} {titleAccent ? <TitleAccent dark={night}>{titleAccent}</TitleAccent> : null}
              </>
            )}
          </motion.h2>
          {/* R190: Hier stand `mt-5` VOR der Variante. Im Light-Zweig loeste
              tailwind-merge das gegen das `mt-4` aus `sectionLead` auf, im
              Night-Zweig blieb `mt-5` stehen — dieselbe Komponente rendert
              damit 16 px oder 20 px, je nach Farbwelt. Genau die Uneinheitlichkeit,
              die diese Runde beseitigen soll. Der Abstand steht jetzt fuer beide
              Zweige gleich; nur Schriftfarbe und -groesse unterscheiden sich. */}
          <motion.p
            variants={item}
            className={cn(
              'mx-auto mt-4 max-w-xl text-pretty',
              night ? 'text-base leading-relaxed text-white/80 sm:text-lg' : sectionLead,
            )}
          >
            {body}
          </motion.p>
          <motion.div
            variants={item}
            className={cn(
              'flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5',
              dense ? 'mt-6' : 'mt-8',
            )}
          >
            <CtaPill href={ctaHref} onNight={night}>
              {ctaLabel}
            </CtaPill>
            {secondary ? (
              <CtaText href={secondary.href} onNight={night}>
                {secondary.label}
              </CtaText>
            ) : null}
          </motion.div>
          {trust && trust.length ? (
            <motion.ul
              variants={item}
              className={cn(
                'mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm font-semibold',
                night ? 'text-white/70' : 'text-[var(--color-ink)]',
              )}
            >
              {trust.map((itemLabel, i) => (
                <li key={itemLabel} className="inline-flex items-center gap-4">
                  {i > 0 ? (
                    <span
                      aria-hidden
                      className={cn(
                        'hidden h-1 w-1 rounded-full sm:inline-block',
                        night ? 'bg-white/35' : 'bg-[var(--color-salsa)]',
                      )}
                    />
                  ) : null}
                  <span>{itemLabel}</span>
                </li>
              ))}
            </motion.ul>
          ) : null}
          {note ? (
            <motion.p
              variants={item}
              className={cn(
                'mx-auto max-w-md text-sm leading-relaxed',
                trust && trust.length ? 'mt-3' : 'mt-4',
                night ? 'text-white/60' : 'text-[var(--color-ink-muted)]',
              )}
            >
              {note}
            </motion.p>
          ) : null}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Abstands-Stufen
 *
 * Design-Kritik Runde 2, Issue 9, Fix-Vorgabe: "Abstaende differenzieren (48px innerhalb einer
 * Sektion, 112px zwischen Sektionen auf Mobil)".
 *
 * Ursache: es gab keine Konstante. Der String `py-12 sm:py-14 lg:py-16` war 68-mal von Hand in
 * 19 Dateien getippt (gezaehlt 2026-08-06). py-12 sind 48px oben + 48px unten; zwischen zwei
 * Sektionen ergibt das 96px - und der gleiche Wert steht innerhalb einer Sektion als mt-12.
 * Deshalb liest sich alles als ein einziger gleichfoermiger Stapel, unabhaengig davon, ob ein
 * neuer Gedanke anfaengt oder nur ein Absatz weitergeht. py-12 liegt ausserdem unter der
 * DESIGN.md-Untergrenze (Zeile 72: "Sektion-Abstand py-16 bis py-24").
 *
 * Die Stufen kommen aus src/public/home/kit.tsx, damit Startseite und Unterseiten denselben
 * Takt haben — genau EINE Skala sitewide statt zweier paralleler.
 *
 *   SECTION_Y   py-16 lg:py-24  -> 64px/64px auf Mobil = 128px zwischen zwei Sektionen
 *   SPACE_IN    mt-12           -> 48px innerhalb einer Sektion
 *
 * Damit ist der Sprung zwischen Sektionen auf Mobil 128px gegen 48px innen (Faktor 2,7);
 * vorher waren es 96px gegen 48px (Faktor 2,0) — und der Unterschied war nicht lesbar. */
/** Sektions-Padding sitewide. Ersetzt das handgetippte `py-12 sm:py-14 lg:py-16`. */
export const SECTION_PAD = SECTION_Y;
/** Abstand INNERHALB einer Sektion (Kopf -> Inhalt, Block -> Block). */
export const SPACE_IN = 'mt-12';

/* Re-Export der Primitive, damit Unterseiten alles aus einem Modul ziehen koennen. */
export {
  Shell,
  Eyebrow,
  TitleAccent,
  CtaArrow,
  CtaPill,
  CtaText,
  BeatMark,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
};
