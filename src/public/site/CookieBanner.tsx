// Cookie-/Einwilligungs-Banner (Sitewide-Shell, sitewide.md §8). Schwebende Karte am
// unteren Rand, aufklappbar zu einer Kategorie-Auswahl.
//
// R208 (Raphael 28.08.: «ich will, dass ich das oeffnen kann und einzelne Sachen
// anklicken kann und Themen dazu machen kann»).
//
// WAS SICH GEAENDERT HAT. Vorher konnte die Leiste genau eins: sich wegklicken lassen.
// Ein Satz «Nur noetige Cookies» und ein Knopf «Akzeptieren» — es gab nichts zu
// entscheiden. Jetzt gibt es «Einstellungen», das ein Panel aufklappt, in dem jede
// Kategorie einzeln schaltbar ist.
//
// WELCHE KATEGORIEN — und warum nicht die ueblichen drei. Die Begruendung steht
// ausfuehrlich in src/lib/consent.ts: Analytics und Marketing gibt es auf dieser Seite
// nachweislich nicht (kein gtag/GTM/Pixel im Quelltext, die Datenschutzerklaerung sagt
// es woertlich). Schalter dafuer waeren Schein-Auswahl. Google Maps dagegen laedt heute
// ungefragt und uebertraegt dabei die IP an Google — das ist der eine echte Fall, und
// genau der wird hier schaltbar.
//
// «Nur noetige» steht gleichwertig neben «Alle akzeptieren»: gleiche Groesse, gleiche
// Zeile, gleiches Gewicht. Eine Ablehnung, die schwerer zu finden ist als die Zustimmung,
// ist keine freie Wahl.
//
// SCROLL-VERHALTEN. Die Leiste raeumt sich beim ersten Scroll ab, ohne die Wahl zu
// speichern (CTAs und Footer sollen nie darunter liegen). Das gilt NICHT, solange das
// Panel offen ist — wer gerade Kategorien einstellt, verliert seine Auswahl nicht,
// weil er zum Lesen scrollt.

/* oxlint-disable anti-slop/no-runtime-typeof --
 * Die drei `typeof`-Pruefungen in dieser Datei (IntersectionObserver, MutationObserver,
 * ResizeObserver) sind Feature-Erkennung fuer Browser-APIs, keine Typ-Verengung an einer
 * I/O-Grenze. Beim Server-Rendern existieren diese Konstruktoren nicht; ohne die Pruefung
 * wirft `new IntersectionObserver(...)` und die Seite rendert gar nicht. Es gibt hier keinen
 * Domaenenwert zum Parsen — die Frage ist allein, ob die Laufzeit die API mitbringt. */

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { readConsent, writeConsent, type ConsentState } from '@/lib/consent';
import { cn } from '@/lib/utils';

const COPY = {
  de: {
    text: 'Wir nutzen nur, was die Seite braucht.',
    settings: 'Einstellungen',
    acceptAll: 'Alle akzeptieren',
    necessaryOnly: 'Nur nötige',
    save: 'Auswahl speichern',
    privacy: 'Datenschutz',
    panelTitle: 'Was du erlaubst',
    always: 'Immer aktiv',
    cats: {
      necessary: {
        title: 'Notwendig',
        body: 'Deine Sprachwahl, diese Einwilligung und der Zwischenspeicher der Buchung. Bleibt in deinem Browser.',
      },
      maps: {
        title: 'Google Maps',
        body: 'Zeigt die Karte zu unseren Studios direkt auf der Seite. Dabei erhält Google deine IP-Adresse.',
      },
    },
  },
  en: {
    text: 'We only use what the site needs.',
    settings: 'Settings',
    acceptAll: 'Accept all',
    necessaryOnly: 'Necessary only',
    save: 'Save choice',
    privacy: 'Privacy',
    panelTitle: 'What you allow',
    always: 'Always on',
    cats: {
      necessary: {
        title: 'Necessary',
        body: 'Your language choice, this consent and the booking draft. Stays in your browser.',
      },
      maps: {
        title: 'Google Maps',
        body: 'Shows the map to our studios on the page. Google receives your IP address.',
      },
    },
  },
} as const;

