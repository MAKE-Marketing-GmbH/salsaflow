// WhatsApp-Floating-Knopf (Sitewide-Shell, sitewide.md §7). Fix unten rechts, direkter Draht
// zu +41 76 478 84 11. Weiss auf WhatsApp-Gruen ist eine feste Kundenabsprache
// (wiki/absprachen.md:21); Motion und Geometrie duerfen sie nicht ueberschreiben.
// Liegt z-technisch unter dem Nav-Drawer (z-50), aber über dem
// Seiteninhalt. Wenn der Cookie-Banner offen ist (Prop `raised`), weicht der Knopf nach oben aus,
// damit er das Banner nicht überlappt (z-Order aus sitewide.md §7/§8).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer traegt im
// Entry-CTA-Band einen eigenen WhatsApp-Button, den der Float sonst ueberlappt (Kritiker-
// Befund kursplan d-mid, Runde 10) — gleiche Footer-Beobachtung wie CookieBanner.tsx.

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { useHydrated } from '@/public/home/motion';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

type WhatsAppFloatStyle = CSSProperties & {
  '--whatsapp-collision-lift': string;
};

/* Breite, die das Label "WhatsApp" plus Innenabstand der Pille belegt. Gemessen auf
   1440px: Pille 122px, Kreis 56px. Der Solver braucht die Zahl, um im kompakten Zustand
   noch zu wissen, wie breit der Knopf mit Label waere — sonst kann er nie zurueck. */
const LABEL_WIDTH = 66;

