import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'motion/react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';

/** Einheitlicher Basistakt: mit klarer Tiefe von unten einblenden, ohne Feder. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const VIEWPORT = { once: true, margin: '0px 0px -4% 0px' } as const;

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
  const stagger = reduced ? 0 : (opts?.stagger ?? 0.05);
  const distance = reduced ? 0 : Math.min(opts?.distance ?? 24, 32);
  const duration = reduced ? 0.2 : (opts?.duration ?? 0.48);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: reduced ? 0 : 0.02 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
    show: {
      opacity: 1,
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

  if (variant === 'clip') {
    return {
      hidden: {
        opacity: 0,
        clipPath: 'inset(0 0 14% 0)',
        transform: `translate3d(0, ${Math.min(distance, 24)}px, 0)`,
      },
      show: {
        opacity: 1,
        clipPath: 'inset(0 0 0 0)',
        transform: 'translate3d(0, 0, 0)',
        transition,
      },
    };
  }

  if (variant === 'blur') {
    return {
      hidden: {
        opacity: 0,
        filter: reduced ? 'blur(0)' : 'blur(4px)',
        transform: `translate3d(0, ${Math.min(distance, 24)}px, 0)`,
      },
      show: {
        opacity: 1,
        filter: 'blur(0)',
        transform: 'translate3d(0, 0, 0)',
        transition,
      },
    };
  }

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
  const stagger = reduced ? 0 : (opts?.stagger ?? 0.05);
  const distance = reduced ? 0 : Math.min(opts?.distance ?? 24, 32);
  const duration = reduced ? 0.2 : (opts?.duration ?? 0.48);
  const delay = opts?.delay ?? 0;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: reduced ? 0 : 0.02 } },
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
};

export function RevealWords({
  text,
  className,
  as: Tag = 'h2',
  stagger = 0.035,
  distance = 18,
  duration = 0.42,
  instant = false,
}: RevealWordsProps) {
  const reduced = useReducedMotion() === true;
  const animated = !instant;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.02 } },
  };
  const word: Variants = animated
    ? {
        hidden: {
          opacity: 0,
          transform: `translate3d(0, ${reduced ? 0 : Math.min(distance, 24)}px, 0)`,
        },
        show: {
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          transition: { duration: reduced ? 0.2 : duration, ease: EASE_OUT },
        },
      }
    : {
        hidden: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        show: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      };

  return (
    <Tag className={className} data-reveal data-reveal-variant="letters">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap gap-x-[0.16em]"
        variants={container}
        initial={instant ? 'show' : 'hidden'}
        {...(instant ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT })}
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
