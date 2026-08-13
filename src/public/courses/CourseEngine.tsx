// Kursplan-Kern (Engine) unter /kursplan — Umbau 2026-08-07 nach Kundenkritik:
// "Das mit dem Kurs sieht komplett lost aus. Mach es mehr wie einen Kalender, klarer.
//  Die Filter-Sidebar links, wo ich scrollen muss, verstehe ich nicht — weg damit.
//  Wenn ich auf einen Kurs klicke, will ich DIREKT buchen."
//
// Daraus folgen drei harte Regeln in dieser Datei:
//  1) KALENDER STATT LISTE. Oben EINE Tages-Leiste (Mo–Sa, aktiver Tag ausgefuellt), darunter
//     nur die Kurse dieses Tages, gruppiert nach Uhrzeit (Zeit links gross = Kalender-Optik).
//     Keine Sidebar, kein Level-Filter-Block, kein Phasen-Toggle. Nur EINE schlanke Zeile
//     Stil-Chips bleibt, weil /kursplan?stil=salsa aus mehreren Seiten verlinkt ist.
//  2) EINE ZEILE PRO WOCHEN-SLOT. Die API liefert jeden Slot zweimal (laufende Staffel +
//     naechste Staffel) — 74 Kurse aus 37 Slots. Im Kalender wird ein Slot zu EINER Zeile
//     zusammengefasst; der Staffel-Unterschied steht als Badge ("Quereinstieg moeglich",
//     "Ausgebucht", "Naechster Start 9. Sep."). Die 8-Wochen-Staffel-Struktur bleibt, sie
//     wird nur nicht mehr doppelt untereinander gedruckt.
//  3) EIN KLICKZIEL. Die ganze Zeile IST der Link auf /buchung?kurs=<id>.
//     Das inline-BookingPanel ist aus dem Kursplan-Flow raus (die Datei bleibt fuer andere
//     Stellen bestehen). Deshalb ist die Zeile ein <a> und der rote CTA nur ein <span> darin.
//
// Datenquelle unveraendert: /api/public/schedule (server/public.ts). Kein Preis (Dauerregel),
// PII tabu (nur Tag/Stil/Level/Zeit/Lehrer-Vorname/Ort). DE+EN immer gemeinsam gepflegt.

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang, WEEKDAY_LABEL, formatDateI18n, levelLabelI18n, type Lang } from '@/lib/i18n';
import {
  buildScheduleDays,
  fetchSchedule,
  formatScheduleDay,
  weekdayKeyForISO,
  type ScheduleCourse,
  type ScheduleResponse,
  type ScheduleTerm,
  embeddedSchedule,
} from '@/lib/schedule';
import { GOOGLE_REVIEWS } from '@/public/site/reviews';

const WEEKDAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
type WeekdayKey = (typeof WEEKDAY_ORDER)[number];
const WHATSAPP_HREF = 'https://wa.me/41764788411';

/* Lokales Mikro-Lexikon fuer die Kalender-Ansicht. Steht bewusst hier und nicht in
 * src/lib/i18n.tsx: es sind Begriffe, die es nur in dieser Ansicht gibt. */
const CAL: Record<Lang, {
  day: string;
  style: string;
  allStyles: string;
  noCoursesDay: string;
  nextStart: string;
  startsOn: string;
  lateEntry: string;
  full: string;
  free: string;
  book: string;
  waitlist: string;
  classOne: string;
  classMany: string;
  until: string;
  teacherTba: string;
  beginner: string;
  moreStyles: (n: number) => string;
  lessStyles: string;
}> = {
  de: {
    day: 'Tag',
    style: 'Stil',
    allStyles: 'Alle Stile',
    noCoursesDay: 'An diesem Tag läuft gerade kein Kurs in dieser Auswahl.',
    nextStart: 'Nächster Start',
    startsOn: 'Start',
    lateEntry: 'Quereinstieg möglich',
    full: 'Ausgebucht',
    free: 'Plätze frei',
    book: 'Platz sichern',
    waitlist: 'Auf Warteliste',
    classOne: 'Kurs',
    classMany: 'Kurse',
    until: 'bis',
    teacherTba: 'Lehrer folgt',
    beginner: 'Ideal zum Einsteigen',
    moreStyles: (n) => `+ ${n} weitere`,
    lessStyles: 'Weniger',
  },
  en: {
    day: 'Day',
    style: 'Style',
    allStyles: 'All styles',
    noCoursesDay: 'No class runs on this day in this selection.',
    nextStart: 'Next start',
    startsOn: 'Starts',
    lateEntry: 'Late entry possible',
    full: 'Fully booked',
    free: 'Spots available',
    book: 'Book your spot',
    waitlist: 'Join waitlist',
    classOne: 'class',
    classMany: 'classes',
    until: 'until',
    teacherTba: 'Teacher to be announced',
    beginner: 'Perfect for starting out',
    moreStyles: (n) => `+ ${n} more`,
    lessStyles: 'Less',
  },
};

