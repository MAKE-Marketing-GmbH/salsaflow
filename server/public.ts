// Oeffentliche Read-API fuer den Kursplan (Etappe 7). KEIN Auth-Gate (Gegenstueck zu den
// /api/admin/* Routen) und KEINE internen Daten: der Plan liest dieselben Tabellen wie das
// Admin-UI (terms/courses/styles/level_rungs/teachers), gibt aber bewusst KEINE Preise heraus
// (Raphael-Dauerregel "keine Preise auf der Website"; Buchung+Preis kommen in Etappe 8/9).
//
// Sichtbarkeit:
//   - nur Staffeln mit status='published' UND endDate >= heute (vergangene Staffeln sind raus),
//   - pro Staffel eine Phase relativ zu heute: 'running' (laeuft) oder 'upcoming' (startet erst),
//   - nur Kurse mit status 'open' oder 'full' (kein draft/cancelled/finished).
// Die DE/EN-Labels stehen schon in der DB (styles.name_de/en, level_rungs.label_de/en); der
// Client schaltet ueber das statische UI-Lexikon (src/lib/i18n) zwischen den Sprachen um.

import { Hono } from 'hono';
import { inArray } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import {
  courses,
  courseTeachers,
  levelRungs,
  locations,
  styles,
  teachers,
  terms,
} from '../db/schema.js';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const PUBLIC_COURSE_STATUS = new Set(['open', 'full']);

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const WEEKDAY_INDEX: Record<(typeof WEEKDAYS)[number], number> = {
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
};

