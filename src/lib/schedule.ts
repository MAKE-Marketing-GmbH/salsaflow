// Typen + Fetch fuer den oeffentlichen Kursplan (Etappe 7). Spiegel der Antwort aus
// server/public.ts (/api/public/schedule). Bewusst OHNE Preise (interne Daten).

import { api } from './api';

export type Phase = 'running' | 'upcoming';

export type ScheduleTerm = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isSummer: boolean;
  phase: Phase;
};

export type ScheduleCourse = {
  id: string;
  termId: string;
  phase: Phase;
  styleId: string;
  styleKey: string;
  styleDe: string;
  styleEn: string;
  ladderKey: string;
  levelRungId: string | null;
  levelDe: string | null;
  levelEn: string | null;
  levelOrdinal: number | null;
  levelCategory: string | null;
  onVariant: 'on1' | 'on2' | null;
  weekday: string;
  nextDates?: string[];
  startTime: string;
  endTime: string;
  locationName: string;
  status: 'open' | 'full';
  allowsLateEntry: boolean;
  teachers: { id: string; displayName: string; photoUrl: string | null }[];
};

export type ScheduleFilters = {
  weekdays: string[];
  styles: { key: string; de: string; en: string }[];
  // Level-Filter nach Kategorie-Schluessel (beginner/intermediate/advanced/heels/open).
  levelCategories: string[];
};

export type ScheduleResponse = {
  today: string;
  bookingEnabled?: boolean;
  terms: ScheduleTerm[];
  courses: ScheduleCourse[];
  filters: ScheduleFilters;
};

export const WEEKDAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type WeekdayKey = (typeof WEEKDAY_ORDER)[number];

const WEEKDAY_NAMES: Record<'de' | 'en', Record<WeekdayKey, string>> = {
  de: {
    mon: 'Montag',
    tue: 'Dienstag',
    wed: 'Mittwoch',
    thu: 'Donnerstag',
    fri: 'Freitag',
    sat: 'Samstag',
    sun: 'Sonntag',
  },
  en: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },
};

const MONTH_NAMES: Record<'de' | 'en', string[]> = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export type ScheduleDay = {
  key: WeekdayKey;
  date: string;
  labelDe: string;
  labelEn: string;
  shortDe: string;
  shortEn: string;
};

