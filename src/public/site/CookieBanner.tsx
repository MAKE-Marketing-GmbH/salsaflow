// Cookie-/Recht-Banner (Sitewide-Shell, sitewide.md §8). Kompakte Leiste am unteren Rand.
// Erscheint EINMALIG beim ersten Besuch und merkt die Wahl in localStorage
// ('salsaflow-cookie-ok'). Nach dem ersten Scroll raeumt die Leiste die Inhaltsflaeche
// frei (CTAs/Footer bleiben klickbar); ohne Bestaetigung erscheint sie beim naechsten
// Mount (Route-Wechsel) wieder, solange scrollY === 0. Unter einem offenen Dialog
// (Buchung) ist sie komplett aus dem DOM und nicht klickbar.

/* oxlint-disable anti-slop/no-runtime-typeof --
 * Die drei `typeof`-Pruefungen in dieser Datei (IntersectionObserver, MutationObserver,
 * ResizeObserver) sind Feature-Erkennung fuer Browser-APIs, keine Typ-Verengung an einer
 * I/O-Grenze. Beim Server-Rendern existieren diese Konstruktoren nicht; ohne die Pruefung
 * wirft `new IntersectionObserver(...)` und die Seite rendert gar nicht. Es gibt hier keinen
 * Domaenenwert zum Parsen — die Frage ist allein, ob die Laufzeit die API mitbringt. */

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
      // R134/10: Vorher eine randlose Leiste ueber die volle Fensterbreite mit harter
      // Oberkante — sie las sich wie ein Systembanner, nicht wie Teil der Seite. Jetzt
      // eine schwebende Karte: eingerueckt, gerundet wie jede andere Flaeche auf der
      // Seite, mit weichem Schatten statt Trennlinie. Der Text darf umbrechen
      // (kein whitespace-nowrap mehr), damit auf 390px nichts abgeschnitten wird.
      // R153: Der WhatsApp-Float steht fix unten rechts. Vorher lief die Karte bis an den
      // rechten Fensterrand und der Knopf lag in derselben Zeile darauf. Der Hebel sitzt am
      // Banner-Wrapper, nicht am Float: rechts bleibt eine freie Spalte fuer den Knopf, also
      // liegen Karte und Knopf nebeneinander statt uebereinander. Mobil ist der Float ein
      // Kreis (3.5rem) bei right-5 (1.25rem) plus 0.75rem Luft = 5.5rem. Ab sm ist er eine
      // Pille mit Label «WhatsApp» bei right-6 und braucht mehr: 10.5rem.
      // Kein `left` am Float — der Knopf bleibt sitewide rechts unten im Gutter.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pr-[5.5rem] sm:px-5 sm:pb-5"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[640px] items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)]/95 px-4 py-2.5 shadow-[0_10px_30px_rgba(17,17,17,0.14)] backdrop-blur-sm sm:px-5">
        <div className="min-w-0 flex-1 text-xs font-medium leading-snug text-[var(--color-ink)] sm:text-sm">
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
          // min-h-11 (44px) statt h-10/sm:h-9: Akzeptieren mass 40px, Desktop 36px —
          // unter dem Tap-Ziel-Richtwert (Critic Runde 7, Item 3).
          className="t-hover min-h-11 min-w-11 shrink-0 rounded-full bg-[var(--color-salsa)] px-3 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:px-5"
        >
          {c.accept}
        </button>
      </div>
    </div>
  );
}
