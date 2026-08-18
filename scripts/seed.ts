import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { sql } from 'drizzle-orm';
import { openDb } from '../db/client.js';
import {
  adminProfiles,
  locations,
  tariffs,
  styles,
  levelRungs,
  teachers,
  terms,
  courses,
  courseTeachers,
  coursePrices,
} from '../db/schema.js';
import { hashPassword } from '../server/auth.js';

/* ---------------------------------------------------------------------------
 * Seed-Quelle: NUR die Kurs-Header der Staffel Januar 2026 (keine Schuelerdaten).
 * Extrahiert in Etappe 5 via Sub-Agent nach .marathon/seed-source/januar-2026.json
 * ------------------------------------------------------------------------- */
type SourceCourse = {
  sheet: string;
  style: string;
  level_raw: string | null;
  weekday: string;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  teachers: string[];
  price_normal: number | null;
  price_reduced: number | null;
  on_variant: 'on1' | 'on2' | null;
  is_workshop: boolean;
};
type SeedSource = {
  term: { name: string; start_date: string; end_date: string; week_count: number };
  courses: SourceCourse[];
};

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = resolve(here, '../db/seed/januar-2026.json');

/* ---------------------------------------------------------------------------
 * Stammdaten (Woerterbuch aus ARCHITEKTUR.md Abschnitt 4)
 * ------------------------------------------------------------------------- */
const TARIFFS = [
  { key: 'normal', nameDe: 'Normal', nameEn: 'Standard', seats: 1, sort: 1 },
  { key: 'student', nameDe: 'Student', nameEn: 'Student', seats: 1, sort: 2 },
  { key: 'couple', nameDe: 'Paar', nameEn: 'Couple', seats: 2, sort: 3 },
  { key: 'family', nameDe: 'Familie', nameEn: 'Family', seats: 1, sort: 4 },
  { key: 'pushflow', nameDe: 'Pushflow', nameEn: 'Pushflow', seats: 1, sort: 5 },
] as const;

const STYLES = [
  { key: 'salsa', nameDe: 'Salsa', nameEn: 'Salsa', ladderKey: 'salsa_bachata', sort: 1 },
  { key: 'bachata', nameDe: 'Bachata', nameEn: 'Bachata', ladderKey: 'salsa_bachata', sort: 2 },
  { key: 'heels', nameDe: 'Heels Class', nameEn: 'Heels Class', ladderKey: 'heels', sort: 3 },
  { key: 'cha_cha_cha', nameDe: 'Cha Cha Cha', nameEn: 'Cha Cha Cha', ladderKey: 'open', sort: 4 },
  {
    key: 'bodymovement_ladystyle',
    nameDe: 'Bodymovement & Ladystyle',
    nameEn: 'Body Movement & Lady Styling',
    ladderKey: 'open',
    sort: 5,
  },
  { key: 'contemporary', nameDe: 'Contemporary', nameEn: 'Contemporary', ladderKey: 'open', sort: 6 },
  {
    key: 'basics_fundamentals',
    nameDe: 'Basics & Fundamentals',
    nameEn: 'Basics & Fundamentals',
    ladderKey: 'open',
    sort: 7,
  },
  { key: 'sfit', nameDe: 'SFIT (Salsaflow Fitness)', nameEn: 'SFIT (Salsaflow Fitness)', ladderKey: 'open', sort: 8 },
  { key: 'partnerwork', nameDe: 'Partnerwork', nameEn: 'Partner Work', ladderKey: 'open', sort: 9 },
  { key: 'shines', nameDe: 'Shines', nameEn: 'Shines', ladderKey: 'open', sort: 10 },
] as const;

type LevelCat = 'beginner' | 'intermediate' | 'advanced' | 'open' | 'heels';
type RungDef = {
  ladderKey: string;
  ordinal: number;
  category: LevelCat;
  stufe: number | null;
  isFlow: boolean;
  isOpenEnded: boolean;
  labelDe: string;
  labelEn: string;
};

