// Mehr-Seite unter /mehr. Schlanker Hub aus dem V3-Copyplan (20_mehr.md + Startseite Section 10
// "MEHR VON SALSAFLOW"): Hero -> 4 Karten (Collabs, Tanzschuhe, Partys, FAQ) mit echten Routen
// -> heller Schluss-CTA. Die frueheren eingebetteten FAQ/Collabs/Partys-Bloecke sind raus, weil
// sie jetzt eigene Seiten haben (/mehr/collabs, /mehr/tanzschuhe, /mehr/partys, /faq) und der Hub
// nur noch weiterleitet. Bright-Editorial-Standard: 1400px-Shell, durchgehend helle Flaechen,
// Lucide-Icons, ruhige Reveal-Motion, ein Script-Akzentwort in der H1.
// Copy nach Regel 003/069/085 (simpel, du-Form, echte Umlaute, CH-ss, keine Em-Dashes).

import { motion } from 'framer-motion';
import { Seo } from '@/lib/seo';
import { useLang } from '@/lib/i18n';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { sectionLead, TitleAccent, Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MORE_PAGE } from '@/public/more/content';
import { ClosingInvite } from '@/public/subpage/kit';
import { ShoppingBag, Footprints, PartyPopper, HelpCircle, ArrowRight } from 'lucide-react';

export function MehrPage() {
  return (
    <>
      <Seo page="more" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <MoreHero />
        <HubCards />
        <ClosingCta />
      </main>
      {/* Runde 2, Issue 9: EIN Abbinder pro Seite. Die Seite hat ihren eigenen ClosingCta,
          der generische Footer-Streifen "Bereit fuer deinen ersten Tanz?" waere der zweite
          Schluss direkt darunter — gleiche Regel wie bei allen Unterseiten (SubPageShell). */}
      <SiteFooter entryCta={false} />
    </>
  );
}

/* ---------------------------------------------------------------------------- Hero */
const MORE_HERO_IMAGE = '/photos/gallery/danceflow/03.jpg';

function MoreHero() {
  const { lang } = useLang();
  const h = MORE_PAGE[lang].hero;
  const { container, item } = useReveal();
  return (
    <section className="relative overflow-hidden bg-[var(--color-paper-warm)]" style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}>
      <Shell className="grid items-center gap-10 pb-14 pt-6 sm:pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:pt-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            // text-balance: auf 390 stand "Tanzen" als Waisenwort allein in der letzten
            // Zeile (Critic Runde 8, Item 3).
            className="type-h1 mt-5 text-[var(--color-ink)]"
          >
            {h.titleA}{' '}
            <TitleAccent>{h.titleAccent}</TitleAccent>
            {h.titleB}
          </motion.h1>
          <motion.p variants={item} className={`mt-6 max-w-xl ${sectionLead}`}>{h.lead}</motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={h.primaryHref}
              className="btn-base btn-primary px-7 py-3.5 text-base"
            >
              {h.primary}
            </a>
            <a
              href={h.secondaryHref}
              className="btn-base btn-outline px-7 py-3.5 text-base"
            >
              {h.secondary}
            </a>
          </motion.div>
        </motion.div>
        <motion.div variants={item} initial="hidden" animate="show" className="relative">
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.10)]">
            <img
              src={MORE_HERO_IMAGE}
              alt={lang === 'de' ? 'Stimmung an einer Danceflow Night in Basel' : 'Atmosphere at a Danceflow Night in Basel'}
              className="aspect-[4/3] w-full object-cover"
              width={1600}
              height={1200}
              loading="eager"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Hub-Karten */
// 4 Karten, kein langer Text (Plan 20). Jede Karte zeigt auf eine echte Route. Reihenfolge und
// Icons: Collabs, Tanzschuhe, Partys, FAQ.
const CARD_ICONS = [ShoppingBag, Footprints, PartyPopper, HelpCircle];

function HubCards() {
  const { lang } = useLang();
  const cards = MORE_PAGE[lang].cards;
  const { item } = useReveal({ stagger: 0.08, distance: 14 });
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {cards.map((card, i) => {
            const Icon = CARD_ICONS[i] ?? HelpCircle;
            return (
              <motion.a
                key={card.href}
                variants={item}
                href={card.href}
                className="group flex flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_16px_50px_rgba(17,17,17,0.06)] t-hover-move hover:-translate-y-0.5 hover:border-[var(--color-salsa)] hover:shadow-[0_24px_70px_rgba(17,17,17,0.10)] sm:p-8"
              >
                <span
                  aria-hidden
                  className="grid h-12 w-12 place-items-center rounded-[var(--radius-card)] bg-[var(--color-paper-warm)] text-[var(--color-salsa)] transition-colors group-hover:bg-[var(--color-salsa)] group-hover:text-white"
                >
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h2 className="type-h2 mt-6 text-[var(--color-ink)]">
                  {card.title}
                </h2>
                <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
                  {card.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-[var(--color-salsa)]">
                  {card.cta}
                  <ArrowRight size={17} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                </span>
              </motion.a>
            );
          })}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Abschluss-CTA */
function ClosingCta() {
  const { lang } = useLang();
  const c = MORE_PAGE[lang].cta;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // Diese Seite hatte zwei handgeschriebene Buttons (einer ohne Pfeil) - jetzt dieselbe
  // Zwei-Stufen-Skala wie ueberall.
  return (
    <ClosingInvite
      eyebrow={c.eyebrow}
      title={c.title}
      body={c.lead}
      ctaLabel={c.primary}
      ctaHref={c.primaryHref}
      secondary={{ label: c.secondary, href: c.secondaryHref }}
    />
  );
}
