// WhatsApp-Floating-Knopf (Sitewide-Shell). Fix unten rechts, direkter Draht
// zu +41 76 478 84 11. Weiss auf WhatsApp-Gruen ist eine feste Kundenabsprache
// (wiki/absprachen.md:21). Liegt z-technisch unter dem Nav-Drawer (z-50).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer
// traegt im Entry-CTA-Band einen eigenen WhatsApp-Button.

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

export function WhatsAppFloat({ raised = false, className = '' }: { raised?: boolean; className?: string }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  const [footerInView, setFooterInView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const compactRef = useRef(false);
  const [compact, setCompact] = useState(false);
  const reduced = useReducedMotion();

  const commitCompact = useCallback((next: boolean) => {
    if (compactRef.current === next) return;
    compactRef.current = next;
    setCompact(next);
  }, []);

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

  useEffect(() => {
    let idleTimer = 0;
    const onScroll = () => {
      window.clearTimeout(idleTimer);
      commitCompact(true);
      idleTimer = window.setTimeout(() => commitCompact(false), 2400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [commitCompact]);

  if (footerInView || dialogOpen) return null;

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      initial={false}
      transition={{ type: 'spring', bounce: 0.18, duration: reduced ? 0.2 : 0.55 }}
      whileHover="hover"
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className={cn(
        'whatsapp-float group/wa font-sans fixed right-6 z-40 hidden h-14 w-14 items-center justify-center gap-2 rounded-full px-0 lg:inline-flex',
        compact ? 'lg:w-14 lg:px-0' : 'lg:w-auto lg:px-4',
        'bg-[var(--color-whatsapp)] text-white shadow-[0_10px_28px_rgba(17,17,17,0.16)] ring-1 ring-black/10',
        'hover:bg-[var(--color-whatsapp-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)]',
        'transition-[color,background-color,border-color,opacity,box-shadow] duration-[var(--dur-slow)] ease-[var(--motion-out)]',
        className,
      )}
      style={{
        bottom: raised
          ? 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--cookie-float-lift, 0px) + var(--whatsapp-lift, 0px))'
          : 'calc(1.25rem + var(--sticky-cta-height, 0px) + var(--whatsapp-lift, 0px))',
      }}
    >
      <motion.span
        className="inline-flex text-white"
        variants={reduced ? undefined : { hover: { rotate: -10, scale: 1.12 } }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
      </motion.span>
      <AnimatePresence initial={false}>
        {!compact && (
          <motion.span
            data-whatsapp-label
            initial={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: reduced ? 0.15 : 0.4 }}
            className="hidden overflow-hidden font-sans text-sm font-medium tracking-normal whitespace-nowrap lg:inline-block"
          >
            WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