function buildRungs(): RungDef[] {
  const rungs: RungDef[] = [];
  // salsa_bachata: Beginner 1-6
  for (let n = 1; n <= 6; n++) {
    rungs.push({
      ladderKey: 'salsa_bachata',
      ordinal: n,
      category: 'beginner',
      stufe: n,
      isFlow: false,
      isOpenEnded: false,
      labelDe: `Beginner Stufe ${n}`,
      labelEn: `Beginner Level ${n}`,
    });
  }
  // Beginner Flow (Bruecke)
  rungs.push({
    ladderKey: 'salsa_bachata',
    ordinal: 7,
    category: 'beginner',
    stufe: null,
    isFlow: true,
    isOpenEnded: false,
    labelDe: 'Beginner Flow',
    labelEn: 'Beginner Flow',
  });
  // Intermediate 7-12 -> ordinals 8-13
  for (let stufe = 7; stufe <= 12; stufe++) {
    rungs.push({
      ladderKey: 'salsa_bachata',
      ordinal: stufe + 1,
      category: 'intermediate',
      stufe,
      isFlow: false,
      isOpenEnded: false,
      labelDe: `Intermediate Stufe ${stufe}`,
      labelEn: `Intermediate Level ${stufe}`,
    });
  }
  // Intermediate Flow (Bruecke)
  rungs.push({
    ladderKey: 'salsa_bachata',
    ordinal: 14,
    category: 'intermediate',
    stufe: null,
    isFlow: true,
    isOpenEnded: false,
    labelDe: 'Intermediate Flow',
    labelEn: 'Intermediate Flow',
  });
  // Advanced 13-18 -> ordinals 15-20 (nach oben offen)
  for (let stufe = 13; stufe <= 18; stufe++) {
    rungs.push({
      ladderKey: 'salsa_bachata',
      ordinal: stufe + 2,
      category: 'advanced',
      stufe,
      isFlow: false,
      isOpenEnded: true,
      labelDe: `Advanced Stufe ${stufe}`,
      labelEn: `Advanced Level ${stufe}`,
    });
  }
  // Advanced Flow (für "Advanced On2 Flow": Rung is_flow=true + Kurs-Attribut on_variant)
  rungs.push({
    ladderKey: 'salsa_bachata',
    ordinal: 25,
    category: 'advanced',
    stufe: null,
    isFlow: true,
    isOpenEnded: false,
    labelDe: 'Advanced Flow',
    labelEn: 'Advanced Flow',
  });
  // heels: Beginner / Intermediate / Advanced (endlich)
  (['Beginner', 'Intermediate', 'Advanced'] as const).forEach((lbl, i) =>
    rungs.push({
      ladderKey: 'heels',
      ordinal: i + 1,
      category: 'heels',
      stufe: null,
      isFlow: false,
      isOpenEnded: false,
      labelDe: lbl,
      labelEn: lbl,
    }),
  );
  // open: Open Level (1) + nicht-nummerierte Intermediate-Rung (2) für z.B. "Bodymovement Int"
  rungs.push({
    ladderKey: 'open',
    ordinal: 1,
    category: 'open',
    stufe: null,
    isFlow: false,
    isOpenEnded: false,
    labelDe: 'Open Level',
    labelEn: 'Open Level',
  });
  rungs.push({
    ladderKey: 'open',
    ordinal: 2,
    category: 'open',
    stufe: null,
    isFlow: false,
    isOpenEnded: false,
    labelDe: 'Intermediate',
    labelEn: 'Intermediate',
  });
  return rungs;
}

/* ---------------------------------------------------------------------------
 * Mapper roh -> Stammdaten-Schluessel
 * ------------------------------------------------------------------------- */
function styleKeyFromRaw(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (s.startsWith('salsa')) return 'salsa';
  if (s.startsWith('bachata')) return 'bachata';
  if (s.startsWith('heels')) return 'heels';
  if (s.startsWith('cha')) return 'cha_cha_cha';
  if (s.startsWith('bodymovement')) return 'bodymovement_ladystyle';
  if (s.startsWith('contemporary')) return 'contemporary';
  if (s.startsWith('basics')) return 'basics_fundamentals';
  if (s.startsWith('sfit')) return 'sfit';
  if (s.startsWith('shines')) return 'shines';
  if (s.startsWith('partnerwork')) return 'partnerwork';
  throw new Error(`Unbekannter Stil im Seed: "${raw}"`);
}

