import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type Variants,
} from 'motion/react';
import {
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  EASE_OUT,
  REVEAL_BLUR,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_STAGGER,
  REVEAL_VIEWPORT,
} from '@/lib/motion-tokens';

export {
  EASE_OUT,
  REVEAL_BLUR,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_STAGGER,
} from '@/lib/motion-tokens';

/** Einheitlicher Basistakt: mit klarer Tiefe von unten einblenden, ohne Feder. */
export const VIEWPORT = REVEAL_VIEWPORT;

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function useReveal(opts?: { stagger?: number; distance?: number; duration?: number }) {
  const reduced = useReducedMotion() === true;
  const stagger = reduced ? 0 : (opts?.stagger ?? REVEAL_STAGGER);
  const distance = reduced ? 0 : Math.min(opts?.distance ?? REVEAL_DISTANCE, 32);
  const duration = reduced ? 0.2 : (opts?.duration ?? REVEAL_DURATION);
  const blur = reduced ? 0 : REVEAL_BLUR;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: reduced ? 0 : 0.04 } },
  };
  const item: Variants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      transform: `translate3d(0, ${distance}px, 0)`,
    },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'translate3d(0, 0, 0)',
      transition: { duration, ease: EASE_OUT },
    },
  };

  return { container, item };
}

const SECTION_OFFSET: ['start end', 'end start'] = ['start end', 'end start'];

export function useScrollProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: ref, offset: SECTION_OFFSET });
  const frozen = useTransform(scrollYProgress, () => 0);
  return reduced ? frozen : scrollYProgress;
}

/** Parallax bleibt nur als kaum merkbare Tiefenstaffelung; Lenis steuert die Scrollphysik. */
export function useParallax(ref: RefObject<HTMLElement | null>, distance = 48): MotionValue<number> {
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: ref, offset: SECTION_OFFSET });
  const travel = reduced ? 0 : Math.min(Math.abs(distance) * 0.25, 14);
  return useTransform(scrollYProgress, [0, 1], [travel / 2, -travel / 2]);
}

export type ParallaxStyle = { transform: MotionValue<string> };

