// WhatsApp-Floating-Knopf (Sitewide-Shell, sitewide.md §7). Rundes, fixes Icon unten rechts,
// ab Tablet sichtbar, direkter Draht zu +41 76 478 84 11 (wa.me, neuer Tab). Klein und dezent, damit
// der helle Look ruhig bleibt. Auf Mobile bleibt WhatsApp über Kontakt/Footer erreichbar.
// Liegt z-technisch unter dem Nav-Drawer (z-50), aber über dem
// Seiteninhalt. Wenn der Cookie-Banner offen ist (Prop `raised`), weicht der Knopf nach oben aus,
// damit er das Banner nicht überlappt (z-Order aus sitewide.md §7/§8).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer traegt im
// Entry-CTA-Band einen eigenen WhatsApp-Button, den der Float sonst ueberlappt (Kritiker-
// Befund kursplan d-mid, Runde 10) — gleiche Footer-Beobachtung wie CookieBanner.tsx.

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

export function WhatsAppFloat({ raised = false }: { raised?: boolean }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  // Footer sichtbar -> Float weg (Doppel-WhatsApp + Overlap mit Footer-Button vermeiden).
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterInView(!!entry?.isIntersecting),
      // Frueh genug ausblenden, bevor der Float das Entry-CTA-Band beruehrt.
      { root: null, rootMargin: '0px 0px -48px 0px', threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (footerInView) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        'fixed right-5 z-40 hidden h-12 w-12 items-center justify-center rounded-full sm:inline-flex',
        // Stage 6: kein Fremd-Grün mehr. Marken-konformer Ink-Kreis mit weissem Icon,
        // beim Hover in Salsa-Rot. Erkennbar bleibt WhatsApp über den Glyph, nicht die Farbe.
        'bg-[var(--color-ink)] text-white shadow-lg shadow-black/20 ring-1 ring-white/10',
        'hover:bg-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)]',
        // Position und Hover-Farbe zusammen: vorher lief nur die Position, ohne Dauer und ohne
        // Kurve. Der Knopf sprang die Farbe hart um und rutschte linear hoch.
        'transition-[bottom,background-color] duration-[var(--dur-base)] ease-out',
      )}
      style={{ bottom: raised ? 'calc(1.25rem + var(--cookie-banner-height, 0px))' : '1.25rem' }}
    >
      {/* WhatsApp-Glyph (Vorlage: SiteFooter.tsx), weisser Strich auf Ink-Kreis. */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 21l1.6-4.5A8 8 0 1 1 8 19.5z" />
        <path d="M8.5 8.5c-.3 1 .2 2.3 1.2 3.4s2.4 1.6 3.4 1.3c.5-.1.9-.6.9-1.1l-.1-.9-1.6-.5-.8.7c-.6-.3-1.2-.8-1.5-1.5l.7-.8-.5-1.6-.9-.1c-.5 0-1 .3-1.1.8z" />
      </svg>
    </a>
  );
}