function parseISODate(iso: string): Date | null {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDaysISO(iso: string, days: number): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayKeyForISO(iso: string): WeekdayKey | null {
  const date = parseISODate(iso);
  if (!date) return null;
  const sundayBased = date.getUTCDay();
  return WEEKDAY_ORDER[(sundayBased + 6) % 7] ?? null;
}

/** Anzahl noch anstehender Lektionen eines Wochenkurses ab `today` innerhalb der Staffel.
 * Gleiche Rechnung wie `upcomingDates` in server/public.ts — hier als Zaehler, weil die
 * Live-Daten (api/index.ts, JSON-Seed) kein `nextDates` mitliefern. */
export function remainingLessons(today: string, term: ScheduleTerm, weekday: string): number {
  const target = WEEKDAY_ORDER.indexOf(weekday as WeekdayKey);
  if (target < 0) return 0;
  let cursor = term.startDate > today ? term.startDate : today;
  const fromKey = weekdayKeyForISO(cursor);
  if (!fromKey) return 0;
  cursor = addDaysISO(cursor, (target - WEEKDAY_ORDER.indexOf(fromKey) + 7) % 7);
  let count = 0;
  while (cursor <= term.endDate) {
    count += 1;
    cursor = addDaysISO(cursor, 7);
  }
  return count;
}

function makeScheduleDay(weekday: WeekdayKey, date: string): ScheduleDay {
  const [, month, day] = date.split('-').map(Number);
  const monthIndex = Math.max(0, (month ?? 1) - 1);
  const longDateDe = `${WEEKDAY_NAMES.de[weekday]}, ${day}. ${MONTH_NAMES.de[monthIndex]}`;
  const longDateEn = `${WEEKDAY_NAMES.en[weekday]}, ${MONTH_NAMES.en[monthIndex]} ${day}`;
  return {
    key: weekday,
    date,
    labelDe: longDateDe,
    labelEn: longDateEn,
    shortDe: weekday === 'thu' ? 'Do' : weekday === 'tue' ? 'Di' : weekday === 'wed' ? 'Mi' : weekday === 'fri' ? 'Fr' : weekday === 'sat' ? 'Sa' : weekday === 'sun' ? 'So' : 'Mo',
    shortEn: weekday === 'thu' ? 'Thu' : weekday === 'tue' ? 'Tue' : weekday === 'wed' ? 'Wed' : weekday === 'fri' ? 'Fri' : weekday === 'sat' ? 'Sat' : weekday === 'sun' ? 'Sun' : 'Mon',
  };
}

/** Baut die sieben Kalendertage der Woche, in der `today` liegt. UTC verhindert
 * Verschiebungen durch die Zeitzone des Browsers oder des Servers. */
export function buildScheduleDays(today: string): ScheduleDay[] {
  const key = weekdayKeyForISO(today);
  const index = key ? WEEKDAY_ORDER.indexOf(key) : 0;
  const monday = addDaysISO(today, -index);
  return WEEKDAY_ORDER.map((weekday, weekdayIndex) => makeScheduleDay(weekday, addDaysISO(monday, weekdayIndex)));
}

function nextWeekdayISO(from: string, weekday: WeekdayKey): string | null {
  const fromKey = weekdayKeyForISO(from);
  if (!fromKey) return null;
  const fromIndex = WEEKDAY_ORDER.indexOf(fromKey);
  const targetIndex = WEEKDAY_ORDER.indexOf(weekday);
  return addDaysISO(from, (targetIndex - fromIndex + WEEKDAY_ORDER.length) % WEEKDAY_ORDER.length);
}

/** Liefert das naechste Vorkommen eines Wochentags innerhalb der sichtbaren Staffel-Zeitraeume.
 * Die ISO-Rechnung bleibt unabhaengig von der Browser-Zeitzone; `today` kommt als Datum aus der
 * API und ist damit die gemeinsame Europe/Zurich-Referenz fuer die Anzeige. */
export function nextScheduleDate(today: string, weekday: WeekdayKey, terms: ScheduleTerm[]): string {
  const validToday = !!parseISODate(today);
  const sortedTerms = [...terms]
    .filter((term) => !!parseISODate(term.startDate) && !!parseISODate(term.endDate) && term.startDate <= term.endDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  for (const term of sortedTerms) {
    const anchor = validToday && today > term.startDate ? today : term.startDate;
    if (anchor > term.endDate) continue;
    const candidate = nextWeekdayISO(anchor, weekday);
    if (candidate && candidate <= term.endDate) return candidate;
  }

  const fallback = nextWeekdayISO(validToday ? today : sortedTerms[0]?.startDate ?? '', weekday);
  return fallback ?? today;
}

export function buildScheduleDaysForTerms(today: string, terms: ScheduleTerm[]): ScheduleDay[] {
  return WEEKDAY_ORDER.map((weekday) => makeScheduleDay(weekday, nextScheduleDate(today, weekday, terms)));
}

export function formatScheduleDay(iso: string, lang: 'de' | 'en'): string {
  const key = weekdayKeyForISO(iso);
  const date = parseISODate(iso);
  if (!key || !date) return iso;
  const day = date.getUTCDate();
  const month = MONTH_NAMES[lang][date.getUTCMonth()];
  return lang === 'de'
    ? `${WEEKDAY_NAMES.de[key]}, ${day}. ${month}`
    : `${WEEKDAY_NAMES.en[key]}, ${month} ${day}`;
}

export type ScheduleSlot = {
  key: string;
  weekday: string;
  startTime: string;
  endTime: string;
  primary: ScheduleCourse;
  bookable: ScheduleCourse;
  running: ScheduleCourse | null;
  upcoming: ScheduleCourse | null;
  nextTerm: ScheduleTerm | null;
  full: boolean;
  lateEntry: boolean;
};

function slotKey(course: ScheduleCourse): string {
  return [
    course.weekday,
    course.startTime,
    course.endTime,
    course.styleKey,
    course.levelRungId ?? course.levelDe ?? '-',
    course.onVariant ?? '-',
    course.teachers.map((teacher) => teacher.id).sort().join('+'),
  ].join('|');
}

/** Faltet laufende und kommende Staffeln zu einem wiederkehrenden Wochen-Slot.
 * Der sichtbare CTA bleibt immer an einem echten API-Kurs verankert. */
export function buildScheduleSlots(courses: ScheduleCourse[], terms: ScheduleTerm[]): ScheduleSlot[] {
  const termById = new Map(terms.map((term) => [term.id, term]));
  const groups = new Map<string, ScheduleCourse[]>();
  for (const course of courses) {
    const key = slotKey(course);
    groups.set(key, [...(groups.get(key) ?? []), course]);
  }

  const slots: ScheduleSlot[] = [];
  for (const [key, list] of groups) {
    const running = list.find((course) => course.phase === 'running') ?? null;
    const upcoming = list
      .filter((course) => course.phase === 'upcoming')
      .sort((a, b) => (termById.get(a.termId)?.startDate ?? '').localeCompare(termById.get(b.termId)?.startDate ?? ''))[0] ?? null;
    const primary = running ?? upcoming ?? list[0];
    if (!primary) continue;

    const bookable = list.find((course) => course.phase === 'running' && course.status === 'open')
      ?? list.find((course) => course.phase === 'upcoming' && course.status === 'open')
      ?? running
      ?? primary;

    slots.push({
      key,
      weekday: primary.weekday,
      startTime: primary.startTime,
      endTime: primary.endTime,
      primary,
      bookable,
      running,
      upcoming,
      nextTerm: upcoming ? termById.get(upcoming.termId) ?? null : null,
      full: list.every((course) => course.status === 'full'),
      lateEntry: !!running?.allowsLateEntry,
    });
  }

  return slots.sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekday as WeekdayKey) - WEEKDAY_ORDER.indexOf(b.weekday as WeekdayKey)
      || a.startTime.localeCompare(b.startTime)
      || a.endTime.localeCompare(b.endTime),
  );
}

