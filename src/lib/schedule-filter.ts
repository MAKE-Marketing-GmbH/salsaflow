// Reine Filter-Praedikate fuer den oeffentlichen Kursplan (aus CourseEngine extrahiert,
// damit die Quereinsteiger-Logik testbar ist). Keine Seiteneffekte, kein Fetch.
import type { ScheduleCourse } from './schedule';

export type EnginePhase = 'all' | 'running' | 'upcoming' | 'late';
export type EngineFilters = { phase: EnginePhase; days: string[]; styleKeys: string[]; levelCats: string[] };

export function matchesFilters(c: ScheduleCourse, f: EngineFilters): boolean {
  if (f.phase === 'late') {
    // Quereinsteiger: nur laufende Kurse, die explizit einen spaeten Einstieg erlauben.
    if (!(c.phase === 'running' && c.allowsLateEntry)) return false;
  } else if (f.phase !== 'all' && c.phase !== f.phase) {
    return false;
  }
  if (f.days.length && !f.days.includes(c.weekday)) return false;
  if (f.styleKeys.length && !f.styleKeys.includes(c.styleKey)) return false;
  if (f.levelCats.length && (!c.levelCategory || !f.levelCats.includes(c.levelCategory))) return false;
  return true;
}

export function filterScheduleCourses(list: ScheduleCourse[], filters: EngineFilters): ScheduleCourse[] {
  return list.filter((course) => matchesFilters(course, filters));
}
