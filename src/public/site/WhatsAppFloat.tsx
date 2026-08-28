// WhatsApp-Floating-Knopf (Sitewide-Shell). Fix unten rechts, direkter Draht
// zu +41 76 478 84 11. Liegt z-technisch unter dem Nav-Drawer (z-50).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer
// traegt im Entry-CTA-Band einen eigenen WhatsApp-Button.
//
// Bauform (2026-08-28, .claude/product-design.md): Kreis, Salsa-Rot, weisser Glyph.
//
// Vorher war der Knopf eine dunkelgruene Pille mit dem Wort «WhatsApp» daneben, die
// beim Scrollen ihre Breite animierte. Zwei Dinge stimmten daran nicht:
//
//   1. Gruen (#075e54) war die einzige Farbe der Seite ausserhalb der Palette.
//      DESIGN.md haelt EINE Akzentfarbe fest; der Float war die Ausnahme, und im
//      Screenshot war er genau deshalb das Erste, was ins Auge sprang — nicht der
//      CTA, sondern die Ecke. Die Wiedererkennung traegt der Glyph, nicht der Grund.
//   2. Das Label wurde auf sieben Routen per CSS wieder ausgeblendet
//      (privatstunden, kursaufbau, events, team, faq, collabs, tanzschuhe+partys).
//      Sieben Ausnahmen gegen eine Regel heissen, dass die Regel falsch war. Der
//      Kreis ist jetzt der Normalfall; die Sonderregeln sind aus index.css entfernt.
//
// Damit faellt auch der Scroll-Listener weg, der nur die Pillenbreite steuerte:
// ein Kreis hat keinen kompakten und keinen offenen Zustand. Das Label lebt als
// Tooltip weiter, der ausschliesslich bei feinem Zeiger erscheint.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

export function WhatsAppFloat({ raised = false, className = '' }: { raised?: boolean; className?: string }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  const tooltip = lang === 'de' ? 'Schreib uns' : 'Message us';
  const [footerInView, setFooterInView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterInView(!!entry?.isIntersecting),
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
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-testid'],
    });
    return () => obs.disconnect();
  }, []);

  if (footerInView || dialogOpen) return null;

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      initial={false}
      whileHover="hover"
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', bounce: 0.18, duration: reduced ? 0.2 : 0.5 }}
      className={cn(
        'whatsapp-float group/wa font-sans fixed right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full lg:inline-flex',
        'bg-[var(--color-salsa)] text-white shadow-[0_12px_32px_rgba(173,24,39,0.28)] ring-1 ring-black/5',
        'hover:bg-[var(--color-salsa-700)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2',
        'transition-[background-color,box-shadow] duration-[var(--dur-base)] ease-[var(--motion-out)]',
        className,
      )}
      style={{
        bottom: raised
          ? 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--cookie-float-lift, 0px) + var(--whatsapp-lift, 0px))'
          : 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--whatsapp-lift, 0px))',
      }}
    >
      {/* Der Glyph neigt sich beim Hover leicht an — dieselbe Geste wie vorher, nur ohne
          die Breiten-Animation drumherum. Feder statt Kurve, weil der Zeiger den Zustand
          jederzeit umkehren kann und eine Feder die Velocity mitnimmt. */}
      <motion.span
        className="inline-flex text-white"
        variants={reduced ? undefined : { hover: { rotate: -10, scale: 1.1 } }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.4 }}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
      </motion.span>

      {/* Das Label als Tooltip statt als Teil des Knopfes: er faehrt nur bei feinem
          Zeiger aus (data-wa-tip + Media-Query in index.css). Auf Touch existiert er
          nicht — dort wuerde er beim Tap kleben und die Ecke zustellen. Der Knopf traegt
          seinen Namen ohnehin in aria-label. */}
      <span
        data-wa-tip
        aria-hidden="true"
        className="pointer-events-none absolute right-[calc(100%+0.75rem)] whitespace-nowrap rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-sm font-medium text-white shadow-lg"
      >
        {tooltip}
      </span>
    </motion.a>
  );
}
