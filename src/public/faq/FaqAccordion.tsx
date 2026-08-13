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

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/public/home/motion';
import type { Faq } from '@/public/subpage/kit';

/** Ein FAQ-Eintrag: Frage (summary) + Antwort (motion-Panel). */
export function FaqItem({ q, a, defaultOpen = false }: Faq & { defaultOpen?: boolean }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Native Toggle-Events synchronisieren den State (Tastatur, Screenreader, Suchmaschinen-
  // Vorab-Text). Das Panel steuert sich selbst ueber AnimatePresence; das details-Attribut
  // `open` bleibt die einzige Wahrheit fuer CSS (group-open:rotate-180) und a11y.
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const onToggle = () => setOpen(el.open);
    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, []);

  return (
    <details ref={detailsRef} open={defaultOpen || undefined} className="group py-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-chip)] py-5 text-left font-display text-lg font-bold leading-snug text-[var(--color-ink)] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4 sm:text-xl [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown
          size={20}
          strokeWidth={2}
          aria-hidden
          className={cn(
            // Gleiche Drehgeschwindigkeit wie der Chevron im mobilen Menue (--acc-chevron).
            'shrink-0 text-[var(--color-salsa)] transition-transform duration-[var(--acc-chevron)] ease-[var(--acc-ease)] group-open:rotate-180',
            reduced && 'transition-none',
          )}
        />
      </summary>
      {/* Bei reduced-motion: Panel sofort da, kein Hoehen-Tween, kein Fade. */}
      {reduced ? (
        open ? <FaqAnswer>{a}</FaqAnswer> : null
      ) : (
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <FaqAnswer>{a}</FaqAnswer>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
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
