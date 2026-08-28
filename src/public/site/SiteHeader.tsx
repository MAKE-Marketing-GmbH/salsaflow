// Fixe Navbar (Non-Overlay, Regel 062). EINE umrandete Leiste (Raphael 2026-07-05): solider
// Cream-Balken mit Rahmen, sitzt gut auf hellem UND dunklem Sektions-Hintergrund. Logo (Wordmark),
// datengetriebene Navigation mit drei Dropdowns (Tanzkurse, Events, Mehr) fuer die volle
// V3-Copyplan-Struktur (24 Seiten), DE/EN-Toggle und rote Schnupper-CTA in der Leiste.
// Keine Animationen (statisch). Pfeile/Chevrons via Lucide.

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Languages, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';

type Leaf = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: Leaf[] };

// Das Vollbild-Menü blendet in 240 ms aus. Der kleine Puffer stellt sicher, dass der
// Browser erst danach den dokumentübergreifenden View-Transition-Snapshot aufnimmt.
const MOBILE_MENU_EXIT_MS = 260;

export function SiteHeader() {
  const { lang, setLang } = useLang();
  const c = HOME[lang];
  const de = lang === 'de';
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [pathname, setPathname] = useState('');
  const [hidden, setHidden] = useState(false);
  /* Der Glas-Zustand (transparente Pille auf dunklem Foto) ist mit Runde 3, Issue 2
   * entfallen: der Home-Hero traegt seinen Titelblock jetzt auf Papier statt auf einem
   * abgedunkelten Bild (siehe home/Hero.tsx). Damit gibt es sitewide keine Flaeche mehr,
   * auf der die Leiste dunkel unterlegt waere — sie ist ueberall der solide Cream-Balken,
   * also genau der in INVARIANTS festgehaltene Normalzustand ("Header komplett umrandet",
   * Raphael 2026-07-05). Der fruehere `overHero`-Zustand samt Scroll-Listener und
   * Weiss-Logo-Variante ist hier ersatzlos raus, statt als toter Pfad liegen zu bleiben. */
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<number | undefined>(undefined);
  const mobileGroupRefs = useRef(new Map<string, HTMLButtonElement>());
  const subnavBackRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setOpenGroup(null);
    menuButtonRef.current?.focus();
  }, []);

  const navigateAfterMobileMenu = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!open || event.defaultPrevented) return;

      const opensElsewhere =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.currentTarget.target === '_blank' ||
        event.currentTarget.hasAttribute('download');

      if (opensElsewhere) {
        closeMenu();
        return;
      }

      event.preventDefault();
      const href = event.currentTarget.href;
      setOpen(false);
      setOpenGroup(null);
      window.clearTimeout(navigationTimerRef.current);

      const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : MOBILE_MENU_EXIT_MS;
      navigationTimerRef.current = window.setTimeout(() => window.location.assign(href), delay);
    },
    [closeMenu, open],
  );

  useEffect(() => () => window.clearTimeout(navigationTimerRef.current), []);

  const openMobileGroup = (label: string) => {
    setOpenGroup(label);
    window.requestAnimationFrame(() => subnavBackRef.current?.focus());
  };

  const closeMobileGroup = () => {
    const label = openGroup;
    setOpenGroup(null);
    window.requestAnimationFrame(() => {
      if (label) mobileGroupRefs.current.get(label)?.focus();
    });
  };

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const isolationTargets = [
      ...document.querySelectorAll<HTMLElement>(
        'main, footer, [data-cookie-banner], [data-sticky-cta], a.whatsapp-float',
      ),
    ].filter((element) => !headerRef.current?.contains(element));
    const previousInert = isolationTargets.map((element) => element.inert);

    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    isolationTargets.forEach((element) => {
      element.inert = true;
    });

    const focusables = () =>
      [...(menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [])].filter(
        (element) =>
          element.getClientRects().length > 0 &&
          !element.closest('[inert]') &&
          element.getAttribute('aria-hidden') !== 'true',
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      isolationTargets.forEach((element, index) => {
        element.inert = previousInert[index] ?? false;
      });
      window.scrollTo(0, scrollY);
    };
  }, [closeMenu, open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    const closeAtDesktop = () => {
      if (!desktop.matches) return;
      setOpen(false);
      setOpenGroup(null);
    };
    closeAtDesktop();
    desktop.addEventListener('change', closeAtDesktop);
    return () => desktop.removeEventListener('change', closeAtDesktop);
  }, []);

  useEffect(() => {
    /* `lastY` wird NUR nachgefuehrt, wenn eine Schwelle tatsaechlich gerissen ist.
       Sonst misst der Vergleich den Zuwachs seit dem letzten Frame statt der
       zurueckgelegten Strecke — unter Lenis (lerp 0.075) bleibt jedes Frame-Delta
       weit unter 24px, und der Header blendete nie aus. */
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      if (y < 24 || open || headerRef.current?.contains(document.activeElement)) {
        setHidden(false);
        lastY = y;
      } else if (y > lastY + 24) {
        setHidden(true);
        lastY = y;
      } else if (y < lastY - 24) {
        setHidden(false);
        lastY = y;
      }
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const showOnFocus = () => setHidden(false);
    header.addEventListener('focusin', showOnFocus);
    return () => header.removeEventListener('focusin', showOnFocus);
  }, []);

  // Volle Navigation (V3-Copyplan): drei Dropdown-Gruppen + Leaf-Links.
  const nav: NavItem[] = [
    {
      label: c.nav.tanzkurse,
      href: '/tanzkurse',
      children: [
        { label: de ? 'Übersicht' : 'Overview', href: '/tanzkurse' },
        { label: 'Salsa', href: '/tanzkurse/salsa' },
        { label: 'Bachata', href: '/tanzkurse/bachata' },
        { label: 'Heels', href: '/tanzkurse/heels' },
        { label: de ? 'Privatstunden' : 'Private lessons', href: '/privatstunden' },
        { label: de ? 'Kursaufbau' : 'Course levels', href: '/kursaufbau' },
        // Preise NICHT mehr hier: der Eintrag lebt top-level (unten) — doppelt gefuehrt
        // trugen auf /preise Tanzkurse UND Preise den Current-Strich (Critic Runde 10, Item 4).
      ],
    },
    { label: c.nav.kursplan, href: '/kursplan' },
    // Preise zusaetzlich top-level: der Preis ist eine Top-3-Frage vor jeder Anmeldung,
    // versteckt im Tanzkurse-Dropdown brauchte er mobil zwei Taps (UX-Audit 13.08.2026).
    { label: de ? 'Preise' : 'Prices', href: '/preise' },
    {
      label: c.nav.events,
      href: '/events',
      children: [
        { label: de ? 'Übersicht' : 'Overview', href: '/events' },
        { label: 'Danceflow Night', href: '/events-workshops/danceflow-night' },
        { label: 'Anniversary Weekend', href: '/events-workshops/anniversary-weekend' },
        { label: 'Floweekend', href: '/events-workshops/floweekend' },
        { label: de ? 'Eventkalender' : 'Event calendar', href: '/events-workshops/eventkalender' },
        { label: de ? 'Shows & Animationen' : 'Shows & animation', href: '/shows-animationen' },
      ],
    },
    { label: c.nav.team, href: '/team' },
    { label: c.nav.fotos, href: '/fotos' },
    {
      // Raphael 17.08.: Mehr ist nur ein Dropdown. Keine Übersicht, kein /mehr-Hub.
      label: c.nav.mehr,
      children: [
        { label: c.nav.faq, href: '/faq' },
        { label: c.nav.collabs, href: '/mehr/collabs' },
        { label: c.nav.tanzschuhe, href: '/mehr/tanzschuhe' },
        { label: c.nav.partys, href: '/mehr/partys' },
      ],
    },
    { label: c.nav.kontakt, href: '/kontakt' },
  ];

  const leafActive = (href: string) => pathname === href;
  const groupActive = (item: NavItem) =>
    !!item.children &&
    ((item.href !== undefined && pathname === item.href) ||
      item.children.some((ch) => ch.href !== '/' && pathname.startsWith(ch.href.split('?')[0])) ||
      (item.href !== undefined && pathname.startsWith(item.href + '/')));

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 isolate bg-[var(--color-paper-warm)] will-change-transform transition-transform duration-[var(--dur-slow)] ease-[var(--motion-out)] motion-reduce:transition-none"
      style={{
        height: 'var(--nav-h)',
        transform: hidden && !open ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <SkipLink label={de ? 'Zum Inhalt springen' : 'Skip to content'} />
      {/* Aussenpadding so gesetzt, dass Pillen-Border (1px) + Innenpadding (pl-3.5 / sm:pl-4)
          das Logo GENAU auf die Textkante der Shell legt: 6+1+14 = 21px mobil (Shell px-5 = 20),
          16+1+16 = 33px ab sm (Shell px-8 = 32). Vorher 10/20 -> Logo lag 4-5px rechts der H1. */}
      {/* py statt pt: die Pille hatte oben 9px/10px Abstand und unten keinen — sie sass
          sichtbar zu hoch in der 76px-Leiste. Oben und unten jetzt gleich. */}
      {/* Raphael 23.08. 16:40, Punkt 4: das offene Menue darf keine Creme-Karte im Hero
          sein (Container im Container), und Hero-CTAs/WhatsApp duerfen nicht darunter
          bzw. darueber liegen. Offen wird die Leiste darum full-bleed: kein Aussen-
          Padding, keine Rundung, und das Panel fuellt den ganzen Viewport (unten). */}
      {/* Der View-Transition-Snapshot haengt hier, nicht am <header>: dort laufen der
          Auto-Hide-Transform und die Snapshot-Animation sonst auf demselben Knoten und
          der neue Header faehrt aus der versteckten Position ein. */}
      <div
        data-page-header
        className={cn('mx-auto max-w-[1400px]', open ? 'px-0 py-0' : 'px-[5px] py-[9px] sm:px-[15px] sm:py-[10px]')}
      >
        {/* ROOT-CAUSE des bekannten Dropdown-Bugs, gemessen mit scripts/nav-probe.cjs:
            Das Desktop-Submenu ging immer auf (`opacity: 1`, `visibility: visible`), wurde
            aber von GENAU dieser Pille abgeschnitten. Sie traegt `overflow-hidden` (noetig
            fuers Mobile-Akkordeon) und ist nur 58px hoch — das Panel rendert bei y=110,
            der Clipper endet bei y=68. Playwright klickte trotzdem durch (kein
            pointer-events:none), ein Mensch sah nur einen 8px-Streifen und traf nichts.
            Darum galt Hover als "unzuverlaessig": es war nie der Hover, es war der Clip.
            Ab `lg` (= dort wo die Dropdowns existieren) also `overflow-visible`. Auf Mobil
            bleibt die Regel, und das Akkordeon clippt ohnehin selbst ueber
            `.t-acc-panel-inner { overflow: hidden }` (index.css:189-191). */}
        <div
          ref={menuRef}
          data-open={open}
          /* `/95` + `backdrop-blur` sind fuer die 58px-Leiste richtig (Inhalt schimmert leicht
             durch, wirkt leicht). Sobald das Mobile-Menu offen ist, ist dieselbe Flaeche aber
             546px hoch (gemessen) — dann las man den Seitentext als Schleier quer durch die
             Navigation. Offen darum deckend und ohne Blur. Betrifft nur Mobil: `open` steuert
             ausschliesslich das Burger-Menu, der Burger ist `lg:hidden`. */
          className="t-acc w-full overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] text-[var(--color-ink)] shadow-[0_8px_28px_rgba(17,17,17,0.1)] data-[open=true]:overflow-visible data-[open=true]:rounded-none data-[open=true]:border-transparent data-[open=true]:shadow-none lg:overflow-visible lg:rounded-full"
        >
          <div className="t-acc-head h-12 gap-3 pl-3.5 pr-1.5 sm:h-14 sm:gap-4 sm:pl-4 sm:pr-3">
          <a
            href="/"
            onClick={navigateAfterMobileMenu}
            className="flex min-h-11 shrink-0 items-center"
            aria-label={de ? 'Salsaflow Dance Company - Startseite' : 'Salsaflow Dance Company - Home'}
          >
            {/* Immer die dunkle Wortmarke: die Leiste sitzt sitewide auf Cream (die weisse
                Variante gehoerte zum entfallenen Glas-Zustand auf dem dunklen Hero-Foto). */}
            <img
              src="/logo/salsaflow-wordmark.png"
              alt="Salsaflow Dance Company"
              className="h-[1.65rem] w-auto sm:h-7"
              width={153}
              height={70}
            />
          </a>

          {/* Desktop-Navigation, inline in der Leiste */}
          <nav className="hidden items-center gap-x-3.5 lg:flex xl:gap-x-4" aria-label={de ? 'Hauptnavigation' : 'Main navigation'}>
            {nav.map((item) =>
              item.children ? (
                <DesktopDropdown key={item.label} item={item} active={groupActive(item)} pathname={pathname} />
              ) : item.href ? (
                <DesktopLink key={item.href} item={{ label: item.label, href: item.href }} active={leafActive(item.href)} />
              ) : null,
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            {/* Raphael 20.08.: der Kursplan ist die wichtigste Aktion, die Schnupperstunde
                gehoert in den Hintergrund. Die gefuellte rote Pille traegt darum den
                Kursplan. Vorher stand hier die Schnupperstunde — zusammen mit der
                Hero-Pille waren das ZWEI gefuellte Rote, die um denselben Blick kaempften.
                Jetzt gibt es im Header/Hero-System genau einen gefuellten CTA.
                Die Schnupperstunde bleibt als ruhiger Textlink erreichbar.
                min-h-11: beide Ziele halten 44px Trefferflaeche (Critic Runde 7, Item 5). */}
            <a
              href="/schnupperstunde"
              className="hidden min-h-11 items-center text-sm font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] lg:inline-flex"
            >
              {c.cta.trial}
            </a>
            <a
              href="/kursplan"
              className="hidden min-h-11 items-center gap-1.5 rounded-full border border-[var(--color-salsa)] bg-[var(--color-salsa)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-[var(--color-salsa-700)] hover:bg-[var(--color-salsa-700)] sm:inline-flex sm:px-4"
            >
              {c.cta.plan}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
            </a>
            {/* Raphael 23.08. 16:40, Punkt 1: der Knopf traegt KEINEN Kasten — kein
                Border, keine weisse Pille, kein Schatten. Offen steht nur das X
                (ohne Text), zu der Burger mit "Menü". min-h/min-w-11 halten das
                44px-Tap-Ziel ohne sichtbare Flaeche. */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? (de ? 'Menü schliessen' : 'Close menu') : de ? 'Menü' : 'Menu'}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-2 text-[var(--color-ink)] lg:hidden"
            >
              {open ? (
                <X size={22} strokeWidth={2} aria-hidden />
              ) : (
                <>
                  <Menu size={20} strokeWidth={2} aria-hidden />
                  <span className="text-xs font-semibold">{de ? 'Menü' : 'Menu'}</span>
                </>
              )}
            </button>
          </div>
          </div>

          {/* Mobile Navigation (Raphael 23.08. 16:40): das Panel fuellt den Viewport
              (Punkt 4 — nichts vom Hero scheint mehr darunter, WhatsApp/Sticky-CTA auf
              z-30/40 liegen unter der z-50-Flaeche). Untermenues oeffnen NACH RECHTS als
              zweite Ebene (Punkt 3), nicht mehr als Akkordeon nach unten — die Menuehoehe
              bleibt konstant. Unterpunkte stehen auf derselben Kante wie die Hauptpunkte,
              ohne Einrueckung und ohne Border-Schiene (Punkt 2). */}
          <div
          id="mobile-navigation"
          data-mobile-menu-panel
          aria-hidden={!open}
          inert={!open}
          aria-label={de ? 'Mobile Navigation' : 'Mobile navigation'}
          className="t-acc-panel lg:hidden"
          >
            <div className="t-acc-panel-inner">
          <div className="relative h-[calc(100dvh-3rem)] overflow-hidden border-t border-[var(--color-line)] sm:h-[calc(100dvh-3.5rem)]">
            {/* Ebene 1: Hauptpunkte. Bei offener Gruppe schiebt sie nach links raus. */}
            <nav
              data-mobile-menu-primary
              aria-label={de ? 'Mobile Navigation' : 'Mobile navigation'}
              aria-hidden={openGroup !== null}
              inert={openGroup !== null}
              className={cn(
                'flex h-full flex-col gap-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-3 transition-transform duration-[var(--dur-base)] ease-[var(--motion-out)] motion-reduce:transition-none sm:px-6',
                openGroup !== null ? '-translate-x-full' : 'translate-x-0',
              )}
            >
              {nav.map((item) =>
                item.children ? (
                  <button
                    key={item.label}
                    type="button"
                    ref={(node) => {
                      if (node) mobileGroupRefs.current.set(item.label, node);
                      else mobileGroupRefs.current.delete(item.label);
                    }}
                    onClick={() => openMobileGroup(item.label)}
                    aria-expanded={openGroup === item.label}
                    className={cn(
                      't-hover flex min-h-11 items-center justify-between rounded-[var(--radius-chip)] px-2 py-2.5 text-base font-medium hover:bg-[var(--color-bg-soft)]',
                      groupActive(item) ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                    )}
                  >
                    {item.label}
                    <ChevronRight size={16} strokeWidth={2} aria-hidden />
                  </button>
                ) : item.href ? (
                  <MobileLink
                    key={item.href}
                    item={{ label: item.label, href: item.href }}
                    active={leafActive(item.href)}
                    onClick={navigateAfterMobileMenu}
                  />
                ) : null,
              )}

              <div className="mt-3 flex items-center justify-between gap-4 border-t border-[var(--color-line)] px-2 pt-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                  <Languages aria-hidden className="h-4 w-4 text-[var(--color-salsa)]" />
                  {de ? 'Sprache' : 'Language'}
                </span>
                <LangToggle lang={lang} setLang={setLang} />
              </div>
              {/* Der rote Full-Width-Knopf gehoert dem Kursplan (Raphael 20.08.); die
                  Hero-CTAs sind bei offenem Menue nicht mehr sichtbar, es gibt also
                  genau EIN Kursplan/Schnupper-Paar im Bild. */}
              <a
                href="/kursplan"
                onClick={navigateAfterMobileMenu}
                className="btn-base btn-primary mt-2 px-4 py-3 text-base"
              >
                {c.cta.plan}
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
              </a>
              <a
                href="/schnupperstunde"
                onClick={navigateAfterMobileMenu}
                className="mt-1 inline-flex items-center justify-center px-4 py-3 text-base font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                {c.cta.trial}
              </a>
            </nav>

            {/* Ebene 2: Unterpunkte der offenen Gruppe, kommt von rechts herein. */}
            <div
              data-mobile-subnav
              data-active={openGroup !== null}
              aria-hidden={openGroup === null}
              inert={openGroup === null}
              className={cn(
                'absolute inset-0 flex flex-col gap-1 overflow-y-auto overscroll-contain bg-[var(--color-paper-warm)] px-4 pb-6 pt-3 transition-transform duration-[var(--dur-base)] ease-[var(--motion-out)] motion-reduce:transition-none sm:px-6',
                openGroup !== null ? 'translate-x-0' : 'translate-x-full',
              )}
            >
              <button
                ref={subnavBackRef}
                type="button"
                onClick={closeMobileGroup}
                className="t-hover mb-1 flex min-h-11 items-center gap-1.5 rounded-[var(--radius-chip)] px-2 py-2.5 text-base font-semibold text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
              >
                <ChevronLeft size={18} strokeWidth={2} aria-hidden />
                {openGroup}
              </button>
              {nav
                .find((item) => item.label === openGroup)
                ?.children?.map((ch) => (
                  /* Aktiv-Zustand bleibt markiert: die aktuelle Unterseite ist auch in
                     der zweiten Ebene zu erkennen. */
                  <a
                    key={ch.href}
                    href={ch.href}
                    onClick={navigateAfterMobileMenu}
                    aria-current={leafActive(ch.href) ? 'page' : undefined}
                    className={cn(
                      't-hover flex min-h-11 items-center rounded-[var(--radius-chip)] px-2 py-2 text-base font-medium hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]',
                      leafActive(ch.href)
                        ? 'bg-[var(--color-bg-soft)] text-[var(--color-salsa)]'
                        : 'text-[var(--color-ink-muted)]',
                    )}
                  >
                    {ch.label}
                  </a>
                ))}
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Skip-Link (sitewide.md §1): erstes Element, nur bei Tastatur-Fokus sichtbar.
function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-[var(--color-salsa)] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:outline-none focus:ring-2 focus:ring-white"
    >
      {label}
    </a>
  );
}

function DesktopLink({ item, active }: { item: Leaf; active: boolean }) {
  return (
    <a
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className="t-hover relative inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-salsa)]"
    >
      {item.label}
      {active && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[var(--color-salsa)]" />
      )}
    </a>
  );
}

/* Desktop-Dropdown mit echtem State statt `group-hover` (Runde 1).
 *
 * Warum State und nicht CSS: `group-hover` kann drei Dinge nicht, die der Auftrag verlangt.
 * (1) Hover-Intent — CSS schliesst in der Millisekunde, in der der Zeiger die Trigger-Box
 *     verlaesst; beim diagonalen Weg zum untersten Kindlink flackert es.
 * (2) `aria-expanded` — ein CSS-Zustand steht in keinem Attribut, Screenreader erfahren nichts.
 * (3) Tastatur — Enter/Space/Pfeile brauchen einen Zustand, den JS kennt.
 *
 * Die Bruecke (`pt-3` am Panel) bleibt Teil der Hover-Flaeche: sie liegt IM Container,
 * der `onPointerLeave` haengt am Container, nicht am Trigger. Zeiger auf dem Weg nach unten
 * verlaesst also nie die Flaeche. Zusaetzlich das Schliess-Delay als Sicherheitsnetz fuer
 * den Diagonal-Move ueber die Nachbar-Spalte hinweg.
 */
const OPEN_DELAY = 90; // kurz genug um sich sofort anzufuehlen, lang genug gegen Durchwisch-Blitzer
const CLOSE_DELAY = 140; // genug fuer den diagonalen Weg, ohne das Schliessen traege wirken zu lassen

function DesktopDropdown({
  item,
  active,
  pathname,
}: {
  item: NavItem;
  active: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const menuId = `nav-menu-${(item.href ?? item.label).replace(/\W+/g, '-')}`;

  // EIN Timer fuer beide Richtungen: jede neue Absicht loescht die alte. Genau das macht
  // die Bewegung interruptible — zurueck auf den Trigger cancelt das Schliessen.
  const schedule = useCallback((next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    if (next) setKeyboardOpen(false);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  }, []);
  const cancel = useCallback(() => window.clearTimeout(timer.current), []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const items = item.children!;
  const focusItem = (i: number) => {
    const links = wrapRef.current?.querySelectorAll<HTMLAnchorElement>('[data-nav-child]');
    if (!links?.length) return;
    links[(i + links.length) % links.length]?.focus();
  };
  const openAndFocus = (i: number) => {
    cancel();
    setKeyboardOpen(true);
    setOpen(true);
    // Erst nach dem Paint fokussieren: vorher ist das Panel `inert` und nimmt keinen Fokus.
    window.requestAnimationFrame(() => focusItem(i));
  };
  const closeToTrigger = () => {
    cancel();
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      // Enter auf dem Trigger oeffnet das Menu, statt sofort zur Uebersicht zu navigieren:
      // die Uebersicht ist als erster Kindlink ohnehin einen Pfeiltritt entfernt.
      e.preventDefault();
      openAndFocus(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openAndFocus(items.length - 1);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(items.length - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); closeToTrigger(); }
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') schedule(true, OPEN_DELAY); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') schedule(false, CLOSE_DELAY); }}
      // Tab-out schliesst: der Fokus hat die Gruppe verlassen, das Menu haette keinen Bezug mehr.
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <a
        ref={triggerRef}
        href={item.href}
        role={item.href ? undefined : 'button'}
        tabIndex={item.href ? undefined : 0}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onKeyDown={onTriggerKeyDown}
        // Touch: der erste Tipp oeffnet das Menu (statt direkt zu navigieren), damit die
        // Unterseiten auf Tablets ueberhaupt erreichbar sind. Ein zweiter Tipp folgt dem Link.
        // Raphael 17.08.: Mehr hat keinen Hub. Der Trigger oeffnet nur das Dropdown.
        onClick={(e) => {
          if (e.detail === 0) return; // Tastatur-"Klick" (Enter) hat onTriggerKeyDown schon behandelt
          if (!item.href) {
            e.preventDefault();
            cancel();
            setKeyboardOpen(false);
            setOpen((wasOpen) => !wasOpen);
            return;
          }
          const coarse = window.matchMedia('(pointer: coarse)').matches;
          if (coarse && !open) {
            e.preventDefault();
            cancel();
            setKeyboardOpen(false);
            setOpen(true);
          }
        }}
        className={cn(
          'relative inline-flex min-h-11 items-center gap-1 text-sm font-medium transition-colors',
          't-hover',
          active || open ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)] hover:text-[var(--color-salsa)]',
        )}
      >
        {item.label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden
          className={cn('transition-transform duration-[var(--dur-fast)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none', open && '-scale-y-100')}
        />
        {active && (
          <span className="absolute -bottom-0.5 left-0 right-6 h-0.5 rounded-full bg-[var(--color-salsa)]" />
        )}
      </a>
      <div
        id={menuId}
        // `inert` statt nur `invisible`: ohne das bleiben die Kindlinks im Tab-Pfad und
        // im Accessibility-Tree, obwohl nichts zu sehen ist.
        inert={!open}
        /* Raphael 20.08.: das Panel öffnet nach RECHTS, nicht mittig nach unten.
           Vorher `left-1/2 -translate-x-1/2`: das Menu hing zentriert unter dem Trigger
           und lief beim linken Nav-Rand über die Logo-Kante hinaus. Jetzt beginnt die
           linke Panel-Kante exakt an der linken Trigger-Kante (`left-0`), das Menu
           wächst von dort nach rechts. Die Ankerachse ist links, nicht unten-mittig.
           Motion: Ursprung links oben, Eintritt darum aus der Richtung, in die das
           Panel wächst (x statt y), Dauer `--dur-fast`, Kurve `cubic-bezier(0.23,1,0.32,1)`
           = der starke Ease-Out der Motion-Doktrin. `scale(0.98)` statt `scale(0)`. */
        style={{
          top: 'calc(100% - 2px)',
          transformOrigin: 'top left',
          transitionDuration: keyboardOpen ? '0ms' : undefined,
        }}
        className={cn(
          'absolute left-0 z-50 w-60 pt-3 transition-[opacity,transform] duration-[var(--dur-fast)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
          open ? 'visible translate-x-0 scale-100 opacity-100' : 'invisible -translate-x-1 scale-[0.98] opacity-0',
        )}
      >
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-2 shadow-[0_12px_32px_rgba(17,17,17,0.12)]">
          {items.map((ch, i) => {
            const chActive = pathname === ch.href;
            return (
              <a
                key={ch.href}
                href={ch.href}
                data-nav-child
                aria-current={chActive ? 'page' : undefined}
                onKeyDown={(e) => onItemKeyDown(e, i)}
                className={cn(
                  'flex min-h-11 items-center rounded-[var(--radius-chip)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-salsa)]',
                  chActive ? 'bg-[var(--color-bg-soft)] text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                )}
              >
                {ch.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  item,
  active,
  onClick,
}: {
  item: Leaf;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        't-hover flex min-h-11 items-center rounded-[var(--radius-chip)] px-2 py-2.5 text-base font-medium hover:bg-[var(--color-bg-soft)]',
        active ? 'bg-[var(--color-bg-soft)] text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
      )}
    >
      {item.label}
    </a>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: 'de' | 'en';
  setLang: (l: 'de' | 'en') => void;
}) {
  return (
    /* Raphael 20.08.: je Sprache EIN echter Kreis. Die frühere Umrandung um beide
       Knöpfe machte aus zwei Kreisen optisch eine breite Ovalpille — der Rahmen ist
       darum weg, die Gruppe ist nur noch ein Abstandshalter. Höhe = Breite = 44px
       (h-11 w-11), damit das Tap-Ziel steht und der Kreis kein Ei wird. */
    <div
      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold"
      role="group"
      aria-label="Sprache / Language"
    >
      {(['de', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          data-testid={`lang-${l}`}
          className={cn(
            // h-11 w-11 statt min-h-11/min-w-10 + px: nur gleiche Höhe UND Breite ergibt
            // einen Kreis. Padding wuerde die Breite wieder aufziehen, darum keins.
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full uppercase transition-colors duration-[var(--dur-fast)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
            lang === l
              ? 'border border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
              : 't-hover border border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
