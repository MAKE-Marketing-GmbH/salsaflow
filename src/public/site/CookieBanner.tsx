// Cookie-/Recht-Banner (Sitewide-Shell, sitewide.md §8). Kompakte Leiste am unteren Rand.
// Erscheint EINMALIG beim ersten Besuch und merkt die Wahl in localStorage
// ('salsaflow-cookie-ok'). Nach dem ersten Scroll raeumt die Leiste die Inhaltsflaeche
// frei (CTAs/Footer bleiben klickbar); ohne Bestaetigung erscheint sie beim naechsten
// Mount (Route-Wechsel) wieder, solange scrollY === 0. Unter einem offenen Dialog
// (Buchung) ist sie komplett aus dem DOM und nicht klickbar.

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';

const STORAGE_KEY = 'salsaflow-cookie-ok';

const COPY = {
  de: {
    text: 'Nur nötige Cookies.',
    accept: 'Akzeptieren',
    privacy: 'Datenschutz',
  },
  en: {
    text: 'Necessary cookies only.',
    accept: 'Okay',
    privacy: 'Privacy',
  },
} as const;

export function CookieBanner({ onVisibleChange }: { onVisibleChange?: (visible: boolean) => void }) {
  const { lang } = useLang();
  const c = COPY[lang];
  // acknowledged startet true bis Mount-Check (kein Flackern fuer Wiederkehrer).
  const [acknowledged, setAcknowledged] = useState(true);
  const [clearedByScroll, setClearedByScroll] = useState(false);
  const [blockedByDialog, setBlockedByDialog] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Erst nach dem Mount entscheiden: kein SSR-Mismatch.
  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // localStorage kann blockiert sein - dann zeigen wir den Hinweis.
    }
    setAcknowledged(ok);
    // Reload/Navigation mitten auf der Seite: Freiraum behalten.
    if (!ok && window.scrollY > 0) setClearedByScroll(true);
  }, []);

  // Sitewide: erster Scroll raeumt die Leiste ab, ohne die Wahl zu speichern.
  // CTAs (Gratis Schnupperstunde / Bailar es vivir) und Footer liegen nie darunter.
  useEffect(() => {
    if (acknowledged) return;
    const onScroll = () => {
      if (window.scrollY > 0) setClearedByScroll(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [acknowledged]);

  // Kurze Seiten (z.B. /buchung Leer-Tag): Footer ist ohne Scroll im Viewport und
  // wuerde von der fixen Leiste durchschnitten. Sobald der Footer den unteren Rand
  // beruehrt, raeumt die Leiste freiraum.
  useEffect(() => {
    if (acknowledged) return;
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setClearedByScroll(true);
      },
      // Frueh genug, bevor die Leiste Primary-CTAs im Footer schneidet.
      { root: null, rootMargin: '0px 0px -48px 0px', threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [acknowledged]);

  // Buchungs-Dialog (aria-modal): Cookie unter dem Overlay aus dem DOM nehmen.
  useEffect(() => {
    const check = () => {
      setBlockedByDialog(!!document.querySelector('[data-testid="booking-dialog"], [aria-modal="true"]'));
    };
    check();
    const obs =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(check)
        : null;
    obs?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-testid'],
    });
    return () => obs?.disconnect();
  }, []);

  const visible = !acknowledged && !clearedByScroll && !blockedByDialog;

  // Sichtbarkeit nach oben melden (WhatsApp-Float weicht aus).
  useEffect(() => {
    onVisibleChange?.(visible);
    window.dispatchEvent(new CustomEvent('salsaflow-cookie-visibility', { detail: visible }));
  }, [visible, onVisibleChange]);

  // Hoehe messen -> Body-Polster + Bottom-CTAs. Bei unsichtbar IMMER 0.
  useEffect(() => {
    const root = document.documentElement;
    const banner = bannerRef.current;
    if (!visible || !banner) {
      root.style.setProperty('--cookie-banner-height', '0px');
      return;
    }

    const updateHeight = () => {
      root.style.setProperty('--cookie-banner-height', `${banner.getBoundingClientRect().height}px`);
    };
    updateHeight();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    observer?.observe(banner);
    return () => {
      observer?.disconnect();
      root.style.setProperty('--cookie-banner-height', '0px');
    };
  }, [visible]);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Wahl liess sich nicht merken - Banner trotzdem schliessen.
    }
    setAcknowledged(true);
  };

  if (acknowledged || !visible) return null;

  return (
    <div
      ref={bannerRef}
      role="region"
      data-cookie-banner
      aria-label={lang === 'de' ? 'Cookie-Hinweis' : 'Cookie notice'}
      className="fixed inset-x-0 bottom-0 z-40 border-y border-[var(--color-line)] bg-[var(--color-paper-warm)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex min-h-12 w-full max-w-[1080px] items-center gap-2 px-5 py-2 sm:gap-3 sm:px-8">
        <div className="min-w-0 flex-1 whitespace-nowrap text-xs font-medium leading-none text-[var(--color-ink)] sm:text-sm">
          <span>{c.text}</span>
          <a
            href="/datenschutz"
            className="ml-1 whitespace-nowrap font-semibold text-[var(--color-salsa)] underline underline-offset-2 sm:ml-1.5"
          >
            {c.privacy}
          </a>
        </div>
        <button
          type="button"
          data-testid="cookie-accept"
          onClick={accept}
          className="t-hover h-10 min-w-11 shrink-0 rounded-full bg-[var(--color-salsa)] px-3 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:h-9 sm:px-5"
        >
          {c.accept}
        </button>
      </div>
    </div>
  );
}
