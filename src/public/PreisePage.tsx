
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
      <div
        data-preise-page=""
        className="preise-page"
        data-cookie-clear={cookieClear ? 'true' : undefined}
      />
      {/* Kein Eyebrow: "Preise & Optionen" stand direkt ueber der H1 "Preise fuer Kurse,
          Workshops und Privatstunden." und wiederholte nur deren erstes Wort. Die Breadcrumb
          darueber sagt bereits "Preise" — dreimal dasselbe Wort in 40px Hoehe. */}


      <SubHero
        axis="center"
        dense
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
/** Flache Preis-Tabelle: EIN Ankerpreis oben, die Nebenpreise klar leiser darunter.
 *
 *  R188 P8, Fix-Runde 3 (Kundenkritik «Linien/Balken raus», Video 07:21-07:23
 *  «Hier diese Linien. Will ich weglassen. Die sind hier oben.»):
 *  Die Runde davor hat nur die Linie ueber der ERSTEN Zeile entfernt und zwischen
 *  allen weiteren Zeilen `border-t` stehen lassen. Im Browser nachgemessen
 *  (dl > div, borderTopWidth): «Freitag Workshop», «Salsaflow Schueler» und
 *  «Salsaflow Pass» standen zwar auf 0px — die jeweils FOLGENDE Zeile trug aber
 *  1px, und genau die liest ein Besucher als Linie ueber dem naechsten Preis.
 *  Fuenf Zeilen, vier Regeln: die Karte sah aus wie ein Kontoauszug.
 *
 *  Jetzt tragen die Zeilen GAR KEINE Linie mehr. Die Gliederung kommt aus dem
 *  Abstand: der Ankerpreis steht mit `pb-4` etwas freier, die Nebenpreise ruecken
 *  mit `space-y`-artigem py-2.5 dicht zusammen. Dichte Zeilen lesen sich als eine
 *  Gruppe, ohne dass eine Linie sie einrahmen muss.
 *
 *  R188 P3 (Kundenwunsch «Preisdarstellung geiler»): Die Runde davor gab dem
 *  Ankerpreis text-xl (20px) und den Nebenpreisen text-lg (18px) — 2px Unterschied,
 *  im Screenshot nicht als Hierarchie lesbar. Jetzt traegt der Ankerpreis
 *  text-[2rem] (32px) in Marken-Rot und die Nebenpreise text-base (16px) in
 *  gedecktem Ink: Faktor 2.0 statt 1.1. Ein Blick, ein Preis. */
