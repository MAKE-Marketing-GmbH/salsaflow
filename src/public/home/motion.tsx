import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
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

/** Einheitlicher Basistakt: sichtbar von unten einblenden, ohne Feder oder Seitenbewegung. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' } as const;

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function endState() {
  return {
    opacity: 1,
    transform: 'none',
    filter: 'blur(0px)',
    clipPath: 'inset(0% 0% 0% 0%)',
  };
}

export function useReveal(opts?: { stagger?: number; distance?: number; duration?: number }) {
  const reduced = useReducedMotion() === true;
  const hydrated = useHydrated();
  const stagger = opts?.stagger ?? 0.055;
  const distance = Math.min(opts?.distance ?? 18, 24);
  const duration = opts?.duration ?? 0.55;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.025 } },
  };
  const item: Variants = hydrated
    ? {
        hidden: reduced ? { opacity: 1 } : { opacity: 0, y: distance },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : duration, ease: EASE_OUT },
        },
      }
    : { hidden: endState(), show: endState() };

  return { container, item, reduced, hydrated };
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
  opts: { reduced: boolean; hydrated: boolean; distance: number; duration: number; delay: number },
): Variants {
  const { reduced, hydrated, distance, duration, delay } = opts;
  if (!hydrated) return { hidden: endState(), show: endState() };
  if (reduced) return { hidden: { opacity: 1 }, show: { opacity: 1 } };

  const transition = { duration, delay, ease: EASE_OUT };
  // Die bisherigen Clip- und Blur-Varianten erzeugten auf kleinen Geräten zusätzliche
  // Compositing-Arbeit und einen uneinheitlichen Takt. Die API-Namen bleiben kompatibel,
  // visuell laufen aber alle Inhalte als derselbe Fade-up aus opacity + transform.
  void variant;
  return {
    hidden: { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
    show: { opacity: 1, transform: 'translate3d(0, 0, 0)', transition },
  };
}

export function useRevealVariant(
  variant: RevealVariant = 'rise',
  opts?: { stagger?: number; distance?: number; duration?: number; delay?: number },
) {
  const reduced = useReducedMotion() === true;
  const hydrated = useHydrated();
  const stagger = opts?.stagger ?? 0.055;
  const distance = Math.min(opts?.distance ?? 18, 24);
  const duration = opts?.duration ?? 0.55;
  const delay = opts?.delay ?? 0;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.025 } },
  };
  const item = revealVariantItem(variant, { reduced, hydrated, distance, duration, delay });
  return { container, item, reduced, hydrated };
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
};

export function RevealWords({
  text,
  className,
  as: Tag = 'h2',
  stagger = 0.03,
  distance = 14,
  duration = 0.5,
  instant = false,
}: RevealWordsProps) {
  const reduced = useReducedMotion() === true;
  const hydrated = useHydrated() && !instant;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.02 } },
  };
  const word: Variants = hydrated
    ? {
        hidden: reduced ? { opacity: 1 } : { opacity: 0, y: Math.min(distance, 20) },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : duration, ease: EASE_OUT },
        },
      }
    : { hidden: endState(), show: endState() };

  return (
    <Tag className={className} data-reveal data-reveal-variant="letters">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap"
        variants={container}
        initial={instant ? 'show' : 'hidden'}
        {...(instant ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT })}
      >
        {words.map((wordText, index) => (
          <motion.span
            key={`${wordText}-${index}`}
            variants={word}
            className="inline-block whitespace-pre"
          >
            {wordText}
            {index < words.length - 1 ? ' ' : ''}
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
  const [val, setVal] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const milliseconds = duration * 1000;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / milliseconds);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, inView, reduced, target]);

  return { ref, val };
}

export function CountStat({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return <span className={className}>{value}</span>;
  const [, prefix, digits, suffix] = match;
  const { ref, val } = useCountUp(Number.parseInt(digits, 10));
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

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
