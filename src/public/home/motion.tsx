// Motion-Bausteine der Startseite (Home-Redesign 2026-07, Motion AN laut INVARIANTS).
// Edle Framer-Motion je Element: Reveal beim Eintritt, Stagger im 4-und-8-Beat, Count-up,
// eine einzige erlaubte Dauer-Schleife (Foto-Marquee). IMMER reduced-motion-Fallback
// (useReducedMotion -> nur Fade, kein Versatz, kein Loop, kein Count-up).
//
// Wichtig fuer die Verify-Schleife: jeder Reveal-Container traegt `data-reveal`. Das
// statische Screenshot-Tool (docs/verify/_tools/shot-static.cjs) erzwingt darueber die
// Sichtbarkeit, sonst waeren Reveal-on-Scroll-Shots leer. Zusaetzlich laeuft das Tool mit
// reducedMotion:'reduce', darum rendern die Elemente ohnehin im Endzustand.
//
// Motion-Tokens folgen dem Design-Vertrag (00-DESIGN-SYSTEM.md Kap. 11): nur transform +
// opacity, Eingang 0.4-0.7s, once:true, Distanzen <= 24px, Easing ease.out [0.22,1,0.36,1].

//
// -------------------------------------------------------------------------------------------
// Ausbau 2026-08-21 (Auftrag "Wo ist meine Scroll-Animation?"). Gemessener Befund davor:
//   grep -rn "useScroll" src/public --include=*.tsx | wc -l  ->  0
//   17x whileInView, jedes davon derselbe Effekt: opacity 0->1 + y 14px, 0.45s, once:true.
// Es gab also keine einzige scroll-GEBUNDENE Bewegung — nur einen einzigen Trigger-Effekt,
// 17 Mal wiederholt. Screenshots 220ms nach jedem Scroll-Sprung zeigten alles fertig stehen.
//
// Dazugekommen sind vier Dinge, alle in dieser Datei, keine neue Abhaengigkeit:
//   1. useParallax     — an useScroll gebunden, laeuft WAEHREND des Scrollens, nicht danach.
//   2. Reveal-Varianten 'rise' | 'clip' | 'blur' | 'letters' — vier unterscheidbare Effekte
//      statt einem. 'rise' bleibt der unveraenderte Default, damit die 23 bestehenden
//      Aufrufstellen ihr Verhalten exakt behalten.
//   3. useScrollProgress — 0..1 fuer eine Sektion, als Andockpunkt fuer andere Pakete.
//   4. useParallaxStyle — die hardware-beschleunigte Fassung von useParallax (siehe unten).
//
// Drei Regeln, die JEDE neue Variante einhaelt (sie sind der Grund, warum die Datei so
// ausfuehrlich kommentiert ist — sie wurden hier schon einmal teuer gelernt):
//
//   A. `prefers-reduced-motion` neutralisiert ALLES. Nur Fade bleibt: kein Versatz, kein
//      Blur, kein clip-path, kein Parallax, kein Wort-Stagger. Nicht "gedaempft", sondern
//      aus. Reduced-Motion-Nutzer bekommen denselben INHALT, nur ohne Bewegung.
//   B. Der `useHydrated`-Haken ist Pflicht, nicht Kuer (siehe Kommentar unten). Jede
//      Variante rendert vor der Hydration ihren ENDZUSTAND. Sonst schreibt der Prerender
//      opacity:0 / clipPath:inset(...100%...) ins HTML und die Seite ist ohne JavaScript leer.
//   C. Nur transform, opacity, filter, clip-path. Nie width/height/top/left — die drei
//      loesen Layout + Paint aus und fallen unter Last aus dem Frame-Budget.
// -------------------------------------------------------------------------------------------