const WEEKDAYS: Record<string, string> = {
  montag: 'mon',
  dienstag: 'tue',
  mittwoch: 'wed',
  donnerstag: 'thu',
  freitag: 'fri',
  samstag: 'sat',
  sonntag: 'sun',
};
function weekdayFromRaw(raw: string): string {
  const key = raw.toLowerCase().trim();
  const wd = WEEKDAYS[key];
  if (!wd) throw new Error(`Unbekannter Wochentag im Seed: "${raw}"`);
  return wd;
}

// Liefert den Ordinal-Wert in der jeweiligen Leiter (oder null, wenn keine Rung passt).
function rungOrdinalFor(ladderKey: string, levelRaw: string | null): number | null {
  const raw = (levelRaw ?? '').toLowerCase().trim();

  if (ladderKey === 'salsa_bachata') {
    if (raw.includes('beginner') && raw.includes('flow')) return 7;
    if (raw.includes('intermediate') && raw.includes('flow')) return 14;
    if (raw.includes('advanced') && raw.includes('flow')) return 25; // Advanced (On2) Flow
    let m = raw.match(/beginner.*?(\d+)/);
    if (m) return Number(m[1]); // Beginner Stufe N -> ordinal N
    m = raw.match(/intermediate.*?(\d+)/);
    if (m) return Number(m[1]) + 1; // Intermediate Stufe N -> ordinal N+1
    m = raw.match(/advanced.*?(\d+)/);
    if (m) return Number(m[1]) + 2; // Advanced Stufe N -> ordinal N+2
    return null;
  }
  if (ladderKey === 'heels') {
    if (raw.includes('advanced')) return 3;
    if (raw.includes('intermediate')) return 2;
    if (raw.includes('beginner')) return 1;
    return 1;
  }
  // open
  if (raw.startsWith('int') || raw.includes('intermediate')) return 2;
  return 1; // Open Level (auch für null / "Bodymovement" / Workshop-Level)
}

/* ---------------------------------------------------------------------------
 * Seed-Lauf
 * ------------------------------------------------------------------------- */
