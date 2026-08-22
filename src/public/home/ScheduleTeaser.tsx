import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import {
  buildScheduleDays,
  buildScheduleSlots,
  fetchSchedule,
  weekdayKeyForISO,
  type ScheduleResponse,
  type ScheduleSlot,
  type WeekdayKey,
  embeddedSchedule,
} from '@/lib/schedule';
// R189: dieselben Bausteine wie /kursplan. Siehe Kopf von CourseRow.tsx.
import { CourseRow, CourseTimeBlock } from '@/public/courses/CourseRow';
import { sectionTitle, sectionLead, Shell } from '@/public/site/primitives';
import { ClipReveal, Reveal, RevealWords, useReveal } from '@/public/home/motion';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { CoursePath } from '@/public/home/CoursePath';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const FALLBACK_STYLES = [
  { k: 'salsa', label: 'Salsa', de: 'Schnell, fröhlich, voller Energie', en: 'Fast, joyful, full of energy' },
  { k: 'bachata', label: 'Bachata', de: 'Langsam, weich, gefühlvoll', en: 'Slow, smooth, full of feeling' },
  { k: 'heels', label: 'Heels', de: 'Haltung, Ausdruck, Auftritt', en: 'Posture, expression, presence' },
] as const;

/** Wie viele Zeilen der Tag maximal zeigt. Vier passen ohne Scroll in einen Desktop-Screen
 *  (gemessen: eine Zeile rendert 76px, plus Kopf 250px = 554px bei 900px Viewport). */
const ROWS_PER_DAY = 4;

const MONTH_SHORT = {
  de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} satisfies Record<'de' | 'en', string[]>;

/** "2026-09-09" -> "9. Sep." bzw. "Sep 9". Bewusst eine lokale Kopie derselben Formel wie
 *  CourseEngine.shortDate (dort file-privat) statt eines Cross-Import in fremden Owner-Code. */
function formatShortDate(iso: string, lang: 'de' | 'en'): string {
  const [, m, d] = iso.split('-').map(Number);
  if (!m || !d) return iso;
  const month = MONTH_SHORT[lang][(m - 1) % 12];
  return lang === 'de' ? `${d}. ${month}` : `${month} ${d}`;
}

/** Runde 1 (2026-08-07). Zwei belegte Fehler in dieser Sektion, beide mit derselben Ursache —
 *  der Teaser nahm eine flache LISTE statt des Wochenplans, den der Kunde pflegt:
 *
 *  FEHLER 1 — falscher Status. Die Auswahl war
 *      pickVariedCourses([...upcoming, ...running], 3)
 *  also "kommende Staffel zuerst". Gemessen an der echten API (curl /api/public/schedule,
 *  2026-08-07): Montag 18:30 Salsa Intermediate 11 ist in der LAUFENDEN Staffel `full`, in der
 *  kommenden Sommerstaffel `open`. Die Startseite zeigte fuer genau diesen Slot "Plätze frei",
 *  waehrend /kursplan fuer dieselbe Zeile "Ausgebucht" schreibt. Das ist kein Anzeige-Detail,
 *  sondern eine falsche Zusage direkt neben einem Buchungs-CTA.
 *  -> Der Teaser nutzt jetzt `buildScheduleSlots` aus lib/schedule.ts — dieselbe Faltung, die
 *     /kursplan verwendet. Dort fuehrt die laufende Staffel (`running ?? upcoming`) und
 *     `full` gilt erst, wenn ALLE Staffeln dieses Slots voll sind. Eine Wahrheit, eine Quelle.
 *
 *  FEHLER 2 — kein Samstag, kein Datum (Auftragsvorgabe "Kursplan zeigt Samstag MIT Datum").
 *  Die drei Zeilen kamen aus `pickVariedCourses`, das "je ein Kurs pro Wochentag" in
 *  API-Reihenfolge nimmt. Die API liefert nach Wochentag sortiert, also gewann immer
 *  Mo/Di/Mi — der Samstagskurs (SFIT, 11:00, existiert real) konnte per Konstruktion nie
 *  erscheinen, und ein Datum stand nirgends. Gemessen: alle drei Zeilen 18:30.
 *  -> Jetzt eine Wochen-Schiene Mo bis Sa mit echtem Kalenderdatum aus
 *     `buildScheduleDays(today)` (UTC-basiert, dieselbe Funktion wie /kursplan). Samstag ist
 *     eine feste Spalte und traegt sein Datum wie jeder andere Tag.
 *
 *  `withCoursePath` haengt die Level-Treppe (CoursePath) an denselben Kurs-Block an, statt sie
 *  als eigene Sektion darunter zu stellen (Kritiker final-2, Issue 2): "welcher Kurs" und
 *  "welches Level" sind EIN Gedanke und brauchen keine zwei Kapitelgrenzen. */
