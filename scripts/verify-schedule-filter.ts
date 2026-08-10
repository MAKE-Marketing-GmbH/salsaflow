// Gate: Quereinsteiger-Filter = laufende Staffel UND allowsLateEntry (Kundenwunsch WhatsApp 2026-06).
import { matchesFilters, type EngineFilters } from '../src/lib/schedule-filter.js';
import type { ScheduleCourse } from '../src/lib/schedule.js';

const base: ScheduleCourse = {
  id: 'c1', termId: 't1', phase: 'running', styleId: 's1', styleKey: 'salsa',
  styleDe: 'Salsa', styleEn: 'Salsa', ladderKey: 'salsa_bachata', levelRungId: null,
  levelDe: 'Level 1', levelEn: 'Level 1', levelOrdinal: 1, levelCategory: 'beginner',
  onVariant: null, weekday: 'mon', startTime: '18:30', endTime: '19:30',
  locationName: 'Studio 1', status: 'open', allowsLateEntry: true, teachers: [],
};
const f = (phase: EngineFilters['phase']): EngineFilters => ({ phase, days: [], styleKeys: [], levelCats: [] });

const checks: { name: string; ok: boolean }[] = [];
const check = (name: string, ok: boolean) => checks.push({ name, ok: !!ok });

check('late: laufend + lateEntry drin', matchesFilters(base, f('late')) === true);
check('late: laufend OHNE lateEntry raus', matchesFilters({ ...base, allowsLateEntry: false }, f('late')) === false);
check('late: zukuenftig + lateEntry raus', matchesFilters({ ...base, phase: 'upcoming' }, f('late')) === false);
check('running: bleibt reine Phase (lateEntry egal)', matchesFilters({ ...base, allowsLateEntry: false }, f('running')) === true);
check('all: nimmt alles', matchesFilters({ ...base, phase: 'upcoming' }, f('all')) === true);
check('tag-filter greift', matchesFilters(base, { ...f('all'), days: ['tue'] }) === false);
check('stil-filter greift', matchesFilters(base, { ...f('all'), styleKeys: ['bachata'] }) === false);
check('level-filter greift', matchesFilters(base, { ...f('all'), levelCats: ['advanced'] }) === false);

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`);
console.log(`VERDICT: ${failed.length === 0 ? 'PASS' : 'FAIL'}`);
process.exit(failed.length === 0 ? 0 : 1);
