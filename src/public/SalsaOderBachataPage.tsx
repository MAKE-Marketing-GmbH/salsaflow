// Vergleichsseite /mehr/salsa-oder-bachata. Aufbau wie TanzschuhePage (SubHero 'left',
// Flaechenwechsel, ClosingInvite), mit einem Baustein, den es sonst nirgends gibt: eine echte
// <table> mit <caption>, <thead> und <th scope>.
//
// Warum eine Tabelle und keine Karten: research-fazit-2026-08-29.md haelt fest, dass
// Extraktions-Engines fuer "X vs Y"-Anfragen bevorzugt Tabellen ziehen. Karten mit denselben
// Werten waeren fuer Maschinen unstrukturiert und fuer Menschen schlechter vergleichbar, weil
// die Kriterien dann nicht mehr auf einer Zeile liegen.
//
// Auf schmalen Viewports scrollt die Tabelle horizontal in ihrem eigenen Container: eine
// Sechs-Zeilen-Matrix mit zwei Textspalten laesst sich unter 640px nicht sinnvoll umbrechen,
// ohne die Zeilenlogik zu zerstoeren.

import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  PrimaryCta,
  Shell,
  Eyebrow,
  TitleAccent,
  MEASURE_L,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { useLang } from '@/lib/i18n';
import { SALSA_ODER_BACHATA } from '@/public/more/salsa-oder-bachata-content';

type Content = (typeof SALSA_ODER_BACHATA)['de'];

export function SalsaOderBachataPage() {
  const { lang } = useLang();
  const c = SALSA_ODER_BACHATA[lang];
  return (
    <SubPageShell seo="salsaOderBachata">
      <SubHero
        axis="left"
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
      />
      <CompareSection c={c} />
      <StylesSection c={c} />
      <VerdictSection c={c} />
      <ClosingInvite
        eyebrow={c.closing.eyebrow}
        title={c.closing.title}
        titleAccent={c.closing.titleAccent}
        body={c.closing.body}
        ctaLabel={c.closing.primary.label}
        ctaHref={c.closing.primary.href}
        secondary={c.closing.secondary}
      />
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ Vergleichstabelle */
function CompareSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const t = c.table;
  return (
    <section id="vergleich" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={t.eyebrow} title={t.title} titleAccent={t.titleAccent} lead={t.lead} />
        </Reveal>
        <Reveal className="mt-12">
          <motion.div
            variants={item}
            className="overflow-x-auto rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.05)]"
          >
            <table className="w-full min-w-[46rem] border-collapse text-left">
              {/* Die Caption traegt die Tabellen-Aussage fuer Screenreader und Extraktion.
                  Sichtbar waere sie eine Dopplung des Sektionskopfes direkt darueber. */}
              <caption className="sr-only">{t.caption}</caption>
              <thead>
                <tr className="border-b border-[var(--color-line)]">
                  <th
                    scope="col"
                    className="w-[8.5rem] px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] sm:px-6"
                  >
                    {t.headCriterion}
                  </th>
                  <th scope="col" className="px-5 py-4 type-h3 text-[var(--color-salsa)] sm:px-6">
                    {t.headSalsa}
                  </th>
                  <th scope="col" className="px-5 py-4 type-h3 text-[var(--color-salsa)] sm:px-6">
                    {t.headBachata}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row) => (
                  <tr key={row.criterion} className="border-b border-[var(--color-line)] last:border-b-0">
                    <th
                      scope="row"
                      className="px-5 py-5 align-top text-[0.95rem] font-bold text-[var(--color-ink)] sm:px-6"
                    >
                      {row.criterion}
                    </th>
                    <td className="px-5 py-5 align-top text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)] sm:px-6">
                      {row.salsa}
                    </td>
                    <td className="px-5 py-5 align-top text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)] sm:px-6">
                      {row.bachata}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Je ein Abschnitt pro Stil */
function StylesSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const s = c.styles;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6" stagger={0.08}>
          {s.items.map((style) => (
            <motion.article
              key={style.name}
              variants={item}
              className="group flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-8"
            >
              <h3 className="type-h2 text-[var(--color-ink)]">{style.name}</h3>
              <p className="mt-2 text-[0.95rem] font-bold text-[var(--color-salsa)]">{style.claim}</p>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{style.body}</p>
              <ul className="mt-6 grid flex-1 content-start gap-2.5">
                {style.fits.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={style.href}
                className="mt-7 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {style.linkLabel}
                <ArrowRight size={15} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-[var(--motion-out)] group-hover:translate-x-0.5" />
              </a>
            </motion.article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Fazit */
function VerdictSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const v = c.verdict;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" stagger={0.08}>
          <motion.div variants={item}>
            <Eyebrow>{v.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle} ${MEASURE_L}`}>
              {v.title} <TitleAccent>{v.titleAccent}</TitleAccent>
            </h2>
          </motion.div>
          <motion.div variants={item} className="min-w-0">
            <p className={`${sectionLead} mt-0`}>{v.body}</p>
            <p className="mt-4 max-w-[62ch] text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
              {v.body2}
            </p>
            <div className="mt-8">
              <PrimaryCta href={v.cta.href}>{v.cta.label}</PrimaryCta>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
