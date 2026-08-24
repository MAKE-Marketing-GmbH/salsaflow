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

function hasNativeVerticalScroll(node: HTMLElement) {
  if (node.scrollHeight <= node.clientHeight + 1) return false;
  const overflowY = window.getComputedStyle(node).overflowY;
  return overflowY === 'auto' || overflowY === 'scroll';
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
    let lenis: Lenis | null = null;

    const stop = () => {
      lenis?.destroy();
      lenis = null;
      delete root.dataset.smoothScroll;
      root.style.scrollBehavior = reducedMotion.matches ? 'auto' : '';
    };

    const start = () => {
      stop();
      if (reducedMotion.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.09,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
        overscroll: true,
        stopInertiaOnNavigate: true,
        anchors: {
          offset: -88,
          duration: 0.9,
          easing: (progress) => 1 - Math.pow(1 - progress, 4),
        },
        prevent: (node) => node.matches(NESTED_SCROLL_SELECTOR) || hasNativeVerticalScroll(node),
      });

      root.dataset.smoothScroll = 'lenis';
    };

    start();
    reducedMotion.addEventListener('change', start);

    return () => {
      reducedMotion.removeEventListener('change', start);
      stop();
    };
  }, []);

  return null;
}