export function ScheduleTeaser({ withCoursePath = false }: { withCoursePath?: boolean } = {}) {
  const { lang } = useLang();
  const de = lang === 'de';
  const s = HOME[lang].schedule;
  // Startwert aus dem eingebetteten Plan (siehe scripts/prerender.mjs).
  const [data, setData] = useState<ScheduleResponse | null>(embeddedSchedule);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(() => (embeddedSchedule() ? 'ready' : 'loading'));
  const [day, setDay] = useState<WeekdayKey | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSchedule()
      .then((schedule) => alive && (setData(schedule), setState('ready')))
      // Bei Netzfehler den eingebetteten Plan stehen lassen statt eine Fehlermeldung zu zeigen.
      .catch(() => alive && !embeddedSchedule() && setState('error'));
    return () => {
      alive = false;
    };
  }, []);

  const slots = useMemo(
    () => (data ? buildScheduleSlots(data.courses, data.terms) : []),
    [data],
  );
  // Mo bis Sa. Sonntag faellt raus, weil die Schule sonntags nicht unterrichtet (API: null
  // Kurse) — eine leere siebte Spalte waere eine Luege ueber das Angebot, kein Kalender.
  const days = useMemo(
    () => (data ? buildScheduleDays(data.today).filter((d) => d.key !== 'sun') : []),
    [data],
  );
  const byDay = useMemo(() => {
    const map = new Map<string, ScheduleSlot[]>();
    for (const slot of slots) map.set(slot.weekday, [...(map.get(slot.weekday) ?? []), slot]);
    return map;
  }, [slots]);

  // Startauswahl: heute, wenn heute Kurse laufen — sonst der naechste Tag mit Kursen.
  // Ohne diesen Fallback zeigte die Sektion an einem kursfreien Tag eine leere Liste.
  const defaultDay = useMemo<WeekdayKey | null>(() => {
    if (!data) return null;
    const today = weekdayKeyForISO(data.today);
    const order = days.map((d) => d.key);
    const start = today ? Math.max(0, order.indexOf(today)) : 0;
    for (let i = 0; i < order.length; i++) {
      const key = order[(start + i) % order.length];
      if (key && (byDay.get(key)?.length ?? 0) > 0) return key;
    }
    return order[0] ?? null;
  }, [data, days, byDay]);

  const activeDay = day ?? defaultDay;
  const activeSlots = activeDay ? byDay.get(activeDay) ?? [] : [];
  const activeLabel = days.find((d) => d.key === activeDay);

  /* R189: Dieselbe Gruppierung wie im Kalender (CourseEngine gruppiert Bloecke nach
   * Start- und Endzeit), damit zwei Kurse derselben Uhrzeit unter EINER Uhr stehen und die
   * Startseite dieselbe Zeit nicht zweimal untereinander druckt.
   * ROWS_PER_DAY zaehlt weiterhin ZEILEN, nicht Bloecke — der Teaser bleibt kompakt. */
  const timeBlocks = useMemo(() => {
    const blocks: { key: string; start: string; end: string; slots: ScheduleSlot[] }[] = [];
    for (const slot of activeSlots.slice(0, ROWS_PER_DAY)) {
      const key = `${slot.startTime}-${slot.endTime}`;
      const last = blocks.at(-1);
      if (last?.key === key) last.slots.push(slot);
      else blocks.push({ key, start: slot.startTime, end: slot.endTime, slots: [slot] });
    }
    return blocks;
  }, [activeSlots]);
  const hasData = state === 'ready' && slots.length > 0 && days.length > 0;
  const { item } = useReveal();
  const loadingLabel = de ? 'Kurse werden geladen ...' : 'Loading courses ...';

  return (
    <section id="kurse" className={cn('scroll-mt-24 bg-[var(--color-paper-warm)]', SECTION_Y_HOME)}>
      <Shell>
        {/* lg:pr-36: der Knopf "Zum ganzen Kursplan" (x=1206-1388) lag in der Zone des
            fixen WhatsApp-FAB (ab x=1294) — wie das Tages-Grid darunter
            (Critic Runde 15, Item 1). */}
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pr-36">
          {/* R189: Die H2 steigt Wort fuer Wort ein. Sie darf das — anders als die H2 in
              Offer — weil sie die Ueberschrift der Kursplan-Sektion ist, also der zweiten
              tragenden Flaeche der Startseite, und weil sie eine echte Aussage traegt statt
              eines Labels. Der Lead darunter behaelt den ruhigen `rise`-Default: zwei
              Effekte in einem Block waeren einer zu viel.
              `as="h2"` — RevealWords rendert das Element selbst, samt `sr-only`-Kopie des
              vollen Satzes fuer Screenreader. */}
          <motion.div variants={item} className="max-w-2xl">
            <RevealWords as="h2" text={s.title} className={cn(sectionTitle, MEASURE_L)} />
            <p className={`mt-3 ${sectionLead}`}>{s.lead}</p>
          </motion.div>
          <motion.a
            variants={item}
            href="/kursplan"
            className="btn-base btn-primary group w-fit gap-2 px-5 py-3 text-sm"
          >
            {s.all}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" strokeWidth={2.25} />
          </motion.a>
        </Reveal>

        <div className="mt-9 border-t border-[var(--color-line)] lg:mt-12" aria-busy={state === 'loading'} aria-live="polite">
          {state === 'loading' ? (
            <p className="py-6 text-sm font-semibold text-[var(--color-ink-muted)]">{loadingLabel}</p>
          ) : !hasData ? (
            <>
              {/* Runde 2, Issue 9: "Bald geht es wieder los" war ein zweiter Ueberschriften-Block
                  (h3 24px + eigener Absatz) direkt unter der Sektions-H2. Zwei Ueberschriften
                  hintereinander lesen sich wie zwei Sektionen - genau die Laenge, die Issue 9
                  meint. Jetzt EIN Hinweis in einer Zeile: Status-Label + Satz, danach sofort
                  die drei Stile. Der Text bleibt vollstaendig erhalten. */}
              <p className="flex flex-col gap-1.5 py-5 text-base leading-relaxed text-[var(--color-ink-muted)] sm:flex-row sm:items-baseline sm:gap-3">
                <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                  {s.soonTitle}
                </span>
                <span className="max-w-2xl">{s.soonText}</span>
              </p>
              <ul className="grid border-y border-[var(--color-line)] sm:grid-cols-3">
                {FALLBACK_STYLES.map((style, index) => (
                  <li key={style.k} className={index > 0 ? 'border-t border-[var(--color-line)] sm:border-l sm:border-t-0' : ''}>
                    <a
                      href={`/kursplan?stil=${style.k}`}
                      className="group flex min-h-28 flex-col justify-between gap-4 px-5 py-5 transition-colors hover:bg-[var(--color-bg-soft)] sm:px-6"
                    >
                      <span>
                        <span className="block type-h3 text-[var(--color-ink)]">{style.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-[var(--color-ink-muted)]">{de ? style.de : style.en}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-salsa)]">
                        {de ? 'Termine ansehen' : 'View dates'}
                        <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" strokeWidth={2.25} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            /* R189: EIN Vorhang ueber die ganze Plan-Flaeche — Tagesleiste, Datumszeile und
               Kursliste zusammen. Der Auftrag nennt den Grund, und die Messung stuetzt ihn:
               vier Kurszeilen (ROWS_PER_DAY) einzeln von unten einfliegen zu lassen ergaebe
               mit der Tagesleiste darueber fuenf gestaffelte Bewegungen in einem Block. Das
               liest sich hektisch, und es ist auch sachlich falsch — die sechs Tage und die
               vier Zeilen sind EIN Fahrplan, kein Stapel unabhaengiger Karten.

               Warum `clip` und nicht `rise`: der Block ist eine grosse zusammenhaengende
               Flaeche mit Haarlinien als Raster. Ein y-Versatz haette die Linien gegen die
               Sektionskante darueber wandern lassen. Der Vorhang laesst jede Linie stehen,
               wo sie ist, und deckt sie nur auf.

               WICHTIG — der Vorhang liegt INNEN, nicht um den Live-Bereich herum. Der
               umgebende <div> traegt `aria-busy` und `aria-live="polite"`; ein
               Reveal-Wrapper darum wuerde beim Zuenden den ganzen Bereich als geaendert
               melden und Screenreader die komplette Liste vorlesen lassen. So bleibt die
               Live-Region unveraendert und nur der sichtbare Inhalt faehrt auf.

               Nur der Datenfall bekommt den Vorhang. Der Lade- und der Fallback-Zweig
               darueber bleiben ohne — eine Statusmeldung aufzudecken waere Deko auf einer
               Information, die sofort da sein muss. */
            <ClipReveal>
              {/* Die Wochen-Schiene. Sechs Spalten fester Breite ab sm (Mo bis Sa), damit die
                  Auswahl beim Tageswechsel nicht springt; darunter waagrecht scrollbar.
                  Datum kommt aus buildScheduleDays(today), also aus dem echten Kalender —
                  nicht aus einem festen Text. */}
              {/* Sechs feste Spalten AUF JEDER BREITE, nicht erst ab sm.
                  Erster Versuch war eine waagrecht scrollbare Leiste mit min-w-[4.5rem].
                  Am 390px-Screenshot nachgemessen (/tmp/sf-home/final/mob-03-y2532.png):
                  6 x 72px + 5 x 4px Gap = 452px gegen 350px Inhaltsbreite — der SAMSTAG,
                  also genau der laut Auftrag geforderte Tag, lag ausserhalb des Bildes und
                  war nur nach seitlichem Wischen zu finden. Ein Tag, den man suchen muss,
                  ist auf einer Startseite nicht vorhanden.
                  350px / 6 = 58px pro Spalte: das traegt "Sa", die Kalenderzahl und "1 Kurs"
                  (11px) ohne Umbruch. Darum mobil px-1 statt px-3 und kein min-width. */}
              <div
                role="tablist"
                aria-label={de ? 'Wochentag wählen' : 'Choose a weekday'}
                // sm:gap-1.5: ohne Fuge klebte die helle Hover-Flaeche eines Nachbar-Tabs buendig an
        // der schwarzen aktiven Kachel — zwei verschweisste Bloecke (Beleg /tmp/hover-tab-mi.png,
        // Critic-Nachlauf 13.08.2026). Mobil kein gap: 390px / 6 = 58px pro Spalte sind schon
        // das Minimum fuer "Sa" + Zahl + "1 Kurs" (siehe Kommentar oben), und Hover gibt es
        // auf Touch nicht.
        // lg:pr-36: der fixe WhatsApp-FAB lag beim Scrollen auf der Sa-Kachel
        // ("1 Kurs" verdeckt, Critic Runde 9, Item 2).
        className="grid grid-cols-6 py-3 sm:gap-1.5 lg:pr-36"
              >
                {days.map((d) => {
                  const count = byDay.get(d.key)?.length ?? 0;
                  const active = d.key === activeDay;
                  const [, , dayNum] = d.date.split('-');
                  return (
                    <button
                      key={d.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="kurse-tagesliste"
                      disabled={count === 0}
                      onClick={() => setDay(d.key)}
                      className={cn(
                        // Inhalt zentriert wie in den /kursplan-Tag-Tabs: linksbuendige Labels
                        // liessen in den breiten Desktop-Spalten ein Loch zwischen dem "Mi"-Text
                        // und der vollbreiten aktiven Kachel (Critic 13.08.2026).
                        'group flex min-w-0 flex-col items-center gap-1 rounded-[var(--radius-chip)] px-1.5 py-2.5 text-center transition-colors sm:px-3',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper-warm)]',
                        count === 0
                          ? 'cursor-default text-[var(--color-line)]'
                          : active
                            ? 'bg-[var(--color-ink)] text-white'
                            : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]',
                      )}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {de ? d.shortDe : d.shortEn}
                      </span>
                      <span
                        className={cn(
                          'font-display text-xl font-extrabold leading-none tabular-nums',
                          count === 0 ? '' : active ? 'text-white' : 'text-[var(--color-ink)]',
                        )}
                      >
                        {Number(dayNum)}
                      </span>
                      {/* Singular/Plural echt behandeln: der Samstag hat genau EINEN Kurs
                          (SFIT 11:00), und "1 Kurse" auf der Startseite einer Schule ist
                          ein sichtbarer Schludrigkeits-Marker. */}
                      <span className={cn('text-[0.6875rem] leading-tight', active ? 'text-white/70' : '')}>
                        {count === 0
                          ? de ? 'frei' : 'off'
                          : count === 1
                            ? de ? '1 Kurs' : '1 class'
                            : de ? `${count} Kurse` : `${count} classes`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Der ausgewaehlte Tag als volles Datum — die Auftragsvorgabe "Samstag MIT Datum"
                  gilt hier fuer JEDEN Tag, nicht nur den Samstag. */}
              <p
                id="kurse-tagesliste-label"
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--color-line)] pt-4 text-sm"
              >
                <span className="type-h3 text-[var(--color-ink)]">
                  {activeLabel ? (de ? activeLabel.labelDe : activeLabel.labelEn) : ''}
                </span>
                <span className="text-[var(--color-ink-muted)]">
                  {activeSlots[0]?.primary.locationName ?? ''}
                </span>
              </p>

              {/* R189 (Raphael, Video): "Mach das einfach in EINEM Stil ... auf der Startseite
                  sieht es GANZ ANDERS aus." Der Teaser rendert jetzt exakt die Bausteine des
                  Kursplans — `CourseTimeBlock` (Zeitspalte links, roter Punkt, weisse Karte)
                  und `CourseRow` (Lehrpersonen-Portrait, Badges, "Platz sichern", ganze Zeile
                  faerbt bei Hover und Fokus auf --color-salsa). Weniger Zeilen als /kursplan
                  ja (ROWS_PER_DAY), andere Optik nein.
                  Die Faltung bleibt unangetastet: `activeSlots` kommt weiterhin aus
                  `buildScheduleSlots` (siehe Kommentar oben, FEHLER 1). Hier wird nur nach
                  Uhrzeit gruppiert.
                  KEIN Datum ueber der Uhr: der gewaehlte Tag steht schon als volle Zeile ueber
                  der Liste ("Freitag, 21. August"). Im Kalender fehlt diese Zeile, dort traegt
                  der Block das Datum. */}
              <div
                id="kurse-tagesliste"
                role="tabpanel"
                aria-labelledby="kurse-tagesliste-label"
                className="mt-1 border-t border-[var(--color-line)] lg:pr-36"
              >
                {timeBlocks.map((block) => (
                  <CourseTimeBlock key={block.key} start={block.start} end={block.end}>
                    {block.slots.map((slot) => (
                      /* Die Zeile nennt Tag + Zeit, also landet der Klick auch auf genau
                         diesem Tag im Kalender (?tag=), nicht auf dem Default-Montag. */
                      <CourseRow
                        key={slot.key}
                        course={slot.primary}
                        href={`/kursplan?tag=${slot.weekday}${slot.primary.styleKey ? `&stil=${slot.primary.styleKey}` : ''}`}
                        full={slot.full}
                        lateEntry={slot.lateEntry}
                        /* "Plätze frei" allein war mehrdeutig (Runde 1, Nachmessung): `full`
                           ist erst wahr, wenn ALLE Staffeln des Slots voll sind. Ist nur die
                           laufende Staffel voll, sagt es der Zusatz-Badge mit dem Datum. */
                        extraBadge={
                          !slot.full && slot.running?.status === 'full' && slot.nextTerm?.startDate
                            ? de
                              ? `Wieder frei ab ${formatShortDate(slot.nextTerm.startDate, lang)}`
                              : `Spots again from ${formatShortDate(slot.nextTerm.startDate, lang)}`
                            : null
                        }
                      />
                    ))}
                  </CourseTimeBlock>
                ))}
              </div>

              {activeSlots.length > ROWS_PER_DAY && (
                <a
                  href={`/kursplan?tag=${activeDay}`}
                  className="group inline-flex min-h-11 items-center gap-1.5 border-t border-[var(--color-line)] pt-4 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)]"
                >
                  {de
                    ? `Alle ${activeSlots.length} Kurse an diesem Tag`
                    : `All ${activeSlots.length} classes on this day`}
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
              )}
            </ClipReveal>
          )}
        </div>

        {withCoursePath && <CoursePath embedded />}
      </Shell>
    </section>
  );
}
