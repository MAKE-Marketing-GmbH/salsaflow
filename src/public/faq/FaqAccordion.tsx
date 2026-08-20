// Zugaengliches FAQ-Accordion fuer /faq (Kontakt+FAQ-Builder, Runde 1). Natives
// <details>/<summary> bleibt die Semantik (Tastatur, Screenreader, SEO ohne JS), Framer
// Motion liefert nur die Feder-Hoehe beim Oeffnen/Schliessen. Die EINE Motion-Signatur
// des Repos (EASE_OUT, 14px-Versatz, Reveal-Stagger) gilt auch hier — kein GSAP, kein
// Bounce. prefers-reduced-motion: Oeffnen/Schliessen sofort, ohne Hoehen-Animation
// (useReducedMotion aus framer-motion, kein MatchMedia-Selbstbau).
//
// Warum ein eigener Component statt des geteilten FaqBlock aus subpage/kit.tsx:
// kit.tsx gehoert dem Seiten-Builder-Owner (nicht uns). Der FaqBlock oeffnet nativ
// (kein Height-Tween). Fuer die FAQ-Seite als Kern-Artefakt dieser Runde bauen wir die
// Accordion-Motion hier lokal — gleiche Optik, gleiche Daten (Faq-Typ aus kit), plus
// sanfte Hoehen-Feder. FAQPage-JSON-LD setzt weiterhin FaqPage.tsx selbst (ld-faq).

import { useState, type MouseEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EASE_OUT } from '@/public/home/motion';
import type { Faq } from '@/public/subpage/kit';
import type { FaqLink } from '@/public/faq/content';

/** Ein FAQ-Eintrag: Frage (summary) + Antwort (motion-Panel). */
export function FaqItem({
  q,
  a,
  defaultOpen = false,
  link,
}: Faq & { defaultOpen?: boolean; link?: FaqLink }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);

  // R163/R166: React darf details nicht unkontrolliert zuruecksetzen.
  // Native summary toggled und React rendert ohne open — die Antwort klappt zu.
  // Darum: open={open} und preventDefault auf dem Summary-Klick.
  function onSummaryClick(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    setOpen((was) => !was);
  }

  return (
    <details open={open} className="group py-3">
      <summary
        onClick={onSummaryClick}
        className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 rounded-[var(--radius-chip)] py-6 text-left font-display text-lg font-bold leading-snug text-[var(--color-ink)] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4 sm:text-xl [&::-webkit-details-marker]:hidden"
      >
        {q}
        <ChevronDown
          size={22}
          strokeWidth={2}
          aria-hidden
          // Gleiche Drehgeschwindigkeit wie der Chevron im mobilen Menue (--acc-chevron).
          // motion-safe: statt einer `reduced`-Klasse — die Klasse haengt sonst am
          // JS-Wert von useReducedMotion, den der Server nicht kennt (Hydration-Mismatch).
          // Die CSS-Variante gilt schon im ersten Frame und braucht kein JavaScript.
          className="shrink-0 text-[var(--color-salsa)] motion-safe:transition-transform motion-safe:duration-[var(--acc-chevron)] motion-safe:ease-[var(--acc-ease)] group-open:rotate-180"
        />
      </summary>
      {/* Bei reduced-motion: Panel sofort da, kein Hoehen-Tween, kein Fade.
          WICHTIG: der Baum bleibt in beiden Faellen gleich AUFGEBAUT. Frueher stand hier
          ein Zweig ohne motion.div. Der Server kennt die Motion-Praeferenz nicht und
          rendert immer die Animations-Variante — bei prefers-reduced-motion sah React
          im Browser dann eine andere Struktur, verwarf den ganzen Seitenbaum und rendert
          neu (Fehler 418). Nur die Werte haengen jetzt an `reduced`, nicht die Struktur. */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <FaqAnswer>
              {a}
              {link ? (
                <>
                  {' '}
                  <a href={link.href} className="whitespace-nowrap">
                    {link.label}
                  </a>
                </>
              ) : null}
            </FaqAnswer>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </details>
  );
}

function FaqAnswer({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[68ch] pb-6 pr-8 text-base leading-7 text-[var(--color-ink-muted)] text-pretty [&_a]:font-semibold [&_a]:text-[var(--color-salsa)] [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 hover:[&_a]:text-[var(--color-salsa-700)] [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--color-salsa)]">
      {children}
    </p>
  );
}
