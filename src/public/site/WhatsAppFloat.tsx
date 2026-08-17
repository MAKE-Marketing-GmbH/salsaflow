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
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

export function WhatsAppFloat({ raised = false }: { raised?: boolean }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  // Footer sichtbar -> Float weg (Doppel-WhatsApp + Overlap mit Footer-Button vermeiden).
  const [footerInView, setFooterInView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  useEffect(() => {
    const check = () => {
      setDialogOpen(!!document.querySelector('[data-testid="booking-dialog"], [aria-modal="true"]'));
    };
    check();
    const obs =
      typeof MutationObserver !== 'undefined' ? new MutationObserver(check) : null;
    obs?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-testid'],
    });
    return () => obs?.disconnect();
  }, []);

  if (footerInView || dialogOpen) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        // hidden sm:inline-flex: unter sm lag der FAB auf Inhalten (390px /kursplan:
        // Samstag-Kachel verdeckt, Critic 13.08.2026) — der File-Kommentar meinte ihn
        // ohnehin ab Tablet.
        'fixed right-5 z-40 hidden h-14 items-center gap-2 rounded-full px-4 sm:right-6 sm:inline-flex',
        'bg-[var(--color-whatsapp)] text-[var(--color-ink)] shadow-lg shadow-black/15 ring-1 ring-black/10',
        't-hover-move transition-[color,background-color,border-color,transform,opacity,box-shadow,bottom] hover:-translate-y-0.5 hover:bg-[var(--color-whatsapp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)]',
      )}
      // --sticky-cta-height: der mobile Home-CTA-Balken (StickyCta) meldet seine Hoehe,
      // solange er sichtbar ist — der Float sass sonst genau auf dem roten Knopf.
      style={{
        bottom: raised
          ? 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--cookie-banner-height, 0px))'
          : 'calc(1.25rem + var(--sticky-cta-height, 0px))',
      }}
    >
      {/* Echtes WhatsApp-Zeichen im gruenen Kreis (vorher generische Lucide-Sprechblase). */}
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
