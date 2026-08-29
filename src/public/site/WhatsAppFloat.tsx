// WhatsApp-Floating-Knopf (Sitewide-Shell). Fix unten rechts, direkter Draht
// zu +41 76 478 84 11. Liegt z-technisch unter dem Nav-Drawer (z-50).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer
// traegt im Entry-CTA-Band einen eigenen WhatsApp-Button.
//
// Bauform (2026-08-28, .claude/product-design.md): Kreis, WhatsApp-Gruen, weisser Glyph.
//
// Vorher war der Knopf eine PILLE mit dem Wort «WhatsApp» daneben, die beim Scrollen
// ihre Breite animierte, in dunklem #075e54. Drei Korrekturen, in dieser Reihenfolge:
//
//   1. FORM. Das Label wurde auf sieben Routen per CSS wieder ausgeblendet
//      (privatstunden, kursaufbau, events, team, faq, collabs, tanzschuhe+partys).
//      Sieben Ausnahmen gegen eine Regel heissen, dass die Regel falsch war. Der
//      Kreis ist jetzt der Normalfall; die Sonderregeln sind aus index.css entfernt.
//      Das Label lebt als Hover-Tooltip weiter.
//   2. FARBE, erster Anlauf: Salsa-Rot, weil #075e54 die einzige Farbe ausserhalb
//      der Palette war und die Ecke staerker zog als der CTA.
//   3. FARBE, korrigiert (Raphael 28.08., «nicht dunkelgruen, sondern das
//      WhatsApp-Gruen»): #25d366, die offizielle Markenfarbe. Der Einwand gegen
//      Rot ist berechtigt — ein WhatsApp-Knopf in der Hausfarbe wird als Kanal nicht
//      mehr erkannt, und die Wiedererkennung ist hier wichtiger als die Palette-
//      Reinheit. Das Problem am alten Zustand war nie «gruen», sondern «dunkelgruen»:
//      #075e54 stammt aus dem alten Logo und wirkt auf warmem Papier wie ein Loch.
//      #25d366 ist hell, sitzt im selben Helligkeitsband wie das Papier und liest
//      sich als Marke statt als Fremdkoerper. Die Farbe liegt im Token
//      --color-whatsapp (index.css), nicht als Literal hier.
//
// Damit faellt auch der Scroll-Listener weg, der nur die Pillenbreite steuerte:
// ein Kreis hat keinen kompakten und keinen offenen Zustand. Das Label lebt als
// Tooltip weiter, der ausschliesslich bei feinem Zeiger erscheint.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

// R211: Plan-Spec 01-home.md fordert den Chat mit vorbereitetem Text — wer den Knopf
// tippt, soll nicht vor einem leeren Eingabefeld ueberlegen muessen, wie man eine
// Tanzschule anschreibt. Der Satz laesst alle Anliegen offen und ist sofort abschickbar.
const WHATSAPP_BASE = 'https://wa.me/41764788411';
const PREFILL = {
  de: 'Hallo Salsaflow! Ich habe eine Frage zu euren Kursen.',
  en: 'Hi Salsaflow! I have a question about your classes.',
} as const;

export function WhatsAppFloat({ raised = false, className = '' }: { raised?: boolean; className?: string }) {
  const { lang } = useLang();
  const whatsappUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent(lang === 'de' ? PREFILL.de : PREFILL.en)}`;
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
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      initial={false}
      whileHover="hover"
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', bounce: 0.18, duration: reduced ? 0.2 : 0.5 }}
      className={cn(
        /* R219 (Raphael 29.08.): WhatsApp soll auf Mobil prominent unten rechts stehen —
           der Float ist jetzt auf ALLEN Breakpoints sichtbar. Die fruehere Mobil-Ausblendung
           (Sticky-CTA-Kollision) ist ueberholt: der bottom-Calc unten hebt den Kreis bereits
           um --sticky-cta-height und --cookie-float-lift an, eine Ausblendung ist damit
           nicht mehr noetig. /kursplan bleibt per float={false} ohne Kreis (gemessene
           Karten-Kollision, SchedulePage). */
        'whatsapp-float group/wa font-sans fixed right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full sm:right-6',
        /* Der Schatten traegt den Gruenton statt eines neutralen Grau: ein farbiger
           Schatten unter einem farbigen Knopf liest sich als Licht, ein grauer als
           Schmutz. Der Ring ist eine haarfeine dunkle Kante, damit der Kreis auf dem
           warmen Papier eine Kontur behaelt — kein Rahmen, nur ein Abschluss. */
        'bg-[var(--color-whatsapp)] text-white shadow-[0_12px_32px_rgba(37,211,102,0.35)] ring-1 ring-black/10',
        'hover:bg-[var(--color-whatsapp-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)] focus-visible:ring-offset-2',
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