export function WhatsAppFloat({ raised = false, className = '' }: { raised?: boolean; className?: string }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  // Footer sichtbar -> Float weg (Doppel-WhatsApp + Overlap mit Footer-Button vermeiden).
  const [footerInView, setFooterInView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [headerDocked, setHeaderDocked] = useState(false);
  const floatRef = useRef<HTMLAnchorElement>(null);
  const collisionLiftRef = useRef(0);
  const headerDockedRef = useRef(false);
  // `compactRef` ist die Form, die gerade gezeichnet wird. Zwei unabhaengige Gruende
  // koennen sie verlangen: Scrollen (weniger Flaeche ueber dem Inhalt) und der Solver
  // (fuer die volle Pille ist am aktuellen Ort kein Platz).
  const compactRef = useRef(false);
  const collisionCompactRef = useRef(false);
  const scrollCompactRef = useRef(false);
  const [compact, setCompact] = useState(false);
  const [collisionLift, setCollisionLift] = useState(0);
  const [placed, setPlaced] = useState(false);
  const placedRef = useRef(false);
  /* R134/10, geschaerft R153 und erneut aufgemacht in dieser Runde (Kundenkritik 21.08.:
     "Der Button sieht tot aus — geile Animationen rein"). Aufloesung des Widerspruchs:
     VERBOTEN bleibt, was ohne Anlass endlos laeuft — Dauer-Puls, Ping-Ring, Bounce,
     Wackeln, alles nach Gratis-Widget. ERLAUBT ist Bewegung MIT Anlass, die auf den
     Nutzer reagiert statt auf eine Schleife:
       1. Eintritt: weicher Spring nach oben (framer-motion, bounce 0.18), einmalig.
       2. Hover: Icon dreht ein paar Grad und zoomt leicht — EINE Geste, nicht zwei.
       3. Scroll/Platz-Mangel: Pille <-> Kreis als Layout-Transition mit Spring.
       4. Press: kurzes Rein- und Zurueckfedern (0.94), taktiles Feedback.
       5. Ausweichen (collisionLift): gleitet, statt zu springen.
     Alles laeuft ueber framer-motion und nur auf transform/opacity. SSR: der Server
     rendert ohne JS den sichtbaren Endzustand (useHydrated-Pattern aus motion.tsx);
     die Animation zuendet erst nach der Hydration, und `useReducedMotion` begrenzt
     alles auf einen einfachen Fade. */
  const reduced = useReducedMotion();
  const hydrated = useHydrated();

  const commitCompact = useCallback(() => {
    const next = collisionCompactRef.current || scrollCompactRef.current;
    if (compactRef.current === next) return;
    compactRef.current = next;
    setCompact(next);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
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
    const obs = new MutationObserver(check);
    obs?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-testid'],
    });
    return () => obs?.disconnect();
  }, []);

  /* Anlass statt Dauerloop: Beim Scrollen schrumpft die Desktop-Pille zum Kreis. Das
     nimmt 66 px Breite vom Inhalt weg, während das Auge der Seite folgt. 2,4 Sekunden nach
     dem letzten Scroll-Event darf das Label wiederkommen. Der Kollisionssolver kann den Kreis
     länger halten. Dieses Fenster bleibt auch unter Browserlast klar länger als der
     900-ms-Zwischenbeleg. Mobil ändert der Zustand keine sichtbare Geometrie. */
  useEffect(() => {
    let idleTimer = 0;
    const onScroll = () => {
      window.clearTimeout(idleTimer);
      if (!scrollCompactRef.current) {
        scrollCompactRef.current = true;
        commitCompact();
      }
      idleTimer = window.setTimeout(() => {
        scrollCompactRef.current = false;
        commitCompact();
      }, 2400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [commitCompact]);

  /* Der Kollisionsschutz hält eine Dokumentkarte der rechten Randzone im Speicher.
     Text, Bilder und Bedienelemente werden beim Laden oder bei Layoutänderungen vermessen.
     Beim Scrollen vergleicht der Solver nur Zahlen. Dadurch bleibt der Haupt-Thread frei. */
  useEffect(() => {
    type CollisionRect = { top: number; bottom: number; left: number; right: number };
    /* `area` traegt die ungepolsterte Dokumentbox plus die sichtbare Breite. Damit entscheidet
       jeder Frame per Rechnung neu, ob dieses Bild gerade Hintergrund ist — ohne DOM-Zugriff. */
    type StaticBlocker = CollisionRect & { area?: { width: number; top: number; bottom: number } };
    type DynamicBlocker =
      | { kind: 'element'; element: HTMLElement }
      | { kind: 'text'; range: Range; parent: HTMLElement };

    /* Polster fuer Elemente, die beim Scrollen noch wandern. 24 px waren zu wenig: die
       Parallax-Distanzen im Projekt gehen bis 44 px (StylePage-Why 44, Hero 44, Location 40,
       Events 36, Team 36). Ein Foto konnte also 20 px unter den Knopf laufen, ohne dass die
       Karte davon wusste — sie wird beim Scrollen nicht neu gebaut. 48 px deckt das Maximum. */
    const MOTION_PAD = 48;
    const CONTENT_SELECTOR =
      'img, video, picture, a, button, input, select, textarea, summary, [role="button"], [role="tab"], [role="checkbox"], [data-cookie-banner], [data-sticky-cta]';
    let frame = 0;
    let revealTimer = 0;
    let settleTimer = 0;
    let rebuildTimer = 0;
    let initialRebuildTimer = 0;
    let active = true;
    let staticBlockers: StaticBlocker[] = [];
    let dynamicBlockers: DynamicBlocker[] = [];
    let viewportAnchoredCache = new WeakMap<HTMLElement, boolean>();

    const elementIsVisible = (element: HTMLElement, allowMotionOpacity: boolean) => {
      if (element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
      if (element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return true;
      return Boolean(
        allowMotionOpacity &&
        element.closest('[data-reveal], [data-scroll-motion]') &&
        element.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true }),
      );
    };

    const viewportAnchored = (element: HTMLElement, knownStyle?: CSSStyleDeclaration): boolean => {
      const cached = viewportAnchoredCache.get(element);
      if (cached !== undefined) return cached;
      const style = knownStyle ?? window.getComputedStyle(element);
      const anchored =
        style.position === 'fixed' ||
        style.position === 'sticky' ||
        element.matches('header, [data-cookie-banner], [data-sticky-cta]') ||
        Boolean(element.parentElement && viewportAnchored(element.parentElement));
      viewportAnchoredCache.set(element, anchored);
      return anchored;
    };

    const movesInViewport = (element: HTMLElement, style: CSSStyleDeclaration) =>
      style.transform !== 'none' || Boolean(element.closest('[data-reveal], [data-scroll-motion]'));

    const CLIP_OVERFLOW = ['hidden', 'clip', 'auto', 'scroll'];

    /* Naechster overflow-Ahn ist die sichtbare Kachel. Founder-Portraits liegen als
       `img.absolute.max-w-none` in `div.aspect-square.overflow-hidden`: die img-Box
       ist groesser als das Fenster. Blocker muss die Kachel sein, nicht der Ueberstand. */
    /* Sichtbare Box = Schnitt aller overflow-Ahnen, nicht nur des naechsten.
       Der naechste Clip ist oft die Karte selbst (Instagram-Peek, Founder-Kachel).
       Die Karte ragt geometrisch unter den Knopf, der Slider schneidet sie aber ab.
       Nur der sichtbare Rest darf blocken. */
    const overflowClipBox = (element: HTMLElement): CollisionRect | null => {
      let clipped: CollisionRect | null = null;
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        const style = window.getComputedStyle(ancestor);
        if (!CLIP_OVERFLOW.includes(style.overflowX) && !CLIP_OVERFLOW.includes(style.overflowY)) continue;
        const box = ancestor.getBoundingClientRect();
        clipped = clipped
          ? {
              top: Math.max(clipped.top, box.top),
              bottom: Math.min(clipped.bottom, box.bottom),
              left: Math.max(clipped.left, box.left),
              right: Math.min(clipped.right, box.right),
            }
          : { top: box.top, bottom: box.bottom, left: box.left, right: box.right };
      }
      return clipped;
    };

    const addStaticRect = (
      rect: { top: number; bottom: number; left: number; right: number },
      scrollTop: number,
      stripLeft: number,
      stripRight: number,
      moving: boolean,
      areaChecked = false,
    ) => {
      if (rect.right - rect.left <= 1 || rect.bottom - rect.top <= 1 || rect.right <= stripLeft || rect.left >= stripRight) return;
      const pad = moving ? MOTION_PAD : 0;
      const top = rect.top + scrollTop;
      const bottom = rect.bottom + scrollTop;
      staticBlockers.push({
        top: top - pad,
        bottom: bottom + pad,
        left: rect.left,
        right: rect.right,
        area: areaChecked
          ? {
              width: Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)),
              top,
              bottom,
            }
          : undefined,
      });
    };

    const labelAllowed = () =>
      window.innerWidth >= 640 &&
      !document.querySelector(
        '[data-split-hero-page], [data-events-page], [data-team-page], [data-faq-page], [data-kursaufbau-page], [data-privat-page], [data-collabs-page], [data-tanzschuhe-page], [data-partys-page], [data-heels-style-page]',
      );

    const rebuildBlockers = () => {
      const float = floatRef.current;
      if (!float) return;
      const current = float.getBoundingClientRect();
      /* Mobil hat kein Label (`hidden sm:inline-block`). Mehrere Desktop-Routen zwingen
         den Kreis per CSS (split-hero, events, team, faq, kursaufbau, privat, collabs,
         tanzschuhe, partys, heels). LABEL_WIDTH dort draufzurechnen vermisst eine
         Phantom-Pille. */
      const pillWidth = labelAllowed() && compactRef.current ? current.width + LABEL_WIDTH : current.width;
      const stripLeft = current.right - pillWidth - 8;
      const stripRight = current.right + 8;
      const scrollTop = window.scrollY;
      staticBlockers = [];
      dynamicBlockers = [];
      viewportAnchoredCache = new WeakMap<HTMLElement, boolean>();

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        const parent = node.parentElement;
        if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
        if (parent.closest('.sr-only')) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].filter(
          (rect) => rect.width > 1 && rect.height > 1 && rect.right > stripLeft && rect.left < stripRight,
        );
        if (!rects.length) continue;
        if (!elementIsVisible(parent, true)) continue;
        const style = window.getComputedStyle(parent);
        if (viewportAnchored(parent, style)) {
          dynamicBlockers.push({ kind: 'text', range, parent });
          continue;
        }
        const moving = movesInViewport(parent, style);
        const clip = overflowClipBox(parent);
        for (const rect of rects) {
          if (!clip) {
            addStaticRect(rect, scrollTop, stripLeft, stripRight, moving);
            continue;
          }
          const left = Math.max(rect.left, clip.left);
          const right = Math.min(rect.right, clip.right);
          const top = Math.max(rect.top, clip.top);
          const bottom = Math.min(rect.bottom, clip.bottom);
          if (right - left <= 1 || bottom - top <= 1) continue;
          addStaticRect({ top, bottom, left, right }, scrollTop, stripLeft, stripRight, moving);
        }
      }

      for (const element of document.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)) {
        if (float.contains(element) || !elementIsVisible(element, true)) continue;
        const style = window.getComputedStyle(element);
        const isMedia =
          element.tagName === 'IMG' ||
          element.tagName === 'VIDEO' ||
          element.tagName === 'PICTURE';
        const isInteractive = element.matches(
          'a, button, input, select, textarea, summary, [role="button"], [role="tab"], [role="checkbox"]',
        );
        const boxed =
          style.borderTopWidth !== '0px' &&
          style.borderBottomWidth !== '0px' &&
          style.borderLeftWidth !== '0px' &&
          style.borderRightWidth !== '0px';
        const filled =
          (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') ||
          style.backgroundImage !== 'none';
        if (!isMedia && !isInteractive && !boxed && !filled) continue;
        if (!isMedia && style.pointerEvents === 'none') continue;

        const raw = element.getBoundingClientRect();
        /* Medien liegen oft als `img.absolute.max-w-none` in einer `overflow-hidden`-Kachel
           (Founder-Portraits). Die img-Box ist dann groesser als das, was man sieht. Blocker
           ist die Kachel; degeneriert die Schnittmenge, gilt die Kachel selbst. */
        let rect: CollisionRect = { top: raw.top, bottom: raw.bottom, left: raw.left, right: raw.right };
        const clip = overflowClipBox(element);
        if (clip) {
          const left = Math.max(raw.left, clip.left);
          const right = Math.min(raw.right, clip.right);
          const top = Math.max(raw.top, clip.top);
          const bottom = Math.min(raw.bottom, clip.bottom);
          if (right - left <= 1 || bottom - top <= 1) {
            /* Medien: die Kachel selbst. Sonst: wirklich unsichtbar, kein Blocker. */
            if (!isMedia) continue;
            rect = { top: clip.top, bottom: clip.bottom, left: clip.left, right: clip.right };
          } else {
            rect = { top, bottom, left, right };
          }
        }
        if (
          rect.right - rect.left <= 1 ||
          rect.bottom - rect.top <= 1 ||
          rect.right <= stripLeft ||
          rect.left >= stripRight
        ) {
          continue;
        }
        if (viewportAnchored(element, style)) {
          dynamicBlockers.push({ kind: 'element', element });
          continue;
        }
        /* Der Grossflaechen-Skip (Bild fuellt das Fenster, gilt also als Hintergrund) faellt
           NICHT hier. Er haengt an der Scroll-Position: dasselbe Foto fuellt oben halb und in
           der Mitte ganz. Frueher entschied der Solver einmal beim Aufbau und merkte sich das
           Ergebnis fuer alle Positionen — so rutschten drei Fotos durch, die der Verifier an
           seiner Position sehr wohl als Blocker sah. Jetzt entscheidet jeder Frame neu. */
        addStaticRect(
          rect,
          scrollTop,
          stripLeft,
          stripRight,
          movesInViewport(element, style),
          true,
        );
      }
    };

    const dynamicRects = () => {
      const rects: CollisionRect[] = [];
      for (const blocker of dynamicBlockers) {
        const owner = blocker.kind === 'text' ? blocker.parent : blocker.element;
        if (!elementIsVisible(owner, false)) continue;
        const liveRects = blocker.kind === 'text'
          ? blocker.range.getClientRects()
          : blocker.element.getClientRects();
        const clip = overflowClipBox(owner);
        for (const rect of liveRects) {
          if (rect.width <= 1 || rect.height <= 1) continue;
          if (!clip) {
            rects.push({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
            continue;
          }
          const left = Math.max(rect.left, clip.left);
          const right = Math.min(rect.right, clip.right);
          const top = Math.max(rect.top, clip.top);
          const bottom = Math.min(rect.bottom, clip.bottom);
          if (right - left <= 1 || bottom - top <= 1) continue;
          rects.push({ top, bottom, left, right });
        }
      }
      return rects;
    };

    const measure = () => {
      frame = 0;
      const float = floatRef.current;
      if (!float) return;

      const current = float.getBoundingClientRect();
      const baseTop = current.top + collisionLiftRef.current;
      const baseBottom = current.bottom + collisionLiftRef.current;
      /* Der Korridor ist absichtlich kurz. Vorher reichte er bis 672 px, und genau das war
         der Fehler: gemessen am 21.08. sass der Knopf auf /tanzkurse/salsa mobil am Ende bei
         y=216 (auf der H1), auf /team desktop bei y=298, und der Hub sprang dort innerhalb
         von zwei Sekunden 0 -> 560 -> 616 -> 560. Ein Knopf, der ins obere Drittel wandert,
         ist nicht mehr der Knopf unten rechts aus wiki/absprachen.md:21 — er ist ein zweites,
         zufaellig platziertes Element. Zwei Knopfhoehen sind die Grenze, ab der man das
         Ausweichen noch als Ausweichen liest. */
      const candidates = [0, 56, 112];
      const viewportH = window.innerHeight;
      const scrollTop = window.scrollY;
      const liveBlockers = dynamicRects();
      const header = document.querySelector('header');
      const headerRect = header?.getBoundingClientRect();
      const headerVisible = Boolean(headerRect && headerRect.bottom > 0 && headerRect.height > 0);
      const ceiling = headerVisible && headerRect ? headerRect.bottom + 12 : 12;
      const pillWidth = labelAllowed() && compactRef.current ? current.width + LABEL_WIDTH : current.width;
      const compactShift = Math.max(0, pillWidth - current.height);
      const searchLeft = current.right - pillWidth;
      let next: number | null = null;
      let needsCompact = false;

      /* Kacheln (Founder-Portraits, Karten) bleiben Blocker. Breite Atmosphaere — Hero,
         Band, volles Shell-Foto — darf der Knopf in der Ecke ueberlagern. Sonst bleibt
         unten rechts kein Platz, und der Solver schiebt den Knopf in die Seite. */
      const isBackgroundNow = (rect: StaticBlocker) => {
        if (!rect.area) return false;
        const height = rect.area.bottom - rect.area.top;
        const ratio = height > 0 ? rect.area.width / height : 0;
        const tile =
          rect.area.width < window.innerWidth * 0.45 &&
          height < viewportH * 0.5 &&
          ratio > 0.75 &&
          ratio < 1.35;
        if (tile) return false;
        if (rect.area.width <= window.innerWidth * 0.35) return false;
        const visibleHeight = Math.max(
          0,
          Math.min(rect.area.bottom, scrollTop + viewportH) - Math.max(rect.area.top, scrollTop),
        );
        return visibleHeight > viewportH * 0.22;
      };

      for (const shrink of [0, compactShift]) {
        for (const lift of candidates) {
          const top = baseTop - lift - 6;
          const bottom = baseBottom - lift + 6;
          const left = searchLeft + shrink - 6;
          const right = current.right + 6;
          if (top < ceiling || bottom > viewportH - 12) continue;
          const documentTop = top + scrollTop;
          const documentBottom = bottom + scrollTop;
          const blockedByStatic = staticBlockers.some(
            (rect) =>
              rect.right > left &&
              rect.left < right &&
              rect.bottom > documentTop &&
              rect.top < documentBottom &&
              !isBackgroundNow(rect),
          );
          const blockedByDynamic = liveBlockers.some(
            (rect) => rect.right > left && rect.left < right && rect.bottom > top && rect.top < bottom,
          );
          if (!blockedByStatic && !blockedByDynamic) {
            next = lift;
            needsCompact = shrink > 0;
            break;
          }
        }
        if (next !== null || compactShift === 0) break;
      }

      /* Findet der Solver im Korridor nichts Freies, faellt der Knopf auf den Grundplatz
         unten rechts zurueck und wird zum Kreis. Vorher blendete er sich dann aus: gemessen
         am 21.08. stand er auf der Startseite mobil bei 700, 1200 und 2000 ms auf
         `visibility: hidden` und dazwischen sichtbar. Der Knopf flackerte und fehlte auf dem
         ersten Fold ganz. Ein Messenger-Knopf, den es manchmal nicht gibt, ist schlechter als
         einer, der am aeussersten Rand ueber einer Textzeile steht. */
      if (next === null) {
        next = 0;
        needsCompact = compactShift > 0;
      }
      if (collisionCompactRef.current !== needsCompact) {
        collisionCompactRef.current = needsCompact;
        commitCompact();
      }
      if (headerDockedRef.current !== headerVisible) {
        headerDockedRef.current = headerVisible;
        setHeaderDocked(headerVisible);
      }
      if (!placedRef.current) {
        placedRef.current = true;
        setPlaced(true);
      }
      if (collisionLiftRef.current !== next) {
        collisionLiftRef.current = next;
        float.style.setProperty('--whatsapp-collision-lift', `${next}px`);
        setCollisionLift(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
      window.clearTimeout(revealTimer);
      window.clearTimeout(settleTimer);
      revealTimer = window.setTimeout(() => {
        if (!frame) frame = window.requestAnimationFrame(measure);
      }, 140);
      settleTimer = window.setTimeout(() => {
        if (!frame) frame = window.requestAnimationFrame(measure);
      }, 700);
    };

    const scheduleRebuild = () => {
      if (!active) return;
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(() => {
        rebuildTimer = 0;
        rebuildBlockers();
        schedule();
      }, 120);
    };

    const onResize = () => {
      scheduleRebuild();
      schedule();
    };
    const mutationObserver = new MutationObserver((records) => {
      const float = floatRef.current;
      if (float && records.every((record) => float.contains(record.target))) return;
      scheduleRebuild();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    const resizeObserver = new ResizeObserver(scheduleRebuild);
    resizeObserver.observe(document.body);

    rebuildBlockers();
    schedule();
    initialRebuildTimer = window.setTimeout(scheduleRebuild, 700);
    void document.fonts.ready.then(scheduleRebuild);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('load', scheduleRebuild, true);
    document.addEventListener('animationend', schedule, true);
    document.addEventListener('transitionend', schedule, true);

    return () => {
      active = false;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(revealTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(rebuildTimer);
      window.clearTimeout(initialRebuildTimer);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('load', scheduleRebuild, true);
      document.removeEventListener('animationend', schedule, true);
      document.removeEventListener('transitionend', schedule, true);
    };
  }, [commitCompact]);

  if (footerInView || dialogOpen) return null;

  const floatStyle: WhatsAppFloatStyle = {
    '--whatsapp-collision-lift': `${collisionLift}px`,
    bottom: raised
      ? 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--cookie-float-lift, 0px) + var(--whatsapp-lift, 0px) + var(--whatsapp-collision-lift))'
      : 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--whatsapp-lift, 0px) + var(--whatsapp-collision-lift))',
  };

  return (
    <motion.a
      ref={floatRef}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      initial={hydrated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.18, duration: reduced ? 0.2 : 0.55 }}
      whileHover="hover"
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className={cn(
        // Rechts unten, weiss auf gruen und auf dem Handy sichtbar (Absprachen.md:21).
        /* R188 / AAA (Video-Runde 21.08.): mobil deckte die Blase Fliesstext ab — gemessen
           auf der Startseite 390px an 14 von 35 Scrollpositionen, 17 ueberdeckte Textzeilen
           (worklog/.r188f6-wa.mjs), auf /preise sogar einen Preis in der Zeile "Schueler
           und Studenten" (worklog/shots/R188/after-final5-preise/preise/m-02.png).
           Ursache ist Geometrie, kein Einzelfall: die Blase mass 56px breit an x=314..370,
           die Inhaltsspalte laeuft bei 390px Viewport bis x=370 (Shell-Padding 20px). Der
           Knopf stand also vollstaendig IN der Textspalte. Ein vertikaler Lift verschiebt
           das Problem nur — genau daran haengen bereits sieben Route-Sonderregeln in
           index.css (R101, R138, R139 ...), jede fuer eine einzelne Stelle.
           Mobil ist die Blase deshalb ein kompakter 48px-Kreis am rechten Rand (right-3).
           Sie belegt jetzt x=338..386 und damit im Wesentlichen den Aussenrand rechts der
           Textkante statt die Spalte selbst. Ab sm bleibt alles unveraendert (h-14, right-6,
           Pillenform mit Label) — Desktop war nie der Befund. */
        'whatsapp-float group/wa fixed right-1 z-40 inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full px-0 sm:right-6 sm:h-14',
        // Kompakt heisst: Kreis statt Pille, weil sonst kein Platz bleibt (siehe Solver).
        compact ? 'sm:w-14 sm:px-0' : 'sm:w-auto sm:px-4',
        // Vor der ersten Messung steht der Knopf noch auf dem Grundplatz, ohne zu wissen, was
        // dort liegt. Er bleibt bis dahin unsichtbar; danach zuendet der Eintritt.
        hydrated && !placed && 'invisible pointer-events-none opacity-0',
        'bg-[var(--color-whatsapp)] text-white shadow-[0_10px_28px_rgba(17,17,17,0.16)] ring-1 ring-black/10',
        // R153: `t-hover-move` ist hier raus. Die Klasse deckte dieselben Eigenschaften ab
        // wie die Zeile darunter, setzte aber `transition-duration: var(--dur-base)` und
        // gewann per Reihenfolge gegen die Utility — gemessen 0.24s statt der gewollten
        // 0.42s. Die explizite `transition-[...]`-Zeile ist die Obermenge (plus `bottom`),
        // also bleibt nur sie.
        'hover:-translate-y-0.5 hover:bg-[var(--color-whatsapp-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)]',
        // `bottom` bleibt in der Transition, weil Cookie-Banner und Sticky-CTA den Knopf
        // im Betrieb verschieben. Der Auftritt selbst laeuft als CSS-Animation
        // (`.whatsapp-float` in index.css), nicht ueber diese Transition.
        // Dauer und Kurve kommen aus den Motion-Token statt aus einer eigenen 520ms-Zahl —
        // dieselbe Stufe wie der Auftritt in `.whatsapp-float`.
        /* Mobil springt `bottom` ohne Zwischenweg in den freien Kollisions-Slot. Eine
           420ms-Fahrt von Slot A nach B kreuzte unterwegs genau den Text, den der Solver
           freigibt (Verifier mass trotz korrektem Ziel weiter Treffer). Ab sm gibt es
           keine Kollisions-Slots; dort bleibt die ruhige Token-Dauer unveraendert. */
        /* Springt der Knopf in einen anderen Slot, faehrt er ohne Zwischenweg. Eine
           420ms-Fahrt von Slot A nach B kreuzte unterwegs genau den Inhalt, den der Solver
           freigibt (Verifier mass trotz korrektem Ziel weiter Treffer). Steht die Kopfzeile
           und liegt der Knopf auf seinem Ausgangsplatz, gibt es nichts zu kreuzen; dann
           bleibt die ruhige Token-Dauer. */
        collisionLift === 0 && headerDocked
          ? 'transition-[color,background-color,border-color,transform,opacity,box-shadow,bottom] duration-[var(--dur-slow)] ease-[var(--ease-sf)]'
          : 'transition-[color,background-color,border-color,transform,opacity,box-shadow,bottom] duration-0 ease-[var(--ease-sf)]',
        // R101: Seiten-Anker (z.B. /kursplan) setzt --whatsapp-lift per Media-Query auf :root.
        className,
      )}
      // bottom ist inline, weil er mehrere gemessene Höhen addiert. Der Solver schreibt
      // --whatsapp-collision-lift sofort auf das Element. React übernimmt denselben Wert danach.
      // So liegt der Knopf auch im Mess-Frame bereits im freien Slot.
      // --sticky-cta-height: der mobile Home-CTA-Balken (StickyCta) meldet seine Hoehe,
      // solange er sichtbar ist — der Float sass sonst genau auf dem roten Knopf.
      // R153: Der Cookie-Anteil laeuft ueber --cookie-float-lift, nicht mehr direkt ueber
      // --cookie-banner-height. Unter sm ist die Variable 0px: dort haelt der rechte Gutter
      // am Banner-Wrapper (CookieBanner.tsx) die Karte vom Knopf weg, und ein Vertikal-Lift
      // haette den Kreis auf den Hero-CTA «Schnupperstunde buchen» gehoben. Ab sm traegt die
      // Variable die gemessene Kartenhoehe und der Float steigt ueber die Karte.
      style={floatStyle}
    >
      {/* Echtes WhatsApp-Zeichen im gruenen Kreis (vorher generische Lucide-Sprechblase).
          Hover ist EINE Geste: das Icon kippt ein paar Grad und zoomt minimal. Kein
          zusaetzliches Verschieben, kein Doppeln. */}
      <motion.span
        className="inline-flex text-white"
        variants={reduced ? undefined : { hover: { rotate: -10, scale: 1.12 } }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
      </motion.span>
      {/* Das Label faellt beim Scrollen und bei Platzmangel weg. Das Icon bleibt;
          `aria-label` traegt den Namen weiter, also bleibt der Knopf fuer Screenreader und
          Tastatur unveraendert benannt. Der Wechsel Pille <-> Kreis ist eine
          Layout-Transition: Breite und Innenabstand federn weich, statt hart umzuschalten.
          Bei reduced-motion bleibt nur der kurze Opacity-Fade des Labels. */}
      <AnimatePresence initial={false}>
        {!compact && (
          <motion.span
            layout
            data-whatsapp-label
            initial={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: reduced ? 0.15 : 0.4 }}
            className="hidden overflow-hidden text-sm font-semibold whitespace-nowrap sm:inline-block"
          >
            WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