export function CookieBanner({ onVisibleChange }: { onVisibleChange?: (visible: boolean) => void }) {
  const { lang } = useLang();
  const c = COPY[lang];
  const reduced = useReducedMotion() === true;
  const panelId = useId();

  // acknowledged startet true bis Mount-Check (kein Flackern fuer Wiederkehrer).
  const [acknowledged, setAcknowledged] = useState(true);
  const [storageChecked, setStorageChecked] = useState(false);
  const [clearedByScroll, setClearedByScroll] = useState(false);
  const [blockedByDialog, setBlockedByDialog] = useState(false);
  const [open, setOpen] = useState(false);
  /* Die Auswahl im offenen Panel. Erst «Auswahl speichern» schreibt sie fest — wer
     einen Schalter umlegt und dann doch «Alle akzeptieren» drueckt, bekommt alle. */
  const [draftMaps, setDraftMaps] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  /* Das Panel darf den ScrollHandler nicht ausloesen. `openRef` statt `open` im
     Handler, weil der Listener nur einmal registriert wird und sonst den Startwert
     einschliessen wuerde. */
  const openRef = useRef(false);

  // Erst nach dem Mount entscheiden: kein SSR-Mismatch.
  useEffect(() => {
    const consent = readConsent();
    setAcknowledged(consent.decided);
    setDraftMaps(consent.maps);
    setStorageChecked(true);
    if (consent.decided) delete document.documentElement.dataset.cookieNotice;
    else document.documentElement.dataset.cookieNotice = 'needed';
    // Reload/Navigation mitten auf der Seite: Freiraum behalten.
    if (!consent.decided && window.scrollY > 0) setClearedByScroll(true);
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Sitewide: erster Scroll raeumt die Leiste ab, ohne die Wahl zu speichern.
  // CTAs (Gratis Schnupperstunde / Bailar es vivir) und Footer liegen nie darunter.
  useEffect(() => {
    if (acknowledged) return;
    const onScroll = () => {
      // R208: Bei offenem Panel NICHT abraeumen. Das Panel ist hoeher als der
      // Viewport-Rest auf kleinen Geraeten; wer darin liest und dabei scrollt,
      // haette sonst mitten in der Auswahl die ganze Karte verloren.
      if (openRef.current) return;
      if (window.scrollY > 0) setClearedByScroll(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [acknowledged]);

  // Kurze Seiten: Der Footer kann ohne Scroll im Viewport stehen. Erst nach einer kurzen
  // Ruhephase ausblenden. Datenrouten wie /kursplan sind beim ersten Render ebenfalls kurz,
  // wachsen aber direkt danach. Ein sofortiges Ausblenden liess den Hinweis dort nur blitzen.
  useEffect(() => {
    if (acknowledged) return;
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    let clearTimer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(clearTimer);
        if (!entry?.isIntersecting) return;
        clearTimer = window.setTimeout(() => {
          if (openRef.current) return;
          const footerStillVisible = footer.getBoundingClientRect().top < window.innerHeight;
          const pageStillShort = document.documentElement.scrollHeight <= window.innerHeight + 1;
          if (footerStillVisible && pageStillShort) setClearedByScroll(true);
        }, 700);
      },
      { root: null, rootMargin: '0px 0px -48px 0px', threshold: 0 },
    );
    io.observe(footer);
    return () => {
      window.clearTimeout(clearTimer);
      io.disconnect();
    };
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

  // Escape schliesst das Panel (nicht den Banner) — erwartetes Verhalten fuer
  // aufklappbare Flaechen, und der einzige Weg zurueck ohne Maus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Sichtbarkeit nach oben melden (WhatsApp-Float weicht aus).
  useEffect(() => {
    if (!storageChecked) return;
    if (visible) document.documentElement.dataset.cookieNotice = 'needed';
    else delete document.documentElement.dataset.cookieNotice;
    onVisibleChange?.(visible);
    window.dispatchEvent(new CustomEvent('salsaflow-cookie-visibility', { detail: visible }));
  }, [onVisibleChange, storageChecked, visible]);

  // Hoehe messen -> Body-Polster + Bottom-CTAs. Bei unsichtbar IMMER 0.
  //
  // R208: Der ResizeObserver hing schon vorher hier, traegt jetzt aber echte Last —
  // beim Auf- und Zuklappen aendert die Karte ihre Hoehe um mehrere hundert Pixel.
  // Ohne die Messung liefe das Body-Polster (--cookie-banner-height) aus dem Tritt und
  // der WhatsApp-Float saesse im offenen Panel.
  useEffect(() => {
    if (!storageChecked) return;
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
  }, [storageChecked, visible]);

  const commit = (next: ConsentState) => {
    writeConsent(next);
    delete document.documentElement.dataset.cookieNotice;
    setAcknowledged(true);
    setOpen(false);
  };

  const acceptAll = () => commit({ decided: true, maps: true });
  const necessaryOnly = () => commit({ decided: true, maps: false });
  const saveChoice = () => commit({ decided: true, maps: draftMaps });

  if (acknowledged || !visible) return null;

  return (
    <div
      ref={bannerRef}
      role="region"
      data-cookie-banner
      data-cookie-open={open ? 'true' : undefined}
      aria-label={lang === 'de' ? 'Cookie-Hinweis' : 'Cookie notice'}
      // R134/10: Vorher eine randlose Leiste ueber die volle Fensterbreite mit harter
      // Oberkante — sie las sich wie ein Systembanner, nicht wie Teil der Seite. Jetzt
      // eine schwebende Karte: eingerueckt, gerundet wie jede andere Flaeche auf der
      // Seite, mit weichem Schatten statt Trennlinie.
      // Erst ab lg, wenn der WhatsApp-Float tatsächlich sichtbar ist, reserviert der
      // Banner rechts dessen Platz.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5 lg:pr-[10.5rem]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[640px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)]/95 shadow-[0_10px_30px_rgba(17,17,17,0.14)] backdrop-blur-sm">
        {/* Kopfzeile.
            Auf Mobil GESTAPELT, ab sm einzeilig. Der erste Wurf hatte Text,
            «Einstellungen» und «Alle akzeptieren» auch auf 390px in einer Zeile: der
            Satz brach dann auf zwei Zeilen und quetschte sich zwischen die beiden
            Bedienelemente — im Screenshot der engste Punkt der ganzen Seite. Gestapelt
            bekommt der Satz seine Zeile und die beiden Knoepfe ihre; der Knopf wird
            dabei so breit wie die Karte, was auf dem Handy ohnehin das bessere Tap-Ziel
            ist. Ab sm ist genug Platz und die Zeile bleibt wie sie war. */}
        <div className="flex flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:py-2.5 sm:px-5">
          <div className="min-w-0 flex-1 text-xs font-medium leading-snug text-[var(--color-ink)] sm:text-sm">
            <span>{c.text}</span>
            <a
              href="/datenschutz"
              className="ml-1 inline-flex min-h-6 items-center whitespace-nowrap font-semibold text-[var(--color-salsa)] underline underline-offset-2 sm:ml-1.5"
            >
              {c.privacy}
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Der Aufklapp-Knopf. Textknopf statt Icon: «Einstellungen» sagt, was
                passiert; ein Zahnrad oder Chevron allein muesste geraten werden. */}
            <button
              type="button"
              data-testid="cookie-settings"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="t-hover inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-semibold text-[var(--color-ink)] underline underline-offset-2 hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:px-3 sm:text-sm"
            >
              <span className="whitespace-nowrap">{c.settings}</span>
              <ChevronDown
                size={14}
                aria-hidden
                className={cn(
                  'shrink-0 transition-transform duration-[var(--acc-chevron)] ease-[var(--acc-timing)]',
                  open && 'rotate-180',
                )}
              />
            </button>

            <button
              type="button"
              data-testid="cookie-accept"
              onClick={acceptAll}
              // min-h-11 (44px): Tap-Ziel-Richtwert (Critic Runde 7, Item 3).
              className="t-hover min-h-11 flex-1 shrink-0 rounded-full bg-[var(--color-salsa)] px-3 text-sm font-semibold whitespace-nowrap text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:flex-none sm:px-5"
            >
              {c.acceptAll}
            </button>
          </div>
        </div>

        {/* Das Panel. `height: auto` ist die eine geduldete Ausnahme zur
            Nur-transform-und-opacity-Regel: fuer ein Akkordeon gibt es kein
            Transform-Aequivalent (Motion-Doktrin §7). Der Ease-Out und die Dauer
            kommen aus den Akkordeon-Token, die die Seite schon fuer die FAQ nutzt —
            kein zweiter Takt fuer dieselbe Geste. */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={panelId}
              key="panel"
              initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{
                duration: reduced ? 0.15 : 0.25,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--color-line)] px-4 pt-3 pb-4 sm:px-5">
                <p className="text-xs font-semibold tracking-wide text-[var(--color-ink-muted)] uppercase">
                  {c.panelTitle}
                </p>

                <ul className="mt-3 flex flex-col gap-2.5">
                  <CategoryRow
                    title={c.cats.necessary.title}
                    body={c.cats.necessary.body}
                    alwaysLabel={c.always}
                    locked
                    checked
                  />
                  <CategoryRow
                    title={c.cats.maps.title}
                    body={c.cats.maps.body}
                    checked={draftMaps}
                    onChange={setDraftMaps}
                    testId="cookie-cat-maps"
                  />
                </ul>

                {/* «Nur noetige» und «Auswahl speichern» stehen gleichwertig
                    nebeneinander, beide in derselben Groesse wie «Alle akzeptieren»
                    oben. Eine Ablehnung, die kleiner oder versteckter ist als die
                    Zustimmung, ist keine freie Wahl. */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    data-testid="cookie-save"
                    onClick={saveChoice}
                    className="t-hover min-h-11 flex-1 rounded-full bg-[var(--color-salsa)] px-4 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
                  >
                    {c.save}
                  </button>
                  <button
                    type="button"
                    data-testid="cookie-necessary-only"
                    onClick={necessaryOnly}
                    className="t-hover min-h-11 flex-1 rounded-full border border-[var(--color-line)] bg-transparent px-4 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
                  >
                    {c.necessaryOnly}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Eine Kategorie-Zeile. Der Schalter ist eine echte Checkbox mit `sr-only`, kein
 *  div-mit-onClick: so bringt er Tastaturbedienung, Screenreader-Ansage und den
 *  Zusammenhang zwischen Beschriftung und Zustand von sich aus mit. */
function CategoryRow({
  title,
  body,
  checked,
  onChange,
  locked = false,
  alwaysLabel,
  testId,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  locked?: boolean;
  alwaysLabel?: string;
  testId?: string;
}) {
  const box = (
    <span
      aria-hidden
      className={cn(
        'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-[var(--dur-fast)] ease-[var(--motion-out)]',
        checked
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
          : 'border-[var(--color-line)] bg-white text-transparent',
        locked && 'opacity-60',
      )}
    >
      <Check size={13} strokeWidth={3} />
    </span>
  );

  const text = (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-sm font-semibold text-[var(--color-ink)]">{title}</span>
        {locked && alwaysLabel ? (
          <span className="text-[0.6875rem] font-medium text-[var(--color-ink-muted)]">{alwaysLabel}</span>
        ) : null}
      </span>
      <span className="mt-0.5 block text-xs leading-snug text-[var(--color-ink-muted)]">{body}</span>
    </span>
  );

  if (locked) {
    return (
      <li className="flex gap-3 rounded-[var(--radius-chip)] bg-[var(--color-bg-soft)]/60 px-3 py-2.5">
        {box}
        {text}
      </li>
    );
  }

  return (
    <li>
      <label className="group/cat flex cursor-pointer gap-3 rounded-[var(--radius-chip)] px-3 py-2.5 transition-colors duration-[var(--dur-fast)] ease-[var(--motion-out)] hover:bg-[var(--color-bg-soft)]/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-salsa)]">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          data-testid={testId}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        {box}
        {text}
      </label>
    </li>
  );
}
