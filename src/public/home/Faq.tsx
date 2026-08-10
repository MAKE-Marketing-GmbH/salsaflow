// S12 FAQ + FAQPage-Schema (Geil-Pass v2): die EINE kanonische FAQ sitewide. Hell, 1400px-Shell,
// zweispaltig editorial (links Kopf + CTA, rechts das Accordion). Die fruehere AnswerBox-SEO-Antwort
// ("Wo kann ich in Basel Salsa lernen?") lebt hier als ERSTE Frage weiter, damit die Keyword-Abdeckung
// fuer KI-Suche und Featured-Snippet nicht verloren geht. Das JSON-LD wird aus genau den gerenderten
// Fragen gebaut (inkl. der uebernommenen AnswerBox-Frage), bleibt also valide und deckungsgleich.
// Accordion via Grid-Trick (grid-template-rows 0fr -> 1fr, kein height-Animieren). Reduced-motion:
// Aufklappen instant. A11y: aria-expanded/-controls/-labelledby, role=region.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME_V3 } from '@/public/home/content-v3';
import { Shell, sectionTitle, sectionLead, CtaArrow } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function Faq() {
  const { lang } = useLang();
  const f = HOME_V3[lang].faq;
  const a = HOME_V3[lang].answer;
  const { item } = useReveal({ stagger: 0.06, distance: 12 });
  const [open, setOpen] = useState<number | null>(null);

  // Geretteter AnswerBox-Kern (Frage + SEO-Antwort) als erste Frage, danach die bestehende FAQ.
  const items = [{ q: a.question, a: a.body }, ...f.items];

  // FAQPage-Schema aus genau den gerenderten Fragen -> bleibt valide und Snippet-faehig.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  const lead =
    lang === 'de'
      ? 'Die häufigsten Fragen vor deiner ersten Stunde, kurz beantwortet.'
      : 'Quick answers to the most common questions before your first class.';

  return (
    <section id="faq" className={cn('scroll-mt-24 bg-[var(--color-paper-warm)]', SECTION_Y_HOME)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Shell>
        <div className="grid gap-y-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-x-16 xl:gap-x-24">
          {/* LINKS: Kopf-Schiene, bleibt beim Scrollen des Accordions stehen. */}
          <Reveal className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>
              {f.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-5 max-w-sm ${sectionLead}`}>
              {lead}
            </motion.p>
            <motion.a
              variants={item}
              href="/kontakt"
              className="group mt-7 inline-flex items-center gap-1.5 text-base font-semibold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-salsa-700)]"
            >
              {f.more}
              <CtaArrow className="transition-transform motion-safe:group-hover:translate-x-0.5" />
            </motion.a>
          </Reveal>

          {/* RECHTS: Das Accordion. Eine Naht-Linie oben/unten, feine Trenner zwischen den Fragen. */}
          <Reveal
            className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]"
            stagger={0.06}
          >
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <motion.div key={it.q} variants={item}>
                  <h3>
                    <button
                      id={`faq-q-${i}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      /* Kritiker-Befund 2026-08-09, "Mid-Sections (Levels/FAQ): vertikale
                         Rhythmen enger". Gemessen (Playwright, 1440px): jede Accordion-Zeile
                         war 77px hoch fuer eine EINZEILIGE Frage — 36px Chevron-Kreis plus
                         2x20px py-5. Bei acht Fragen sind das 616px Sektionshoehe, von denen
                         320px reines Zeilenpolster sind.
                         py-4 (2x16px) macht daraus 68px je Zeile, spart 64px ueber die
                         Sektion und bleibt mit 68px weit ueber dem 44px-Touchziel. Die
                         Sektionsraender bleiben unangetastet: sie stehen mit py-16 schon auf
                         der untersten in DESIGN.md erlaubten Stufe. */
                      className="group/btn flex w-full items-center justify-between gap-5 py-4 text-left"
                    >
                      <span className="font-display text-lg font-bold leading-snug tracking-[-0.01em] text-[var(--color-ink)] transition-colors group-hover/btn:text-[var(--color-salsa)] sm:text-xl">
                        {it.q}
                      </span>
                      {/* Chevron im Kreis. Aktiver Zustand = einziger roter Vollton (kein Pastell). */}
                      <span
                        aria-hidden
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-200 motion-reduce:transition-none ${
                          isOpen
                            ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
                            : 'border-[var(--color-line)] text-[var(--color-salsa)] group-hover/btn:border-[var(--color-salsa)]'
                        }`}
                      >
                        <ChevronDown
                          size={17}
                          strokeWidth={2.25}
                          className={`transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    hidden={!isOpen}
                    className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-4 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
                        {it.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
