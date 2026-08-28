// R188 / SW1: das EINE wiederverwendbare Reinflieg-Muster der Site.
//
// Warum diese Datei existiert. Das Repo hatte Reveal-Motion schon zweimal, aber beide
// Fassungen liegen unter `src/public/home/` und heissen deshalb "Startseite":
//   - `home/motion.tsx`  Reveal + useReveal (Container/Item mit Stagger)
//   - `home/kit.tsx`     Rise (Einzelelement)
// Jede Unterseite, die eine Reinflieg-Animation wollte, musste damit aus dem Home-Ordner
// importieren oder sich eine dritte Variante tippen. Der Video-Wunsch SW1 ("ueberall
// Animationen, Reinflieg, sexy, nicht kompliziert") ist ein SITEWIDE-Wunsch — also gehoert
// das Muster nach `src/lib`, wo jede Seite es ohne Umweg zieht.
//
// Die Motion-Physik folgt exakt `home/motion.tsx`: 24px Weg, 0.72s, 8px Blur und
// dieselbe Ease-Out-Kurve. Zwei verschiedene Takte auf derselben Seite waeren
// schlechter als gar keine Animation. Reduced Motion behaelt nur Opacity.
//
// Zwei harte Regeln, die hier eingebaut sind statt an jeder Aufrufstelle wiederholt:
//   1. Der Prerender schreibt den Startzustand; `noscript` stellt den Inhalt ohne
//      JavaScript sofort sichtbar.
//   2. `once: true`. Ein Element, das bei jedem Vorbeiscrollen erneut einfliegt, ist der
//      Unterschied zwischen "sexy" und "kompliziert".
//
// `data-reveal` bleibt auf jedem Container: die Screenshot-Werkzeuge des Repos erzwingen
// darueber die Sichtbarkeit, sonst waeren Scroll-Reveal-Shots leer.

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  EASE_OUT,
  REVEAL_BLUR,
  REVEAL_DISTANCE,
  REVEAL_DRIFT,
  REVEAL_DURATION,
  REVEAL_STAGGER,
  REVEAL_VIEWPORT,
} from '@/lib/motion-tokens';

/** Der EINE Easing-Wert der Site (ease-[var(--motion-out)], kein Bounce — Bounce ist ein AI-Slop-Tell). */
export const REVEAL_EASE = EASE_OUT;

export { REVEAL_VIEWPORT };

/** Aus welcher Richtung fliegt das Element ein.
 *  'up' ist der Default und der Normalfall — die anderen drei nur, wenn die Richtung etwas
 *  bedeutet (z. B. eine Bildspalte, die von ihrer Seite hereinkommt). */
export type RevealFrom = 'up' | 'down' | 'left' | 'right';

/** R206: `drift` ist der seitliche Ausholer auf dem Standardweg 'up' — das Element kommt
 *  leicht aus der Seite herein und findet beim Ankommen zur Mitte. Ein Schritt, kein
 *  Nachwippen: die Kurve bleibt dieselbe Ease-Out, es gibt keinen Overshoot.
 *
 *  Nur 'up' bekommt den Drift. Die drei gerichteten Faelle ('down', 'left', 'right')
 *  tragen ihre Richtung bereits als Aussage — eine Bildspalte, die von rechts kommt,
 *  soll geradlinig kommen. Ein zusaetzlicher Querversatz laese sich dort als
 *  Layout-Fehler, nicht als Geste. */
function revealTransform(from: RevealFrom, distance: number, drift = 0) {
  if (from === 'down') return `translate3d(0, ${-distance}px, 0)`;
  if (from === 'left') return `translate3d(${-distance}px, 0, 0)`;
  if (from === 'right') return `translate3d(${distance}px, 0, 0)`;
  return `translate3d(${drift}px, ${distance}px, 0)`;
}

/** Varianten fuer Gruppe + Kind. Aufrufer, die eigene `motion`-Elemente rendern, ziehen
 *  sich hier Container und Item und behalten die volle Kontrolle ueber das Markup. */
export function useRevealMotion(opts?: {
  stagger?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
  /** Seitlicher Ausholer in px. Negativ = aus der linken Seite. Default: kein Drift —
   *  eine Gruppe entscheidet selbst, ob ihre Kinder eine Richtung tragen sollen. */
  drift?: number;
}) {
  const reduced = useReducedMotion() === true;
  const stagger = reduced ? 0 : (opts?.stagger ?? REVEAL_STAGGER);
  const distance = reduced ? 0 : Math.min(opts?.distance ?? REVEAL_DISTANCE, 32);
  const duration = reduced ? 0.2 : (opts?.duration ?? REVEAL_DURATION);
  const blur = reduced ? 0 : REVEAL_BLUR;
  const drift = reduced ? 0 : (opts?.drift ?? 0);
  const startTransform = revealTransform(opts?.from ?? 'up', distance, drift);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: reduced ? 0 : 0.04 } },
  };
  const item: Variants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      transform: startTransform,
    },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'translate3d(0, 0, 0)',
      transition: { duration, ease: REVEAL_EASE },
    },
  };
  return { container, item };
}

