// Partys-Seite unter /mehr/partys. Rhythmus aus dem V3-Copyplan (pages/23): Hero -> Danceflow
// Night als Start -> Weitere Orte (kuratiert) -> Erstes Mal (Tipps) -> FAQ -> Schluss-CTA. Ruhig,
// aber warm und lebendig (Plan: hell, echte Menschen, nie dunkler Club). Copy 1:1 aus PARTYS
// (echte Umlaute, CH-ss). Danceflow + Kalender verlinken auf echte Event-Routen.

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  FaqBlock,
  PrimaryCta,
  CtaArrow,
  Shell,
  Eyebrow,
  TitleAccent,
  BeatMark,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { PARTYS } from '@/public/more/partys-content';

export function PartysPage() {
  const { lang } = useLang();
  const c = PARTYS[lang];
  return (
    <SubPageShell seo="partys">
      <div data-partys-page="">
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'wide' + full-bleed Partyband
          unter der Headline — das Motiv traegt hier inhaltlich, aber randlos statt als
          gerahmte Kachel neben dem Text.
          R150: 14rem + center 30% schnitt den hinteren Scheitel. Band-Top sitzt
          bei y484, Fold 730 — mehr als 15rem ragt unter den Fold und schneidet Kinn.
          15rem + center 18% haelt das ganze Band im Fold und die Koepfe im Fenster.
          Mobil 13rem/18% bleibt. Desktop-WA Kreis ueber den Marker.
          R151: Crop 10 %, Band 20rem. Quelle Y 90–544: hinterer Scheitel und Kinn.
          Desktop-CSS blendet Microcopy aus, damit das Band im 730-Fold endet. */}
      <SubHero
        axis="wide"
        dense
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
        media={{
          src: c.hero.image.src,
          alt: c.hero.image.alt,
          positionClass: 'object-[center_10%]',
          heightClass: 'h-[16rem] sm:h-[18rem] lg:h-[20rem]',
        }}
      />
      <DanceflowSection c={c} />
      <MoreSection c={c} />
      <FirstTimeSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
      <FinalCta c={c} />
      </div>
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ Danceflow Night als Start */
function DanceflowSection({ c }: { c: (typeof PARTYS)['de'] }) {
  // Takt dieser Seite: 0.7s statt 0.45s, Stagger 0.1 — ruhiger als die Startseite.
  // Der Versatz bleibt bei den 14px der Repo-Signatur (home/motion.tsx:49). R151 hatte
  // ihn hier auf 8px gezogen; das war eine stille Abweichung vom EINEN Takt und ist raus.
  const { container, item } = useReveal({ duration: 0.7, distance: 14, stagger: 0.1 });
  const d = c.danceflow;
  /* R163: Dieser Block beginnt bei y=825, der Fold endet bei 900. Mit dem Default-
     Viewport (-8%) zuendete er sofort beim Laden: gemessen lief die Opazitaet ohne
     jeden Scroll von 0.35 auf 1.00. Wer dann nach unten kam, sah einen fertigen,
     toten Block — der Auftritt war oben schon verbraucht.
     Darum hier ein eigener `whileInView` mit `-25% 0px`: der Block wartet, bis er
     wirklich im Blick ist. Gleiche Varianten wie `Reveal`, nur die Zuendschwelle
     ist anders. `once: true` bleibt, `data-reveal` bleibt (das Shot-Werkzeug
     erzwingt darueber die Sichtbarkeit). */
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <motion.div
          data-reveal
          className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-25% 0px' }}
        >
          <motion.div variants={item} className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.42)]">
              <img
                src={d.image.src}
                alt={d.image.alt}
                className="aspect-[4/3] w-full object-cover"
                width={1400}
                height={1050}
                loading="lazy"
              />
            </div>
          </motion.div>
          {/* lg:pr-36: der Danceflow-Lead endete bei x=1356 und lief beim Scrollen unter
              den FAB (ab x=1294; Critic Runde 15, Item 5). */}
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2 lg:pr-36">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {d.title} <TitleAccent>{d.titleAccent}</TitleAccent>
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{d.body}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--color-line)] pt-6">
              {d.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-display text-lg font-extrabold leading-tight text-[var(--color-salsa)] sm:text-xl">{f.value}</dt>
                  <dd className="mt-1.5 text-xs leading-snug text-[var(--color-ink-muted)]">{f.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <PrimaryCta href={d.cta.href}>{d.cta.label}</PrimaryCta>
            </div>
          </motion.div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Weitere Orte (kuratiert) */
function MoreSection({ c }: { c: (typeof PARTYS)['de'] }) {
  // Gleicher Takt wie im Danceflow-Block: 0.7s, Stagger 0.1, Versatz 14px (Repo-Signatur).
  const { item } = useReveal({ duration: 0.7, distance: 14, stagger: 0.1 });
  const m = c.more;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-3xl" stagger={0.1}>
            <motion.div variants={item}>
              <Eyebrow>{m.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {m.title} <TitleAccent>{m.titleAccent}</TitleAccent>
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {m.body}
            </motion.p>
            <motion.div variants={item} className="mt-7">
              <a
                href={m.cta.href}
                className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {m.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
          <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {m.template.map((row) => (
              <motion.div
                key={row.label}
                variants={item}
                className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <p className="flex items-center gap-2 type-h3 text-[var(--color-ink)]">
                  <BeatMark size="sm" />
                  {row.label}
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{row.hint}</p>
              </motion.div>
            ))}
          </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Zum ersten Mal (Tipps) */
function FirstTimeSection({ c }: { c: (typeof PARTYS)['de'] }) {
  // Gleicher Takt wie im Danceflow-Block: 0.7s, Stagger 0.1, Versatz 14px (Repo-Signatur).
  const { item } = useReveal({ duration: 0.7, distance: 14, stagger: 0.1 });
  const f = c.firstTime;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl" stagger={0.1}>
            <motion.div variants={item}>
              <Eyebrow>{f.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {f.title} <TitleAccent>{f.titleAccent}</TitleAccent>
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {f.body}
            </motion.p>
            <motion.ul variants={item} className="mt-8 grid gap-3">
              {f.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 text-[0.98rem] leading-relaxed text-[var(--color-ink)] sm:p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-salsa)] text-white">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  {tip}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28" stagger={0.1}>
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img
                src={f.image.src}
                alt={f.image.alt}
                className="aspect-[4/5] w-full object-cover"
                width={1200}
                height={1500}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Schluss-CTA (zwei Wege) */
function FinalCta({ c }: { c: (typeof PARTYS)['de'] }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  return (
    <ClosingInvite
      eyebrow={cl.eyebrow}
      title={cl.title}
      titleAccent={cl.titleAccent}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
    />
  );
}