/**
 * Der zur Buildzeit eingebettete Kursplan (siehe scripts/prerender.mjs).
 *
 * Er dient zwei Zwecken: Er steht als echter Text im ausgelieferten HTML, und er ist der
 * Startwert im Browser, damit die Seite nicht mit "wird geladen" beginnt. Der Netz-Aufruf
 * laeuft trotzdem und ueberschreibt ihn mit dem Live-Stand.
 */
export function embeddedSchedule(): ScheduleResponse | null {
  // Beim Prerender laeuft kein Browser: dort setzt scripts/prerender.mjs den Plan als
  // globalThis.__SCHEDULE__, damit die Komponenten schon serverseitig echte Zeiten rendern.
  const scope = globalThis as {
    __SCHEDULE__?: ScheduleResponse;
    __EMBEDDED_SCHEDULE__?: ScheduleResponse;
    document?: { getElementById(id: string): { textContent: string | null } | null };
  };
  if (scope.__SCHEDULE__) return scope.__SCHEDULE__;
  const node = scope.document?.getElementById('schedule-data');
  if (node?.textContent) {
    try {
      return JSON.parse(node.textContent) as ScheduleResponse;
    } catch {
      return null;
    }
  }
  // Watchdog R63: Dev-Fallback. Der Prerender-Tag `schedule-data` existiert nur im
  // gebauten HTML — der Dev-Server (und damit jeder Watchdog-Shot) lief bisher mit
  // leerem Start und «wird geladen». scripts/dev-schedule-global.mjs schreibt den
  // aktuellen API-Stand nach src/generated/schedule-embedded.ts; src/main.tsx laedt
  // ihn als globalThis.__EMBEDDED_SCHEDULE__, bevor irgendeine Komponente rendert.
  // Derselbe Vertrag wie im Build: Startwert aus dem Bundle, Fetch aktualisiert nur.
  return scope.__EMBEDDED_SCHEDULE__ ?? null;
}

export function fetchSchedule(): Promise<ScheduleResponse> {
  return api.get<ScheduleResponse>('/api/public/schedule');
}

// Reine Anzeige-Auswahl (keine Engine-Aenderung): waehlt bis zu n Kurse fuer die Vorschau
// so, dass sie moeglichst verschieden wirken - erst je ein Kurs pro Wochentag, dann pro Stil,
// dann auffuellen. Loest die "4x identische MONTAG/Salsa"-Vorschaukarten.
export function pickVariedCourses(list: ScheduleCourse[], n: number): ScheduleCourse[] {
  const picked: ScheduleCourse[] = [];
  const usedWeekday = new Set<string>();
  const usedStyle = new Set<string>();
  const usedKey = new Set<string>();

  const take = (c: ScheduleCourse) => {
    picked.push(c);
    usedWeekday.add(c.weekday);
    usedStyle.add(c.styleKey);
    usedKey.add(c.id);
  };

  // Pass 1: je ein Kurs pro Wochentag (staerkster sichtbarer Unterschied).
  for (const c of list) {
    if (picked.length >= n) break;
    if (!usedWeekday.has(c.weekday)) take(c);
  }
  // Pass 2: neue Stile ergaenzen.
  for (const c of list) {
    if (picked.length >= n) break;
    if (!usedKey.has(c.id) && !usedStyle.has(c.styleKey)) take(c);
  }
  // Pass 3: mit dem Rest auffuellen.
  for (const c of list) {
    if (picked.length >= n) break;
    if (!usedKey.has(c.id)) take(c);
  }
  return picked.slice(0, n);
}
