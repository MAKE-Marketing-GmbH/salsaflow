import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Shell, sectionLead } from '@/public/site/primitives';
import { MEASURE_L, MEASURE_M, SECTION_Y } from '@/public/home/kit';
import { cn } from '@/lib/utils';

const COPY = {
  de: {
    title: 'Vom ersten Grundschritt zur sicheren Tanzfläche.',
    lead: 'Unsere Kurse sind klar aufgebaut. Du lernst Schritt für Schritt und wächst in dein nächstes Level hinein.',
    levels: [
      ['Beginner Stufe 1 bis 6', 'Rhythmus, Grundschritte, Drehungen und die wichtigsten Signale im Paartanz.'],
      ['Beginner Flow', 'Beginner-Inhalte verbinden, Timing festigen und freier tanzen.'],
      ['Intermediate Stufe 7 bis 12', 'Technik, Musikalität und komplexere Kombinationen aufbauen.'],
      ['Intermediate Flow', 'Intermediate-Inhalte variieren und sicher auf der Tanzfläche einsetzen.'],
      ['Advanced ab Stufe 13', 'Details, Dynamik, Flow und eigenen Ausdruck vertiefen.'],
    ],
    fact: 'Eine Kursstaffel dauert in der Regel 8 Wochen mit einer Lektion à 60 Minuten pro Woche.',
    cta: 'Welches Level passt zu mir?',
  },
  en: {
    title: 'From your first steps to dancing with confidence.',
    lead: 'Our classes follow a clear path. You learn step by step and grow into your next level.',
    levels: [
      ['Beginner stages 1 to 6', 'Rhythm, basic steps, turns and the most important partner-dance signals.'],
      ['Beginner Flow', 'Connect the beginner material, strengthen your timing and dance more freely.'],
      ['Intermediate stages 7 to 12', 'Build technique, musicality and more complex combinations.'],
      ['Intermediate Flow', 'Vary the intermediate material and use it confidently on the dance floor.'],
      ['Advanced from stage 13', 'Refine detail, dynamics, flow and individual expression.'],
    ],
    fact: 'A regular course block usually runs for 8 weeks with one 60-minute class per week.',
    cta: 'Which level fits me?',
  },
} as const;

export function CoursePath({ embedded = false }: { embedded?: boolean } = {}) {
  const { lang } = useLang();
  const c = COPY[lang];

  const Heading = embedded ? 'h3' : 'h2';

  const body = (
    <>
        <div className="max-w-3xl">
          <Heading
            className={cn(
              'font-display font-bold leading-[0.98] tracking-tight text-[var(--color-ink)]',
              embedded
                ? 'text-2xl sm:text-3xl md:text-[2.25rem]'
                : 'text-3xl sm:text-4xl md:text-[2.75rem]',
              MEASURE_L,
            )}
          >
            {c.title}
          </Heading>
          <p className={`mt-4 max-w-xl ${sectionLead}`}>{c.lead}</p>
          <a
            href="/kursaufbau"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--color-salsa)]"
          >
            {c.cta}
            <ArrowRight size={17} strokeWidth={2.25} className="transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        <div className={cn('grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16', embedded ? 'mt-10 lg:mt-12' : 'mt-12 lg:mt-16')}>
          <ol className="relative order-2 lg:order-1">
            <span aria-hidden className="absolute left-[3px] top-2 bottom-8 w-px bg-[var(--color-line)]" />
            {c.levels.map(([name, body], i) => {
              const LevelHeading = embedded ? 'h4' : 'h3';
              return (
                <li key={name} className="group relative pb-9 pl-8 last:pb-0">
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-2 h-[9px] w-[9px] rounded-full bg-[var(--color-salsa)] ring-4',
                      embedded ? 'ring-[var(--color-paper-warm)]' : 'ring-[var(--color-paper)]',
                      'transition-transform duration-300 ease-out motion-safe:group-hover:scale-150',
                    )}
                  />
                  <LevelHeading
                    className={cn(
                      'font-display text-2xl font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]',
                      MEASURE_M,
                    )}
                  >
                    <span className="mr-2.5 tabular-nums text-[var(--color-salsa)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {name}
                  </LevelHeading>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
                    {body}
                  </p>
                </li>
              );
            })}

            <p className="mt-9 flex max-w-xl items-start gap-3 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              <CalendarDays aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-salsa)]" strokeWidth={1.8} />
              <span>{c.fact}</span>
            </p>
          </ol>

          <figure className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <div className="relative h-64 overflow-hidden rounded-[var(--radius-media)] sm:h-80 lg:h-[30rem]">
              <img
                src="/photos/party/party-36.webp"
                alt={
                  lang === 'de'
                    ? 'Eine volle Kursgruppe übt gemeinsam im hellen Salsaflow-Studio'
                    : 'A full class practising together in the bright Salsaflow studio'
                }
                width={1500}
                height={1000}
                loading="lazy"
                className="h-full w-full origin-bottom scale-[1.35] object-cover object-center"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent" />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Beginner-Kurs im Studio am Bahnhof SBB. So sieht eine normale Lektion aus.'
                : 'A beginner class at our studio by Basel SBB. This is what a normal lesson looks like.'}
            </figcaption>
          </figure>
        </div>
    </>
  );

  if (embedded) {
    return (
      <div id="kursaufbau" className="mt-10 scroll-mt-24 border-t border-[var(--color-line)] pt-8">
        {body}
      </div>
    );
  }

  return (
    <section id="kursaufbau" className={cn('scroll-mt-24 bg-[var(--color-paper)]', SECTION_Y)}>
      <Shell>{body}</Shell>
    </section>
  );
}
