// Unterseite /kursaufbau (V3-Copyplan pages/08). Risikoabbau-Asset: sie verhindert
// falsche Einstiege und macht klar, wie wir aufbauen. Rhythmus wie die uebrigen
// Unterseiten (SubPageShell + Kit), Copy 1:1 aus KURSAUFBAU (kursaufbau/content.ts).
//
// Signatur ist die Leiter aus CoursesPage LevelsSection: nummerierte Stufen (01 bis 04),
// roter aktiver Marker auf der Einstiegs-Stufe (Beginner). Flaechen hell im Wechsel
// (paper-warm <-> bg-soft), Rot #AD1827 sparsam (CTA, Marker, aktive Stufe, ein
// Script-Akzentwort pro Headline). Echte Bilder, echte Umlaute, CH-ss, keine Em-Dashes.

import { motion } from 'framer-motion';
import { Check, CalendarDays, Clock, DoorOpen, Ticket, Quote, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { KURSAUFBAU, type KursaufbauContent } from '@/public/kursaufbau/content';
import {
  ClosingInvite,
  SubPageShell,
  Breadcrumb,
  PrimaryCta,
  GhostCta,
  SectionHead,
  FaqBlock,
  Shell,
  Eyebrow,
  TitleAccent,
  CtaArrow,
  // R188 KA1: `BeatMark` ist raus. Die einzige Fundstelle war die Legende
  // «So liest du die Leiter», die mit den verschachtelten Karten weggefallen ist.
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';

export function KursaufbauPage() {
  const { lang } = useLang();
  const c = KURSAUFBAU[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* R141: Marker dieser Route, Muster aus R139 (HeelsView) / R140 (Privatstunden).
          Traegt EINE route-lokale Korrektur, ohne WhatsAppFloat.tsx anzufassen (sitewide/tabu):
          Der Desktop-Float ist sonst eine Pille mit Label «WhatsApp» (im Vorher-Shot
          1440x730 gemessen, worklog/shots/S7-ux141/vorher/kursaufbau-desktop-1440-vorher.png).
          Hier Kreis wie mobil. Eigenes Attribut statt [data-privat-page]: das haengt an
          /privatstunden und wuerde diese Route mitziehen. */}
      <div data-kursaufbau-page="">
        <KursaufbauHero c={c} />
        <LevelsLadder c={c} />
        <DoubtSection c={c} />
        <TermSection c={c} />
        <MissSection c={c} />
        <ClosingSection c={c} />
        <FaqBlock title={c.faqTitle} items={c.faq} />
      </div>
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero */
function KursaufbauHero({ c }: { c: KursaufbauContent }) {
  const { container, item } = useReveal();
  const h = c.hero;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      // paddingBottom: solange die Cookie-Leiste steht, deckte sie 58px des Hero-Fotos —
      // der Hero macht ihr Platz; nach Accept wird die Variable 0px (Critic Runde 7, Item 3).
      style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)', paddingBottom: 'var(--cookie-banner-height, 0px)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      <Shell className="grid items-center gap-10 pb-14 pt-6 sm:pb-16 lg:grid-cols-[0.98fr_1.02fr] lg:gap-14 lg:pb-20 lg:pt-8">
        <motion.div data-reveal variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={[c.crumb]} />
          </motion.div>
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="type-h1 mt-5"
          >
            {h.title} {h.titleAccent ? <TitleAccent>{h.titleAccent}</TitleAccent> : null}
          </motion.h1>
          <motion.p variants={item} className={`mt-6 max-w-xl ${sectionLead}`}>
            {h.lead}
          </motion.p>
          <motion.ul variants={item} className="mt-7 flex flex-wrap gap-2">
            {h.bullets.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink)] shadow-sm"
              >
                <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
                {b}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
            <GhostCta href={h.secondary.href}>{h.secondary.label}</GhostCta>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {h.microcopy}
          </motion.p>
        </motion.div>

        <motion.div data-reveal variants={item} initial="hidden" animate="show" className="relative">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src={h.image.src}
              alt={h.image.alt}
              // R80 (Fold 1440x730): lg:aspect-[4/5] (Foto 814px) zog die Grid-Zeile so
              // tief, dass der rote CTA bei top 720 mit 44px unter den Fold hing.
              // lg:aspect-[3/2] (Foto ~433px) schrumpft die rechte Spalte; items-center
              // zentriert beide Spalten hoeher -> CTA bottom ~610, ganz im Fenster.
              // Motiv kurs-02.jpg, Copy, Chips, H1 bleiben. Salsa DE14/EN55 unberuehrt.
              className="aspect-[4/5] w-full object-cover object-[center_42%] sm:aspect-[5/4] lg:aspect-[3/2]"
              width={1600}
              height={1067}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* Links angedockt + festes Papier statt Glas — FAB lag auf der Kartenecke,
              Glas auf Fotos verboten (Sweep 14.08.2026, wie PrivatstundenPage). */}
          {/* bottom-4 statt -bottom-5: die Karte hing aus dem Foto in die naechste Sektion
              (Critic Runde 12, Item 2 — gleiches Muster wie /privatstunden in Runde 11). */}
          <div className="absolute bottom-4 left-5 right-5 rounded-2xl border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[18rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight">{h.cardText}</p>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Levels (die Leiter-Signatur) */
function LevelsLadder({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const { lang } = useLang();
  const de = lang === 'de';
  const l = c.levels;
  return (
    <section id="levels" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-20 lg:py-32">
      {/* R188 KA1 (Video 11:19 «Einfach macht das ein bisschen simpler»): Die Sektion
          steckte in drei Kartenebenen ineinander — eine 2rem-Karte um die ganze Sektion,
          darin eine 1.75rem-Karte um die Leiter, darin je Stufe noch eine 2xl-Karte.
          Drei Rahmen, drei Radien, drei Flaechen fuer eine Liste. Verschachtelte Karten
          sind laut design-Doktrin immer falsch.
          Jetzt: kein Sektions-Rahmen, kein Leiter-Rahmen. Es bleibt EINE Kartenebene,
          naemlich die Stufe selbst. Die Legende «So liest du die Leiter» faellt weg: sie
          erklaerte zwei Pillen, die neben jeder Stufe ohnehin im Klartext stehen. */}
      <Shell>
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            {/* Linke Spalte: Kopf + Stil-Verweise.
                `lg:sticky` statt der frueheren gestreckten Spalte: die Leiter ist mit
                fuenf Stufen rund 900px hoch, der Kopf nur rund 400px. Ohne sticky stuende
                unter den Stil-Knoepfen eine halbe Bildschirmhoehe leer (genau die Luecke,
                die R141 mit der Schritt-Grafik zugestellt hatte). Mitlaufend bleibt die
                Frage sichtbar, waehrend man die Stufen liest. */}
            <motion.div variants={item} className="flex flex-col lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <Eyebrow>{l.eyebrow}</Eyebrow>
              <h2 className={`mt-5 ${sectionTitle}`}>
                {l.title} {l.titleAccent ? <TitleAccent>{l.titleAccent}</TitleAccent> : null}
              </h2>
              <p className={`mt-4 ${sectionLead}`}>{l.body}</p>

              <div className="mt-8">
                <p className="max-w-md text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{l.stylesIntro}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {l.styles.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="btn-base btn-outline group px-4 py-2 text-sm"
                    >
                      {s.label}
                      <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* R188 KA1: Die Schritt-Grafik ist raus. Sie war `alt=""` und
                  `aria-hidden`, trug also keine Information — sie fuellte nur Leerraum
                  (so stand es im R141-Kommentar hier woertlich). Ihre Bildunterschrift
                  wiederholte ausserdem die H2 daneben. */}
            </motion.div>

            {/* Rechte Spalte: die Leiter, jetzt ohne eigenen Rahmen */}
            <motion.div variants={item}>
              <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-line)] pb-4">
                <h3 className="type-h3 text-[var(--color-ink)]">
                  {de ? 'Salsa & Bachata: Stufe für Stufe' : 'Salsa & Bachata: stage by stage'}
                </h3>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--color-ink-muted)]">
                  {l.rungs.length} {de ? 'Stufen' : 'stages'}
                </span>
              </div>

              <ol className="mt-5 grid gap-3">
                  {l.rungs.map((rung, ri) => {
                    const active = ri === 0;
                    return (
                      <li
                        key={rung.name}
                        // R188 KA1: `bg-white/70` war halbtransparent gegen die
                        // Papier-Flaeche der entfernten Leiter-Karte. Ohne diese
                        // Flaeche stuende die Stufe jetzt auf bg-soft und waere
                        // milchig. Volles Weiss, wie die aktive Stufe.
                        className={cn(
                          'rounded-2xl border p-4 sm:p-5',
                          active
                            ? 'border-[var(--color-salsa)]/35 bg-white shadow-sm'
                            : 'border-[var(--color-line)] bg-white',
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold tabular-nums',
                              active
                                ? 'bg-[var(--color-salsa)] text-white'
                                : 'border border-[var(--color-line)] bg-[var(--color-paper-warm)] text-[var(--color-ink)]',
                            )}
                          >
                            {String(ri + 1).padStart(2, '0')}
                          </span>
                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span
                              className={cn(
                                'font-display text-xl font-bold leading-tight',
                                active ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                              )}
                            >
                              {rung.name}
                            </span>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                                active
                                  ? 'bg-[var(--color-salsa)]/10 text-[var(--color-salsa)]'
                                  : 'bg-[var(--color-paper-warm)] text-[var(--color-ink-muted)]',
                              )}
                            >
                              {active ? l.startTag : l.buildTag}
                            </span>
                          </div>
                        </div>

                        {/* R141 (Video 04:46 «Ich versteh nicht, was hier mit den ganzen
                            Texten ist», 04:52 «dass es hier ein bisschen aufgeht»):
                            Vorher trug JEDE der fuenf Stufen drei gleich laute Zeilen —
                            15 Textbloecke gleichzeitig, mobil rund fuenf Bildschirme.
                            Jetzt traegt jede Stufe nur ihre Kernzeile («Fuer dich, wenn»).
                            Inhalte und Wechsel-Kriterium liegen in einer nativen
                            <details>-Klappe, also Detail auf Wunsch statt fuenf Waende.
                            Stufe 01 ist offen: die Einstiegs-Stufe zeigt weiter, wie die
                            Leiter zu lesen ist, ohne dass jemand erst klicken muss. */}
                        <div className="mt-3 sm:pl-[3.75rem]">
                          {/* Die Kernzeile traegt die Stufe. Sie steht als normaler Satz da,
                              nicht als Label-Wert-Paar: das Label «Fuer dich, wenn» wuerde
                              als vierte Grossbuchstaben-Zeile die Ruhe wieder zerstoeren,
                              die der Umbau gerade gebracht hat. */}
                          <p className="text-[0.95rem] leading-relaxed text-[var(--color-ink)]">{rung.forYou}</p>
                          <details className="group/rung mt-2.5" open={active}>
                            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full text-xs font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-salsa)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-salsa)] [&::-webkit-details-marker]:hidden">
                              {/* R141 Nachtrag: Ohne den Stufennamen tragen alle fuenf
                                  Klapp-Schalter denselben zugaenglichen Namen. In der
                                  Elementliste eines Screenreaders stand fuenfmal
                                  «Inhalte und Wechsel». Der Name davor macht sie
                                  unterscheidbar. Natives summary liefert Rolle, Tastatur
                                  und Auf/Zu-Zustand selbst, mehr ARIA braucht es nicht. */}
                              <span className="sr-only">{rung.name}: </span>
                              {l.detailsLabel}
                              <ChevronDown
                                size={14}
                                strokeWidth={2.5}
                                aria-hidden
                                className="transition-transform duration-[var(--dur-fast)] ease-out group-open/rung:rotate-180"
                              />
                            </summary>
                            <dl className="mt-3 grid gap-2.5">
                              <RungRow label={l.youLearnLabel} value={rung.youLearn} />
                              <RungRow label={l.nextLabel} value={rung.next} />
                            </dl>
                          </details>
                        </div>
                      </li>
                    );
                  })}
              </ol>

              {/* R188 KA1: die mobile Zweitfassung der Schritt-Grafik ist mit der
                  Desktop-Fassung zusammen raus (Begruendung oben in der linken Spalte). */}
            </motion.div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* Eine Zeile innerhalb der aufgeklappten Detail-Liste: kleines Label ueber dem Text.
 * R141: vorher zweispaltig (sm:grid-cols-[7.5rem_1fr]). Das Label stand dann neben
 * dem Satz und riss eine zweite Textkante auf. Gestapelt liest die Stufe wie ein
 * Block: Kernzeile, Label, Satz. */
function RungRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-salsa)]">{label}</dt>
      <dd className="text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{value}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------- Wenn du unsicher bist */
function DoubtSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const d = c.doubt;
  return (
    <section className="bg-[var(--color-paper-warm)] py-20 lg:py-32">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={d.eyebrow} title={d.title} titleAccent={d.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {d.blocks.map((b) => (
            <motion.div
              key={b.quote}
              variants={item}
              className="flex h-full flex-col rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
            >
              <Quote aria-hidden className="h-7 w-7 text-[var(--color-salsa)]" strokeWidth={1.75} />
              <p className="mt-4 font-display text-lg font-bold leading-snug text-[var(--color-ink)]">
                {'„'}
                {b.quote}
                {'“'}
              </p>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">{b.answer}</p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-9">
          <motion.div variants={item}>
            <a
              href={d.cta.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {d.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Kursstaffeln & Dauer */
const TERM_ICONS = [CalendarDays, Clock, DoorOpen, Ticket];

function TermSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const t = c.term;
  return (
    <section className="bg-[var(--color-bg-soft)] py-20 lg:py-32">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-md">
            <motion.div variants={item}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {t.title} {t.titleAccent ? <TitleAccent>{t.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {t.body}
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={t.cta.href}>{t.cta.label}</PrimaryCta>
              <GhostCta href={t.secondary.href}>{t.secondary.label}</GhostCta>
            </motion.div>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
            {t.cards.map((card, i) => {
              const Icon = TERM_ICONS[i] ?? CalendarDays;
              return (
                <motion.div
                  key={card.label}
                  variants={item}
                  className="flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Icon aria-hidden className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.75} />
                  </span>
                  <h3 className="type-h4 mt-5 text-[var(--color-ink-muted)]">
                    {card.label}
                  </h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{card.value}</p>
                </motion.div>
              );
            })}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Nachholen & Fehlen */
function MissSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const m = c.miss;
  return (
    <section className="bg-[var(--color-paper-warm)] py-20 lg:py-32">
      <Shell>
        {/* R141 (Video 04:58 «Hier ist so viel Freiraum»): Raphael nennt zwei Dinge in
            einem Satz. Das dunkle Foto ist getauscht (content.ts). Der Freiraum war
            zuerst nur vertikal behandelt, die eigentliche Klage ist aber die Flaeche
            NEBEN dem Text: rechts von Eyebrow, H2 und zwei Zeilen Fliesstext stand die
            halbe Blockbreite leer.
            Zwei Aenderungen loesen das, ohne neue Dichte:
            1. Das Grid dreht zugunsten des Bildes (1.15fr zu 0.85fr statt 0.95 zu 1.05).
               Die Textspalte wird schmaler, die Zeilen laufen dichter an ihre Kante.
            2. Die «Dein Tempo»-Karte parkte als Overlay auf dem Foto und verdeckte dort
               Tanzende. Sie steht jetzt als eigener Block unter dem Fliesstext und fuellt
               die Restflaeche mit dem Inhalt, der ohnehin zur Sektion gehoert.
            Ein frueherer Kommentar an dieser Stelle behauptete ein festes lg:aspect-[4/5]
            am Foto. Die Klasse trug nie ein aspect-Utility, sondern lg:h-full plus
            min-h — damit konnte das Bild die Grid-Spur weiter mitbestimmen. Das Foto
            liegt jetzt absolut in einem Wrapper ohne Eigenhoehe, also bestimmt allein
            die Textspalte die Zeilenhoehe. */}
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.08)] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <motion.div variants={item} className="relative lg:h-full">
            <img
              src={m.image.src}
              alt={m.image.alt}
              // R188 SW4: Die Datei ist jetzt der rechts beschnittene Auszug
              // (1410x1065, content.ts miss.image). width/height melden die ECHTEN
              // Masse — mit den alten 1600x1065 haette der Browser die falsche
              // Hoehe reserviert und die Seite waere beim Laden gesprungen (CLS).
              // object-[center_38%] bleibt: der Ausschnitt fuellt die Breite voll
              // (extra_x = 0 im gemessenen 767x403-Kasten), die Position verschiebt
              // also nur senkrecht. Bei 38% liegen alle Koepfe der Klasse ganz im
              // Bild (Quell-y 125..861 von 1065, am echten Ausschnitt nachgesehen).
              // Ab lg absolut positioniert: das Bild fuellt die Spur, die der Text
              // aufspannt, und traegt selbst keine Hoehe in das Grid hinein.
              className="h-72 w-full object-cover object-[center_38%] sm:h-80 lg:absolute lg:inset-0 lg:h-full"
              width={1410}
              height={1065}
              loading="lazy"
            />
          </motion.div>
          <motion.div variants={item} className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <Eyebrow>{m.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {m.title} {m.titleAccent ? <TitleAccent>{m.titleAccent}</TitleAccent> : null}
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{m.body}</p>
            {/* Festes Papier statt Glas (Sweep 14.08.2026). Aus dem Foto-Overlay in die
                Textspalte gezogen: dort verdeckte die Karte Tanzende, hier fuellt sie den
                Rest der Spalte mit Inhalt, der ohnehin zur Sektion gehoert. */}
            <div className="mt-7 rounded-2xl border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{m.cardLabel}</p>
              <p className="mt-1 font-display text-lg font-bold leading-tight">{m.cardText}</p>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schluss-CTA (zwei Wege) */
function ClosingSection({ c }: { c: KursaufbauContent }) {
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
      note={cl.microcopy}
      surface="soft"
    />
  );
}