/** Welches Element die Gruppe rendert.
 *  Der Grund fuer diese Wahl statt eines festen <div>: eine Liste muss ihre <li> als DIREKTE
 *  Kinder behalten. Ein Wrapper-<div> zwischen <ol> und <li> ist fuer Screenreader keine
 *  Liste mehr — die Ansage "Liste mit 5 Eintraegen" faellt weg. Darum kann die Gruppe selbst
 *  die Liste sein. */
const GROUP_TAG = {
  div: motion.div,
  ol: motion.ol,
  ul: motion.ul,
  section: motion.section,
};

export type RevealGroupTag = keyof typeof GROUP_TAG;

/** Gruppe: die Kinder mit `variants={item}` steigen nacheinander ein.
 *
 *  Die Props sind bewusst an `motion.div` typisiert, obwohl `as` auch ol/ul/section zulaesst.
 *  Der Grund: die vier Motion-Komponenten haben je einen anderen Event-Handler-Typ
 *  (`ClipboardEventHandler<HTMLOListElement>` gegen `...<HTMLDivElement>`), eine Union daraus
 *  loest zu `never` auf und macht die Komponente unbenutzbar. Praktisch relevant ist nur die
 *  Schnittmenge — className, style, id, aria-*, data-* — und die ist bei allen vier gleich.
 *  Der Cast liegt deshalb an genau EINER Stelle hier drin statt an jeder Aufrufstelle. */
export function RevealGroup({
  children,
  as = 'div',
  stagger,
  distance,
  duration,
  from,
  drift = REVEAL_DRIFT,
  ...rest
}: {
  children: ReactNode;
  as?: RevealGroupTag;
  stagger?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
  /** R206: seitlicher Ausholer der Kinder. Gruppen tragen ihn per Default — genau hier
   *  wird «Element fuer Element» sichtbar, weil mehrere Kinder nacheinander aus derselben
   *  Seite hereinkommen. Auf 0 setzen, wenn eine Gruppe geradlinig kommen soll. */
  drift?: number;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, 'variants' | 'initial' | 'whileInView' | 'viewport'>) {
  const { container } = useRevealMotion({ stagger, distance, duration, from, drift });
  // SAFETY: `as` ist auf die vier Schluessel von GROUP_TAG begrenzt (RevealGroupTag), der
  // Zugriff kann also nicht undefined liefern. Alle vier sind Motion-Komponenten mit
  // identischer Prop-Schnittmenge; abweichend sind nur die Event-Handler-Elementtypen, und
  // diese Komponente reicht keinen Event-Handler durch, sondern ausschliesslich className,
  // Motion-Props und data-/aria-Attribute.
  const Tag = GROUP_TAG[as] as typeof motion.div;
  return (
    <Tag
      data-reveal
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Einzelnes Element. Fuer den haeufigsten Fall: ein Block, der beim Scrollen hereinkommt. */
export function RevealItem({
  children,
  delay = 0,
  distance,
  duration,
  from,
  drift = 0,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
  /** R206: seitlicher Ausholer. Anders als bei `RevealGroup` ist der Default hier 0.
   *  Ein einzelnes Element hat keinen Nachbarn, gegen den sich der Versatz liest — er
   *  wirkt dann wie ein verrutschtes Layout statt wie eine Geste. Opt-in fuer Faelle,
   *  in denen mehrere RevealItems bewusst als Reihe gesetzt sind. */
  drift?: number;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, 'initial' | 'whileInView' | 'viewport' | 'transition'>) {
  const reduced = useReducedMotion() === true;
  const startTransform = revealTransform(
    from ?? 'up',
    reduced ? 0 : Math.min(distance ?? REVEAL_DISTANCE, 32),
    reduced ? 0 : drift,
  );
  const blur = reduced ? 0 : REVEAL_BLUR;
  return (
    <motion.div
      data-reveal
      initial={{
        opacity: 0,
        filter: `blur(${blur}px)`,
        transform: startTransform,
      }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', transform: 'translate3d(0, 0, 0)' }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: reduced ? 0.2 : (duration ?? REVEAL_DURATION),
        delay,
        ease: REVEAL_EASE,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
