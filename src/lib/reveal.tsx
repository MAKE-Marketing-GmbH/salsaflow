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
// Die Motion-Physik folgt exakt `home/motion.tsx`: 44px Weg, 0.78s und eine klare
// Ease-Out-Kurve. Zwei verschiedene Takte auf derselben Seite waeren schlechter als gar
// keine Animation.
//
// Zwei harte Regeln, die hier eingebaut sind statt an jeder Aufrufstelle wiederholt:
//   1. Der Prerender schreibt den Startzustand; `noscript` stellt den Inhalt ohne
//      JavaScript sofort sichtbar.
//   2. `once: true`. Ein Element, das bei jedem Vorbeiscrollen erneut einfliegt, ist der
//      Unterschied zwischen "sexy" und "kompliziert".
//
// `data-reveal` bleibt auf jedem Container: die Screenshot-Werkzeuge des Repos erzwingen
// darueber die Sichtbarkeit, sonst waeren Scroll-Reveal-Shots leer.

import { motion, type Variants } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

/** Der EINE Easing-Wert der Site (ease-out, kein Bounce — Bounce ist ein AI-Slop-Tell). */
export const REVEAL_EASE = [0.23, 1, 0.32, 1] as const;

/** Der EINE Viewport-Trigger. -4% startet den Reveal weich am unteren Bildrand. */
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -4% 0px' } as const;

/** Aus welcher Richtung fliegt das Element ein.
 *  'up' ist der Default und der Normalfall — die anderen drei nur, wenn die Richtung etwas
 *  bedeutet (z. B. eine Bildspalte, die von ihrer Seite hereinkommt). */
export type RevealFrom = 'up' | 'down' | 'left' | 'right';

function revealTransform(from: RevealFrom, distance: number) {
  if (from === 'down') return `translate3d(0, ${-distance}px, 0) scale(0.97)`;
  if (from === 'left') return `translate3d(${-distance}px, 0, 0) scale(0.97)`;
  if (from === 'right') return `translate3d(${distance}px, 0, 0) scale(0.97)`;
  return `translate3d(0, ${distance}px, 0) scale(0.97)`;
}

/** Varianten fuer Gruppe + Kind. Aufrufer, die eigene `motion`-Elemente rendern, ziehen
 *  sich hier Container und Item und behalten die volle Kontrolle ueber das Markup. */
export function useRevealMotion(opts?: {
  stagger?: number;
  distance?: number;
  duration?: number;
  from?: RevealFrom;
}) {
  const stagger = opts?.stagger ?? 0.06;
  const distance = Math.min(opts?.distance ?? 44, 56);
  const duration = opts?.duration ?? 0.78;
  const startTransform = revealTransform(opts?.from ?? 'up', distance);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: {
      opacity: 0,
      transform: startTransform,
    },
    show: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
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
  const startTransform = revealTransform(from ?? 'up', Math.min(distance ?? 44, 56));
  return (
    <motion.div
      data-reveal
      initial={{
        opacity: 0,
        transform: startTransform,
      }}
      whileInView={{ opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: duration ?? 0.78,
        delay,
        ease: REVEAL_EASE,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