// Alle noch anstehenden konkreten Daten eines woechentlichen Kurses innerhalb seiner Staffel.
function upcomingDates(startDate: string, endDate: string, weekday: (typeof WEEKDAYS)[number], today: string): string[] {
  const start = new Date(`${(startDate > today ? startDate : today)}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const delta = (WEEKDAY_INDEX[weekday] - start.getUTCDay() + 7) % 7;
  start.setUTCDate(start.getUTCDate() + delta);
  const dates: string[] = [];
  while (start <= end) {
    dates.push(start.toISOString().slice(0, 10));
    start.setUTCDate(start.getUTCDate() + 7);
  }
  return dates;
}

export function createPublicRoutes(db: Db) {
  const pub = new Hono();

  pub.get('/api/public/schedule', async (c) => {
    const today = todayISO();

    // 1) Sichtbare Staffeln: veroeffentlicht + nicht vorbei. Phase relativ zu heute.
    const termRows = await db.select().from(terms);
    const visibleTerms = termRows
      .filter((t) => t.status === 'published' && t.endDate >= today)
      .map((t) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        isSummer: t.isSummer,
        phase: (t.startDate <= today ? 'running' : 'upcoming') as 'running' | 'upcoming',
      }));
    const termById = new Map(visibleTerms.map((t) => [t.id, t]));
    const termIds = visibleTerms.map((t) => t.id);

    if (termIds.length === 0) {
      return c.json({
        today,
        bookingEnabled: true,
        terms: [],
        courses: [],
        filters: { weekdays: [], styles: [], levels: [] },
      });
    }

    // 2) Stammdaten + Kurse der sichtbaren Staffeln.
    const [styleRows, rungRows, locRows, courseRows, ctRows, teacherRows] = await Promise.all([
      db.select().from(styles),
      db.select().from(levelRungs),
      db.select().from(locations),
      db.select().from(courses).where(inArray(courses.termId, termIds)),
      db.select().from(courseTeachers),
      db.select().from(teachers),
    ]);
    const styleById = new Map(styleRows.map((s) => [s.id, s]));
    const rungById = new Map(rungRows.map((r) => [r.id, r]));
    const locById = new Map(locRows.map((l) => [l.id, l]));
    const teacherById = new Map(teacherRows.map((t) => [t.id, t]));

    const teachersByCourse = new Map<
      string,
      { id: string; displayName: string; photoUrl: string | null }[]
    >();
    for (const ct of ctRows) {
      const t = teacherById.get(ct.teacherId);
      if (!t) continue;
      const list = teachersByCourse.get(ct.courseId) ?? [];
      list.push({ id: t.id, displayName: t.displayName, photoUrl: t.photoUrl });
      teachersByCourse.set(ct.courseId, list);
    }

    // 3) Nur sichtbare Kurse, angereichert + sortiert (Wochentag, dann Startzeit, dann Stil).
    const order = (wd: string) => WEEKDAYS.indexOf(wd as (typeof WEEKDAYS)[number]);
    const visibleCourses = courseRows
      .filter((co) => PUBLIC_COURSE_STATUS.has(co.status))
      .map((co) => {
        const style = styleById.get(co.styleId);
        const rung = co.levelRungId ? rungById.get(co.levelRungId) : null;
        const loc = locById.get(co.locationId);
        const term = termById.get(co.termId)!;
        return {
          id: co.id,
          termId: co.termId,
          phase: term.phase,
          styleId: co.styleId,
          styleKey: style?.key ?? '',
          styleDe: style?.nameDe ?? '',
          styleEn: style?.nameEn ?? '',
          ladderKey: style?.ladderKey ?? 'open',
          levelRungId: co.levelRungId,
          levelDe: rung?.labelDe ?? null,
          levelEn: rung?.labelEn ?? null,
          levelOrdinal: rung?.ordinal ?? null,
          levelCategory: rung?.category ?? null,
          onVariant: co.onVariant,
          weekday: co.weekday,
          // `nextDates` ist das verbindliche Datumsfeld fuer die UI, auch bei Samstagskursen.
          nextDates: upcomingDates(term.startDate, term.endDate, co.weekday, today),
          startTime: co.startTime.slice(0, 5),
          endTime: co.endTime.slice(0, 5),
          locationName: loc?.name ?? '',
          status: co.status,
          allowsLateEntry: co.allowsLateEntry,
          teachers: teachersByCourse.get(co.id) ?? [],
        };
      })
      .sort(
        (a, b) =>
          order(a.weekday) - order(b.weekday) ||
          a.startTime.localeCompare(b.startTime) ||
          a.styleDe.localeCompare(b.styleDe),
      );

    // 4) Filter-Metadaten NUR aus tatsaechlich vorhandenen Kursen (keine leeren Filter-Chips).
    const presentWeekdays = WEEKDAYS.filter((w) => visibleCourses.some((co) => co.weekday === w));

    const styleMap = new Map<string, { key: string; de: string; en: string; sort: number }>();
    for (const co of visibleCourses) {
      if (co.styleKey && !styleMap.has(co.styleKey)) {
        const s = styleById.get(co.styleId);
        styleMap.set(co.styleKey, { key: co.styleKey, de: co.styleDe, en: co.styleEn, sort: s?.sort ?? 0 });
      }
    }
    const presentStyles = [...styleMap.values()].sort((a, b) => a.sort - b.sort);

    // Level-Filter nach KATEGORIE (Beginner/Intermediate/Advanced/Heels/Open) statt pro
    // Einzelstufe: vermeidet einen Chip-Dschungel und doppelte Labels (z.B. zwei
    // "Intermediate" aus verschiedenen Leitern). Die exakte Stufe steht weiter auf der Karte.
    const CATEGORY_ORDER = ['beginner', 'intermediate', 'advanced', 'heels', 'open'];
    const presentCategories = [...new Set(visibleCourses.map((co) => co.levelCategory).filter(Boolean))]
      .map((key) => key as string)
      .sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));

    return c.json({
      today,
      bookingEnabled: true,
      terms: visibleTerms.sort((a, b) => a.startDate.localeCompare(b.startDate)),
      courses: visibleCourses,
      filters: { weekdays: presentWeekdays, styles: presentStyles, levelCategories: presentCategories },
    });
  });

  return pub;
}
