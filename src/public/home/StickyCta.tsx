// Sticky Bottom-CTA (Redesign 08/2026, P3, Masterplan §2.1): erscheint ab 480 px Scroll,
// nur mobil (unter sm). Ersetzt die frueheren vier CTA-Baender im Scroll durch EINEN
// mitlaufenden Knopf.
//
// Stacking-Hinweis: unten konkurrieren Cookie-Banner (z-40, fixed) und WhatsAppFloat
// (z-40, ab sm sichtbar). Dieser Balken liegt bewusst auf z-30 und ist nur unter sm aktiv.
// Sein Bottom-Offset nutzt dieselbe gemessene CSS-Variable wie das globale body-Polster.

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';

export function StickyCta() {
  const { lang } = useLang();
  const cta = HOME[lang].cta;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      data-sticky-cta
      aria-hidden={!show}
      className={`fixed inset-x-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-paper-warm)]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-[opacity,transform] duration-300 motion-reduce:transition-none sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ bottom: 'var(--cookie-banner-height, 0px)' }}
    >
      <a
        href="/kontakt#schnupperstunde"
        tabIndex={show ? 0 : -1}
        className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--color-salsa)] text-base font-semibold text-white transition-colors hover:bg-[var(--color-salsa-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper-warm)]"
      >
        {cta.trial}
      </a>
    </div>
  );
}
