// FAQ-Seite (/faq) aus dem V3-Copyplan (pages/24_faq.md). Design-System strikt (Kit + StylePage):
// hell im Wechsel (paper-warm <-> bg-soft), Rot sparsam, Reveal-Takt wie Startseite.
//
// Rhythmus: Hero (erste echte Frage) -> zwei FAQ-Spalten nach Thema -> Schluss-CTA.
// JSON-LD bleibt EIN Block (id ld-faq) und sammelt beide Spalten.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { sectionLead } from '@/public/site/primitives';
import {
  Breadcrumb,
  ClosingInvite,
  GhostCta,
  MEASURE_XL,
  PrimaryCta,
  SubPageShell,
  SectionHead,
  Shell,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { FAQ_CONTENT, type FaqPageContent } from '@/public/faq/content';
import { FaqItem } from '@/public/faq/FaqAccordion';

export function FaqPage() {
  const { lang } = useLang();
  const c = FAQ_CONTENT[lang];
  const [cookieClear, setCookieClear] = useState(false);

  // Der Hinweis bleibt beim Einstieg sichtbar. Sobald jemand die Seite erkundet, räumt er
  // die Inhaltsfläche frei; auf der nächsten Route erscheint er wieder, falls er nicht bestätigt wurde.
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
    <SubPageShell seo={c.seo}>
      <div className="faq-page" data-faq-page="" data-cookie-clear={cookieClear ? 'true' : undefined}>
        <FaqHero c={c} />
        <FaqSection c={c} />
        <FinalCta c={c} />
      </div>
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero (erste Frage) */
/* Meta-Kritik 2026-08-07 ("AI-Eyebrow-Flut / jede Unterseite startet gleich"): /faq oeffnete
   mit derselben zentrierten Riesen-Behauptung wie /preise und /tanzkurse/heels — Headline,
   Lead, zwei CTAs, Microcopy, mittig, Achse 'center' (Beleg /tmp/eyebrow-shots/faq.png vs
   preise.png vs heels.png, identische Silhouette). Die alte H1 "Unsicher ist normal. Unklar
   muss es nicht bleiben." sagte ausserdem nichts, was die Seite nicht schon im Breadcrumb
   verspricht.
   Fix: die Seite startet jetzt mit dem, wofuer man sie oeffnet — der ersten echten Frage
   samt Antwort. Achse 'split': Frage links, Antwort + CTA in der rechten Schiene. Damit ist
   der Einstieg inhaltlich UND strukturell nicht mehr mit Preise/Heels verwechselbar.
   Quelle ist bewusst faqSection.items[0] und keine zweite Copy-Stelle: das Hero-Versprechen
   kann so nicht von der Liste darunter abweichen. */
function allFaqItems(c: FaqPageContent) {
  return c.faqSection.columns.flatMap((column) => column.items);
}

/* R188 F2 + F6 (Video 00:27-00:45): "Hero: mehr Platz/Luft generell" und "ganzer Text
 * inkl. Buttons links zusammen, dazu ein Bild. Simpel."
 *
 * Der alte Hero lief ueber `SubHero axis="split"`. Diese Achse setzt die H1 links und
 * schiebt Lead, Knoepfe und Microcopy in eine rechte SCHIENE — Text und Knoepfe standen
 * also auf zwei Spalten verteilt, nicht zusammen. Dazu trug er `dense` und `tightBottom`,
 * zwei Schalter, die den Hero absichtlich flach machen (Padding oben/unten gekuerzt,
 * damit ein Bildband in den 730er-Fold rutscht). Beide Befunde aus dem Video haengen
 * genau daran: eng, und der Text auseinandergezogen.
 *
 * Hier steht darum ein eigener, einfacher Hero statt einer weiteren Achse in kit.tsx:
 * links Breadcrumb, H1, Lead, beide Knoepfe und die Microcopy als EIN Block; rechts
 * das Bild. `dense`/`tightBottom` sind weg, das Padding ist grosszuegig
 * (pt nav-h + 3rem, pb-16/lg:pb-24) — das ist die Luft aus F2.
 *
 * Die H1 ist wieder eine echte Ueberschrift statt der ersten FAQ-Frage. Die Frage steht
 * unveraendert unten in der Liste; sie zweimal zu zeigen war der Grund, warum der Hero
 * fruehe eine Riesenfrage ohne Seitentitel trug.
 */
function FaqHero({ c }: { c: FaqPageContent }) {
  const { lang } = useLang();
  const { container, item } = useReveal();
  const h = c.hero;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      <Shell className="grid items-center gap-10 pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24">
        <motion.div data-reveal variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={[c.crumb]} />
          </motion.div>
          <motion.h1 variants={item} className={cn('type-h1 text-[var(--color-ink)]', MEASURE_XL)}>
            {lang === 'de' ? 'Fragen und Antworten' : 'Questions and answers'}
          </motion.h1>
          <motion.p variants={item} className={cn('mt-6 max-w-xl text-pretty', sectionLead)}>
            {h.lead}
          </motion.p>
          {/* Text UND Knoepfe im selben Block (F6). */}
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
            <GhostCta href={h.secondary.href} down={h.secondary.href.startsWith('#')}>
              {h.secondary.label}
            </GhostCta>
          </motion.div>
          <motion.p variants={item} className="mt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {h.microcopy}
          </motion.p>
        </motion.div>

        {/* Rechts EIN Bild, simpel: ein Rahmen, ein Radius, kein Chip, keine Collage. */}
        <Reveal>
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_30px_70px_-32px_rgba(17,17,17,0.45)] ring-1 ring-black/5"
          >
            <img
              src={h.image.src}
              alt={h.image.alt}
              className="aspect-[4/3] w-full object-cover object-[center_35%]"
              width={1920}
              height={1280}
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- FAQ (Motion-Accordion) */
function FaqSection({ c }: { c: FaqPageContent }) {
  const { item } = useReveal();
  const { lang } = useLang();
  const f = c.faqSection;
  const items = allFaqItems(c);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
  return (
    <section
      id="faq"
      className="scroll-mt-[calc(var(--nav-h)+1.5rem)] bg-[var(--color-bg-soft)] pb-16 pt-8 lg:pb-20 lg:pt-14"
    >
      <script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }}
      />
      <Shell>
        {/* R188 F3 (Video 00:45, "Haeufige Fragen sieht lost aus, Ueberschriften anders").
            Der Kopf stand vorher in einer max-w-3xl-Spalte ganz links, die rechten zwei
            Fuenftel der Seite blieben leer — das ist das "lost". Jetzt traegt der Kopf
            die volle Shell: links Titel und Themen-Chips, rechts der Weg zur direkten
            Frage. Die Chips sitzen auf einer eigenen Linie statt frei zu schweben. */}
        <Reveal className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <motion.div variants={item}>
            <SectionHead eyebrow={f.eyebrow} title={f.title} titleAccent={f.titleAccent} />
          </motion.div>
          <motion.div variants={item} className="border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:pt-0">
            <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Deine Frage ist nicht dabei? Schreib uns kurz, wir antworten persönlich.'
                : 'Your question is not here? Send us a short message, we answer personally.'}
            </p>
            <a
              href="/kontakt"
              className="group mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
            >
              {lang === 'de' ? 'Frag uns direkt' : 'Ask us directly'}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>

        {/* R188 Runde 3, Sol-Befund m-02 ("fahrige Treppe mit viel verschenkter Hoehe").
            Gemessen auf 390px: die sieben Pillen sind zwischen 82px und 269px breit, weil
            jedes Label anders lang ist. In einem `flex-wrap` passte darum nie eine zweite
            Pille neben die erste — sieben Pillen ergaben sieben Zeilen, jede mit einem
            unterschiedlich langen Rest an leerem Platz rechts. Das ist die Treppe: nicht
            zu wenig Platz, sondern eine Umbruchregel, die bei sehr unterschiedlichen
            Breiten kein ruhiges Bild ergeben kann.
            Mobil laufen die Pillen darum in EINER Reihe waagerecht, mit Wischen statt
            Umbruch. Sieben Zeilen werden zu einer; die Pillen behalten ihre Hoehe (min-h-11
            = 44px Touch-Ziel) und stehen alle auf derselben Grundlinie. `snap` laesst die
            Reihe sauber einrasten, die negativen Raender fuehren die Reihe bis an den
            Bildschirmrand, damit sichtbar ist, dass es rechts weitergeht.
            Ab `sm` ist wieder Umbruch aktiv: dort ist die Zeile breit genug fuer mehrere
            Pillen nebeneinander, und Desktop bleibt exakt wie freigegeben. */}
        {/* Linkes Minus-Margin spiegelt `pl-5` der Shell. Rechts bleibt die WhatsApp-Spur
            (`pr-14`) stehen — die Pillen sollen nicht unter den Kreis laufen. */}
        <Reveal className="-ml-5 mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pl-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:ml-0 sm:snap-none sm:flex-wrap sm:overflow-visible sm:pl-0 sm:pb-0">
          {c.themes.items.map((theme) => (
            <motion.a
              key={theme.href}
              variants={item}
              href={theme.href}
              className="inline-flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:shrink"
            >
              {theme.label}
            </motion.a>
          ))}
        </Reveal>

        {/* R189 F2 (d-03/d-04): Der Kapitelkopf stand als Zweispalter, Foto links,
            Titel rechts. Der Titel braucht zwei Zeilen, das Foto 480 Pixel Hoehe — daneben
            blieben rund 400 Pixel leere Cremeflaeche. Das war schon die zweite Fassung
            desselben Fehlers: davor hing das Foto `sticky` und die Luecke stand darunter.
            Ein Zweispalter kann das nicht loesen, solange eine Spalte kurzer Text und die
            andere ein hohes Bild ist.
            Jetzt laeuft alles auf voller Breite untereinander: Bildband, Titel plus Blurb,
            Accordion. Es gibt keine zweite Spalte mehr, also auch keine Spalte, die leer
            bleiben kann. Zwei Bilder stehen nebeneinander und sind gleich hoch. */}
        <div className="mt-16 flex flex-col gap-20 lg:mt-20 lg:gap-28">
          {f.columns.map((column, ci) => (
            <Reveal key={column.title} stagger={0.06}>
              <motion.div
                variants={item}
                className={cn('grid gap-4', column.image2 && 'sm:grid-cols-2 sm:gap-6')}
              >
                <figure className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_26px_60px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
                  <img
                    src={column.image.src}
                    alt={column.image.alt}
                    className={cn(
                      'w-full object-cover object-[center_35%]',
                      column.image2 ? 'aspect-[4/3]' : 'aspect-[16/9] lg:aspect-[21/9]',
                    )}
                    width={1920}
                    height={1280}
                    loading="lazy"
                  />
                </figure>
                {column.image2 ? (
                  <figure className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_26px_60px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
                    <img
                      src={column.image2.src}
                      alt={column.image2.alt}
                      className="aspect-[4/3] w-full object-cover object-[center_35%]"
                      width={1800}
                      height={1200}
                      loading="lazy"
                    />
                  </figure>
                ) : null}
              </motion.div>

              {/* Die Textspalte ist schmaler als das Bildband, aus zwei Gruenden.
                  Lesbarkeit: ueber die volle Shell waeren die Zeilen rund 1340 Pixel breit,
                  weit jenseits einer angenehmen Zeilenlaenge.
                  Und Platz: die Aufklapp-Pfeile sassen bei voller Breite ganz rechts am
                  Rand, Zeile fuer Zeile ueber die ganze Seitenhoehe. Damit belegten sie
                  genau die Spur, in der der WhatsApp-Knopf ausweicht — er fand keine
                  einzige freie Stelle mehr und blendete sich aus
                  (Beleg: worklog/shots/R189/whatsapp-collisions/faq-desktop-hidden.png). */}
              <motion.div variants={item} className="mt-8 max-w-4xl lg:mt-10">
                <h3 className="type-h3 text-[var(--color-ink)]">{column.title}</h3>
                <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {column.blurb}
                </p>
              </motion.div>

              <motion.div variants={item} className="mt-8 min-w-0 max-w-4xl lg:mt-10">
                <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                  {column.items.map((faq, i) => (
                    <FaqItem
                      key={faq.q}
                      q={faq.q}
                      a={faq.a}
                      defaultOpen={ci === 0 && i === 0}
                      link={faq.link}
                      link2={faq.link2}
                    />
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schluss-CTA (zwei CTAs) */
function FinalCta({ c }: { c: FaqPageContent }) {
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
