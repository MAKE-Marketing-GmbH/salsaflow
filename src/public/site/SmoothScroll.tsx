// Desktop-only Smooth-Scroll via Lenis (Home-Redesign 2026-07, Motion-Lane).
// Ruhig und hochwertig gekoppelt an framer-motion: Lenis scrollt das echte Dokument,
// darum bleiben IntersectionObserver, whileInView und useInView korrekt.
//
// Regeln:
// - NUR Desktop: bei Touch (pointer: coarse) ODER Breite < 1024px bleibt natives Scrollen.
// - prefers-reduced-motion: reduce -> Lenis aus.
// - Anker-Links (#id) werden smooth angesteuert, sonst greift der Browser-Default.
// - Sauberer Cleanup beim Unmount (rAF stoppen, Listener weg, Lenis zerstoeren).
//
// Lenis wird dynamisch geladen, damit Mobile/Reduced das Bundle gar nicht zieht.

import { useEffect } from 'react';
import type Lenis from 'lenis';

export function SmoothScroll() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 1023px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Ohne Lenis (mobil/schmal) trug bisher `html { scroll-behavior: smooth }` die weichen
     * Anker-Spruenge. Die Regel konnte aber Nutzer-Absicht nicht von Automatik unterscheiden
     * und hat auch jedes `window.scrollTo(0,0)` animiert (siehe index.css, Issue 1).
     *
     * Darum liegt die Weichheit jetzt hier: nur der Anker-KLICK scrollt smooth, alles andere
     * springt sofort. Gleiche Wirkung fuer Nutzer, ohne den globalen Nebeneffekt.
     * `reduced` respektiert prefers-reduced-motion (dort bleibt es hart). */
    if (coarse || narrow || reduced) {
      if (reduced) return;
      const onAnchorClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        const href = anchor?.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.getElementById(decodeURIComponent(href.slice(1)));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      };
      document.addEventListener('click', onAnchorClick);
      return () => document.removeEventListener('click', onAnchorClick);
    }

    let lenis: Lenis | null = null;
    let rafId = 0;
    let cancelled = false;
    let cleanupClick = () => {};
    let cleanupHash = () => {};
    let cleanupSync = () => {};

    void import('lenis').then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({
        // Geil-Pass 2026-07-07: lerp-basiert statt duration-basiert. Duration 1.05 gab
        // einen ~1s-Nachlauf nach dem Loslassen des Rads ("schwebend, unrealistisch").
        // lerp 0.16 folgt der Hand: kurzer, natuerlicher Glide, kein Eigenleben.
        lerp: 0.16,
        wheelMultiplier: 1,
        smoothWheel: true,
      });
      // Lenis uebernimmt das Scrollen -> natives CSS-smooth abschalten, sonst doppelt es
      // bei Anker-Spruengen (index.css schaltet ueber html.lenis-active auf auto).
      document.documentElement.classList.add('lenis-active');

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      const scrollToHash = (hash: string, immediate = false) => {
        const id = decodeURIComponent(hash.replace(/^#/, ''));
        const target = id ? document.getElementById(id) : null;
        if (!target) return false;
        const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
        lenis?.scrollTo(target, { offset: -(navHeight + 12), immediate });
        return true;
      };

      // Anker-Links smooth: URL bleibt teilbar und der feste Header bekommt seinen Abstand.
      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as
          | HTMLAnchorElement
          | null;
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        if (!scrollToHash(href)) return;
        e.preventDefault();
        window.history.pushState(null, '', href);
      };
      document.addEventListener('click', onClick);
      cleanupClick = () => document.removeEventListener('click', onClick);

      const onHashChange = () => scrollToHash(window.location.hash);
      window.addEventListener('hashchange', onHashChange);
      cleanupHash = () => window.removeEventListener('hashchange', onHashChange);
      if (window.location.hash) window.requestAnimationFrame(() => scrollToHash(window.location.hash, true));

      /* Design-Kritik Runde 3, Issue 1 ("Header-Pille rendert mitten im Inhalt").
       *
       * Root-Cause, gemessen — nicht der fixe Header und nicht das Capture-Skript:
       * Lenis haelt mit `animatedScroll` eine EIGENE Scroll-Wahrheit und schreibt sie in
       * jedem rAF-Frame per `setScroll()` zurueck ins Dokument. Ein programmatisches
       * `window.scrollTo(0, 0)` setzt zwar sofort `document.scrollingElement.scrollTop`,
       * aber Lenis kennt diesen Sprung nicht: sein `onNativeScroll`-Handler uebernimmt
       * fremde Positionen nur, solange `isScrolling === false | 'native'`. Direkt nach
       * einer Scroll-Serie steht das Flag auf 'smooth', der Handler steigt aus — und der
       * naechste Frame ueberschreibt die 0 wieder mit dem alten `animatedScroll`. Danach
       * laeuft der lerp (0.16) von dort aus zurueck nach 0.
       *
       * Gemessen auf /tanzkurse/heels, 1440px (Frame fuer Frame nach `scrollTo(0,0)`):
       *   3654,3652,3645,3632,3613,3586,3549,...,261,235,210  -> ~1.5s bis 0 erreicht ist.
       * Ohne Lenis (reducedMotion=reduce) ist derselbe Ablauf sofort bei 0.
       *
       * Folge: JEDE Automatisierung, die scrollt und dann sofort liest — Full-Page-
       * Screenshot, Print-to-PDF, `scrollIntoView` von aussen, Testing-Tools — sieht eine
       * Position, die die Seite laut DOM gar nicht mehr hat. Der fixe Header friert dabei
       * mitten im Inhalt ein. Der Vorschlag aus der Kritik (Header auf sticky) behebt das
       * NICHT: gegengetestet mit `position:sticky` bei scrollY=1200 rendert die Pille
       * weiterhin quer ueber den Karten (/tmp/v-B-at1200.png) — sie ist Symptom, nicht
       * Ursache. Gleiches gilt fuer ein Style-Override im Capture-Skript: das haette nur
       * das Artefakt uebermalt und den Scroll-Desync stehen lassen.
       *
       * Fix an der Ursache: fremde Scroll-Spruenge zurueck in Lenis spiegeln. `resize()`
       * ist die dokumentierte oeffentliche Methode, die `animatedScroll` und `targetScroll`
       * hart auf `actualScroll` zieht (lenis.d.ts:399; die interne `reset()` ist private).
       * Wir tun das nur, wenn die Positionen wirklich auseinanderlaufen UND die Abweichung
       * groesser ist als ein lerp-Schritt — so bleibt der normale Rad-/Anker-Glide, der
       * hier Absicht ist, voellig unberuehrt. */
      /* Erkennung: waehrend Lenis selbst scrollt, hat es `animatedScroll` gerade eben per
       * setScroll() ins Dokument geschrieben — actualScroll und animatedScroll liegen dann
       * unter 1px auseinander. Ein fremder Sprung reisst sie um hunderte Pixel auseinander.
       * Die Schwelle trennt beides sauber, ohne den normalen Rad-Glide anzufassen.
       *
       * `scrollTo(..., immediate)` ist bewusst gewaehlt und nicht `resize()`: nur der
       * immediate-Pfad ruft intern `reset()` und damit `animate.stop()` (lenis.mjs:797-806).
       * `resize()` allein setzt zwar animatedScroll, laesst aber eine laufende Animation
       * weiterlaufen — die haette die Korrektur im naechsten Frame wieder ueberschrieben. */
      const JUMP_PX = 8;
      const syncFromNativeScroll = () => {
        const l = lenis;
        if (!l) return;
        if (Math.abs(l.actualScroll - l.animatedScroll) <= JUMP_PX) return;
        l.scrollTo(l.actualScroll, { immediate: true, force: true });
      };
      window.addEventListener('scroll', syncFromNativeScroll, { passive: true });
      cleanupSync = () => window.removeEventListener('scroll', syncFromNativeScroll);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupClick();
      cleanupHash();
      cleanupSync();
      lenis?.destroy();
      document.documentElement.classList.remove('lenis-active');
    };
  }, []);

  return null;
}
