
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  CheckList,
  PrimaryCta,
  GhostCta,
  CtaArrow,
  Shell,
  TitleAccent,
  BeatMark,
  sectionTitle,
  MEASURE_L,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { PREISE, type PreiseContent, type PriceRow, type PriceGroup } from '@/public/preise/content';

export function PreisePage() {
  const { lang } = useLang();
  const c = PREISE[lang];

  const [cookieClear, setCookieClear] = useState(false);
  useEffect(() => {
    if (window.scrollY > 0) {
      setCookieClear(true);
      return;
    }
    const clearOnFirstScroll = () => setCookieClear(true);
    window.addEventListener('scroll', clearOnFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', clearOnFirstScroll);
  }, []);
  return (
    <SubPageShell seo="preise">
      <div className="preise-page" data-cookie-clear={cookieClear ? 'true' : undefined} />
      {/* Kein Eyebrow: "Preise & Optionen" stand direkt ueber der H1 "Preise fuer Kurse,
          Workshops und Privatstunden." und wiederholte nur deren erstes Wort. Die Breadcrumb
          darueber sagt bereits "Preise" — dreimal dasselbe Wort in 40px Hoehe. */}


      <SubHero
        axis="center"
        seoCrumbs={[c.crumb]}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        facts={c.hero.facts}
        media={c.hero.media}
      />
      <RegularSection c={c} />
      <PrivatSection c={c} />
      <WorkshopsSection c={c} />
      <PassSection c={c} />
      <FitSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} titleAccent={c.faqTitleAccent} items={c.faq} />
    </SubPageShell>
  );
}