import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Laeuft der Code schon im Browser?
 *
 * Der Grund fuer diesen Haken: Die Reveal-Varianten starten bei `opacity: 0`. Beim Prerender
 * landet dieser Startwert als Inline-Stil im ausgelieferten HTML — auf der Startseite 47 Mal,
 * darunter die H1 und der Haupt-CTA. Wer die Seite ohne JavaScript oeffnet, oder bevor das
 * Bundle da ist, sieht eine leere Flaeche.
 *
 * `useSyncExternalStore` gibt auf dem Server false und im Browser true. Damit rendert der
 * Server den sichtbaren Endzustand, und die Animation zuendet erst nach der Hydration.
 */
const emptySubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
// Geil-Pass 2026-07-07: -8% statt -12%, damit Reveals frueher zuenden und nicht
// mitten im Scroll-Glide "nachschwimmen".
export const VIEWPORT = { once: true, margin: '-8% 0px' } as const;

/** Container- + Item-Varianten, an prefers-reduced-motion gebunden.
 *  container: staggerChildren. item: y-Versatz + Fade (bei reduced nur Fade).
 *  EIN Takt fuer die ganze Seite (Geil-Pass): 14px, 0.45s, Stagger 0.07. */
export function useReveal(opts?: { stagger?: number; distance?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const stagger = opts?.stagger ?? 0.07;
  const distance = opts?.distance ?? 14;
  const duration = opts?.duration ?? 0.45;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.03 } },
  };
  const item: Variants = {
    // Vor der Hydration ist `hidden` der Endzustand. Sonst schreibt der Prerender
    // opacity:0 ins HTML und die Seite bleibt ohne JavaScript leer.
    hidden: hydrated ? { opacity: 0, y: reduced ? 0 : distance } : { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.3 : duration, ease: EASE_OUT } },
  };
  return { container, item, reduced, hydrated };
}

// ============================================================================================
// SCROLL-GEBUNDENE BEWEGUNG
//
// Der Unterschied zu allem darueber: `whileInView` ist ein TRIGGER — es zuendet einmal und
// laeuft dann auf seiner eigenen Uhr ab. `useScroll` ist eine BINDUNG — der Wert haengt an
// der Scroll-Position, bewegt sich mit dem Finger und steht still, wenn der Nutzer stillsteht.
// Genau dieses Zweite hat der Seite gefehlt.
// ============================================================================================

/** Der Standard-Messbereich einer Sektion: 0 = Oberkante betritt den Viewport von unten,
 *  1 = Unterkante verlaesst ihn nach oben. Als Konstante, damit alle Haken hier denselben
 *  Bereich messen und sich Effekte verschiedener Pakete nicht gegeneinander verschieben.
 *
 *  Bewusst KEIN `as const`: `useScroll` erwartet ein veraenderliches Array, ein readonly-Tupel
 *  laesst sich dort nicht zuweisen (TS4104). */
const SECTION_OFFSET: ['start end', 'end start'] = ['start end', 'end start'];

/**
 * Fortschritt einer Sektion als 0..1, gebunden an die Scroll-Position.
 *
 * Der Andockpunkt fuer alles, was "waehrend" statt "beim Eintritt" passieren soll:
 * Fortschrittsbalken, mitlaufende Zahlen, Farbwechsel, ein Bild, das sich mitdreht.
 *
 * Bei reduced-motion gibt der Haken einen eingefrorenen MotionValue auf 0 zurueck — nicht
 * `null`. Der Grund: der Aufrufer soll `useTransform` darauf immer bedingungsfrei aufrufen
 * koennen. Ein Haken, der mal einen Wert und mal nichts liefert, zwingt jede Aufrufstelle in
 * eine Fallunterscheidung, und genau dort wird die Reduced-Motion-Regel dann vergessen.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: SECTION_OFFSET });
  const frozen = useTransform(scrollYProgress, () => 0);
  return reduced ? frozen : scrollYProgress;
}

/**
 * Parallax: das Element wandert langsamer als die Seite.
 *
 * `distance` ist die GESAMTE Wanderstrecke in Pixeln ueber den vollen Durchlauf der Sektion,
 * symmetrisch um die Mitte verteilt (+d/2 beim Eintritt, -d/2 beim Austritt). Bei 48 bewegt
 * sich das Element also 24px nach unten und 24px nach oben — nie mehr als die Haelfte in eine
 * Richtung.
 *
 * Warum das Maximum bei rund 60 liegt: darueber loest sich das Bild sichtbar von seinem
 * Rahmen, man sieht die Kante des Containers durchscheinen und der Effekt kippt von "teuer"
 * nach "Baukasten". 40-60 ist der Bereich, in dem es wirkt, ohne sich zu zeigen.
 *
 * WICHTIG fuer den Aufrufer: das Element braucht Ueberstand, sonst schiebt der Versatz eine
 * leere Kante ins Bild. Bei einem Bild in einer Box mit `overflow-hidden` heisst das:
 * das Bild etwas hoeher machen als die Box (z. B. `h-[calc(100%+60px)] -top-[30px]`).
 */
