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
 * Breadcrumb, H1, Lead, beide Knoepfe und die Microcopy als EIN zusammenhaengender Block.
 * `dense`/`tightBottom` sind weg, das Padding ist grosszuegig (pt nav-h + 3rem,
 * pb-16/lg:pb-24) — das ist die Luft aus F2.
 *
 * Die H1 ist wieder eine echte Ueberschrift statt der ersten FAQ-Frage. Die Frage steht
 * unveraendert unten in der Liste; sie zweimal zu zeigen war der Grund, warum der Hero
 * frueher eine Riesenfrage ohne Seitentitel trug.
 *
 * R212 (Raphael 23.08. 22:33): "FAQ-Hero ohne Home-Paar." Rechts stand hier das Bild
 * `hero-paar-dreh-01.webp` — dieselbe Datei, die der Home-Hero traegt (home/Hero.tsx:635).
 * Der Fold las sich damit als zweites Home-Hero statt als FAQ.
 *
 * Das war ein Rest, kein Entwurf: Raphaels Spec vom 23.08. 16:40 sagt "Bilder nicht
 * noetig. Hero oben, unten eine CTA-Section. Seite schlank" (woertlich zitiert in
 * faq/content.ts:25-29). R206 hat daraufhin die Kapitel-Bildbaender entfernt, dieses
 * eine Bild aber stehen lassen. Die Begruendung aus R188 F6 trug hier auch nicht mehr:
 * sie waehlte das Motiv gegen das FOTO IM ERSTEN FAQ-BLOCK darunter (Doppelung beim
 * Scrollen) — gegen den Home-Hero war es nie geprueft.
 *
 * Statt Bild traegt der Textblock jetzt die volle Shell. Bewusst KEIN Wechsel auf
 * `axis="center"`: genau damit lief /faq vor der Meta-Kritik vom 07.08. und sah Silhouette
 * fuer Silhouette aus wie /preise und /heels (Kommentar oben). Linksbuendig ueber die
 * ganze Breite ist die eine Form, die weder das Home-Hero noch die zentrierten
 * Schwesterseiten zitiert.
 *
 * Der Lead darf dabei breiter laufen (max-w-xl -> max-w-2xl): er wurde vorher von der
 * Bildspalte gedrueckt, die es nicht mehr gibt. Ueber die volle Shell laufen zu lassen
 * waere zu weit — `sectionLead` ist auf ruhige Zeilenlaenge ausgelegt, nicht auf 1440px.
 *
 * R216 (Critic 24.08. 00:51): "/faq ist der einzige Hero der Site ohne jedes Bild
 * (mediaCount 0). Rechte Haelfte leer, 96px tote Zone. Bitte echtes Bild ins FAQ-Hero."
 *
 * mediaCount 0 ist nachgemessen richtig (scripts/r216-faq-hero.cjs) — aber es ist die
 * SPEC, kein Defekt: Raphael 23.08. 16:40 "Bilder nicht noetig" (woertlich in
 * content.ts:25) und 23.08. 22:33 "FAQ-Hero ohne Home-Paar". Genau deshalb hat R212 das
 * Bild entfernt. Raphael hat den Widerspruch am 24.08. entschieden: die tote Zone wird
 * gefuellt, aber ohne Bild.
 *
 * Die Zahl ist korrigiert: gemessen sind es 88px zwischen Textkante (x1332) und Shell
 * (x1420), nicht 96. Der eigentliche Befund ist trotzdem groesser als diese Zahl — im
 * Screenshot steht die ganze Flaeche ab der Seitenmitte ueber die volle Hero-Hoehe leer,
 * waehrend links H1, Lead, CTAs und Microcopy sitzen.
 *
 * Gefuellt wird mit dem Muster, das DIESE SEITE schon selbst benutzt: der Kopf von
 * "Haeufige Fragen" darunter loeste denselben Befund ("rechte zwei Fuenftel leer, sieht
 * lost aus", R188 F3) mit einem Grid — links Titel, rechts der Weg zur direkten Frage.
 * Kein neues Muster, kein Bild.
 *
 * Der Inhalt rechts ist bestehende, freigegebene Copy, die bisher TOT im Content lag:
 * `themes.items` — sieben Sprungziele mit Label und Hinweis. Gegengeprueft per grep, dass
 * `themes` an keiner anderen Stelle gerendert wird; R206 hat den Block beim Vereinfachen
 * fallen lassen, ohne die Copy zu entfernen. Damit steht rechts etwas, das der Seite
 * gehoert und einem Besucher nuetzt, statt Dekoration zur Flaechenfuellung.
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
      <Shell className="pb-16 lg:pb-24">
        <motion.div data-reveal variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={[c.crumb]} />
          </motion.div>
          {/* R216: zweispaltig ab lg. Links der unveraenderte Textblock aus R212/R188 F6
              (H1, Lead, beide Knoepfe, Microcopy — bewusst weiter EIN zusammenhaengender
              Block), rechts die Themen-Spruenge. `items-start`, weil die rechte Liste
              oben auf Ueberschriftenhoehe beginnen soll: genau dort war die Flaeche leer.
              Unter lg bleibt alles gestapelt — auf 390 gibt es keine rechte Haelfte, und
              die Liste rutscht dort unter die Microcopy statt daneben. */}
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            <div>
              <motion.h1 variants={item} className={cn('type-h1 text-[var(--color-ink)]', MEASURE_XL)}>
                {lang === 'de' ? 'Fragen und Antworten' : 'Questions and answers'}
              </motion.h1>
              <motion.p variants={item} className={cn('max-w-2xl text-pretty', sectionLead)}>
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
            </div>

            {/* Die sieben Themen dieser Seite als Sprungliste. Alle sieben, nicht eine
                Auswahl: welche wichtig sind, entscheidet der Besucher, und die Copy
                fuehrt sie als geschlossene Liste. Als <nav> mit Label, weil es eine
                Navigationshilfe ist und kein Fliesstext — Screenreader koennen sie
                so ueberspringen. Haarlinien statt Kaesten: die Seite arbeitet
                durchgehend mit `border-line`, ein Kartenraster waere hier ein
                Fremdkoerper. */}
            <motion.nav
              variants={item}
              aria-label={lang === 'de' ? 'Themen dieser Seite' : 'Topics on this page'}
              className="border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:pt-0"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {c.themes.title} {c.themes.titleAccent}
              </p>
              <ul className="mt-4">
                {c.themes.items.map((t) => (
                  <li key={t.label} className="border-b border-[var(--color-line)] last:border-b-0">
                    <a
                      href={t.href}
                      className="group flex min-h-11 items-baseline justify-between gap-4 py-3 transition-colors duration-[var(--dur-fast)] hover:text-[var(--color-salsa)]"
                    >
                      <span className="text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-salsa)]">
                        {t.label}
                      </span>
                      <span className="shrink-0 text-sm text-[var(--color-ink-muted)]">{t.hint}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>
        </motion.div>
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

        {/* R206 (Raphael 23.08. 16:40): "/faq zu kompliziert. Keine tote Creme-Spalte,
            keine Kapitel-Bildbaender. Themen aufteilen und als Grid links/rechts.
            Bilder nicht noetig. Hero oben, unten eine CTA-Section. Seite schlank."
            Die Themen-Chips, die Kapitel-Bildbaender und die schmale max-w-4xl-Spalte
            (deren Rest die tote Cremeflaeche war) sind darum raus. Die sechs kleinen
            Themenbloecke aus content.ts laufen in einem 2er-Grid links/rechts. */}
        <div className="mt-12 grid items-start gap-x-16 gap-y-12 lg:mt-16 lg:grid-cols-2 lg:gap-y-16">
          {f.columns.map((column, ci) => (
            <Reveal key={column.title} stagger={0.06}>
              <motion.div variants={item}>
                <h3 className="type-h3 text-[var(--color-ink)]">{column.title}</h3>
                <p className="mt-2 text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {column.blurb}
                </p>
              </motion.div>
              <motion.div variants={item} className="mt-5 min-w-0">
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
