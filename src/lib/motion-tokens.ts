/** Der EINE Reveal-Takt der Site. Marketing, nicht UI: langsamer Ease-Out,
 *  leichter Blur, einmal. Reduced Motion behaelt nur Opacity. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -4% 0px' } as const;
export const REVEAL_DURATION = 0.72;
export const REVEAL_DISTANCE = 24;
export const REVEAL_BLUR = 8;
export const REVEAL_STAGGER = 0.05;