export function useParallax(ref: RefObject<HTMLElement | null>, distance = 48): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: SECTION_OFFSET });
  const half = reduced ? 0 : distance / 2;
  return useTransform(scrollYProgress, [0, 1], [half, -half]);
}

/** Der Rueckgabetyp von `useParallaxStyle`.
 *
 *  Warum ein eigener Typ statt `CSSProperties`: React kennt `transform` nur als String,
 *  Framer Motion nimmt an derselben Stelle einen `MotionValue<string>` und loest ihn selbst
 *  auf. Ein Cast auf `CSSProperties` waere also eine Luege ueber den Laufzeitwert. Der eigene
 *  Typ beschreibt, was wirklich drin liegt, und passt auf die `style`-Prop jedes
 *  `motion.*`-Elements — genau dort, wo er hingehoert. */
export type ParallaxStyle = { transform: MotionValue<string> };

/**
 * Dieselbe Bewegung wie `useParallax`, aber als fertiger `transform`-String.
 *
 * Der Grund fuer die zweite Fassung: Framer Motions Kurzform-Props (`x`, `y`, `scale`) laufen
 * ueber requestAnimationFrame im Haupt-Thread und sind NICHT hardware-beschleunigt. Bei einem
 * Parallax laeuft die Bewegung ueber die gesamte Sektionshoehe mit — genau waehrend der
 * Browser Bilder dekodiert und Schrift nachlaedt. Der volle `transform`-String geht dagegen
 * auf den Compositor und bleibt glatt, wenn der Haupt-Thread beschaeftigt ist.
 *
 * Fuer Parallax auf Bildern deshalb DIESEN Haken nehmen, nicht `useParallax`:
 *   const style = useParallaxStyle(ref, 56);
 *   <motion.img style={style} ... />
 */
