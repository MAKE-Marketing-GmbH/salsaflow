// Wiederkehrende Design-System-Primitive der Startseite (Etappe 10).
// - Eyebrow: das rote Takt-Leitmotiv (ein roter Takt-Tick + Label) vor jeder Sektion.
// - Squiggle: handgezeichneter organischer Unterstrich (kein CSS-Strich, Regel-Praeferenz).
// - sectionTitle/lead: einheitliche Typo-Skala fuer Sektions-Koepfe.

import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowDown, Star } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { GOOGLE_REVIEWS } from '@/public/site/reviews';
import { WhatsAppIcon } from '@/public/site/BrandIcons';

/** Geteilte 1400px-Shell (v2-Direktive Raphael 2026-07-07: Sektionen 1400px breit statt 1200).
 *  Ersetzt die alten `max-w-6xl mx-auto px-6`-Container sitewide. `as` fuer semantisches Tag. */
export function Shell({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  /* Rechtes Padding ist groesser als das linke: dort sitzt der fixe WhatsApp-Knopf
     (48 px mobil right-1, 56 px ab sm right-6, plus Luft). pr-16 (64 px) liess auf
     390 px nur 12 px zwischen Spaltenkante und Kreis — die Samstag-Reiterlinie auf
     /kursplan las sich als auf dem Knopf (Opus+Grok auf m-00). pr-24 (96 px) haelt
     44 px Luft. Desktop bleibt 5.5 rem. */
  return (
    <Tag className={cn('mx-auto w-full max-w-[1400px] pl-5 pr-24 sm:pl-8 sm:pr-[5.5rem]', className)}>
      {children}
    </Tag>
  );
}

/** Fuenf Sterne in Salsa-Rot (Marken-Akzent, kein Gold - Farb-DNA bleibt Rot/Ink/Cream).
 *  Rating 4.9 rundet visuell auf fuenf gefuellte Sterne; die echte Zahl steht daneben. */
export function StarRating({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} strokeWidth={0} className="fill-[var(--color-salsa)] text-[var(--color-salsa)]" />
      ))}
    </span>
  );
}

/** Echte Google-Bewertung als kompakte Trust-Zeile (Sterne + 4,9 von 5 + Anzahl), verlinkt auf
 *  die echte Google-Maps-Seite. Sitewide wiederverwendbar (Hero, Wall of Love, Footer). */
export function GoogleRating({ className }: { className?: string }) {
  const { lang } = useLang();
  const r = GOOGLE_REVIEWS;
  const ratingStr = lang === 'de' ? r.rating.toString().replace('.', ',') : r.rating.toString();
  const of5 = lang === 'de' ? 'von 5' : 'of 5';
  const label = lang === 'de' ? `${r.count} Google-Bewertungen` : `${r.count} Google reviews`;
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        // py-3 -my-3: hebt die Tap-Flaeche der ~20px-Textzeile auf 44px, ohne das Layout
        // der Umgebung zu verschieben (Touch-Sweep 14.08.2026, /fotos-Hero 332x20).
        'group -my-3 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full py-3',
        className,
      )}
    >
      {/* Vierfarbiges Original-G (public/logo/google-g.svg), nicht das einfarbige BrandIcons-G:
          diese Zeile steht auf hellem Papier, dort traegt das Markenlogo in Originalfarbe.
          Das einfarbige GoogleIcon nutzt der Footer, wo currentColor auf Dunkel noetig ist. */}
      <img src="/logo/google-g.svg" alt="Google" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
      <StarRating />
      <span className="text-sm font-bold text-[var(--color-ink)]">
        {ratingStr} {of5}
      </span>
      <span className="text-sm text-[var(--color-ink-muted)] transition-colors group-hover:text-[var(--color-ink)]">
        · {label}
      </span>
    </a>
  );
}

/** Die sichtbare Marke: drei rote Balken im Salsa-Beat (1-2-3). Geteiltes Primitive,
 *  sitewide der Eyebrow-Anker. `size` steuert die Balken-Hoehe (sm fuer Fussnoten). */
export function BeatMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const bars =
    size === 'sm'
      ? ['h-2 w-[2px]', 'h-2.5 w-[2px]', 'h-1.5 w-[2px]']
      : ['h-2.5 w-[3px]', 'h-3.5 w-[3px]', 'h-2 w-[3px]'];
  return (
    <span aria-hidden className={cn('inline-flex items-end gap-[3px]', className)}>
      {bars.map((b, i) => (
        <span key={i} className={cn(b, 'rounded-full bg-[var(--color-salsa)]')} />
      ))}
    </span>
  );
}