/* ----------------------------------------------------------------- Preis-Tabellen */
/** Flache Preis-Tabelle. Rot-Dosierung: nur die erste (Anker-)Zeile rot, der Rest in Ink. */
function PriceRows({ rows, onRequest }: { rows: PriceRow[]; onRequest: string }) {
  return (
    <dl className="border-t border-[var(--color-line)]">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 last:border-b-0"
        >
          <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
          <dd
            className={cn(
              'shrink-0 font-display text-base font-extrabold tabular-nums',
              i === 0 ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
            )}
          >
            {row.value ?? onRequest}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Gruppierte Preis-Tabelle (Einzeln / Zu zweit / Einzellektion). Rot nur der Anker (erste
 *  Zeile der ersten Gruppe), damit die Rot-Dosierung sitewide gleich bleibt. */
function GroupedPrices({ groups, onRequest }: { groups: PriceGroup[]; onRequest: string }) {
  return (
    <div className="grid gap-6">
      {groups.map((g, gi) => (
        <div key={g.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{g.label}</p>
          <dl className="mt-2.5 border-t border-[var(--color-line)]">
            {g.rows.map((row, ri) => {
              const anchor = gi === 0 && ri === 0;
              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 last:border-b-0"
                >
                  <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
                  <dd
                    className={cn(
                      'shrink-0 font-display text-base font-extrabold tabular-nums',
                      anchor ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                    )}
                  >
                    {row.value ?? onRequest}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- Reguläre Kurse */
function RegularSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const r = c.regular;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <SectionHead title={r.title} titleAccent={r.titleAccent} lead={r.body} />
            </motion.div>

            <motion.p
              variants={item}
              className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              <BeatMark />
              {r.fixed}
            </motion.p>
            <motion.div variants={item} className="mt-8">
              <CheckList items={r.included} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={r.cta.href}>{r.cta.label}</PrimaryCta>
            </motion.div>
            <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {r.microcopy}
            </motion.p>
          </Reveal>


          <Reveal className="border-t border-[var(--color-line)] pt-6">
            <motion.div
              variants={item}
              className="flex items-baseline justify-between gap-4 border-b border-[var(--color-line)] pb-5"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]">{r.cardTitle}</p>
              <p className="text-xs font-semibold text-[var(--color-ink-muted)]">{r.cardNote}</p>
            </motion.div>
            <motion.div variants={item} className="mt-6">
              <GroupedPrices groups={r.groups} onRequest={c.onRequest} />
            </motion.div>
          </Reveal>
        </div>


        <Reveal className="mt-12 border-t border-[var(--color-line)] pt-6 lg:mt-14">
          <motion.p
            variants={item}
            className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]"
          >
            <BeatMark />
            {r.entry.label}
          </motion.p>
          <div className="mt-6 grid gap-x-16 gap-y-8 lg:grid-cols-[0.9fr_1.1fr]">
            {r.entry.items.map((e) => (
              <motion.div key={e.title} variants={item}>
                <h3 className="font-display text-lg font-bold leading-snug text-balance text-[var(--color-ink)]">
                  {e.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {e.text}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Stufe 2 der Link-Skala, nicht noch ein roter Pill: die Sektion hat mit
              "Kursplan oeffnen" oben schon ihren einen Primary (DESIGN.md Zeile 86). */}
          <motion.div variants={item} className="mt-6 -ml-4">
            <GhostCta href={r.entry.link.href}>{r.entry.link.label}</GhostCta>
          </motion.div>
        </Reveal>


        <Reveal className="mt-12 lg:mt-16">
          <motion.figure variants={item}>
            <img
              src={r.image.src}
              alt={r.image.alt}
              className="aspect-[21/9] w-full rounded-[var(--radius-media)] object-cover object-[center_45%]"
              width={1500}
              height={1000}
              loading="lazy"
            />
            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--color-line)] pt-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {r.cardTitle}
              </span>
              <span className="text-[0.95rem] text-[var(--color-ink-muted)]">{r.fixed}</span>
            </figcaption>
          </motion.figure>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Privatstunden */
function PrivatSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const p = c.privat;
  return (

    <section className="bg-[var(--color-paper-warm)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:h-full">

            <motion.div variants={item} className="flex h-full flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-media)]">
                <img
                  src={p.image.src}
                  alt={p.image.alt}

                  /* Asset ist seit 10.08.2026 ein echtes Quadrat (offer-privat-square-1200):
                     beide Tanzenden voll im Bild, kein horizontaler Beschnitt mehr noetig —
                     object-center statt 42%-Bias, width/height 1200x1200. */
                  className="photo-grade-private aspect-[4/5] w-full object-cover object-center sm:aspect-[4/3] lg:aspect-square"
                  width={1200}
                  height={1200}
                  loading="lazy"
                />
              </div>
              <div className="mt-5 border-t border-[var(--color-line)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{p.cardLabel}</p>
                <p className="mt-1.5 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{p.cardText}</p>
              </div>
            </motion.div>
          </Reveal>

          <Reveal className="order-1 max-w-xl lg:order-2">
            <motion.div variants={item}>
              <SectionHead eyebrow={p.eyebrow} title={p.title} titleAccent={p.titleAccent} lead={p.body} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PriceRows rows={p.rows} onRequest={c.onRequest} />
            </motion.div>

            <motion.p
              variants={item}
              className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]"
            >
              {p.note}
            </motion.p>

            <motion.div variants={item} className="mt-8">
              <CheckList items={p.included} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Workshops & Danceflow Night */
function WorkshopCard({
  title,
  body,
  rows,
  foot,
  image,
  onRequest,
}: {
  title: string;
  body: string;
  rows: PriceRow[];
  foot?: string;
  image: { src: string; alt: string; width: number; height: number; position?: string };
  onRequest: string;
}) {
  return (
    <div className="flex h-full flex-col border-t border-[var(--color-line)] pt-6">

      {/* width/height melden das ECHTE Seitenverhaeltnis der Datei (nicht das der Box) —
          sonst reserviert der Browser die falsche Hoehe und die Seite springt beim Laden (CLS).
          Die beiden Spalten tragen unterschiedliche Formate: Workshop hochkant 1067x1600,
          Danceflow quer 1500x1000. Ein fester Wert waere fuer eine der beiden falsch. */}

      <img
        src={image.src}
        alt={image.alt}
        className="mb-6 aspect-[3/2] w-full rounded-[var(--radius-media)] object-cover"
        style={{ objectPosition: image.position ?? 'center 40%' }}
        width={image.width}
        height={image.height}
        loading="lazy"
      />
      <div className="flex items-center gap-3">
        <BeatMark />
        <h3 className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">{title}</h3>
      </div>
      <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
      <div className="mt-6">
        <PriceRows rows={rows} onRequest={onRequest} />
      </div>

      {foot ? (
        <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{foot}</p>
      ) : null}
    </div>
  );
}

function WorkshopsSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const w = c.workshops;
  return (

    <section className="bg-[var(--color-bg-soft)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <SectionHead title={w.title} titleAccent={w.titleAccent} lead={w.lead} />
          </motion.div>
        </Reveal>
        <Reveal className="mt-12 grid items-stretch gap-x-10 md:grid-cols-2" stagger={0.08}>
          <motion.div variants={item} className="h-full">
            <WorkshopCard
              title={w.workshop.title}
              body={w.workshop.body}
              rows={w.workshop.rows}
              image={w.workshop.image}
              onRequest={c.onRequest}
            />
          </motion.div>
          <motion.div variants={item} className="h-full">
            <WorkshopCard
              title={w.social.title}
              body={w.social.body}
              rows={w.social.rows}
              foot={w.social.foot}
              image={w.social.image}
              onRequest={c.onRequest}
            />
          </motion.div>
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <PrimaryCta href={w.cta.href}>{w.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Salsaflow Pass */
function PassSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const p = c.pass;
  return (

    <section id="salsaflow-pass" className="scroll-mt-24 bg-[var(--color-paper-warm)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>

        <Reveal className="border-y border-[var(--color-line)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={item} className="py-10 lg:py-14 lg:pr-12">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <BeatMark />
              {p.badge}
            </p>
            <h2 className={cn('mt-5', sectionTitle, MEASURE_L)}>
              {p.title} <TitleAccent>{p.titleAccent}</TitleAccent>
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">{p.body}</p>

            <div className="mt-7 max-w-xl">
              <CheckList items={p.included} />
            </div>
            <div className="mt-8">
              <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
            </div>
          </motion.div>
          <motion.div
            variants={item}

            className="flex flex-col border-t border-[var(--color-line)] py-10 lg:block lg:border-l lg:border-t-0 lg:py-14 lg:pl-12"
          >

            <img
              src={p.image.src}
              alt={p.image.alt}
              className="order-2 mt-8 aspect-[16/9] w-full rounded-[var(--radius-media)] object-cover object-[center_45%] lg:order-none lg:mb-7 lg:mt-0"
              width={1920}
              height={1280}
              loading="lazy"
            />
            <div className="order-1 lg:order-none">
              <PriceRows rows={p.rows} onRequest={c.onRequest} />
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Was passt zu dir? */
function FitSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const f = c.fit;
  return (
    <section className="bg-[var(--color-bg-soft)] py-12 lg:py-16">
      <Shell>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <motion.div variants={item}>
              <SectionHead title={f.title} titleAccent={f.titleAccent} lead={f.lead} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>

          <Reveal className="border-t border-[var(--color-line)]" stagger={0.06}>
            {f.options.map((o) => (
              <motion.a
                key={o.when}
                variants={item}
                href={o.href}
                className="group flex items-center justify-between gap-5 border-b border-[var(--color-line)] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-soft)]"
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-salsa)]">{o.when}</span>
                  <span className="mt-1 block text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{o.pick}</span>
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-salsa)] transition-colors duration-200 group-hover:border-[var(--color-salsa)] group-hover:bg-[var(--color-salsa)] group-hover:text-white">
                  <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                </span>
              </motion.a>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Final CTA (heller Closer, zwei CTAs) */
function ClosingSection({ c }: { c: PreiseContent }) {
  const cl = c.closing;
  return (
    <ClosingInvite
      title={cl.title}
      titleAccent={cl.titleAccent}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
    />
  );
}