const TEACHER_PHOTOS: Record<string, string> = {
  aleks: '/photos/team/teacher-aleksandra.webp',
  aleksandra: '/photos/team/teacher-aleksandra.webp',
  claudia: '/photos/founders/claudia.webp',
  fabio: '/photos/founders/fabio.webp',
  jelena: '/photos/team/teacher-jelena.webp',
  maarten: '/photos/team/teacher-maarten.webp',
  sebas: '/photos/founders/sebastian.webp',
  sebastian: '/photos/founders/sebastian.webp',
  tobi: '/photos/team/teacher-tobias.webp',
  tobias: '/photos/team/teacher-tobias.webp',
  vanessa: '/photos/founders/vanessa.webp',
};

const STYLE_PHOTOS: Record<string, string> = {
  bachata: '/photos/premium/offer-bachata-800.webp',
  heels: '/photos/premium/offer-heels-800.webp',
  salsa: '/photos/premium/offer-salsa-800.webp',
};

function portraitFor(teacher: ScheduleCourse['teachers'][number] | undefined, styleKey: string) {
  if (teacher?.photoUrl) return { src: teacher.photoUrl, named: true };
  const name = teacher?.displayName.trim().toLowerCase();
  if (name && TEACHER_PHOTOS[name]) return { src: TEACHER_PHOTOS[name], named: true };
  return { src: STYLE_PHOTOS[styleKey] ?? '/photos/2026/kurse-classfreude-01.webp', named: false };
}

/* Kurzes Start-Datum fuer die Badge ("9. Sep." / "Sep 9"). Das lange Format aus
 * formatDateI18n ("9. September 2026") sprengt die Badge-Zeile. */
const MONTH_SHORT: Record<Lang, string[]> = {
  de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

function shortDate(iso: string, lang: Lang): string {
  const [, m, d] = iso.split('-').map(Number);
  if (!m || !d) return iso;
  const month = MONTH_SHORT[lang][(m - 1) % 12];
  return lang === 'de' ? `${d}. ${month}` : `${month} ${d}`;
}

/** Ein Wochen-Slot: EIN wiederkehrender Termin im Stundenplan, ueber alle Staffeln hinweg.
 *  `instances` sind die konkreten Kurse (laufende + naechste Staffel) desselben Slots. */
type WeekSlot = {
  key: string;
  weekday: string;
  startTime: string;
  endTime: string;
  styleKey: string;
  primary: ScheduleCourse;
  cta: ScheduleCourse;
  phase: ScheduleCourse['phase'];
  full: boolean;
  lateEntry: boolean;
  nextTerm: ScheduleTerm | undefined;
  nextIsFirstStart: boolean;
};

/** Slot-Identitaet: gleicher Tag + gleiche Zeit + gleicher Stil + gleiches Level + gleiches
 *  Lehrer-Team ist derselbe wiederkehrende Kurs, nur in einer anderen Staffel. */
function slotKey(c: ScheduleCourse): string {
  return [
    c.weekday,
    c.startTime,
    c.endTime,
    c.styleKey,
    c.levelRungId ?? c.levelDe ?? '-',
    c.onVariant ?? '-',
    c.teachers.map((tea) => tea.id).sort().join('+'),
  ].join('|');
}

/** Faltet die 74 API-Kurse zu den ~37 Wochen-Slots. Der laufende Kurs ist die Anzeige-Basis
 *  (er beschreibt, was diese Woche im Studio passiert); die naechste Staffel liefert das
 *  Start-Datum. Ziel des CTA ist der Kurs, in den man wirklich einsteigen kann: der erste
 *  Termin mit freien Plaetzen, sonst der laufende (dann Warteliste). */
function buildSlots(courses: ScheduleCourse[], termById: Map<string, ScheduleTerm>): WeekSlot[] {
  const groups = new Map<string, ScheduleCourse[]>();
  for (const c of courses) {
    const k = slotKey(c);
    const list = groups.get(k);
    if (list) list.push(c);
    else groups.set(k, [c]);
  }

  const slots: WeekSlot[] = [];
  for (const [key, list] of groups) {
    const running = list.find((c) => c.phase === 'running');
    const upcoming = list
      .filter((c) => c.phase === 'upcoming')
      .sort((a, b) => (termById.get(a.termId)?.startDate ?? '').localeCompare(termById.get(b.termId)?.startDate ?? ''))[0];
    const primary = running ?? upcoming ?? list[0];
    const cta = list.find((c) => c.status === 'open') ?? primary;
    slots.push({
      key,
      weekday: primary.weekday,
      startTime: primary.startTime,
      endTime: primary.endTime,
      styleKey: primary.styleKey,
      primary,
      cta,
      phase: primary.phase,
      full: list.every((c) => c.status === 'full'),
      // Quereinstieg zaehlt nur fuer die LAUFENDE Staffel — bei einem Kurs, der erst startet,
      // ist "Quereinstieg" keine Information, da ist der Start das Argument.
      lateEntry: !!running && running.allowsLateEntry,
      nextTerm: upcoming ? termById.get(upcoming.termId) : undefined,
      // Ohne laufende Staffel ist das Datum der erste Start, nicht der "naechste".
      nextIsFirstStart: !running,
    });
  }

  return slots.sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekday as WeekdayKey) - WEEKDAY_ORDER.indexOf(b.weekday as WeekdayKey) ||
      a.startTime.localeCompare(b.startTime) ||
      a.endTime.localeCompare(b.endTime),
  );
}