/** Geteilter CTA-Pfeil (lucide ArrowRight, size 16, strokeWidth 2). Ein Look sitewide.
 *  `className` nimmt die Hover-Bewegung auf (group-hover:translate-x-0.5). */
export function CtaArrow({ className }: { className?: string }) {
  return <ArrowRight size={16} strokeWidth={2} aria-hidden className={className} />;
}

/* ------------------------------------------------------------------ Link-Stufen (ZWEI, sitewide)
 *
 * Design-Kritik Runde 2, Issue 2 + 3. Zwei Befunde, EINE Ursache:
 *
 *  Issue 2 ("Glow inkonsistent"): der rosa Glow-Halo unter den roten Pills war kein System,
 *  sondern eine Utility, die in 6 Dateien einzeln hineinkopiert wurde. Gemessene Glow-Pixel
 *  je Seite: tanzkurse 28850, events 14396, home 13373, team 12377, salsa 8768 — aber
 *  preise 1893 und heels 1669. Dasselbe Label "Kursplan oeffnen" trug den Halo auf
 *  /tanzkurse und trug ihn auf /preise nicht (Beleg /tmp/slices/z_glowcmp2.jpg).
 *
 *  Issue 3 ("Drei Link-Vokabulare auf einer Seite"): "Salsa Kurse ansehen" war schlichter
 *  schwarzer Fettext ohne Pfeil, ohne Farbe, ohne Unterstrich (Beleg z_link1.jpg) — direkt
 *  neben roten Pfeil-Links und roten Pills. Die wichtigsten Kategorie-Einstiege der Seite
 *  sahen aus wie tote Ueberschriften.
 *
 * Ursache in beiden Faellen: es gab keine Komponente, die "Link" definiert. Jede Seite hat
 * ihre eigene className-Kette gebaut. Darum stehen die Stufen jetzt HIER, genau zwei:
 *
 *   CtaPill  (Stufe 1, primaer)  roter Pill + Pfeil. KEIN Glow — der weiche rosa Fleck lag
 *                                auf hellem Papierton im Weissraum und machte die Kante
 *                                unscharf. Der Zustandswechsel laeuft ueber Farbtiefe
 *                                (salsa #AD1827 -> salsa-700 #8E1320, das sind -8% Luminanz)
 *                                plus eine 1px-Kontur, wie im Kritik-Fix gefordert.
 *   CtaText  (Stufe 2, tertiaer) roter Textlink mit Pfeil und 1px-Unterstrich bei Hover.
 *
 * Alles andere ist abgeschafft. Wer eine dritte Stufe braucht, aendert diese Datei —
 * nicht die Seite. */

/** Stufe 1: der EINE gefuellte CTA. `down` fuer Anker, die auf der Seite nach unten springen. */
export function CtaPill({
  href,
  children,
  className,
  down = false,
  onNight = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  down?: boolean;
  /** Pill auf dunklem Grund (Fokus-Ring hell statt rot). */
  onNight?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const Icon = down ? ArrowDown : ArrowRight;
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full',
        'border border-[var(--color-salsa)] bg-[var(--color-salsa)] px-7 py-3.5',
        'text-base font-semibold text-white',
        'transition-colors duration-[var(--dur-fast)] ease-out hover:border-[var(--color-salsa-700)] hover:bg-[var(--color-salsa-700)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        onNight
          ? 'focus-visible:ring-white focus-visible:ring-offset-[var(--color-surface-dark)]'
          : 'focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-[var(--color-paper-warm)]',
        className,
      )}
      {...rest}
    >
      {children}
      <Icon
        size={18}
        strokeWidth={2.25}
        aria-hidden
        className={cn(
          'transition-transform duration-[var(--dur-fast)] ease-out',
          down ? 'motion-safe:group-hover:translate-y-0.5' : 'motion-safe:group-hover:translate-x-0.5',
        )}
      />
    </a>
  );
}

/** Stufe 2: roter Textlink mit Pfeil, Unterstrich waechst beim Hover. Kein Pill-Padding —
 *  er sitzt auf der Textkante, damit er auf derselben Achse wie Headline und Absatz beginnt. */