export function useParallaxStyle(ref: RefObject<HTMLElement | null>, distance = 48): ParallaxStyle {
  const y = useParallax(ref, distance);
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`;
  return { transform };
}

export type RevealVariant = 'rise' | 'clip' | 'blur';

function revealVariantItem(
  variant: RevealVariant,
  opts: { distance: number; duration: number; delay: number; reduced: boolean },
): Variants {
  const { distance, duration, delay, reduced } = opts;
  const transition = { duration, delay, ease: EASE_OUT };
  const blur = reduced ? 0 : REVEAL_BLUR;

  if (variant === 'clip') {
    return {
      hidden: {
        opacity: 0,
        /* clipPath war der letzte ungated Wert (blur unten hat die Gabel schon):
           bei Reduced Motion zeigt der hidden-Frame sonst einen beschnittenen Streifen. */
        clipPath: reduced ? 'inset(0 0 0 0)' : 'inset(0 0 14% 0)',
        filter: `blur(${blur}px)`,
        transform: `translate3d(0, ${Math.min(distance, 24)}px, 0)`,
      },
      show: {
        opacity: 1,
        clipPath: 'inset(0 0 0 0)',
        filter: 'blur(0px)',
        transform: 'translate3d(0, 0, 0)',
        transition,
      },
    };
  }

  if (variant === 'blur') {
    return {
      hidden: {
        opacity: 0,
        filter: `blur(${blur}px)`,
        transform: `translate3d(0, ${Math.min(distance, 24)}px, 0)`,
      },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        transform: 'translate3d(0, 0, 0)',
        transition,
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      transform: `translate3d(0, ${distance}px, 0)`,
    },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'translate3d(0, 0, 0)',
      transition,
    },
  };
}

export function useRevealVariant(
  variant: RevealVariant = 'rise',
  opts?: { stagger?: number; distance?: number; duration?: number; delay?: number },
) {
  const reduced = useReducedMotion() === true;
  const stagger = reduced ? 0 : (opts?.stagger ?? REVEAL_STAGGER);
  const distance = reduced ? 0 : Math.min(opts?.distance ?? REVEAL_DISTANCE, 32);
  const duration = reduced ? 0.2 : (opts?.duration ?? REVEAL_DURATION);
  const delay = opts?.delay ?? 0;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: reduced ? 0 : 0.04 } },
  };
  const item = revealVariantItem(variant, { distance, duration, delay, reduced });
  return { container, item };
}

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

export type RevealOneProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: RevealVariant;
  delay?: number;
  distance?: number;
  duration?: number;
};

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

export function RiseReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="rise" />;
}

export function ClipReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="clip" />;
}

export function BlurReveal(props: Omit<RevealOneProps, 'variant'>) {
  return <RevealOne {...props} variant="blur" />;
}

export type RevealWordsProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  distance?: number;
  duration?: number;
  instant?: boolean;
  /** R-Scroll: startet die Welle sofort beim Mount (initial/animate) statt auf den
   *  Viewport-Trigger zu warten. Fuer Above-the-fold-H1s der Unterseiten-Heroes:
   *  `instant` waere gar keine Animation, `whileInView` ein spaeter Start. */
  immediate?: boolean;
  /** R206: Rolle im Fold fuer die Seitenwechsel-Choreografie (index.css haengt daran
   *  einen view-transition-name). Muss explizit in den Props stehen: diese Komponente
   *  reicht keine unbekannten Attribute durch, ein `data-fold` an der Aufrufstelle
   *  fiele sonst still weg — und die H1 waere die einzige Fold-Rolle ohne Snapshot. */
  'data-fold'?: string;
};

export function RevealWords({
  text,
  className,
  as: Tag = 'h2',
  stagger = 0.045,
  distance = 18,
  duration = 0.62,
  instant = false,
  immediate = false,
  'data-fold': dataFold,
}: RevealWordsProps) {
  const reduced = useReducedMotion() === true;
  /* R-Scroll-Review (Grok F1/F5): `immediate` bei Reduced Motion == `instant` — gar keine
     Animation. Und im `immediate`-Zweig bleibt die Opacity KONSTANT 1: der hidden-Zustand
     steht im prerenderten HTML (SSR schreibt `initial`), eine ATF-H1 mit opacity:0 wäre
     ohne JS unsichtbar (der R209-Fall). Nur der y-Versatz animiert — der ist ohne JS
     harmlos (Text steht dann 14px tiefer, aber sichtbar). Kein Blur on ATF: ein
     unscharfer Erstframe ist derselbe R209-Fehler, nur weicher. */
  const still = instant || (immediate && reduced);
  const animated = !still;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const wordBlur = reduced || immediate ? 0 : 4;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.04 } },
  };
  const word: Variants = animated
    ? {
        hidden: {
          opacity: immediate ? 1 : 0,
          filter: `blur(${wordBlur}px)`,
          transform: `translate3d(0, ${reduced ? 0 : Math.min(distance, 24)}px, 0)`,
        },
        show: {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'translate3d(0, 0, 0)',
          transition: { duration: reduced ? 0.2 : duration, ease: EASE_OUT },
        },
      }
    : {
        hidden: { opacity: 1, filter: 'blur(0px)', transform: 'translate3d(0, 0, 0)' },
        show: { opacity: 1, filter: 'blur(0px)', transform: 'translate3d(0, 0, 0)' },
      };

  return (
    <Tag className={className} data-reveal data-reveal-variant="letters" data-fold={dataFold}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap gap-x-[0.16em]"
        variants={container}
        initial={still ? 'show' : 'hidden'}
        {...(still
          ? { animate: 'show' }
          : immediate
            ? { animate: 'show' }
            : { whileInView: 'show', viewport: VIEWPORT })}
      >
        {words.map((wordText, index) => (
          <motion.span
            key={`${wordText}-${index}`}
            variants={word}
            className="inline-block min-w-0 whitespace-normal"
          >
            {wordText}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

export function LettersReveal(props: RevealWordsProps) {
  return <RevealWords {...props} />;
}

export function useCountUp(target: number, duration = 0.9) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  /* SSR/Prerender: der Span traegt serverseitig IMMER den Zielwert als Kind (siehe
     CountStat unten) — ohne JS und fuer Crawler steht die richtige Zahl. Der Reset auf 0
     passiert ausschliesslich hier im Effekt (nach der Hydration, nie im Render).
     Wert laeuft per textContent direkt ins DOM statt ueber React-State: setState pro
     rAF-Frame waren ~54 Re-Renders pro Zaehlvorgang. React weiss vom laufenden Wert
     nichts, die Komponente rendert dafuer nie neu. */
  useEffect(() => {
    if (!inView || reduced) return;
    const el = ref.current;
    if (!el) return;
    el.textContent = '0';
    let frame = 0;
    const start = performance.now();
    const milliseconds = duration * 1000;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / milliseconds);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, inView, reduced, target]);

  return { ref };
}

export function CountStat({ value, className }: { value: string; className?: string }) {
  /* R-Scroll: Rules-of-Hooks-Fix. Vorher stand `if (!match) return ...` VOR useCountUp —
     ein Hook nach einem early return. Solange `value` stabil ist, fiel das nie auf, aber
     ein Wechsel von "2018" auf z.B. "Basel" haette die Hook-Reihenfolge zerrissen.
     Der Hook laeuft jetzt IMMER (Fallback-Target 0), der Fallback rendert danach. */
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const { ref } = useCountUp(match ? Number.parseInt(match[2], 10) : 0);
  if (!match) return <span className={className}>{value}</span>;
  const [, prefix, num, suffix] = match;
  /* Der Zahl-Span traegt den Zielwert als Kind (SSR-sichtbar); der Effekt aus useCountUp
     ueberschreibt den textContent beim Hochzaehlen. Prefix/Suffix bleiben eigene Text-
     knoten — textContent nur auf dem Zahl-Span, sonst frisst das Schreiben die Raender. */
  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>{num}</span>
      {suffix}
    </span>
  );
}

/* R-Scroll: das Band laeuft nicht mehr als fixe Keyframe-Animation, sondern per
   useAnimationFrame und koppelt sich leicht an die Scrollgeschwindigkeit: Grundtempo ist
   unveraendert 50% pro `duration` Sekunden, bei schnellem Scrollen steigt der Faktor
   gleitend bis 2.5x (Spring glaettet die rohe px/s-Velocity, sonst zuckt das Band bei
   jedem Lenis-Impuls). 3000 px/s als Normierung: das ist ein zuegiger Flick auf Desktop —
   normales Lesescrollen (~600 px/s) hebt den Faktor nur um ~0.3, bleibt also subtil.
   API (children, className, duration) und der Reduced-Motion-Zweig (statisches
   geclipptes Band, kein rAF) sind unveraendert. */
export function Marquee({
  children,
  className,
  duration = 48,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion() === true;
  const rootRef = useRef<HTMLDivElement>(null);
  /* Review (Grok F2): rAF nur, solange das Band im Viewport steht — offscreen weiterlaufen
     kostet Frames ohne sichtbaren Effekt. margin haelt das Band schon kurz vor Eintritt
     aktiv, damit es nie stehend in den Viewport rutscht. */
  const inView = useInView(rootRef, { margin: '200px 0px' });
  const x = useMotionValue(0);
  /* Perf-Review: Die Kette laeuft auch bei reduced/offscreen weiter — Hooks duerfen nicht
     konditional sein. Das ist bewusst akzeptiert: useVelocity/useSpring rechnen nur,
     solange sich scrollY tatsaechlich aendert (Subscription auf den MotionValue, kein
     eigener rAF-Dauerloop), und im Ruhezustand faellt die Feder auf 0 und schlaeft.
     Ein paar Zahlen-Updates pro Scroll-Frame sind billiger als jede Umbau-Alternative. */
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 40, stiffness: 200 });
  const transform = useMotionTemplate`translate3d(${x}%, 0, 0)`;

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    // Review (Grok F3): delta klemmen — nach Tab-Rueckkehr liefert rAF ein Riesen-Delta,
    // das Band wuerde springen. 48ms = max. ~3 Frames Nachholung, danach normal weiter.
    const dt = Math.min(delta, 48) / 1000;
    // Faktor 1..2.5, richtungsunabhaengig — das Band laeuft immer vorwaerts, nur schneller.
    const factor = 1 + Math.min(Math.abs(smoothVelocity.get()) / 3000, 1) * 1.5;
    const base = 50 / duration; // Prozent pro Sekunde bei Faktor 1
    let next = x.get() - base * factor * dt;
    // Wrap bei -50%: die zweite Kind-Kopie steht dann exakt dort, wo die erste begann.
    // Mit geklemmtem dt ist ein einzelnes += 50 immer ausreichend (Schritt << 50).
    if (next <= -50) next += 50;
    x.set(next);
  });

  /* Reduced: statisches, geclipptes Band statt `overflow-x-auto`. Die Children sind rein
     dekorativ (einziger Nutzer: CommunityBand.tsx, das bei reduced ohnehin auf sein
     3er-Grid wechselt und das Marquee nur im ersten Hydration-Frame zeigt) — ein
     scrollbarer Container unter aria-hidden waere fuer Tastatur fokussierbar, fuer
     Screenreader aber unsichtbar. */
  return (
    <div ref={rootRef} aria-hidden className={`overflow-hidden ${className ?? ''}`}>
      <motion.div className="flex w-max" style={reduced ? undefined : { transform }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}