function PriceRows({ rows, onRequest }: { rows: PriceRow[]; onRequest: string }) {
  return (
    <dl>
      {rows.map((row, i) => {
        const anchor = i === 0;
        return (
          <div
            key={row.label}
            className={cn(
              'grid grid-cols-[1fr_auto] items-baseline gap-5',
              // Kein border mehr (P8). Der Ankerpreis bekommt unten Luft, damit er
              // sich von der Nebengruppe loest; die Nebenpreise stehen dicht.
              anchor ? 'pb-3.5' : 'py-2.5',
            )}
          >
            <dt
              className={cn(
                'leading-snug',
                anchor
                  ? 'text-[0.95rem] font-semibold text-[var(--color-ink)]'
                  : 'text-[0.9rem] text-[var(--color-ink-muted)]',
              )}
            >
              {row.label}
            </dt>
            <dd
              className={cn(
                // Kein tabular-nums: Cal Sans sperrt damit auch Punkt und Strich auf
                // Ziffernbreite — "CHF 30.-" wurde zu "CHF 30 . -" (Sweep 13.08.2026,
                // gemessen 73px statt 58px). Die Werte sind rechtsbuendige Strings,
                // eine Ziffern-Spaltenausrichtung braucht es hier nicht.
                'shrink-0 font-display leading-none tracking-[-0.02em]',
                anchor
                  ? 'text-[2rem] font-extrabold text-[var(--color-salsa)]'
                  : 'text-base font-bold text-[var(--color-ink-muted)]',
              )}
            >
              {row.value ?? onRequest}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** Gruppierte Preis-Tabelle (Einzeln / Zu zweit / Einzellektion).
 *
 *  R188 P1/P3 (Video 06:26 «uebelst unuebersichtlich», 06:49 «Der Preis muss ein
 *  bisschen geiler»), Fix-Runde 3 nach FAIL des Kritikers:
 *
 *  Der Ist-Stand war eine flache Sechser-Liste mit fuenf Trennlinien. Der Kritiker
 *  nennt sie woertlich einen Kontoauszug, und das trifft: sechs Zahlen in fast
 *  gleicher Groesse untereinander, nur die erste rot. Nachgemessen im Browser waren
 *  Ankerpreis und Nebenpreise 40px gegen 20px — aber alle SECHS standen im selben
 *  Rhythmus, im selben Abstand, mit derselben Linie dazwischen. Groesse allein macht
 *  keine Hierarchie, wenn die Bauform aller Zeilen identisch bleibt.
 *
 *  Jetzt zwei Ebenen statt einer Liste:
 *  1. Der ANKER steht oben als eigener Block, nicht als Zeile eins von sechs:
 *     Positionsname, dann der Preis in 3.25rem, daneben die Empfehlungs-Pille.
 *     Das ist der Einstieg, den der Auftrag verlangt («Hauptpreis prominent,
 *     Empfehlung hervorheben»).
 *  2. Die fuenf NEBENPREISE stehen darunter als leise Gruppe, zweispaltig ab sm,
 *     mit ihrem Gruppennamen als Ueberschrift. Sie sind Varianten desselben
 *     Produkts, keine konkurrierenden Angebote — deshalb duerfen sie klein sein.
 *
 *  P8 gilt hier genauso: keine Trennlinie zwischen den Preisen. Die Gruppen trennt
 *  ihr Gruppenname und der Abstand, nicht ein Strich.
 *
 *  Der Gruppenname steht NUR einmal je Gruppe. Ein frueherer Versuch setzte ihn unter
 *  jede Zeile — dann stand «Einzeln» zweimal und «Einzellektion» direkt unter der
 *  gleichnamigen Position. Nennt die Position ihren Gruppennamen ohnehin schon,
 *  bleibt er weg. */
function GroupedPrices({
  groups,
  onRequest,
  anchorNote,
}: {
  groups: PriceGroup[];
  onRequest: string;
  anchorNote: string;
}) {
  const [firstGroup, ...restGroups] = groups;
  const [anchorRow, ...firstRest] = firstGroup.rows;
  // Die Restgruppen behalten ihren Namen; aus der Ankergruppe bleibt nur, was nach
  // dem Ankerpreis noch kommt. `key` aus Gruppe UND Position: «Schüler und Studenten»
  // steht in allen drei Gruppen, `row.label` allein waere dreimal derselbe Key.
  const secondary = [
    ...(firstRest.length ? [{ label: firstGroup.label, rows: firstRest }] : []),
    ...restGroups,
  ];
  return (
    <div>
      {/* Ebene 1: der Ankerpreis. Eigener Block, eigener Rhythmus.
          Preis LINKS, Beschriftung rechts daneben: rechtsbuendig stand die Zahl
          rund 500px von ihrem eigenen Positionsnamen entfernt (gemessen im ersten
          Durchgang, d-02.png) und die beiden lasen sich nicht mehr als ein Paar.
          Die 52px-Zahl ist ohnehin der Blickfang, sie braucht die rechte Kante nicht. */}
      <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <dd className="shrink-0 font-display text-[2.75rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-salsa)] sm:text-[3.25rem]">
          {anchorRow.value ?? onRequest}
        </dd>
        <div className="min-w-0">
          <dt className="text-[0.95rem] font-semibold leading-snug text-[var(--color-ink)]">
            {anchorRow.label}
          </dt>
          {/* Die Empfehlungs-Pille steht UNTER dem Positionsnamen. Marken-Rot auf
              10 Prozent Flaeche, kein Pastellton — die Schrift traegt volles
              #AD1827 (var(--color-salsa)). */}
          <dd className="mt-1.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-salsa)]/10 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--color-salsa)]">
              <BeatMark />
              {anchorNote}
            </span>
          </dd>
        </div>
      </dl>

      {/* Ebene 2: die Nebenpreise. Zweispaltig ab sm, damit fuenf Positionen nicht
          wieder als lange Zahlenkolonne untereinander stehen — genau das war der
          Kontoauszug-Eindruck. Keine Linie, nur Abstand.
          `items-start`: ohne das streckt das Raster die einzeilige Gruppe «Einzeln»
          auf die Hoehe der zweizeiligen «Zu zweit» und darunter klafft sichtbar
          Leerraum (erster Durchgang, d-02.png). */}
      <div className="mt-9 grid items-start gap-x-10 gap-y-7 sm:grid-cols-2">
        {secondary.map((g) => (
          <div key={g.label}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              {g.label}
            </p>
            <dl className="mt-2.5">
              {g.rows.map((row) => (
                <div
                  key={`${g.label}-${row.label}`}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-1.5"
                >
                  <dt className="text-[0.9rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
                  <dd className="shrink-0 font-display text-base font-bold leading-none tracking-[-0.02em] text-[var(--color-ink)]">
                    {row.value ?? onRequest}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
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
        {/* R188 P4: `lead={r.body}` ist raus. Der Begleitsatz unter dem Intro
            («Eine Kursstaffel ist der normale Einstieg …») sagte, was die Tabelle
            daneben zeigt. Der Satz mit der echten Information (8 Wochen, 60 Minuten)
            bleibt als `fixed`-Zeile stehen. */}
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <SectionHead title={r.title} titleAccent={r.titleAccent} />
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


          {/* R188 P8, Fix-Runde 3: Auch die Linie UNTER dem Kartenkopf ist raus. Sie
              lag direkt ueber dem Ankerpreis und war damit die letzte waagrechte
              Regel dieser Karte — genau die Sorte Deko, die SW5 und die Kundenkritik
              («Linien/Balken raus») meinen. Kopf und Preisblock trennt jetzt nur der
              Abstand (mt-6). */}
          <Reveal>
            <motion.div
              variants={item}
              className="flex items-baseline justify-between gap-4"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]">{r.cardTitle}</p>
              <p className="text-xs font-semibold text-[var(--color-ink-muted)]">{r.cardNote}</p>
            </motion.div>
            <motion.div variants={item} className="mt-6">
              <GroupedPrices groups={r.groups} onRequest={c.onRequest} anchorNote={r.anchorNote} />
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
          {/* Spaltenzahl aus der Anzahl Karten. Das feste Zwei-Spalten-Raster war fuer genau
              zwei gebaut; die dritte Karte (Festpreis) stand allein in der linken Spalte und
              liess rechts ein Loch. */}
          <div
            className={cn(
              'mt-6 grid gap-x-16 gap-y-8',
              r.entry.items.length === 2 ? 'lg:grid-cols-[0.9fr_1.1fr]' : 'md:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {r.entry.items.map((e) => (
              <motion.div key={e.title} variants={item}>
                <h3 className="type-h3 text-[var(--color-ink)]">
                  {e.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {e.text}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Stufe 2 der Link-Skala, nicht noch ein roter Pill: die Sektion hat mit
              "Kursplan oeffnen" oben schon ihren einen Primary (DESIGN.md Zeile 86).

              R188 P5 (Video 07:03 «Macht das mal, dass es hier links auch ordentlich
              angeordnet ist»): `-ml-4` zog den Link 16px nach links aus der Textkante
              heraus. Eyebrow, die drei Ueberschriften und der Fliesstext standen alle
              auf x=52, der Link allein auf x=36 — die einzige gebrochene Kante der
              Sektion. Ohne den negativen Rand liegt er auf derselben Linie. */}
          <motion.div variants={item} className="mt-8">
            <GhostCta href={r.entry.link.href}>{r.entry.link.label}</GhostCta>
          </motion.div>
        </Reveal>


        {/* R188 P2/P8: Die Bildunterschrift ist raus. Sie trug «KURSSTAFFEL» (steht schon
            als Kopf ueber der Preistabelle) und «8 Wochen, eine Lektion à 60 Minuten pro
            Woche» (steht schon als `fixed`-Zeile links) — beides ein drittes Mal auf
            derselben Bildschirmhoehe. Mit ihr faellt die Trennlinie unter dem Foto weg. */}
        <Reveal className="mt-12 lg:mt-16">
          {/* objectPosition kommt aus dem Content (wie in PassSection), sonst
              waere `regular.image.position` still wirkungslos. Ohne Angabe bleibt es
              bei den bisherigen 45%. width/height melden die echten Masse der Datei
              (R188 P6: r188-preise/kurs-paar-studiowand-1920.webp = 1920x1280). */}
          <motion.img
            variants={item}
            src={r.image.src}
            alt={r.image.alt}
            style={{ objectPosition: r.image.position ?? 'center 45%' }}
            className="aspect-[21/9] w-full rounded-[var(--radius-media)] object-cover"
            width={1920}
            height={1280}
            loading="lazy"
          />
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
              {/* R188 P7 (Video 07:09 «Macht den Text hier weg», 07:11-07:15 «Eins zu eins
                  Fokus. Dein Tempo, dein Ziel. Nicht geil»): Label und Satz unter dem Foto
                  sind ersatzlos raus. Sie wiederholten nur die H2 daneben
                  («Privatstunden für persönlichen Fokus»). Damit faellt auch die
                  Trennlinie unter dem Bild weg — das Foto steht jetzt allein. */}
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
  cta,
  onRequest,
}: {
  title: string;
  body: string;
  rows: PriceRow[];
  foot?: string;
  image: { src: string; alt: string; width: number; height: number; position?: string };
  cta: { label: string; href: string };
  onRequest: string;
}) {
  return (
    // R188 P8: `border-t` ueber der Karte ist raus. Ueber jeder Workshop-Spalte lag
    // eine Linie und darunter, ueber der ersten Preiszeile, die naechste. Zwei
    // waagrechte Linien pro Spalte, beide nur Deko. Das Foto beginnt jetzt direkt.
    <div className="flex h-full flex-col">

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
        <h3 className="type-h3 text-[var(--color-ink)]">{title}</h3>
      </div>
      <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
      <div className="mt-6">
        <PriceRows rows={rows} onRequest={onRequest} />
      </div>

      {foot ? (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{foot}</p>
      ) : null}

      {/* R60: eigener Knopf pro Karte, per mt-auto an der gemeinsamen Unterkante. Vorher
          sass EIN Section-Knopf unter der linken Karte — die rechte (Danceflow Night)
          trug keine Aktion und endete hoeher. Jetzt enden beide Karten auf einer Linie. */}
      <div className="mt-auto pt-6">
        <PrimaryCta href={cta.href}>{cta.label}</PrimaryCta>
      </div>
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
              cta={w.workshop.cta}
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
              cta={w.social.cta}
              onRequest={c.onRequest}
            />
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

        {/* R188 P8: `border-y` ist raus. Ueber dem Pass-Block lag eine Linie ueber die
            volle Breite, darunter im rechten Kasten die naechste ueber der Preiszeile
            «Salsaflow Pass». Die senkrechte Trennung zwischen Text und Preisspalte
            (lg:border-l unten) bleibt: sie trennt zwei Inhalte, statt nur zu dekorieren. */}
        <Reveal className="lg:grid lg:grid-cols-[1.1fr_0.9fr]">
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
              // content darf den Ausschnitt vorgeben (Hochformat-Motive); ohne Angabe bleibt 45%.
              style={p.image.position ? { objectPosition: p.image.position } : undefined}
              className="order-2 mt-8 aspect-[16/9] w-full rounded-[var(--radius-media)] object-cover object-[center_45%] lg:order-none lg:mb-7 lg:mt-0"
              width={1400}
              height={1000}
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
                  <span className="block type-h3 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-salsa)]">{o.when}</span>
                  <span className="mt-1 block text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{o.pick}</span>
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-salsa)] transition-colors duration-[var(--dur-fast)] group-hover:border-[var(--color-salsa)] group-hover:bg-[var(--color-salsa)] group-hover:text-white">
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
