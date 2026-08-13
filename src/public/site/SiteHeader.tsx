// Fixe Navbar (Non-Overlay, Regel 062). EINE umrandete Leiste (Raphael 2026-07-05): solider
// Cream-Balken mit Rahmen, sitzt gut auf hellem UND dunklem Sektions-Hintergrund. Logo (Wordmark),
// datengetriebene Navigation mit drei Dropdowns (Tanzkurse, Events, Mehr) fuer die volle
// V3-Copyplan-Struktur (24 Seiten), DE/EN-Toggle und rote Schnupper-CTA in der Leiste.
// Keine Animationen (statisch). Pfeile/Chevrons via Lucide.

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Languages, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';

type Leaf = { label: string; href: string };
type NavItem = Leaf & { children?: Leaf[] };

export function SiteHeader({ solidBackdrop = false }: { solidBackdrop?: boolean } = {}) {
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

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      if (y < 24 || open) {
        setHidden(false);
      } else if (y > lastY + 8) {
        setHidden(true);
      } else if (y < lastY - 8) {
        setHidden(false);
      }
      lastY = y;
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

  const closeMenu = () => {
    setOpen(false);
    setOpenGroup(null);
    menuButtonRef.current?.focus();
  };

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
        { label: 'Privatstunden', href: '/privatstunden' },
        { label: 'Kursaufbau', href: '/kursaufbau' },
        { label: de ? 'Preise' : 'Prices', href: '/preise' },
      ],
    },
    { label: c.nav.kursplan, href: '/kursplan' },
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
      label: c.nav.mehr,
      href: '/mehr',
      children: [
        { label: de ? 'Übersicht' : 'Overview', href: '/mehr' },
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
    (pathname === item.href ||
      item.children.some((ch) => ch.href !== '/' && pathname.startsWith(ch.href.split('?')[0])) ||
      pathname.startsWith(item.href + '/'));

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 will-change-transform transition-transform duration-300 ease-out motion-reduce:transition-none',
        solidBackdrop && 'bg-[var(--color-paper-warm)]',
      )}
      style={{
        height: 'var(--nav-h)',
        transform: hidden && !open ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <SkipLink label={de ? 'Zum Inhalt springen' : 'Skip to content'} />
      {/* Aussenpadding so gesetzt, dass Pillen-Border (1px) + Innenpadding (pl-3.5 / sm:pl-4)
          das Logo GENAU auf die Textkante der Shell legt: 6+1+14 = 21px mobil (Shell px-5 = 20),
          16+1+16 = 33px ab sm (Shell px-8 = 32). Vorher 10/20 -> Logo lag 4-5px rechts der H1. */}
      <div className="mx-auto max-w-[1400px] px-[5px] pt-[9px] sm:px-[15px] sm:pt-[10px]">
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
          className="t-acc w-full overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-paper-warm)]/95 text-[var(--color-ink)] shadow-[0_8px_28px_rgba(17,17,17,0.1)] backdrop-blur data-[open=true]:bg-[var(--color-paper-warm)] data-[open=true]:backdrop-blur-none lg:overflow-visible lg:rounded-full"
        >
          <div className="t-acc-head h-12 gap-3 pl-3.5 pr-1.5 sm:h-14 sm:gap-4 sm:pl-4 sm:pr-3">
          <a href="/" className="flex shrink-0 items-center" aria-label={de ? 'Salsaflow Dance Company - Startseite' : 'Salsaflow Dance Company - Home'}>
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
                <DesktopDropdown key={item.href} item={item} active={groupActive(item)} pathname={pathname} />
              ) : (
                <DesktopLink key={item.href} item={item} active={leafActive(item.href)} />
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            <a
              href="/kontakt#schnupperstunde"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--color-salsa)] bg-[var(--color-salsa)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-[var(--color-salsa-700)] hover:bg-[var(--color-salsa-700)] sm:inline-flex sm:px-4"
            >
              {c.cta.trial}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={de ? 'Menü' : 'Menu'}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 text-[var(--color-ink)] shadow-sm lg:hidden"
            >
              <Menu size={18} strokeWidth={2} aria-hidden />
              <span className="text-xs font-semibold">{open ? (de ? 'Schliessen' : 'Close') : (de ? 'Menü' : 'Menu')}</span>
              <ChevronDown className="t-acc-chevron" size={15} strokeWidth={2.2} aria-hidden />
            </button>
          </div>
          </div>

          {/* Mobile Navigation: dieselbe Header-Flaeche waechst nach unten. */}
          <div
          id="mobile-navigation"
          aria-hidden={!open}
          inert={!open}
          aria-label={de ? 'Mobile Navigation' : 'Mobile navigation'}
          className="t-acc-panel lg:hidden"
          >
            <div className="t-acc-panel-inner">
          {/* Kein eigener max-w-Cap mehr (war max-w-6xl = 1152px): die Leiste sitzt schon in der
              1400px-Shell, ein zweiter Container darin war das dritte Raster (Kritik Runde 2). */}
          <nav className="flex max-h-[calc(100dvh-var(--nav-h)-1rem)] flex-col gap-1 overflow-y-auto border-t border-[var(--color-line)] px-4 pb-4 pt-3 sm:px-6" aria-label={de ? 'Mobile Navigation' : 'Mobile navigation'}>
            {nav.map((item) =>
              item.children ? (
                <div key={item.href} className="t-acc" data-open={openGroup === item.href}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup((v) => (v === item.href ? null : item.href))}
                    aria-expanded={openGroup === item.href}
                    className={cn(
                      't-acc-head rounded-[var(--radius-chip)] px-3 py-2.5 text-base font-medium hover:bg-[var(--color-bg-soft)]',
                      groupActive(item) ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className="t-acc-chevron"
                      aria-hidden
                    />
                  </button>
                  <div className="t-acc-panel" aria-hidden={openGroup !== item.href} inert={openGroup !== item.href}>
                    <div className="t-acc-panel-inner">
                    <div className="ml-3 flex flex-col gap-0.5 border-l border-[var(--color-line)] pb-2 pl-3">
                      {item.children.map((ch) => (
                        /* Aktiv-Zustand fehlte im Mobile-Menu komplett: die aktuelle
                           Unterseite war dort nicht zu erkennen (Desktop-Dropdown und
                           Leaf-Links markieren sie laengst). */
                        <a
                          key={ch.href}
                          href={ch.href}
                          onClick={closeMenu}
                          aria-current={leafActive(ch.href) ? 'page' : undefined}
                          className={cn(
                            'flex min-h-11 items-center rounded-[var(--radius-chip)] px-2 py-2 text-[0.95rem] font-medium hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]',
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
              ) : (
                <MobileLink key={item.href} item={item} active={leafActive(item.href)} onClick={closeMenu} />
              ),
            )}

            <div className="mt-3 flex items-center justify-between gap-4 border-t border-[var(--color-line)] px-3 pt-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                <Languages aria-hidden className="h-4 w-4 text-[var(--color-salsa)]" />
                {de ? 'Sprache' : 'Language'}
              </span>
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            <a
              href="/kontakt#schnupperstunde"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-salsa)] px-4 py-3 text-center text-base font-semibold text-white"
            >
              {c.cta.trial}
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
            </a>
          </nav>
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
      className="relative py-1 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-salsa)]"
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
const CLOSE_DELAY = 220; // Zeit fuer den diagonalen Weg zum untersten Kindlink

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const menuId = `nav-menu-${item.href.replace(/\W+/g, '-')}`;

  // EIN Timer fuer beide Richtungen: jede neue Absicht loescht die alte. Genau das macht
  // die Bewegung interruptible — zurueck auf den Trigger cancelt das Schliessen.
  const schedule = useCallback((next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
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
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}
    >
      <a
        ref={triggerRef}
        href={item.href}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onKeyDown={onTriggerKeyDown}
        // Touch: der erste Tipp oeffnet das Menu (statt direkt zu navigieren), damit die
        // Unterseiten auf Tablets ueberhaupt erreichbar sind. Ein zweiter Tipp folgt dem Link.
        onClick={(e) => {
          if (e.detail === 0) return; // Tastatur-"Klick" (Enter) hat onTriggerKeyDown schon behandelt
          const coarse = window.matchMedia('(pointer: coarse)').matches;
          if (coarse && !open) { e.preventDefault(); cancel(); setOpen(true); }
        }}
        className={cn(
          'relative inline-flex items-center gap-1 py-1 text-sm font-medium transition-colors',
          active || open ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)] hover:text-[var(--color-salsa)]',
        )}
      >
        {item.label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden
          className={cn('transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', open && '-scale-y-100')}
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
        className={cn(
          'absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
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
                  'block rounded-[var(--radius-chip)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-salsa)]',
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

function MobileLink({ item, active, onClick }: { item: Leaf; active: boolean; onClick: () => void }) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center rounded-[var(--radius-chip)] px-2 py-2.5 text-base font-medium hover:bg-[var(--color-bg-soft)]',
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
    <div
      className="inline-flex min-h-10 shrink-0 items-center gap-0.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] p-0.5 text-xs font-semibold shadow-sm"
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
            'inline-flex h-9 min-w-10 items-center justify-center rounded-full px-2.5 uppercase transition-colors',
            lang === l
              ? 'bg-[var(--color-ink)] text-white'
              : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
