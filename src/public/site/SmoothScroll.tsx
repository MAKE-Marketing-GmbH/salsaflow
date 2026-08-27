import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const NESTED_SCROLL_SELECTOR = [
  '[data-lenis-prevent]',
  '[role="dialog"]',
  'dialog',
  'textarea',
  'select',
  '[contenteditable="true"]',
].join(',');

/* getComputedStyle ist zu teuer fuer den Wheel-Pfad (Lenis fragt `prevent` pro
   Wheel-Event fuer jeden Knoten der Event-Kette). Der overflow-y-Wert eines Knotens
   haengt an Klassen/Styles, nicht am Scrollzustand — er aendert sich in dieser Codebase
   nie zur Laufzeit. Ein veralteter Cache-Eintrag waere zudem harmlos: schlimmstenfalls
   greift Lenis auf einem frisch scrollbar gewordenen Container einmal zu frueh/spaet,
   und die WeakMap raeumt entfernte Knoten selbst ab. Darum keine Invalidierung. */
const overflowScrollableCache = new WeakMap<HTMLElement, boolean>();

function hasNativeVerticalScroll(node: HTMLElement) {
  // scrollHeight/clientHeight zuerst: billig, aendert sich mit dem Inhalt — nicht cachen.
  if (node.scrollHeight <= node.clientHeight + 1) return false;
  let scrollable = overflowScrollableCache.get(node);
  if (scrollable === undefined) {
    const overflowY = window.getComputedStyle(node).overflowY;
    scrollable = overflowY === 'auto' || overflowY === 'scroll';
    overflowScrollableCache.set(node, scrollable);
  }
  return scrollable;
}

/**
 * Lenis glättet ausschließlich Wheel-/Trackpad-Eingaben. Touch bleibt nativ (`syncTouch:
 * false`), damit die bewährte iOS-/Android-Physik erhalten bleibt. Formulare, Dialoge und
 * echte innere Scrollcontainer werden nicht abgefangen. Ohne JavaScript oder bei aktivierter
 * Reduced-Motion-Präferenz scrollt die Seite weiterhin vollständig nativ.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    let lenis: Lenis | null = null;

    const stop = () => {
      lenis?.destroy();
      lenis = null;
      delete root.dataset.smoothScroll;
      root.style.scrollBehavior = reducedMotion.matches ? 'auto' : '';
    };

    const start = () => {
      stop();
      // Touch bleibt ohnehin nativ. Auf echten Coarse-Pointer-Geräten Lenis gar nicht
      // erst starten, damit kein leerer 60-Hz-RAF-Loop im Hintergrund weiterläuft.
      if (reducedMotion.matches || coarsePointer.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.075,
        wheelMultiplier: 0.85,
        touchMultiplier: 1,
        overscroll: true,
        stopInertiaOnNavigate: true,
        anchors: {
          offset: -88,
          duration: 1.05,
          easing: (progress) => 1 - Math.pow(1 - progress, 5),
        },
        prevent: (node) => node.matches(NESTED_SCROLL_SELECTOR) || hasNativeVerticalScroll(node),
      });

      root.dataset.smoothScroll = 'lenis';
    };

    start();
    reducedMotion.addEventListener('change', start);
    coarsePointer.addEventListener('change', start);

    return () => {
      reducedMotion.removeEventListener('change', start);
      coarsePointer.removeEventListener('change', start);
      stop();
      // Waehrend einer Reduced-Phase setzt stop() bewusst `scrollBehavior: 'auto'`
      // (harte Anker-Spruenge statt smooth). Beim Unmount darf dieser Inline-Style
      // nicht auf <html> haengen bleiben — zurueck auf den Stylesheet-Default.
      root.style.scrollBehavior = '';
    };
  }, []);

  return null;
}
