// Seite Standort & Raumvermietung (/kontakt/standort-raumvermietung) aus dem V3-Copyplan
// (pages/19). Design-System strikt (Kit + StylePage): hell im Wechsel (paper-warm <-> bg-soft),
// Rot sparsam, Reveal-Takt wie Startseite.
//
// Zwei Jobs, sauber getrennt aber verbunden: Standortvertrauen (Anfahrt, Studios) und
// Anfrage-Conversion (Raumvermietung -> Kontaktformular). Kein eingebetteter Kartendienst:
// Adresse als Text + externer Google-Maps-Link (CONTACT.googleReviews). Die Raumanfrage laeuft
// ueber das bestehende Kontaktformular (/kontakt#raumvermietung belegt dort das Anliegen vor),
// darum hier keine zweite Formular-Mechanik, sondern eine klare Anfrage-Checkliste + CTA.
//
// Rhythmus: Hero -> Anfahrt -> Studios -> Raumvermietung (Checkliste) -> Schluss-CTA -> FAQ.

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { CONTACT } from '@/public/site/SiteFooter';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  FaqBlock,
  SectionHead,
  PrimaryCta,
  Shell,
  Eyebrow,
  TitleAccent,
  BeatMark,
  Reveal,
  useReveal,
  sectionTitle,
  sectionLead,
} from '@/public/subpage/kit';
import { STANDORT, type StandortContent } from '@/public/contact/standort-content';

export function StandortPage() {
  const { lang } = useLang();
  const c = STANDORT[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'split' — Headline links,
          Anfahrt-Zuruf rechts; das Studio-Motiv laeuft randlos unter dem Typo-Block. */}
      <SubHero
        axis="split"
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
        media={{
          src: c.hero.image.src,
          alt: c.hero.image.alt,
          // hero-02.jpg ist ein 1080x1616-Portrait; im flachen Hero-Band lag das Fenster mit
          // 45% bei ~35-57% der Bildhoehe — Gesichter (~26%) abgeschnitten, nur Torsi sichtbar
          // (Beleg: kontakt__standort…-01-y0.png, Kritik 10.08.2026). 20% holt die Koepfe rein.
          position: 'center 20%',
        }}
      />
      <AnfahrtSection c={c} />
      <StudiosSection c={c} />
      <RentalSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock
        eyebrow={c.faqSection.eyebrow}
        title={c.faqSection.title}
        titleAccent={c.faqSection.titleAccent}
        items={c.faqSection.items}
      />
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Anfahrt (#anfahrt) */
function AnfahrtSection({ c }: { c: StandortContent }) {
  const { item } = useReveal();
  const a = c.anfahrt;
  return (
    <section id="anfahrt" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="max-w-md">
            <motion.div variants={item}>
              <Eyebrow>{a.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {a.title} {a.titleAccent ? <TitleAccent>{a.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {a.body}
            </motion.p>
            <motion.a
              variants={item}
              href={CONTACT.googleReviews}
              target="_blank"
              rel="noreferrer"
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-3 text-base font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
            >
              {a.mapsCta}
              <ArrowRight size={18} strokeWidth={2} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </motion.a>
          </Reveal>
          <Reveal className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
            {a.infos.map((info) => (
              <motion.div
                key={info.label}
                variants={item}
                className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  <BeatMark />
                  {info.label}
                </p>
                {/* NAP-Microdata auf der Adress-Karte (Local SEO). Dieselben Fakten wie im
                    sitewide LocalBusiness-JSON-LD (seo-schema.ts localBusinessNode). */}
                {info.label === 'Adresse' || info.label === 'Address' ? (
                  <p
                    itemScope
                    itemType="https://schema.org/LocalBusiness"
                    className="mt-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)]"
                  >
                    <span itemProp="name">Salsaflow Dance Company GmbH</span>
                    <br />
                    <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="contents">
                      <span itemProp="streetAddress">Elisabethenanlage 7</span>,{' '}
                      <span itemProp="postalCode">4051</span> <span itemProp="addressLocality">Basel</span>
                      <meta itemProp="addressCountry" content="CH" />
                    </span>
                  </p>
                ) : (
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{info.value}</p>
                )}
              </motion.div>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Studios (#studios) */
function StudiosSection({ c }: { c: StandortContent }) {
  const { item } = useReveal();
  const s = c.studios;
  return (
    <section id="studios" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} lead={s.lead} />
        </Reveal>
        {/* lg:pr-36: der fixe WhatsApp-FAB lag auf dem Text der dritten Studio-Karte
            (Critic Runde 14, Item 3 — Muster ScheduleTeaser/Offer). */}
        <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:pr-36" stagger={0.08}>
          {s.items.map((studio) => (
            <motion.div
              key={studio.name}
              variants={item}
              className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
            >
              <div className="overflow-hidden">
                <img
                  src={studio.image.src}
                  alt={studio.image.alt}
                  className="aspect-[4/3] w-full object-cover object-[center_45%]"
                  width={1200}
                  height={900}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{studio.name}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{studio.text}</p>
              </div>
            </motion.div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Raumvermietung (#mieten) */
function RentalSection({ c }: { c: StandortContent }) {
  const { item } = useReveal();
  const r = c.rental;
  return (
    <section id="mieten" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-14">
          <Reveal>
            <motion.div variants={item}>
              <Eyebrow>{r.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {r.title} {r.titleAccent ? <TitleAccent>{r.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {r.subline}
            </motion.p>
            <motion.p
              variants={item}
              className="mt-8 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]"
            >
              <BeatMark />
              {r.suitedTitle}
            </motion.p>
            <motion.ul variants={item} className="mt-4 flex flex-wrap gap-2.5">
              {r.suited.map((use) => (
                <li
                  key={use}
                  className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm"
                >
                  {use}
                </li>
              ))}
            </motion.ul>
            <motion.p variants={item} className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {r.note}
            </motion.p>
          </Reveal>
          <Reveal>
            <motion.div
              variants={item}
              className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.06)] sm:p-8"
            >
              <h3 className="font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{r.checklistTitle}</h3>
              <ul className="mt-5 space-y-px">
                {r.checklist.map((entry) => (
                  <li key={entry} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3 first:border-t-0">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{entry}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {r.checklistMicro}
              </p>
              <div className="mt-6">
                <PrimaryCta href={r.cta.href}>{r.cta.label}</PrimaryCta>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schluss-CTA (zwei CTAs) */
function ClosingSection({ c }: { c: StandortContent }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
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