export function useParallaxStyle(ref: RefObject<HTMLElement | null>, distance = 48): ParallaxStyle {
  const y = useParallax(ref, distance);
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`;
  return { transform };
}

// ============================================================================================
// REVEAL-VARIANTEN
//
// Vier Effekte statt einem. Die Zuordnung ist keine Geschmacksfrage, sondern folgt daraus,
// was das Element IST:
//
//   rise    Fliesstext, Listen, alles Uebrige. Der ruhige Default. Unveraendert.
//   clip    Bilder und Karten. Der Inhalt wird aufgedeckt statt eingeblendet — als ob ein
//           Vorhang hochgeht. Wirkt teuer, weil sich das Element nicht bewegt: nur seine
//           sichtbare Flaeche waechst. Genau deshalb funktioniert es auf Fotos, wo ein
//           y-Versatz das Motiv verschiebt und billig aussieht.
//   blur    Ueberschriften. Blur 3->0 plus ein Hauch scale (1.01->1). Der Text bleibt auch
//           im Zwischenbild lesbar und wirkt trotzdem wie ein Scharfstellen.
//   letters Grosse H1/H2. WORT-fuer-Wort, nie Buchstabe fuer Buchstabe.
//
// Warum Woerter und nicht Buchstaben — das ist der teuerste Fehler in dieser Familie von
// Effekten, und er kostet zwei Dinge:
//   1. Umlaute und Ligaturen. Ein deutscher Text pro Buchstabe in <span> zerlegt bricht die
//      Formung; je nach Schrift und Normalisierung reisst es Diakritika vom Grundzeichen.
//      "Tanzschueler" mit echtem Umlaut wird dann zu Grundzeichen plus freistehendem Punktepaar.
//   2. Screenreader. Jeder <span> ist eine eigene Textbox. VoiceOver und NVDA buchstabieren
//      dann "T-a-n-z-s-c-h-u-e-l-e-r" statt das Wort zu sprechen. Bei Woertern bleibt jedes
//      Wort als Einheit stehen, und die Wortgrenzen sind genau da, wo der Screenreader
//      ohnehin trennt.
// ============================================================================================

/** Die drei Element-Effekte. Der vierte Effekt ist `RevealWords`, weil nur diese benannte
 *  Komponente einen String sicher in Woerter teilen kann. Ein generischer ReactNode laesst
 *  sich nicht zerlegen, ohne Markup und Barrierefreiheit zu zerstoeren. */
export type RevealVariant = 'rise' | 'clip' | 'blur';

/** Wie lange ein Element-Effekt laeuft. clip braucht mehr Zeit als rise: dort wandert eine
 *  sichtbare Kante ueber das ganze Element. Unter 0.7s wirkt sie gehetzt statt ruhig. */
const VARIANT_DURATION = {
  rise: 0.45,
  clip: 0.72,
  blur: 0.48,
} satisfies Record<RevealVariant, number>;

/** Wort-Stagger hat eine eigene Dauer, weil er kein generischer Element-Effekt ist. */
const WORD_DURATION = 0.5;

/**
 * Die Item-Variante eines Effekts.
 *
 * `hydrated === false` liefert bei JEDEM Effekt den vollen Endzustand — sichtbar, unverzerrt,
 * ungeclippt. Das ist Regel B oben und der Grund, warum diese Funktion die Fallunterscheidung
 * an genau einer Stelle trifft statt in vier.
 *
 * `reduced === true` liefert reines Fade: kein y, kein Blur, kein scale, kein clip-path.
 * Auch clip faellt auf Fade zurueck — ein wandernder Ausschnitt IST Bewegung, auch wenn sich
 * das Element selbst nicht verschiebt.
 */
function variantItem(
  variant: RevealVariant,
  opts: { reduced: boolean; hydrated: boolean; distance: number; duration: number; delay: number },
): Variants {
  const { reduced, hydrated, distance, duration, delay } = opts;
  const transition = {
    duration: reduced ? 0.3 : duration,
    delay: reduced ? 0 : delay,
    ease: EASE_OUT,
  };

  if (!hydrated) {
    // Vor der Hydration: Endzustand. Alle Eigenschaften explizit neutral, damit kein Rest
    // stehen bleibt, wenn ein Aufrufer die Variante zur Laufzeit wechselt.
    const end = {
      opacity: 1,
      transform: 'none',
      filter: 'blur(0px)',
      clipPath: 'inset(0% 0% 0% 0%)',
    };
    return { hidden: end, show: end };
  }

  if (reduced) {
    return { hidden: { opacity: 0 }, show: { opacity: 1, transition } };
  }

  if (variant === 'clip') {
    return {
      // inset(top right bottom left): 100% unten heisst "von der Unterkante komplett
      // weggeschnitten". Der Vorhang faehrt also nach oben auf.
      hidden: { opacity: 1, clipPath: 'inset(0% 0% 100% 0%)' },
      show: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transition },
    };
  }

  if (variant === 'blur') {
    return {
      // Der Start bleibt lesbar. Ein starker Blur erzeugte im 220-ms-Beleg nur graue
      // Geisterzeilen. 3px plus 1% Skalierung zeigt die Geste ohne Textverlust.
      hidden: { opacity: 0.55, filter: 'blur(3px)', transform: 'scale(1.01)' },
      show: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition },
    };
  }

  return {
    hidden: { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
    show: { opacity: 1, transform: 'translate3d(0, 0px, 0)', transition },
  };
}

/** Container + Item fuer rise, clip oder blur. Die Variantenfassung von `useReveal`.
 *  `useReveal` selbst bleibt unveraendert — 23 Dateien haengen daran. */
export function useRevealVariant(
  variant: RevealVariant = 'rise',
  opts?: { stagger?: number; distance?: number; duration?: number; delay?: number },
) {
  const reduced = useReducedMotion() === true;
  const hydrated = useHydrated();
  const stagger = opts?.stagger ?? 0.07;
  const distance = opts?.distance ?? 14;
  const duration = opts?.duration ?? VARIANT_DURATION[variant];
  const delay = opts?.delay ?? 0;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.03 } },
  };
  const item = variantItem(variant, { reduced, hydrated, distance, duration, delay });
  return { container, item, reduced, hydrated };
}

/** Standard-Reveal-Gruppe (motion.div). Kinder mit `variants={item}` steigen gestaffelt ein.
 *  Diese Schnittstelle bleibt exakt kompatibel; 23 Dateien importieren sie bereits. */
export function Reveal({
  children,
  className,
  id,
  stagger,
  distance,
  role,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  stagger?: number;
  distance?: number;
  /** Landmark-Rolle fuer den Wrapper. Reveal rendert oft das Grid einer Sektion; ein
   *  zusaetzliches div nur fuer die Rolle wuerde dieses Grid brechen. Deshalb reicht
   *  Reveal genau diese zwei ARIA-Props durch — kein Spread, damit nicht beliebige
   *  Attribute still an einem Motion-Wrapper landen. */
  role?: string;
  'aria-label'?: string;
}) {
  const { container } = useReveal({ stagger, distance });
  return (
    <motion.div
      id={id}
      role={role}
      aria-label={ariaLabel}
      data-reveal
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

/** Props eines einzelnen Element-Reveals. Exportiert, damit Aufrufer Wrapper bauen koennen,
 *  ohne die Schnittstelle ein zweites Mal abzuschreiben. */
export type RevealOneProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: RevealVariant;
  delay?: number;
  distance?: number;
  duration?: number;
};

/**
 * Ein einzelnes Element mit rise, clip oder blur, ohne Gruppe drumherum.
 *
 * Fuer den haeufigsten Fall: EIN Bild, EINE Karte, EINE Ueberschrift. Wer eine Gruppe mit
 * Stagger braucht, nimmt `Reveal` als Huelle und `useRevealVariant().item` an den Kindern.
 */
export function RevealOne({
  children,
  className,
  id,
  variant = 'rise',
  delay = 0,
  distance,
  duration,
}: RevealOneProps) {
  const { item } = useRevealVariant(variant, { distance, duration, delay });
  return (
    <motion.div
      id={id}
      data-reveal
      data-reveal-variant={variant}
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

/** Benannte, unverwechselbare Fassungen fuer direkte Nutzung. Jeder Wrapper behaelt
 *  `data-reveal`, weil RevealOne ihn rendert. */
export function RiseReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="rise" />;
}

export function ClipReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="clip" />;
}

export function BlurReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="blur" />;
}

/**
 * Wort-fuer-Wort-Stagger fuer eine grosse Ueberschrift.
 *
 * `text` ist bewusst ein String und kein ReactNode: die Komponente muss an Leerzeichen
 * trennen koennen, und ein beliebiger Kindbaum laesst sich nicht zuverlaessig in Woerter
 * schneiden, ohne fremdes Markup zu zerlegen.
 *
 * Barrierefreiheit: die zerlegte Fassung ist `aria-hidden`, daneben steht der vollstaendige
 * Satz in einer `sr-only`-Kopie. Screenreader lesen damit einen zusammenhaengenden Satz,
 * Augen sehen den Stagger. Ohne diese Kopie liest VoiceOver jedes Wort als eigenen Absatz.
 *
 * Bei reduced-motion faellt die Komponente auf EIN Fade des ganzen Textes zurueck: kein
 * Versatz, kein Blur, kein Stagger.
 */
export type RevealWordsProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  distance?: number;
  duration?: number;
};

export function RevealWords({
  text,
  className,
  as: Tag = 'h2',
  stagger = 0.045,
  distance = 18,
  duration,
}: RevealWordsProps) {
  const reduced = useReducedMotion() === true;
  const hydrated = useHydrated();
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const dur = duration ?? WORD_DURATION;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.02 } },
  };
  const word: Variants = hydrated
    ? {
        hidden: reduced
          ? { opacity: 0 }
          : {
              opacity: 0.72,
              transform: `translate3d(0, ${distance}px, 0)`,
              filter: 'blur(0px)',
            },
        show: reduced
          ? { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }
          : {
              opacity: 1,
              transform: 'translate3d(0, 0px, 0)',
              filter: 'blur(0px)',
              transition: { duration: dur, ease: EASE_OUT },
            },
      }
    : {
        hidden: { opacity: 1, transform: 'none', filter: 'blur(0px)' },
        show: { opacity: 1, transform: 'none', filter: 'blur(0px)' },
      };

  return (
    <Tag className={className} data-reveal data-reveal-variant="letters">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        // inline-flex statt inline: ein reines <span> nimmt keinen transform an, und ohne
        // flex-wrap braechen lange Ueberschriften nicht mehr um.
        className="inline-flex flex-wrap"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        {words.map((w, i) => (
          <motion.span
            // Der Index gehoert hier in den Key: derselbe Text kann dasselbe Wort mehrfach
            // enthalten ("Tanz fuer Tanz"), reine Woerter waeren also keine eindeutigen Keys.
            key={`${w}-${i}`}
            variants={word}
            className="inline-block whitespace-pre"
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Benannter vierter Effekt. Der Name entspricht `rise | clip | blur | letters`; intern
 *  bleibt `RevealWords` als selbsterklaerende API erhalten. */
export function LettersReveal(props: RevealWordsProps) {
  return <RevealWords {...props} />;
}

/** Zaehlt eine Zahl ab Sichtbarkeit hoch (Count-up). Bei reduced sofort Endwert. */
export function useCountUp(target: number, duration = 1.1) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [val, setVal] = useState(reduced ? target : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, duration]);
  return { ref, val };
}

/** Zahlen-Bühne: zeigt einen Prefix (z.B. "~"), zaehlt die Zahl hoch, dann Suffix. */
export function CountStat({ value, className }: { value: string; className?: string }) {
  // Trennt fuehrende Nicht-Ziffern (z.B. "~") von der Zahl. "~40" -> prefix "~", num 40.
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) {
    return <span className={className}>{value}</span>;
  }
  const [, prefix, digits, suffix] = match;
  const { ref, val } = useCountUp(parseInt(digits, 10));
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

/** Foto-Marquee: die EINE erlaubte Dauer-Schleife der Seite. Zwei identische Spuren laufen
 *  nahtlos nach links. Bei reduced-motion steht das Band still (seitlich scrollbar). */
export function Marquee({
  children,
  className,
  duration = 42,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  // Struktur bleibt in beiden Faellen gleich: der Server kennt die Motion-Praeferenz
  // nicht, und ein Struktur-Wechsel beim Hydrieren wirft den ganzen Baum weg (Fehler 418).
  // Ohne Bewegung steht das Band still und laesst sich seitlich scrollen; der doppelte
  // Kinder-Satz bleibt drin, weil er sonst wieder die Knotenzahl aendern wuerde.
  return (
    <div aria-hidden className={`${reduced ? 'overflow-x-auto' : 'overflow-hidden'} ${className ?? ''}`}>
      <motion.div
        className="flex w-max"
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={reduced ? undefined : { duration, ease: 'linear', repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
