// Natives Dokument-Scrollen. Lenis ist aus (13.08.2026): Raphael konnte in der
// echten Session nicht scrollen. Lenis haelt eine eigene Scroll-Wahrheit und
// sperrt das Rad, sobald der Viewer Wheel-Events nicht sauber durchreicht.
// Anker-Klicks bleiben weich, alles andere springt sofort.

import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const href = anchor?.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    };
    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, []);

  return null;
}