/* URL-Sync: ?stil= bleibt als Komma-Liste erhalten (mehrere Seiten verlinken /kursplan?stil=salsa),
 * ?tag= ist jetzt Einzelwert (der Kalender zeigt genau einen Tag). */
function readArrayParam(name: string): string[] {
  if (typeof window === 'undefined') return [];
  const raw = new URLSearchParams(window.location.search).get(name);
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

function readDayParam(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('tag');
  const first = raw ? raw.split(',')[0]?.trim() : '';
  return first && (WEEKDAY_ORDER as readonly string[]).includes(first) ? first : null;
}

export function CourseEngine({ onTotal }: { onTotal?: (total: number) => void }) {
  const { lang } = useLang();
  const c = CAL[lang];
  // Startwert aus dem eingebetteten Plan: sonst rendert der Prerender "wird geladen"
  // ins HTML und die Kurszeiten fehlen fuer Suchmaschinen komplett (DESIGN.md:113).
  const [data, setData] = useState<ScheduleResponse | null>(embeddedSchedule);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(() => !embeddedSchedule());
  const [styleKeys, setStyleKeys] = useState<string[]>(() => readArrayParam('stil'));
  // null = noch nicht gewaehlt; dann bestimmt der Kalender den sinnvollen Starttag selbst.
  const [day, setDay] = useState<string | null>(() => readDayParam());
  // Hat der Besucher den Tag SELBST angeklickt? Nur dann gilt er absolut. Ohne diese
  // Unterscheidung verschluckt der Auto-Fallback unten den Klick auf einen Tag ohne Treffer:
  // der Tab sprang zurueck, ohne dass irgendetwas passierte (gemessen bei ?stil=heels +
  // Klick auf Montag: aria-selected blieb false, keine Meldung).
  const [dayPicked, setDayPicked] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      setData(await fetchSchedule());
    } catch {
      // Faellt der Netz-Aufruf aus, bleibt der zur Buildzeit eingebettete Plan stehen. Er ist
      // hoechstens einen Deploy alt und damit besser als eine Fehlermeldung auf einer Seite,
      // die eigentlich schon lesbare Kurse zeigt.
      if (!embeddedSchedule()) setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const termById = useMemo(
    () => new Map((data?.terms ?? []).map((tm) => [tm.id, tm])),
    [data],
  );

  const allSlots = useMemo(
    () => (data ? buildSlots(data.courses, termById) : []),
    [data, termById],
  );

  // Gesamtzahl = Kurse pro Woche (Slots), nicht Staffel-Instanzen. Sonst steht im Hero "74 Kurse",
  // waehrend der Kalender 37 zeigt.
  useEffect(() => {
    if (data && onTotal) onTotal(allSlots.length);
  }, [data, allSlots.length, onTotal]);

  const byStyle = useMemo(
    () => (styleKeys.length ? allSlots.filter((s) => styleKeys.includes(s.styleKey)) : allSlots),
    [allSlots, styleKeys],
  );

  // Tages-Leiste: jeder vorhandene Wochentag bekommt das naechste konkrete Datum innerhalb
  // einer sichtbaren Staffel. So bleibt auch Samstag eindeutig, selbst wenn die API nur
  // weekday + Staffel-Zeitraum liefert.
  const days = useMemo(() => {
    if (!data) return [];
    return buildScheduleDays(data.today)
      .filter((d) => allSlots.some((s) => s.weekday === d.key))
      .map((d) => ({
        key: d.key as string,
        count: byStyle.filter((s) => s.weekday === d.key).length,
        date: d.date,
      }));
  }, [allSlots, byStyle, data]);

  // Aktiver Tag.
  //  - Selbst angeklickter Tag gewinnt IMMER, auch wenn er leer ist (dann steht dort die
  //    Leer-Meldung). Alles andere waere ein Klick, der nichts tut.
  //  - Tag nur aus der URL (?tag=mon) ist ein Vorschlag: hat er in der Stil-Auswahl keine
  //    Treffer, rutscht der Kalender weiter, damit /kursplan?stil=heels nicht leer aufmacht.
  //  - Ohne Angabe: HEUTE, sonst der naechste Tag mit Kursen — dieselbe Logik wie das
  //    Home-Widget und /buchung. Der fruehere Montag-Default zeigte ab Dienstag zuerst
  //    Kurse, die diese Woche schon gelaufen sind, und liess sie kommentarlos reservieren
  //    (UX-Audit 13.08.2026). Ein duennerer Tag ist ehrlicher als ein vergangener.
  const activeDay = useMemo(() => {
    if (dayPicked && day) return day;
    if (day && days.some((d) => d.key === day && d.count > 0)) return day;
    const todayKey = data ? weekdayKeyForISO(data.today) : null;
    const todayIndex = todayKey ? days.findIndex((d) => d.key === todayKey) : -1;
    const fromToday = todayIndex >= 0 ? [...days.slice(todayIndex), ...days.slice(0, todayIndex)] : days;
    const firstWithCourses = fromToday.find((d) => d.count > 0);
    if (firstWithCourses) return firstWithCourses.key;
    return day ?? days[0]?.key ?? null;
  }, [day, dayPicked, days, data]);

  // Aktiven Tag + Stil in die URL schreiben (teilbarer Plan), ohne History-Eintrag.
  useEffect(() => {
    if (typeof window === 'undefined' || !activeDay) return;
    const params = new URLSearchParams(window.location.search);
    params.set('tag', activeDay);
    if (styleKeys.length) params.set('stil', styleKeys.join(','));
    else params.delete('stil');
    // Alt-Parameter aus der Filter-Sidebar-Zeit entfernen, damit keine toten Links entstehen.
    params.delete('phase');
    params.delete('level');
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
  }, [activeDay, styleKeys]);

  const daySlots = useMemo(
    () => byStyle.filter((s) => s.weekday === activeDay),
    [byStyle, activeDay],
  );

  // Zeit-Bloecke: der Kalender-Rhythmus. Alle Kurse, die gleichzeitig starten, stehen unter
  // EINER Uhrzeit — genau wie im Stundenplan an der Studio-Wand.
  const blocks = useMemo(() => {
    const map = new Map<string, WeekSlot[]>();
    for (const s of daySlots) {
      const k = `${s.startTime}-${s.endTime}`;
      const list = map.get(k);
      if (list) list.push(s);
      else map.set(k, [s]);
    }
    return [...map.entries()].map(([k, list]) => ({ key: k, start: list[0].startTime, end: list[0].endTime, slots: list }));
  }, [daySlots]);

  // Staffel-Zeile: fast immer starten ALLE Kurse eines Tages am selben Datum (eine Staffel).
  // Dann gehoert das Datum einmal ueber den Plan und nicht neunmal als Badge in jede Zeile
  // ("Nächster Start 9. Sep." x9 war die monotonste Stelle der alten Liste). Nur wenn ein Kurs
  // aus der Reihe faellt, traegt genau dieser weiterhin seine eigene Badge.
  const commonStart = useMemo(() => {
    const dates = daySlots.map((s) => s.nextTerm?.startDate).filter((d): d is string => !!d);
    if (dates.length < 2 || dates.length !== daySlots.length) return null;
    return dates.every((d) => d === dates[0]) ? dates[0] : null;
  }, [daySlots]);

  if (loading) return <SkeletonCalendar />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div>
      <DayBar
        days={days}
        active={activeDay}
        onSelect={(d) => {
          setDay(d);
          setDayPicked(true);
        }}
        styles={data!.filters.styles}
        styleKeys={styleKeys}
        onStyle={(keys) => {
          setStyleKeys(keys);
          // Neuer Stil = neue Frage. Der Tag wird wieder zum Vorschlag, damit ein Wechsel auf
          // "Heels" nicht auf dem dann leeren Montag stehen bleibt.
          setDayPicked(false);
        }}
      />

      <section className="mt-6 sm:mt-8" aria-labelledby="kursplan-day-title">
        <h2 id="kursplan-day-title" className="sr-only">
          {activeDay
            ? `${WEEKDAY_LABEL[lang][activeDay]?.long ?? activeDay} — ${daySlots.length} ${daySlots.length === 1 ? c.classOne : c.classMany}`
            : c.noCoursesDay}
        </h2>

        {allSlots.length > 0 && byStyle.length === 0 ? (
          <EmptyState onReset={() => setStyleKeys([])} />
        ) : blocks.length === 0 ? (
          <DayEmpty showReset={styleKeys.length > 0} onReset={() => setStyleKeys([])} />
        ) : (
          <>
            {commonStart && (
              <p className="mb-2 text-sm font-semibold text-[var(--color-ink-muted)]">
                {lang === 'de'
                  ? `Alle Kurse an diesem Tag laufen 8 Wochen · nächste Staffel startet am ${formatDateI18n(commonStart, lang)}`
                  : `Every class on this day runs for 8 weeks · next term starts on ${formatDateI18n(commonStart, lang)}`}
              </p>
            )}
            <div className="border-t border-[var(--color-line)]">
              {blocks.map((b) => (
                <TimeBlock key={b.key} start={b.start} end={b.end}>
                  {b.slots.map((s) => (
                    <SlotRow key={s.key} slot={s} hideStart={!!commonStart} />
                  ))}
                </TimeBlock>
              ))}
            </div>
          </>
        )}
      </section>
      <ScheduleBottomCta
        nextStart={commonStart ?? daySlots.find((slot) => slot.nextTerm)?.nextTerm?.startDate ?? null}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tages-Leiste: das einzige grosse Bedienelement der Seite. Desktop sechs gleich
 * breite Segmente, mobil horizontal scrollbar (snap), aktiver Tag ausgefuellt.
 * -------------------------------------------------------------------------- */
function DayBar({
  days,
  active,
  onSelect,
  styles,
  styleKeys,
  onStyle,
}: {
  days: { key: string; count: number; date: string }[];
  active: string | null;
  onSelect: (day: string) => void;
  styles: { key: string; de: string; en: string }[];
  styleKeys: string[];
  onStyle: (keys: string[]) => void;
}) {
  const { lang } = useLang();
  const c = CAL[lang];
  // Stil-Chips mobil eingeklappt (siehe Kommentar an der Chip-Zeile).
  const [stylesExpanded, setStylesExpanded] = useState(false);
  const MOBILE_CHIPS = 3;
  const hiddenStyleCount = styles.filter((s, i) => i >= MOBILE_CHIPS && !styleKeys.includes(s.key)).length;

  return (
    // Bewusst NICHT sticky. Ein Tag hat hoechstens 9 Kurse (rund eine Bildschirmhoehe), die
    // Leiste braucht also nicht mitzureisen — sie kostete 150px Dauer-Hoehe und lief beim
    // Scrollen sichtbar ueber die erste Uhrzeit (Beleg: /tmp/kursplan-cal-shots2/kursplan-desktop-01-y700.png,
    // "18:30" halb hinter der Leiste).
    <div>
      {/* Tage. Bis Tabletbreite ein 3x2-Raster statt einer horizontal scrollenden Reihe: bei
          schmalen Viewports passen die ausgeschriebenen Daten nicht kollisionsfrei nebeneinander.
          Erst ab lg stehen alle sechs Tage in einer Reihe. */}
      <div
        // Kein role="tablist": ohne Pfeiltasten-Navigation und ohne verknuepftes Panel
        // waere das ein Versprechen an Screenreader, das die Umsetzung nicht haelt.
        // Es sind Filter-Schalter.
        role="group"
        aria-label={c.day}
        className="grid grid-cols-3 gap-1.5 lg:flex lg:gap-2"
      >
        {days.map((d) => {
          const on = d.key === active;
          const empty = d.count === 0;
          return (
            <button
              key={d.key}
              aria-pressed={on}
              data-testid={`day-${d.key}`}
              onClick={() => onSelect(d.key)}
              className={cn(
                'group flex flex-col items-center justify-center rounded-[var(--radius-card)] border px-2 py-2.5 transition-colors sm:min-w-0 sm:flex-1 sm:px-3 sm:py-4',
                on
                  ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                  : empty
                    ? 'border-[var(--color-line)] bg-transparent text-[var(--color-ink-muted)] opacity-55'
                    : 'border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]',
              )}
            >
              {/* Mobil bleibt die Abkuerzung kompakt, aber das konkrete Datum steht trotzdem im
                  HTML. Desktop zeigt direkt das verlangte Format "Samstag, 9. August". */}
              <span className="font-display text-lg font-extrabold leading-none tracking-tight sm:text-2xl">
                <span className="lg:hidden">{WEEKDAY_LABEL[lang][d.key]?.short ?? d.key}</span>
                <span className="hidden lg:inline">{formatScheduleDay(d.date, lang)}</span>
              </span>{' '}
              <span
                className={cn(
                  'mt-1.5 text-[11px] font-semibold tabular-nums',
                  on ? 'text-white/70' : 'text-[var(--color-ink-muted)]',
                )}
              >
                <span className="lg:hidden">{formatScheduleDay(d.date, lang)} · </span>
                <span>{d.count} {d.count === 1 ? c.classOne : c.classMany}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* EINE schlanke Zeile Stil-Chips. Mehr Filter gibt es bewusst nicht.
          Mobil wird NICHT mehr horizontal gescrollt: die Reihe schnitt am Viewport-Rand mitten
          ins Wort ("Cho" statt "Cha Cha Cha") und sah kaputt aus (Beleg:
          /tmp/salsaflow-r2-mobil/kursplan-mobile-00-fold.png). Jetzt umbrechen die Chips, und
          damit 8 Stile x lange Namen ("Bodymovement & Ladystyle") den ersten Kurs nicht unter
          den Fold schieben, sind mobil nur die ersten drei plus ein "+ n weitere"-Schalter
          sichtbar. Ein aktiver Filter bleibt immer sichtbar, sonst waere er unsichtbar aktiv.
          Ab sm stehen ohnehin alle Chips nebeneinander. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="mr-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {c.style}
        </span>
        <StyleChip active={styleKeys.length === 0} onClick={() => onStyle([])} testid="style-all">
          {c.allStyles}
        </StyleChip>
        {styles.map((s, i) => (
          <StyleChip
            key={s.key}
            active={styleKeys.includes(s.key)}
            onClick={() => onStyle(styleKeys.includes(s.key) ? styleKeys.filter((k) => k !== s.key) : [...styleKeys, s.key])}
            testid={`style-${s.key}`}
            // hidden nur mobil und nur fuer nicht gewaehlte Chips hinter den ersten dreien
            className={cn(i >= MOBILE_CHIPS && !stylesExpanded && !styleKeys.includes(s.key) && 'hidden sm:inline-flex')}
          >
            {lang === 'de' ? s.de : s.en}
          </StyleChip>
        ))}
        {hiddenStyleCount > 0 && (
          <button
            type="button"
            onClick={() => setStylesExpanded((v) => !v)}
            data-testid="style-more"
            aria-expanded={stylesExpanded}
            className="shrink-0 whitespace-nowrap rounded-full border border-dashed border-[var(--color-ink-muted)] px-3 py-1.5 text-[0.8rem] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] sm:hidden"
          >
            {stylesExpanded ? c.lessStyles : c.moreStyles(hiddenStyleCount)}
          </button>
        )}
      </div>
    </div>
  );
}

function StyleChip({
  active,
  onClick,
  children,
  testid,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testid: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      aria-pressed={active}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-colors',
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
          : 'border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------------------
 * Zeit-Block: Uhrzeit gross links (Kalender-Spalte), Kurse rechts. Mobil rutscht
 * die Uhrzeit als Zeile ueber die Kurse.
 * -------------------------------------------------------------------------- */
function TimeBlock({ start, end, children }: { start: string; end: string; children: React.ReactNode }) {
  const { lang } = useLang();
  const until = CAL[lang].until;
  return (
    <div className="grid gap-1.5 border-b border-[var(--color-line)] py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:py-5 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <p className="flex items-baseline gap-2 sm:block sm:self-stretch sm:border-r sm:border-[var(--color-line)] sm:pr-5">
        <span className="inline-flex items-center gap-2 font-display text-[2rem] font-extrabold leading-none tabular-nums text-[var(--color-ink)]">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--color-salsa)]" />
          {start}
        </span>
        <span className="text-sm font-semibold tabular-nums text-[var(--color-ink-muted)] sm:ml-4 sm:mt-1.5 sm:block">
          {until} {end}
        </span>
      </p>
      <div className="min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white">
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Kurs-Zeile: die GANZE Zeile führt direkt in den Buchungsfluss. Der rote CTA ist deshalb
 * ein <span> (kein verschachtelter Link/Button). Der kleine Lehrpersonen-/Stil-Marker gibt
 * jeder Zeile einen eigenen visuellen Anker, auch wenn die API kein Foto liefert.
 * -------------------------------------------------------------------------- */
function SlotRow({ slot, hideStart = false }: { slot: WeekSlot; hideStart?: boolean }) {
  const { lang } = useLang();
  const c = CAL[lang];
  const course = slot.primary;
  const level = levelLabelI18n(lang === 'de' ? course.levelDe : course.levelEn, course.onVariant);
  const style = lang === 'de' ? course.styleDe : course.styleEn;
  const teachers = course.teachers.map((tea) => tea.displayName.split(' ')[0]).join(' & ');
  const label = slot.full ? c.waitlist : c.book;
  const beginner = course.levelCategory === 'beginner';

  return (
    <a
      href={`/buchung?kurs=${encodeURIComponent(slot.cta.id)}`}
      data-testid="course-card"
      data-course-id={slot.primary.id}
      data-cta-course-id={slot.cta.id}
      data-phase={slot.phase}
      data-weekday={slot.weekday}
      data-style={slot.styleKey}
      className={cn(
        'group flex flex-col gap-2 border-b border-[var(--color-line)] px-4 py-3 transition-colors last:border-b-0 sm:flex-row sm:items-center sm:gap-5 sm:px-5 sm:py-3.5',
        beginner
          ? 'bg-[var(--color-paper-warm)] hover:bg-[var(--color-salsa-50)]'
          : 'bg-white hover:bg-[var(--color-bg-soft)]',
      )}
    >
      <span className="flex min-w-0 flex-1 items-start gap-3">
        <TeacherPortrait styleKey={slot.styleKey} style={style} teachers={course.teachers} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg leading-tight text-[var(--color-ink)] sm:text-xl">{style}</span>
            {level && <Badge tone="level">{level}</Badge>}
          </span>
          <span className="mt-1 block break-words text-sm leading-snug text-[var(--color-ink-muted)]">
            {teachers || c.teacherTba} · {course.locationName}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <Badge tone={slot.full ? 'muted' : 'strong'}>{slot.full ? c.full : c.free}</Badge>
            {beginner && <Badge tone="outline">{c.beginner}</Badge>}
            {slot.lateEntry && <Badge tone="outline">{c.lateEntry}</Badge>}
            {slot.nextTerm && !hideStart && (
              <Badge tone="outline">
                {`${slot.nextIsFirstStart ? c.startsOn : c.nextStart} ${shortDate(slot.nextTerm.startDate, lang)}`}
              </Badge>
            )}
          </span>
        </span>
      </span>
      {/* Kritik-Runde 10.08.2026: vorher trug NUR die erste Zeile des Tages einen roten
          Pill-CTA, alle weiteren einen Textlink — sah aus wie zwei Buchungs-Systeme.
          Jetzt EIN ruhiger Zeilen-CTA fuer alle; die rote Hauptaktion gehoert dem
          ScheduleBottomCta. */}
      <span className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 self-start px-1 text-sm font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-salsa)] sm:self-center">
        {label}
        <ArrowRight size={16} strokeWidth={2} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

function TeacherPortrait({
  styleKey,
  style,
  teachers,
}: {
  styleKey: string;
  style: string;
  teachers: ScheduleCourse['teachers'];
}) {
  const shown = (teachers.length ? teachers : [undefined]).slice(0, 2);

  return (
    <span aria-hidden data-style-mark={styleKey} className="flex h-14 w-[4.5rem] shrink-0 items-end">
      {shown.map((teacher, index) => {
        const portrait = portraitFor(teacher, styleKey);
        return (
          <span
            key={teacher?.id ?? `${styleKey}-studio`}
            title={portrait.named ? teacher?.displayName : style}
            className={cn(
              'relative h-14 w-12 overflow-hidden rounded-[1rem] border-2 border-white bg-[var(--color-bg-soft)]',
              index > 0 && '-ml-5 h-12',
            )}
          >
            <img
              src={portrait.src}
              alt=""
              loading="lazy"
              className={cn('h-full w-full', portrait.named ? 'object-contain object-top' : 'object-cover')}
            />
          </span>
        );
      })}
    </span>
  );
}

function ScheduleBottomCta({ nextStart }: { nextStart: string | null }) {
  const { lang } = useLang();
  const rating = lang === 'de' ? GOOGLE_REVIEWS.rating.toFixed(1).replace('.', ',') : GOOGLE_REVIEWS.rating.toFixed(1);
  const start = nextStart ? shortDate(nextStart, lang) : lang === 'de' ? 'laufend' : 'ongoing';

  const facts = [
    {
      value: nextStart ? start : '8 Wochen',
      label: lang === 'de' ? (nextStart ? 'nächster Staffelstart' : 'pro Staffel') : nextStart ? 'next term start' : 'per term',
    },
    {
      value: 'Basel',
      label: 'Studio Elisabethenanlage',
    },
    {
      value: `${rating}/5`,
      label: lang === 'de' ? `${GOOGLE_REVIEWS.count} Google-Bewertungen` : `${GOOGLE_REVIEWS.count} Google reviews`,
    },
  ];

  return (
    <section
      data-testid="schedule-bottom-cta"
      className="mt-4 overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-surface-dark)] text-white sm:mt-8"
    >
      <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-salsa-300)]">
          {lang === 'de' ? 'Dein Einstieg bei Salsaflow' : 'Your start at Salsaflow'}
        </p>
        <h2 className="mt-3 max-w-xl font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {lang === 'de' ? 'Nicht länger suchen. Deinen Platz sichern.' : 'Stop searching. Save your spot.'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          {lang === 'de'
            ? 'Wähle deinen Kurs direkt aus dem Plan. Du reservierst online und zahlst entspannt vor Ort.'
            : 'Choose your class directly from the schedule. Reserve online and pay comfortably on site.'}
        </p>

        <div className="mt-7 grid grid-cols-3 border-y border-white/15">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 border-r border-white/15 px-2 py-4 first:pl-0 last:border-r-0 sm:px-4 sm:first:pl-0">
              <div className="truncate font-display text-base font-extrabold sm:text-xl">{fact.value}</div>
              <div className="mt-1 text-[11px] leading-tight text-white/55 sm:text-xs">{fact.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/buchung"
            className="group inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-salsa)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-salsa-500)]"
          >
            {lang === 'de' ? 'Platz sichern' : 'Book your spot'}
            <ArrowRight size={16} strokeWidth={2} aria-hidden className="ml-1.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
          </a>
          <a
            href="/kontakt#schnupperstunde"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white"
          >
            {lang === 'de' ? 'Gratis Schnupperstunde' : 'Free trial class'}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Metadaten bleiben neutral. Salsa-Rot markiert nur die erste Buchungsaktion. */
function Badge({
  tone,
  children,
}: {
  tone: 'strong' | 'level' | 'muted' | 'outline';
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 font-medium',
        tone === 'strong' && 'bg-[var(--color-ink)] text-white',
        tone === 'level' && 'bg-[var(--color-bg-soft)] font-semibold text-[var(--color-ink)]',
        tone === 'muted' && 'bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)]',
        tone === 'outline' && 'border border-[var(--color-line)] bg-white text-[var(--color-ink-muted)]',
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Zustaende: Laden, Tag leer, Auswahl leer, Fehler.
 * -------------------------------------------------------------------------- */
function SkeletonCalendar() {
  const { t } = useLang();
  return (
    <div data-testid="schedule-loading" role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">{t.loading}</p>
      {/* gleiches Raster wie die echte Tages-Leiste (bis Tablet 3x2), sonst springt das Layout */}
      <div aria-hidden className="grid grid-cols-3 gap-1.5 lg:flex lg:gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[4.75rem] flex-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]" />
        ))}
      </div>
      <div aria-hidden className="mt-8 border-t border-[var(--color-line)]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 border-b border-[var(--color-line)]" />
        ))}
      </div>
    </div>
  );
}

/** Leerer Tag. Ist ein Stil gewaehlt, ist der Stil-Filter fast immer der Grund — dann steht
 *  der Weg zurueck direkt daneben, statt dass der Besucher die Chip-Zeile zurueckraten muss. */
function DayEmpty({ showReset, onReset }: { showReset: boolean; onReset: () => void }) {
  const { lang } = useLang();
  return (
    <div data-testid="schedule-day-empty" className="border-b border-[var(--color-line)] py-10">
      <p className="text-base text-[var(--color-ink-muted)]">{CAL[lang].noCoursesDay}</p>
      {showReset && (
        <button
          onClick={onReset}
          className="mt-4 rounded-full border border-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
        >
          {CAL[lang].allStyles}
        </button>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { lang, t } = useLang();
  return (
    <div
      data-testid="schedule-empty"
      className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-6 py-12 text-center"
    >
      <p className="text-base text-[var(--color-ink)]">{t.noCourses}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="t-hover rounded-full border border-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
        >
          {t.reset}
        </button>
        <WhatsappLink>{lang === 'de' ? 'Sag uns per WhatsApp, was du suchst' : 'Tell us on WhatsApp what you are looking for'}</WhatsappLink>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { lang, t } = useLang();
  const headline = lang === 'de' ? 'Kursplan konnte nicht geladen werden.' : 'The schedule failed to load.';
  const eyebrow = lang === 'de' ? 'Kursplan' : 'Schedule';
  const nextStep = lang === 'de' ? 'Nächster Schritt' : 'Next step';
  const footnote = lang === 'de' ? 'Meist liegt es an der Verbindung. Ein Reload hilft oft.' : 'Usually a connection hiccup. A reload often fixes it.';
  return (
    <section
      data-testid="schedule-error"
      role="alert"
      aria-labelledby="schedule-error-title"
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)]"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[var(--color-salsa)]" />
      <div className="grid gap-8 px-6 py-9 pl-8 sm:px-10 sm:py-11 lg:grid-cols-[1.5fr_1fr] lg:gap-12 lg:px-14 lg:py-12">
        <div className="lg:max-w-xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-salsa)]" />
            {eyebrow}
          </span>
          <h3 id="schedule-error-title" className="mt-4 font-display text-2xl leading-tight text-[var(--color-ink)] sm:text-[1.7rem]">
            {headline}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {lang === 'de'
              ? 'Alle laufenden und kommenden Kurse mit Tag, Stil und Level stehen hier, sobald der Plan wieder da ist.'
              : 'All running and upcoming courses with day, style and level will show up here once the schedule is back.'}
          </p>
        </div>

        <div className="lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-[var(--color-line)] lg:pl-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">{nextStep}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              {t.retry}
            </button>
            <WhatsappLink>{lang === 'de' ? 'Schreib uns per WhatsApp' : 'Message us on WhatsApp'}</WhatsappLink>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">{footnote}</p>
        </div>
      </div>
    </section>
  );
}

function WhatsappLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      className="t-hover inline-flex items-center gap-2 rounded-full bg-[var(--color-salsa)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)]"
    >
      {children}
    </a>
  );
}
