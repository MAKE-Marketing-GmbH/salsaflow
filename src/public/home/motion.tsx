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

import { motion, useReducedMotion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// Geil-Pass 2026-07-07: -8% statt -12%, damit Reveals frueher zuenden und nicht
// mitten im Scroll-Glide "nachschwimmen".
export const VIEWPORT = { once: true, margin: '-8% 0px' } as const;

/** Container- + Item-Varianten, an prefers-reduced-motion gebunden.
 *  container: staggerChildren. item: y-Versatz + Fade (bei reduced nur Fade).
 *  EIN Takt fuer die ganze Seite (Geil-Pass): 14px, 0.45s, Stagger 0.07. */
export function useReveal(opts?: { stagger?: number; distance?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const stagger = opts?.stagger ?? 0.07;
  const distance = opts?.distance ?? 14;
  const duration = opts?.duration ?? 0.45;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.03 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.3 : duration, ease: EASE_OUT } },
  };
  return { container, item, reduced };
}

/** Standard-Reveal-Gruppe (motion.div). Kinder mit `variants={item}` steigen gestaffelt ein. */
export function Reveal({
  children,
  className,
  id,
  stagger,
  distance,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  stagger?: number;
  distance?: number;
}) {
  const { container } = useReveal({ stagger, distance });
  return (
    <motion.div
      id={id}
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
  if (reduced) {
    return (
      <div aria-hidden className={`overflow-x-auto ${className ?? ''}`}>
        <div className="flex w-max">{children}</div>
      </div>
    );
  }
  return (
    <div aria-hidden className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
