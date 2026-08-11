import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME, type OfferCard } from '@/public/home/content';
import { Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MEASURE_L, MEASURE_M, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

function FeaturedStyle({ card }: { card: OfferCard }) {
  const { lang } = useLang();

  return (
    <a
      href={card.href}
      aria-label={`${card.title}: ${card.hint}`}
      className="group relative isolate flex min-h-[31rem] overflow-hidden rounded-[1.5rem] bg-[var(--color-ink)] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:rounded-[2.5rem] lg:min-h-[42rem]"
    >
      {/* width/height sind die INTRINSISCHEN Masse der Datei (Seitenverhaeltnis-Hinweis fuers
          Layout). Sie standen fest auf 1200x1600 (Hochformat) — mit dem neuen Salsa-Motiv
          kurs-01.jpg (1600x1067, Querformat, siehe content.ts) waere daraus ein falsches
          Verhaeltnis und damit ein Layout-Shift geworden. Das Bild liegt absolut im Rahmen,
          die sichtbare Form bestimmt der Container, nicht diese Zahlen. */}
      <img
        src={card.photo}
        alt={card.alt}
        className="absolute inset-0 h-full w-full object-cover object-[center_42%] transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
        width={1600}
        height={1067}
        loading="lazy"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-transparent to-transparent" />
      <div className="relative z-10 mt-auto max-w-xl p-6 sm:p-8 lg:p-10">
        <span className="text-sm font-semibold text-white/80">{card.hint}</span>
        <h3
          className={cn(
            'mt-3 font-display text-[2.35rem] leading-[0.94] tracking-[-0.025em] sm:text-[3.1rem]',
            MEASURE_L,
          )}
        >
          {card.title}
        </h3>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/80">{card.text}</p>
        <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold">
          {lang === 'de' ? 'Salsa entdecken' : 'Explore salsa'}
          <ArrowRight aria-hidden size={18} strokeWidth={2.25} className="transition-transform motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

function StyleRow({ card, index }: { card: OfferCard; index: number }) {
  return (
    <a
      href={card.href}
      aria-label={`${card.title}: ${card.hint}`}
      className="group grid min-h-[10rem] grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--color-line)] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-6"
    >

      <div className="h-24 overflow-hidden rounded-[1.25rem] bg-[var(--color-bg-soft)] transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5 sm:h-32 sm:rounded-[1.5rem]">
        <img
          src={card.photo}
          alt={card.alt}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.035]',
            card.key === 'bachata' ? 'photo-grade-bachata' : card.key === 'privat' ? 'photo-grade-private' : undefined,
            index === 1 ? 'object-[center_36%]' : index === 2 ? 'object-[center_20%]' : 'object-[center_46%]',
          )}
          width={card.key === 'privat' ? 1800 : card.key === 'bachata' ? 2752 : 1200}
          height={card.key === 'privat' ? 1200 : card.key === 'bachata' ? 1536 : 1600}
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <span className="text-xs font-semibold text-[var(--color-salsa)]">{card.hint}</span>
        <h3
          className={cn(
            'mt-1 font-display text-[1.4rem] leading-[1] tracking-[-0.02em] text-[var(--color-ink)] sm:text-[1.75rem]',
            MEASURE_M,
          )}
        >
          {card.title}
        </h3>
      </div>
      <ArrowRight aria-hidden size={20} strokeWidth={2} className="text-[var(--color-ink)] transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-[var(--color-salsa)]" />
    </a>
  );
}

export function Offer() {
  const { lang } = useLang();
  const o = HOME[lang].offer;
  const { item } = useReveal({ stagger: 0.07 });

  return (
    <section id="angebot" className={cn('relative scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}>
      <Shell>
        <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
          <motion.h2
            variants={item}
            className={cn(
              'font-display text-[2.5rem] leading-[0.96] tracking-[-0.03em] text-[var(--color-ink)] sm:text-[3.5rem] lg:text-[4rem]',
              MEASURE_L,
            )}
          >
            {o.title}
          </motion.h2>
          <motion.p variants={item} className="max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {o.lead}
          </motion.p>
        </Reveal>

        <Reveal className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12" stagger={0.07}>
          <motion.div variants={item} className="min-w-0 lg:-mb-8">
            <FeaturedStyle card={o.cards[0]} />
          </motion.div>
          <motion.div variants={item} className="border-t border-[var(--color-line)] lg:pt-2">
            {o.cards.slice(1).map((card, index) => (
              <StyleRow key={card.key} card={card} index={index + 1} />
            ))}
          </motion.div>
        </Reveal>


        <Reveal className="mt-10 lg:mt-12">
          <motion.a
            variants={item}
            href="/tanzkurse"
            className="group inline-flex min-h-11 items-center gap-2 border-t border-[var(--color-line)] pt-5 text-base font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4"
          >
            {lang === 'de'
              ? 'Alle Tanzkurse im Überblick'
              : 'See all dance classes'}
            <ArrowRight aria-hidden size={18} strokeWidth={2.25} className="transition-transform motion-safe:group-hover:translate-x-0.5" />
          </motion.a>
        </Reveal>
      </Shell>
    </section>
  );
}
