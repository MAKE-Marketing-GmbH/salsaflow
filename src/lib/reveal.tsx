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
// Bewusst KEIN Neubau der Motion-Physik: Dauer, Distanz und Easing sind exakt die Werte,
// die `home/motion.tsx` seit dem Geil-Pass faehrt (14px, 0.45s, ease-out [0.22,1,0.36,1]).
// Zwei verschiedene Takte auf derselben Seite waeren schlechter als gar keine Animation.
//
// Drei harte Regeln, die hier eingebaut sind statt an jeder Aufrufstelle wiederholt:
//   1. `prefers-reduced-motion` -> nur Fade, kein Versatz. Nie ganz abschalten (der Inhalt
//      wuerde sonst je nach Systemeinstellung anders erscheinen), aber nie bewegen.
//   2. Vor der Hydration ist der Endzustand der Startzustand. Sonst schreibt der Prerender
//      `opacity: 0` ins ausgelieferte HTML und die Seite ist ohne JavaScript leer.
//   3. `once: true`. Ein Element, das bei jedem Vorbeiscrollen erneut einfliegt, ist der
//      Unterschied zwischen "sexy" und "kompliziert".
//
// `data-reveal` bleibt auf jedem Container: die Screenshot-Werkzeuge des Repos erzwingen
// darueber die Sichtbarkeit, sonst waeren Scroll-Reveal-Shots leer.

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useHydrated } from '@/public/home/motion';

/** Der EINE Easing-Wert der Site (ease-out, kein Bounce — Bounce ist ein AI-Slop-Tell). */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/** Der EINE Viewport-Trigger. -8% laesst den Reveal zuenden, bevor das Element mittig steht;
 *  bei 0% "schwimmt" er sichtbar nach. */
export const REVEAL_VIEWPORT = { once: true, margin: '-8% 0px' } as const;

/** Aus welcher Richtung fliegt das Element ein.
 *  'up' ist der Default und der Normalfall — die anderen drei nur, wenn die Richtung etwas
 *  bedeutet (z. B. eine Bildspalte, die von ihrer Seite hereinkommt). */
export type RevealFrom = 'up' | 'down' | 'left' | 'right';

function offset(from: RevealFrom, distance: number) {
  if (from === 'down') return { y: -distance, x: 0 };
  if (from === 'left') return { x: -distance, y: 0 };
  if (from === 'right') return { x: distance, y: 0 };
  return { y: distance, x: 0 };
}

/** Varianten fuer Gruppe + Kind. Aufrufer, die eigene `motion`-Elemente rendern, ziehen
 *  sich hier Container und Item und behalten die volle Kontrolle ueber das Markup. */
export function useRevealMotion(opts?: {
  stagger?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
}) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const stagger = opts?.stagger ?? 0.07;
  const distance = opts?.distance ?? 14;
  const duration = opts?.duration ?? 0.45;
  const shift = offset(opts?.from ?? 'up', distance);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.03 } },
  };
  const item: Variants = {
    hidden: hydrated
      ? { opacity: 0, x: reduced ? 0 : shift.x, y: reduced ? 0 : shift.y }
      : { opacity: 1, x: 0, y: 0 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduced ? 0.3 : duration, ease: REVEAL_EASE },
    },
  };
  return { container, item, reduced, hydrated };
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
  ...rest
}: {
  children: ReactNode;
  as?: RevealGroupTag;
  stagger?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, 'variants' | 'initial' | 'whileInView' | 'viewport'>) {
  const { container } = useRevealMotion({ stagger, distance, duration, from });
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
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, 'initial' | 'whileInView' | 'viewport' | 'transition'>) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const shift = offset(from ?? 'up', distance ?? 14);
  return (
    <motion.div
      data-reveal
      initial={hydrated ? { opacity: 0, x: reduced ? 0 : shift.x, y: reduced ? 0 : shift.y } : false}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: reduced ? 0.3 : duration ?? 0.45,
        delay: reduced ? 0 : delay,
        ease: REVEAL_EASE,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