export async function runSeed() {
  const source = JSON.parse(await readFile(SOURCE_PATH, 'utf8')) as SeedSource;
  const handle = await openDb();
  const { db } = handle;

  console.log(`[seed] Treiber=${handle.driver} - leere Tabellen (idempotent)...`);
  await db.execute(sql`
    TRUNCATE TABLE
      notifications, payment_events, payments, bookings, participants,
      course_prices, course_teachers, courses, terms, level_rungs, styles,
      tariffs, teachers, locations, audit_log, admin_profiles
    RESTART IDENTITY CASCADE
  `);

  // Standort (eine Adresse, Tippfehler-Varianten werden zusammengefuehrt)
  const locationId = randomUUID();
  await db.insert(locations).values({
    id: locationId,
    name: 'Studio Elisabethenanlage',
    address: 'Elisabethenanlage 7, 4051 Basel',
    sort: 0,
  });

  // Tarife
  await db.insert(tariffs).values(TARIFFS.map((t) => ({ ...t })));

  // Stile
  const styleIdByKey = new Map<string, string>();
  await db.insert(styles).values(
    STYLES.map((s) => {
      const id = randomUUID();
      styleIdByKey.set(s.key, id);
      return { id, ...s };
    }),
  );

  // Level-Leitern (Woerterbuch + Auto-Aufstieg)
  const rungDefs = buildRungs();
  const rungIdByLadderOrdinal = new Map<string, string>();
  await db.insert(levelRungs).values(
    rungDefs.map((r) => {
      const id = randomUUID();
      rungIdByLadderOrdinal.set(`${r.ladderKey}#${r.ordinal}`, id);
      return { id, ...r };
    }),
  );

  // Term-Kurse = alle Eintraege ausser Einzeltermin-Workshops
  const termCourses = source.courses.filter((c) => !c.is_workshop);

  // Lehrer (nur die, die in Term-Kursen vorkommen -> jede Zeile wird referenziert)
  const teacherIdByName = new Map<string, string>();
  const teacherRows: { id: string; displayName: string; sort: number }[] = [];
  let teacherSort = 0;
  for (const c of termCourses) {
    for (const name of c.teachers) {
      const clean = name.trim();
      if (!clean || teacherIdByName.has(clean)) continue;
      const id = randomUUID();
      teacherIdByName.set(clean, id);
      teacherRows.push({ id, displayName: clean, sort: teacherSort++ });
    }
  }
  await db.insert(teachers).values(teacherRows);

  // Admin-Account (Login-Beweis für Etappe 5)
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'salsaflow-admin-2026';
  await db.insert(adminProfiles).values({
    email: 'admin@salsaflow-dc.com',
    passwordHash: hashPassword(adminPassword),
    displayName: 'Salsaflow Admin',
    role: 'owner',
  });

  // ---------------------------------------------------------------------------
  // Term-Insertion als wiederverwendbarer Helfer (ein Term = Staffel + ihre Kurse).
  // Etappe 7: zusaetzlich zur historischen Staffel Januar 2026 werden eine LAUFENDE
  // und eine ZUKUENFTIGE Staffel relativ zu heute geseedet, damit der öffentliche
  // Kursplan den Filter "laufend / neu+zukuenftig" mit echten Daten zeigen kann.
  // Die Staffel Januar 2026 bleibt unveraendert (Etappe-5-Verify haengt daran).
  // ---------------------------------------------------------------------------
  const counts = { terms: 0, courses: 0, links: 0, prices: 0 };

  async function insertTerm(
    meta: {
      name: string;
      startDate: string;
      endDate: string;
      weekCount: number;
      isSummer?: boolean;
    },
    lateEntryFor?: (c: SourceCourse) => boolean,
    statusFor?: (idx: number) => 'open' | 'full',
  ): Promise<string> {
    const tId = randomUUID();
    await db.insert(terms).values({
      id: tId,
      name: meta.name,
      startDate: meta.startDate,
      endDate: meta.endDate,
      weekCount: meta.weekCount,
      isSummer: meta.isSummer ?? false,
      status: 'published',
    });
    counts.terms++;

    let idx = -1;
    for (const c of termCourses) {
      idx++;
      const styleKey = styleKeyFromRaw(c.style);
      const styleId = styleIdByKey.get(styleKey)!;
      const ladderKey = STYLES.find((s) => s.key === styleKey)!.ladderKey;
      const ordinal = rungOrdinalFor(ladderKey, c.level_raw);
      const levelRungId =
        ordinal === null ? null : (rungIdByLadderOrdinal.get(`${ladderKey}#${ordinal}`) ?? null);

      const isLeaderFollower = styleKey === 'salsa' || styleKey === 'bachata';
      const courseId = randomUUID();

      await db.insert(courses).values({
        id: courseId,
        termId: tId,
        styleId,
        levelRungId,
        onVariant: styleKey === 'salsa' ? c.on_variant : null,
        weekday: weekdayFromRaw(c.weekday) as 'mon',
        startTime: `${c.start_time ?? '00:00'}:00`,
        endTime: `${c.end_time ?? '00:00'}:00`,
        locationId,
        bookingType: isLeaderFollower ? 'leader_follower' : 'open',
        // Quereinstieg: Default true (Spalten-Default). Fuer die laufende Staffel kann
        // der Helfer pro Kurs steuern, damit der "Quereinstieg möglich"-Chip variiert.
        allowsLateEntry: lateEntryFor ? lateEntryFor(c) : true,
        // Status default 'open'; die laufende Staffel markiert ein paar als 'full',
        // damit der "Ausgebucht"-Chip im öffentlichen Plan echte Daten hat (Etappe 7).
        status: statusFor ? statusFor(idx) : 'open',
      });
      counts.courses++;

      // Lehrer verknuepfen
      for (const name of c.teachers) {
        const tid = teacherIdByName.get(name.trim());
        if (!tid) continue;
        await db.insert(courseTeachers).values({ courseId, teacherId: tid });
        counts.links++;
      }

      // Preise: Normal (190) + ermässigt/Student (160) aus dem Excel-Header.
      // (Intern gepflegt; der öffentliche Plan zeigt keine Preise, Etappe 7.)
      if (c.price_normal != null) {
        await db.insert(coursePrices).values({
          courseId,
          tariffId: await tariffId(db, 'normal'),
          amountChf: c.price_normal.toFixed(2),
        });
        counts.prices++;
      }
      if (c.price_reduced != null) {
        await db.insert(coursePrices).values({
          courseId,
          tariffId: await tariffId(db, 'student'),
          amountChf: c.price_reduced.toFixed(2),
        });
        counts.prices++;
      }
    }
    return tId;
  }

  // 1) Historische Staffel Januar 2026 (unveraendert; liegt heute in der Vergangenheit
  //    -> der öffentliche Plan blendet sie über das Datum aus, das beweist die Datums-Logik).
  await insertTerm({
    name: source.term.name,
    startDate: source.term.start_date,
    endDate: source.term.end_date,
    weekCount: source.term.week_count,
  });

  // 2)+3) Feste Staffeln laut Watchdog-Vertrag S0 (PROMPT-R2, 2026-08-14):
  // eine laufende und eine kommende Staffel mit deterministischen Daten,
  // damit Shots und Vorausbuchung stabil pruefbar sind.

  // Laufende Staffel August: Quereinstieg bei allem ausser Advanced möglich (damit der
  // "Quereinstieg möglich"-Chip im Plan sichtbar variiert); die ersten drei Kurse als
  // 'full' (zeigt den "Ausgebucht"-Chip live).
  await insertTerm(
    { name: 'Staffel August 2026', startDate: '2026-08-10', endDate: '2026-10-02', weekCount: 8 },
    (c) => !(c.level_raw ?? '').toLowerCase().includes('advanced'),
    (idx) => (idx < 3 ? 'full' : 'open'),
  );

  // Kommende Staffel Oktober (upcoming; Vorausbuchung zeigt auf diese Termine).
  await insertTerm({
    name: 'Staffel Oktober 2026',
    startDate: '2026-10-12',
    endDate: '2026-12-05',
    weekCount: 8,
  });

  console.log('[seed] fertig:');
  console.log(`  Stile:        ${STYLES.length}`);
  console.log(`  Level-Rungs:  ${rungDefs.length}`);
  console.log(`  Tarife:       ${TARIFFS.length}`);
  console.log(`  Lehrer:       ${teacherRows.length}`);
  console.log(`  Staffeln:     ${counts.terms} (Januar + August + Oktober 2026)`);
  console.log(`  Kurse:        ${counts.courses}`);
  console.log(`  Kurs-Lehrer:  ${counts.links}`);
  console.log(`  Kurs-Preise:  ${counts.prices}`);
  console.log(`  Admin:        admin@salsaflow-dc.com (Rolle owner)`);

  await handle.close();
}

// kleiner Helfer: Tarif-Id nach Key (gecached pro Lauf)
const tariffIdCache = new Map<string, string>();
async function tariffId(db: Awaited<ReturnType<typeof openDb>>['db'], key: string): Promise<string> {
  if (tariffIdCache.has(key)) return tariffIdCache.get(key)!;
  const rows = await db.select().from(tariffs);
  for (const r of rows) tariffIdCache.set(r.key, r.id);
  const id = tariffIdCache.get(key);
  if (!id) throw new Error(`Tarif nicht gefunden: ${key}`);
  return id;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSeed().catch((err) => {
    console.error('[seed] FEHLER:', err);
    process.exit(1);
  });
}