export function CtaText({
  href,
  children,
  className,
  down = false,
  onNight = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  down?: boolean;
  onNight?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const Icon = down ? ArrowDown : ArrowRight;
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex min-h-12 items-center gap-1.5 text-base font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        onNight
          ? 'text-white hover:text-[var(--color-script-cream)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-surface-dark)]'
          : 'text-[var(--color-salsa)] hover:text-[var(--color-salsa-700)] focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-[var(--color-paper-warm)]',
        className,
      )}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            'absolute -bottom-0.5 left-0 block h-px w-full',
            't-underline',
            onNight ? 'bg-white' : 'bg-[var(--color-salsa)]',
          )}
        />
      </span>
      <Icon
        size={18}
        strokeWidth={2.25}
        aria-hidden
        className={cn(
          'shrink-0 transition-transform duration-[var(--dur-fast)] ease-out',
          down ? 'motion-safe:group-hover:translate-y-0.5' : 'motion-safe:group-hover:translate-x-0.5',
        )}
      />
    </a>
  );
}

/** WhatsApp-Glyph fuer Kontakt-Links: das ECHTE Markenzeichen (BrandIcons, Simple Icons CC0),
 *  16px, currentColor. Vorher stand hier ein Lucide `MessageCircle` — eine generische
 *  Sprechblase neben dem Wort "WhatsApp". Der Kanal war damit am Icon nicht zu erkennen.
 *  Name bleibt WhatsAppGlyph, damit die bestehenden Kontakt-Links sitewide unveraendert
 *  weiter darauf zeigen. */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return <WhatsAppIcon className={cn('h-4 w-4 shrink-0', className)} />;
}

/** Rotes Takt-Leitmotiv + Label (nutzt BeatMark). Eine Signatur sitewide. */
/** Rotes Takt-Leitmotiv + Label.
 *
 *  Design-Kritik Runde 3, Issue 8 ("Eyebrow-Inflation flacht die Hierarchie ein"): der rote
 *  Takt-Marker markiert eine Kapitelgrenze. Gemessen im gerenderten DOM trugen /kursaufbau
 *  8, /team 7 und /tanzkurse 6 davon — dieselbe Auszeichnung fuer eine Kernsektion wie fuer
 *  "Schritt 1" oder eine Footer-Spalte. Wenn 8 Sektionen gleich laut rufen, ruft keine.
 *
 *  Quote wie beim Script-Akzent (siehe TitleAccent): die ersten DREI Eyebrows pro Seite
 *  behalten den Takt-Marker, alle weiteren laufen als ruhiges Label weiter. Der Text bleibt
 *  immer stehen — er traegt Kontext und ist teils SEO-relevant; nur die Auszeichnung wird
 *  knapp gehalten. Auch das bewusst im Renderer statt in 30 content.ts-Dateien: so kann die
 *  Regel nicht durch eine neue Sektion still zurueckkriechen.
 *
 *  `dark` fuer weisse Headlines auf dunklem Grund. Leerer String -> nichts (Copy-Regel:
 *  nicht jede Sektion braucht einen). */
/* Der Zaehler hier hatte denselben Defekt wie der beim Script-Akzent (siehe TitleAccent):
 * ein Modul-Level-`Map`, das beim Prerender komplett uebersprungen wurde
 * (`typeof window === 'undefined' -> true`) und nach der Hydration nie zuruecksetzte. Damit
 * hing es an der Ladereihenfolge, WELCHE drei Eyebrows den Takt-Marker bekamen — und
 * SSR-HTML und hydrierte Seite widersprachen sich.
 *
 * Der Marker markiert jetzt schlicht jeden Eyebrow, der einen bekommen soll. Die Dosierung
 * ist damit wieder eine Inhalts-Entscheidung an der Sektion (`mark={false}` schaltet ihn ab)
 * statt eines unsichtbaren Zaehlers, den niemand nachvollziehen kann. */
export function Eyebrow({
  children,
  dark = false,
  mark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
  /** false = ruhiges Label ohne roten Takt-Marker. */
  mark?: boolean;
}) {
  const empty = children == null || children === '';
  const marked = !empty && mark;
  if (empty) return null;
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]',
        dark ? 'text-white/70' : 'text-[var(--color-ink-muted)]',
      )}
    >
      {marked ? <BeatMark /> : null}
      {children}
    </p>
  );
}

