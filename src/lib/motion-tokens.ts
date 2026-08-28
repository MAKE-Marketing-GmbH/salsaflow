/** Der EINE Reveal-Takt der Site. Marketing, nicht UI: langsamer Ease-Out,
 *  leichter Blur, einmal. Reduced Motion behaelt nur Opacity.
 *
 *  R206 (2026-08-28): Takt bewusst verlangsamt und aufgefaechert. Der Auftrag lautete
 *  «Animationen etwas langsamer, Element fuer Element, bisschen taenzerisch» —
 *  uebersetzt in Werte statt in Gefuehl:
 *
 *    DURATION 0.72 -> 0.86   Traegt laenger. Das ist Marketing-Motion, kein UI: die
 *                           300ms-Regel der Motion-Doktrin gilt fuer Dropdowns und
 *                           Tooltips, nicht fuer einen Abschnitt, der beim Scrollen
 *                           EINMAL hereinkommt.
 *    STAGGER  0.05 -> 0.085  Macht «Element fuer Element» ueberhaupt erst hoerbar. Bei
 *                           50ms verschwimmen sechs Karten zu einer Flaeche. 85ms liegt
 *                           am oberen Ende des 30-80ms-Korridors der Doktrin — bewusst,
 *                           weil die laengere Dauer sonst die Staffel ueberdeckt.
 *    DISTANCE 24 -> 28       Mehr Weg traegt die laengere Dauer. Ohne das wirkt die
 *                           Bewegung gedehnt statt ruhig.
 *    DRIFT    neu, 6px       Der seitliche Ausholer: ein Element kommt leicht aus der
 *                           Seite herein und findet zur Mitte. Das ist das
 *                           «Taenzerische» — ein Schritt, der ankommt, kein Nachwippen.
 *                           Kein Bounce (im Repo als AI-Slop-Tell gesperrt), kein
 *                           Overshoot, keine Rotation. Wer den Versatz bewusst bemerkt,
 *                           sieht zu viel davon.
 *
 *  Die Kurve bleibt unveraendert: eine Ease-Out-Familie fuer die ganze Site.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -4% 0px' } as const;
export const REVEAL_DURATION = 0.86;
export const REVEAL_DISTANCE = 28;
export const REVEAL_BLUR = 8;
export const REVEAL_STAGGER = 0.085;
/** Seitlicher Ausholer beim Eintritt. Alterniert pro Gruppe, siehe reveal.tsx. */
export const REVEAL_DRIFT = 6;
