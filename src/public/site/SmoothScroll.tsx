// Natives Dokument-Scrollen. Lenis ist aus (13.08.2026): Raphael konnte in der
// echten Session nicht scrollen. Lenis haelt eine eigene Scroll-Wahrheit und
// sperrt das Rad, sobald der Viewer Wheel-Events nicht sauber durchreicht.
//
// R188 / SW1 (Video 21.08., "ueberall Smooth Scroll mit dem Animate"). Der Wunsch ist
// erfuellt, aber NICHT durch die Rueckkehr einer Scroll-Bibliothek — der Grund, aus dem
// Lenis geflogen ist, gilt unveraendert. Stattdessen `scroll-behavior: smooth` auf dem
// Wurzelelement: das ist der Browser-eigene Weg, er faellt nie aus, und er kann das Rad
// per Konstruktion nicht sperren, weil er nur PROGRAMMATISCHE Spruenge weich macht
// (Anker-Klicks, `scrollTo`, Tastatur-Navigation). Wheel und Touch bleiben nativ.
//
// Warum per JavaScript gesetzt und nicht in index.css: `scroll-behavior: smooth` in einem
// Stylesheet gilt auch fuer den ersten Sprung nach dem Laden, wenn die URL einen Hash
// traegt — die Seite scrollt dann sichtbar von oben zum Anker, statt dort zu starten.
// Der Effekt wird hier deshalb erst nach dem Mount eingeschaltet.

import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Die Praeferenz kann sich waehrend der Sitzung aendern (Systemeinstellung, DevTools-
    // Emulation, und die Screenshot-Werkzeuge des Repos fahren mit reducedMotion:'reduce').
    // Darum nicht einmal lesen, sondern auf Aenderung hoeren.
    const apply = () => {
      root.style.scrollBehavior = media.matches ? 'auto' : 'smooth';
    };
    apply();
    media.addEventListener('change', apply);

    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: media.matches ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      media.removeEventListener('change', apply);
      document.removeEventListener('click', onAnchorClick);
      root.style.scrollBehavior = '';
    };
  }, []);

  return null;
}
