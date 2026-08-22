// Sticky Bottom-CTA (Redesign 08/2026, P3, Masterplan §2.1): nur mobil (unter sm).
// Ersetzt die frueheren vier CTA-Baender im Scroll durch EINEN Knopf. R189: Der Knopf
// erscheint ab 480px nur beim Scrollen NACH OBEN. Beim Lesen nach unten bleibt der Inhalt
// frei; ein fixer Balken lag im echten Zwischenframe ueber dem Text der Angebotskarte.
//
// Stacking-Hinweis: unten konkurrieren Cookie-Banner (z-40, fixed) und WhatsAppFloat
// (z-40, ab sm sichtbar). Dieser Balken liegt bewusst auf z-30 und ist nur unter sm aktiv.
// Sein Bottom-Offset nutzt dieselbe gemessene CSS-Variable wie das globale body-Polster.

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';

export function StickyCta() {
  const { lang } = useLang();
  const cta = HOME[lang].cta;
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Richtungsweg statt einzelnes Event: Smooth-Scroll und spaet ladende Bilder erzeugen
    // kleine Gegenbewegungen. 12px abwaerts blenden sicher aus; erst 48px kumuliert nach
    // oben zeigen echte Rueckkehr-Absicht und holen den CTA zurueck.
    let lastY = window.scrollY;
    let upwardStart: number | null = null;
    let downwardStart: number | null = null;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 480) {
        upwardStart = null;
        downwardStart = null;
        setShow(false);
      } else if (y > lastY) {
        upwardStart = null;
        downwardStart ??= lastY;
        if (y - downwardStart >= 12) setShow(false);
      } else if (y < lastY) {
        downwardStart = null;
        upwardStart ??= lastY;
        if (upwardStart - y >= 48) setShow(true);
      }
      lastY = y;
    };
    setShow(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Gemessene Hoehe als CSS-Variable, solange der Balken sichtbar ist. Der WhatsAppFloat
  // liest sie und weicht nach oben aus — sonst liegt er genau auf dem CTA (gemessen
  // 13.08.2026, /tmp/salsa-ultra/mobile-home-bottom.png). Gleiche Mechanik wie
  // --cookie-banner-height.
  useEffect(() => {
    const root = document.documentElement;
    const apply = () =>
      root.style.setProperty('--sticky-cta-height', show && barRef.current ? `${barRef.current.offsetHeight}px` : '0px');
    apply();
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      root.style.setProperty('--sticky-cta-height', '0px');
    };
  }, [show]);

  return (
    <div
      ref={barRef}
      data-sticky-cta
      aria-hidden={!show}
      className={`fixed inset-x-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-paper-warm)]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-[opacity,transform] duration-[var(--dur-base)] motion-reduce:transition-none sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ bottom: 'var(--cookie-banner-height, 0px)' }}
    >
      {/* Kursplan bleibt die einzige gefuellte rote Hauptaktion (absprachen.md:13).
          Schnupperstunde behaelt die grosse 52px-Klickflaeche, aber weder rote Fuellung
          noch Outline-Pille. So bleibt der Weg sichtbar und klar zweitrangig. */}
      <a
        href="/schnupperstunde"
        tabIndex={show ? 0 : -1}
        className="group inline-flex h-[52px] w-full items-center justify-center gap-2 text-base font-semibold text-[var(--color-salsa)] transition-colors duration-[var(--dur-fast)] hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-inset"
      >
        {cta.trial}
        <ArrowRight
          aria-hidden
          size={18}
          strokeWidth={2.25}
          className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
        />
      </a>
    </div>
  );
}
