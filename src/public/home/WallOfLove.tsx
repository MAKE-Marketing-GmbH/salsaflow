import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { GOOGLE_REVIEWS, WALL_REVIEWS, localizeReview } from '@/public/site/reviews';
import { CtaArrow, GoogleRating, Shell, StarRating, sectionLead } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

const COPY = {
  de: {
    title: 'Was unsere Community sagt.',
    lead: 'Echte Google-Bewertungen von Menschen, die bei uns tanzen.',
    all: `Alle ${GOOGLE_REVIEWS.count} Bewertungen auf Google`,
    cue: 'Echte Stimmen',
    rail: 'Google-Bewertungen',
  },
  en: {
    title: 'What our community says.',
    lead: 'Real Google reviews from people who dance with us.',
    all: `Read all ${GOOGLE_REVIEWS.count} reviews on Google`,
    cue: 'Real voices',
    rail: 'Google reviews',
  },
} as const;

export function WallOfLove() {
  const { lang } = useLang();
  const { item } = useReveal();
  const c = COPY[lang];

  return (
    // Flaeche paper-warm statt bg-soft (Runde 1, 2026-08-07): WhyGrid steht direkt darueber
    // und laeuft auf bg-soft. Zwei gleiche Toene hintereinander verschmelzen zu einer
    // ueberlangen Sektion — gemessen 758px + 714px ohne sichtbare Naht dazwischen.
    // Wechsel statt neuer Ton, der Zweiklang der Seite bleibt unveraendert.
    <section id="community" className={cn('scroll-mt-24 bg-[var(--color-paper-warm)]', SECTION_Y_HOME)}>
      <Shell>
        <Reveal className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div variants={item} className="max-w-2xl">
            {/* Kritiker-Verdict r14, Punkt 3 ("Typo-Hierarchie in den Mittel-Sektionen klarer
                stufen"). Gemessen mit `node scripts/aaa-r14-typo.cjs 1440` lief die Seite auf
                DREI H2-Groessen ohne System: 64px (angebot), 52px (einstieg), 48px (community,
                events, standort) und 44px (kurse, price, faq, instagram). Der Ausreisser nach
                unten sind die vier `sectionTitle`-Sektionen — und `sectionTitle` haengt an 23
                weiteren Dateien sitewide (`grep -rn sectionTitle src/`), ist hier also nicht
                anfassbar. Anfassbar ist die Gegenrichtung: diese Sektion stand mit 48px
                zwischen den 44ern, ohne dass sie wichtiger ist als der Kursplan darueber.
                48px -> 44px (text-4xl, sm:text-[2.75rem]) legt sie auf dieselbe Stufe wie
                kurse/faq/price. Die Seite hat danach genau drei Stufen mit klarer Bedeutung:
                64px Angebot (Hauptkapitel), 52px Einstieg, 44px alle Mittel-Sektionen. */}
            <h2
              className={cn(
                'font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)] sm:text-[2.75rem]',
                MEASURE_L,
              )}
            >
              {c.title}
            </h2>
            {/* mt-4 -> mt-3: derselbe Kopfabstand wie im Kursplan-Block darueber
                (`node scripts/aaa-r14-headgap.cjs` mass dort H2->lead=12, hier 16). */}
            <p className={`mt-3 max-w-xl ${sectionLead}`}>{c.lead}</p>
          </motion.div>
          {/* Kritiker-Befund 2026-08-09, "Uebergang Reviews->Events: tote Weissflaeche straffen".
              Gemessen (Playwright, 1440px): die Zitat-Spalten enden bei y=4969, der Google-Link
              stand danach als eigene Zeile bei y=4990..5012 — ein 22px hoher Textlink mit einem
              332px kurzen Haarlinien-Stummel darueber, links in einer 1400px breiten Zeile,
              danach 65px Sektionsfuss auf 64px Kopf des dunklen Events-Bandes. Zwischen dem
              letzten Zitat und dem Farbwechsel lagen damit 108px Flaeche fuer eine Textzeile
              (`python3 scripts/aaa-r10-dead.py`: DEAD y=4940..5000 und y=5020..5100).
              Die Zeile entfaellt ersatzlos: derselbe Link steht jetzt unter der Bewertung im
              Sektionskopf, also bei der Zahl, die er belegt. Kein Wort Copy und kein Ziel geht
              verloren, die Sektion schliesst direkt mit den Zitaten. */}
          {/* Kein `justify-between` unterhalb von lg (Runde r13, 2026-08-09): der Grid-Track ist
              dort die volle Shell-Breite, also hat es die grosse "4,9" an die linke und den
              Google-Cluster an die rechte Kante gedrueckt — gemessen 390px: Zahl bei x=20..87,
              Cluster erst ab x=111 und zweizeilig umgebrochen; 768px: Zahl x=64, Cluster
              x=808..1472. Dazwischen stand eine leere Flaeche, und `items-end` legte die
              Zahl zusaetzlich unter die Sternzeile statt neben sie. Ab lg ist die Spalte
              `auto` breit und rechtsbuendig — dort bleibt alles unveraendert. */}
          <motion.div variants={item} className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-2">
            <span className="font-display text-[3.5rem] font-extrabold leading-[0.82] tracking-tight text-[var(--color-ink)] sm:text-[4.25rem]">
              {lang === 'de' ? '4,9' : '4.9'}
            </span>
            <div className="flex flex-col items-start gap-2 lg:items-end">
              <GoogleRating />
              <a
                href={GOOGLE_REVIEWS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-salsa)]"
              >
                {c.all}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </Reveal>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{c.cue}</span>
          <img src="/logo/google-g.svg" alt="Google" width={22} height={22} className="h-[22px] w-[22px]" />
        </div>

        {/* Runde 1 (2026-08-07), zwei Aenderungen an derselben Stelle:
            1) SECHS Karten -> DREI Zitate. Gemessen war die Sektion 983px hoch auf Desktop
               und 2199px auf Mobil (node scripts/home-shot.cjs base) — auf 390px sind sechs
               Karten sechs volle Bildschirme fuer EINE Aussage ("4,9 aus 104"). Drei Stimmen
               belegen dieselbe Aussage; die restlichen neun stehen unveraendert in
               site/reviews.ts und hinter dem Google-Link darunter.
            2) Karten-Chrome raus (Radius + Rahmen + Schatten + Hover-Lift gleichzeitig).
               DESIGN.md:77 "Border ODER weicher Schatten, nicht beides stark" und
               "Karten meist nur feine --color-line Border. Tiefe ueber Spacing". Jetzt drei
               Spalten an einer Haarlinie, getrennt durch senkrechte Linien — dieselbe Bauform
               wie WhyGrid und CoursePath, statt eines siebten Kartentyps. */}
        {/* Kritiker-Verdict r14, Punkt 2: "echte Fotos ergaenzen, ABER NUR falls unter
            public/photos/ echte Personenfotos vorhanden sind, die zu den Namen passen".
            Geprueft: `find public/photos -iname "*deliu*" -o -iname "*sarah*" -o -iname "*marco*"`
            liefert NICHTS. Vorhanden sind ausschliesslich Team- und Gruender-Fotos
            (public/photos/team/, public/photos/founders/ — Fabio, Claudia, Sebastian, Vanessa,
            teacher-*), also Mitarbeitende der Schule, nicht die Google-Rezensenten Deliu, Sarah
            und Marco. Ein Team-Gesicht neben ein Kundenzitat zu setzen waere eine erfundene
            Zuordnung und zugleich ein gefaelschter Beleg — genau das verbietet der Auftrag
            ("NIEMALS Stock-/Fremdfotos oder erfundene Zuordnungen"). Es kommt also KEIN Foto
            dazu; die Karten werden stattdessen typografisch differenziert:

              1) Das erste Zitat traegt das grosse Anfuehrungszeichen und laeuft in groesserer
                 Schrift (19px statt 17px) ueber eine breitere Spalte — eine Leitstimme statt
                 drei gleichrangiger Kacheln. Die Spalten sind ab sm 1.25fr/1fr/1fr statt 3x
                 gleich breit; damit ist die gemessene "3x445px"-Kachelreihe
                 (`node scripts/aaa-r14-pattern.cjs`) als Reihe aufgeloest.
              2) Das Anfuehrungszeichen ist Cal Sans in --color-line, also die vorhandene
                 Linienfarbe als Typo — keine neue Farbe, keine Deko-Flaeche (DESIGN.md).
                 aria-hidden, weil es semantisch nichts traegt; das <blockquote> tut das. */}
        <div role="region" aria-label={c.rail} className="mt-2 grid sm:grid-cols-[1.25fr_1fr_1fr]">
          {WALL_REVIEWS.slice(0, 3).map((review, index) => {
            const localized = localizeReview(review, lang);
            const lead = index === 0;
            return (
              <figure
                key={`${review.name}-${index}`}
                lang={lang}
                className={cn(
                  // Fusspolster nur dort, wo darunter noch etwas kommt. Die Zitate sind seit
                  // dem Wegfall der Link-Zeile das LETZTE Element der Sektion; ihr eigenes
                  // pb (32px) lag danach direkt auf dem Sektionsfuss und trieb die gemessene
                  // Kante zu #events auf 160px (`node scripts/aaa-measure.cjs`), waehrend jede
                  // andere Kante der Seite 128px hat. Ab sm stehen alle drei nebeneinander und
                  // enden gemeinsam an der Sektionskante -> pb entfaellt dort ganz; mobil
                  // braucht nur die letzte Spalte kein Polster mehr.
                  // `relative` traegt das absolut gesetzte Anfuehrungszeichen der Leitstimme.
                  'relative flex flex-col py-7 last:pb-0 sm:pb-0 sm:pt-8',
                  index > 0 && 'border-t border-[var(--color-line)] sm:border-l sm:border-t-0 sm:pl-7 lg:pl-10',
                  index < 2 && 'sm:pr-7 lg:pr-10',
                )}
              >
                {/* Die Sterne bleiben auf ALLEN drei Karten. Sie sind der Beleg der einzelnen
                    Stimme (jede dieser drei ist eine 5-Sterne-Bewertung) und nicht dasselbe wie
                    die 4,9-Gesamtnote im Sektionskopf — sie gegen das Anfuehrungszeichen zu
                    tauschen waere ein verlorener Beleg fuer eine Optik. Das Zeichen kommt beim
                    Leitzitat zusaetzlich dazu. */}
                <StarRating size={15} />
                {/* Das Anfuehrungszeichen der Leitstimme, zwei Korrekturen am Crop
                    (`node scripts/aaa-r14-crop.cjs community 1440`):
                      1) 52px las sich als grauer Fleck, nicht als Zeichen — die Glyphe fuellt
                         nur einen Bruchteil ihrer Schriftgroesse (52px Cal Sans ergaben rund
                         20px sichtbare Hoehe auf dem leisen --color-line #E4E4E1). Jetzt 88px.
                      2) Absolut gesetzt lag es im Polster ueber den Sternen und stiess dort
                         mit der Eyebrow-Zeile "ECHTE STIMMEN" zusammen. Es laeuft darum IM
                         Fluss: Sterne, Zeichen, Zitat. `-mb-5` zieht den Zeilenkasten wieder
                         zusammen, damit die Glyphe die Spalte nicht hoeher macht als ihre
                         beiden Nachbarn — die drei Zitate enden weiter gemeinsam an der
                         Sektionskante.
                    Farbe bleibt --color-line: Rot ist laut DESIGN.md fuer Aktion reserviert
                    und nie Deko-Flaeche. */}
                {lead && (
                  <span
                    aria-hidden
                    className="-mb-5 mt-3 block select-none font-display text-[5.5rem] font-bold leading-[0.5] text-[var(--color-line)]"
                  >
                    &ldquo;
                  </span>
                )}
                <blockquote
                  className={cn(
                    'text-pretty text-[var(--color-ink)]',
                    lead ? 'mt-4 text-[1.1875rem] leading-[1.5]' : 'mt-4 text-[1.0625rem] leading-relaxed',
                  )}
                >
                  {localized.text}
                </blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-bold text-[var(--color-ink)]">{review.name}</div>
                    <div className="text-xs text-[var(--color-ink-muted)]">{localized.when}</div>
                  </div>
                  <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-salsa)]">
                    {localized.aspect}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