/** Handgezeichneter, leicht unregelmaessiger Unterstrich in Salsa-Rot. Streckt sich auf Textbreite. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className={cn('block w-full', className)}
      fill="none"
    >
      <path
        d="M2 9.5C30 4.2 58 3.4 92 6.1c20 1.6 41 4.6 62 1.9 14-1.8 28-4.4 42-5.1"
        stroke="var(--color-salsa)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Design-Kritik Runde 3, Issue 6 ("Zwei konkurrierende Rot-Akzent-Mechaniken in identischer
 * Rolle"). Der Befund stimmte, aber die Ursache lag nicht im Inhalt — sie lag in genau
 * diesem Zaehler.
 *
 * Der bisherige Aufbau war ein Modul-Level-`Map`, das pro Pfad mitzaehlte und nur der ERSTEN
 * Instanz das Script gab. Zwei Fehler steckten darin:
 *
 *  1. Beim Prerender lief `typeof window === 'undefined'` -> `return true` fuer JEDE Instanz.
 *     Das ausgelieferte HTML trug darum auf /preise VIER Script-Woerter (Beleg: gemessen im
 *     SSR-HTML vor Hydration, ssr_script=4), obwohl die Regel eines vorsah.
 *  2. Nach der Hydration entschied die Reihenfolge, in der Module das erste Mal rendern —
 *     das `Map` wurde nie zurueckgesetzt. Gemessen ueber fuenf Seiten in einem Browser-Kontext:
 *       /preise         ssr=4  live_script=4  live_boldRed=0
 *       /tanzkurse/heels ssr=3  live_script=0  live_boldRed=3
 *       /tanzkurse/salsa ssr=3  live_script=3  live_boldRed=0
 *       /kontakt        ssr=1  live_script=0  live_boldRed=1
 *     Dieselbe Rolle, dasselbe Bauteil — und trotzdem mal Script, mal fettes Rot, abhaengig
 *     davon, welche Seite vorher geladen war. Genau das hat die Kritik als "zwei konkurrierende
 *     Mechaniken" gesehen: es war nie eine Entscheidung, es war ein Zufallsergebnis.
 *
 * Neu gilt die Regel, die die Kritik verlangt, und zwar explizit statt aus einem Zaehler:
 *
 *   Script-Kursiv  = ausschliesslich das emotionale Schlusswort der SEITEN-H1.
 *                    Genau 1x pro Seite, vom Aufrufer benannt (`script`), nicht implizit
 *                    von der Ladereihenfolge vergeben. Deckt sich mit DESIGN.md:52
 *                    ("Script-Akzent = Alex Brush, genau EINE Stelle").
 *   Rot            = ausschliesslich sachliche Hervorhebung im Fliesstext und in Preisen.
 *                    In H1/H2 fiel es damit weg: das Akzentwort laeuft dort in normaler
 *                    Textfarbe weiter (auf dunklem Grund entsprechend hell). Genau der
 *                    Punkt der Kritik — "alle Bold-Rot-Vorkommen in H1/H2 auf normale
 *                    Textfarbe zuruecksetzen, dann bleibt pro Seite genau ein roter
 *                    Script-Moment stehen".
 *
 * Der Inhalt bleibt dabei unangetastet: die ~100 `titleAccent`-Strings in den content.ts-
 * Dateien stehen weiter da, sie werden nur nicht mehr rot eingefaerbt. Die Regel sitzt im
 * Renderer, damit die naechste neue Sektion sie nicht still brechen kann.
 *
 * Kein Zaehler, kein `useState`, kein SSR/Client-Unterschied -> das prerenderte HTML und die
 * hydrierte Seite zeigen garantiert dasselbe (vorher ein echter Hydration-Mismatch). */
/* Kein `script`-Schalter mehr (Meta-Kritik 2026-08-07). DESIGN.md beschraenkt Alex Brush auf
 * GENAU eine Stelle sitewide — den Hero-Eyebrow "Bailar es vivir" (Home.Hero) — plus die
 * Footer-Ausnahme. Ueber `TitleAccent script` hing die Handschrift aber am H1-Akzentwort JEDER
 * Unterseite (HeroFrame + sechs Seiten mit eigenem Hero) und wurde damit zum wiederkehrenden
 * Seitenmuster statt zur Signatur — sichtbar als "Privatstunden" auf /preise und "suchst" auf
 * /kontakt. Der Schalter ist entfernt statt nur an zwei Stellen ausgeschaltet, damit die naechste
 * neue Seite ihn nicht still zurueckholt. */
export function TitleAccent({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    // Kein Rot in Ueberschriften: das Akzentwort bleibt Teil der Headline-Farbe.
    <span className={cn('font-display font-bold', dark ? 'text-white' : 'text-[var(--color-ink)]')}>
      {children}
    </span>
  );
}

/* Die EINE H2-Groesse sitewide. Zeigt seit S1 (14.08.2026) auf `.type-h2` in
 * src/index.css — vorher stand die Kette hier UND in fuenf Varianten an einzelnen
 * Seiten. Der Name bleibt, damit die 15 Unterseiten unveraendert darauf zeigen. */
export const sectionTitle = 'type-h2 text-[var(--color-ink)]';

export const sectionLead = 'text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg';
