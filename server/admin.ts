import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import type { Db } from '../db/client.js';
import {
  adminProfiles,
  auditLog,
  courses,
  coursePrices,
  courseTeachers,
  levelRungs,
  locations,
  styles,
  tariffs,
  teachers,
  terms,
} from '../db/schema.js';
import { SESSION_COOKIE, verifySession } from './auth.js';
import { promote, promotionLabel, type Rung } from './promotion.js';
import { BookingError, bookingsForCourse, cancelBooking, computeAvailability } from './booking.js';
import { refundBooking } from './payment-service.js';

// Kontext-Typ für eingeloggte Admins (von der Auth-Middleware gesetzt).
type AdminCtx = { id: string; role: string; email: string; displayName: string };

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const WEEKDAY_DE: Record<string, string> = {
  mon: 'Montag',
  tue: 'Dienstag',
  wed: 'Mittwoch',
  thu: 'Donnerstag',
  fri: 'Freitag',
  sat: 'Samstag',
  sun: 'Sonntag',
};
const COURSE_STATUS = ['draft', 'open', 'full', 'cancelled', 'finished'] as const;
const BOOKING_TYPE = ['leader_follower', 'open'] as const;

/* ----------------------------------------------------------------------------
 * Zod-Schemas für Schreib-Endpunkte
 * -------------------------------------------------------------------------- */
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum als YYYY-MM-DD');
const timeStr = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Zeit als HH:MM');

// End-Datum darf nicht vor dem Start-Datum liegen (ISO-Strings sind lexikografisch vergleichbar).
const datesOrdered = (d: { startDate?: string; endDate?: string }) =>
  !d.startDate || !d.endDate || d.endDate >= d.startDate;
const dateOrderMsg = { message: 'End-Datum liegt vor dem Start-Datum', path: ['endDate'] };

const termCreateSchema = z
  .object({
    name: z.string().min(1).max(120),
    startDate: dateStr,
    endDate: dateStr,
    weekCount: z.number().int().min(1).max(52).optional(),
    isSummer: z.boolean().optional(),
  })
  .refine(datesOrdered, dateOrderMsg);

const termPatchSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    startDate: dateStr.optional(),
    endDate: dateStr.optional(),
    weekCount: z.number().int().min(1).max(52).optional(),
    isSummer: z.boolean().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
  })
  .refine(datesOrdered, dateOrderMsg);

const duplicateSchema = z
  .object({
    name: z.string().min(1).max(120),
    startDate: dateStr,
    endDate: dateStr,
    weekCount: z.number().int().min(1).max(52).optional(),
    isSummer: z.boolean().optional(),
    // Pro Kurs (alte Kurs-id) ein explizit gewaehltes Ziel-Level statt dem Auto-Vorschlag.
    overrides: z.record(z.string().uuid(), z.string().uuid()).optional(),
  })
  .refine(datesOrdered, dateOrderMsg);

const priceSchema = z.object({
  tariffId: z.string().uuid(),
  amountChf: z.number().min(0).max(100000),
});

const courseBodySchema = z.object({
  termId: z.string().uuid(),
  styleId: z.string().uuid(),
  levelRungId: z.string().uuid().nullable().optional(),
  onVariant: z.enum(['on1', 'on2']).nullable().optional(),
  weekday: z.enum(WEEKDAYS),
  startTime: timeStr,
  endTime: timeStr,
  locationId: z.string().uuid(),
  bookingType: z.enum(BOOKING_TYPE).optional(),
  capacityTotal: z.number().int().min(1).max(500).optional(),
  status: z.enum(COURSE_STATUS).optional(),
  teacherIds: z.array(z.string().uuid()).optional(),
  prices: z.array(priceSchema).optional(),
});

const coursePatchSchema = courseBodySchema.partial().omit({ termId: true });

/* ----------------------------------------------------------------------------
 * Hilfsfunktionen
 * -------------------------------------------------------------------------- */
function normTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

async function audit(
  db: Db,
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  meta?: unknown,
) {
  try {
    await db.insert(auditLog).values({
      actorId,
      action,
      entity,
      entityId,
      meta: (meta ?? null) as never,
    });
  } catch {
    // Audit darf die Hauptaktion nie blockieren.
  }
}

// Alle level_rungs als Rung[] (für Auto-Aufstieg + Vorschau).
async function loadRungs(db: Db): Promise<Rung[]> {
  const rows = await db.select().from(levelRungs);
  return rows.map((r) => ({
    id: r.id,
    ladderKey: r.ladderKey,
    ordinal: r.ordinal,
    category: r.category,
    stufe: r.stufe,
    isFlow: r.isFlow,
    isOpenEnded: r.isOpenEnded,
    labelDe: r.labelDe,
    labelEn: r.labelEn,
  }));
}

// Angereicherte Kurs-Sicht einer Staffel (Stil-/Level-Labels, Lehrer, Preise) für das UI.
async function loadCoursesForTerm(db: Db, termId: string) {
  const courseRows = await db.select().from(courses).where(eq(courses.termId, termId));
  if (courseRows.length === 0) return [];

  const styleRows = await db.select().from(styles);
  const rungRows = await db.select().from(levelRungs);
  const locRows = await db.select().from(locations);
  const tariffRows = await db.select().from(tariffs);
  const styleById = new Map(styleRows.map((s) => [s.id, s]));
  const rungById = new Map(rungRows.map((r) => [r.id, r]));
  const locById = new Map(locRows.map((l) => [l.id, l]));
  const tariffById = new Map(tariffRows.map((t) => [t.id, t]));

  const courseIds = courseRows.map((c) => c.id);
  const ctRows = await db
    .select()
    .from(courseTeachers)
    .where(inArray(courseTeachers.courseId, courseIds));
  const teacherRows = await db.select().from(teachers);
  const teacherById = new Map(teacherRows.map((t) => [t.id, t]));
  const cpRows = await db
    .select()
    .from(coursePrices)
    .where(inArray(coursePrices.courseId, courseIds));

  const teachersByCourse = new Map<string, { id: string; displayName: string }[]>();
  for (const ct of ctRows) {
    const t = teacherById.get(ct.teacherId);
    if (!t) continue;
    const list = teachersByCourse.get(ct.courseId) ?? [];
    list.push({ id: t.id, displayName: t.displayName });
    teachersByCourse.set(ct.courseId, list);
  }
  const pricesByCourse = new Map<
    string,
    { tariffId: string; tariffKey: string; tariffDe: string; amountChf: string }[]
  >();
  for (const cp of cpRows) {
    const t = tariffById.get(cp.tariffId);
    const list = pricesByCourse.get(cp.courseId) ?? [];
    list.push({
      tariffId: cp.tariffId,
      tariffKey: t?.key ?? '',
      tariffDe: t?.nameDe ?? '',
      amountChf: cp.amountChf,
    });
    pricesByCourse.set(cp.courseId, list);
  }

  // Sortiert nach Wochentag, dann Startzeit -> wie im Plan.
  const order = (wd: string) => WEEKDAYS.indexOf(wd as (typeof WEEKDAYS)[number]);
  return courseRows
    .map((c) => {
      const style = styleById.get(c.styleId);
      const rung = c.levelRungId ? rungById.get(c.levelRungId) : null;
      const loc = locById.get(c.locationId);
      return {
        id: c.id,
        styleId: c.styleId,
        styleKey: style?.key ?? '',
        styleDe: style?.nameDe ?? '',
        styleEn: style?.nameEn ?? '',
        ladderKey: style?.ladderKey ?? 'open',
        levelRungId: c.levelRungId,
        levelDe: rung?.labelDe ?? null,
        levelEn: rung?.labelEn ?? null,
        onVariant: c.onVariant,
        weekday: c.weekday,
        weekdayDe: WEEKDAY_DE[c.weekday] ?? c.weekday,
        startTime: c.startTime.slice(0, 5),
        endTime: c.endTime.slice(0, 5),
        locationId: c.locationId,
        locationName: loc?.name ?? '',
        bookingType: c.bookingType,
        capacityTotal: c.capacityTotal,
        status: c.status,
        teachers: teachersByCourse.get(c.id) ?? [],
        prices: pricesByCourse.get(c.id) ?? [],
      };
    })
    .sort((a, b) => order(a.weekday) - order(b.weekday) || a.startTime.localeCompare(b.startTime));
}

// Schreibt Lehrer-Verknuepfungen + Preise eines Kurses neu (idempotent: erst löschen, dann setzen).
async function setCourseRelations(
  db: Db,
  courseId: string,
  teacherIds: string[] | undefined,
  prices: { tariffId: string; amountChf: number }[] | undefined,
) {
  if (teacherIds) {
    await db.delete(courseTeachers).where(eq(courseTeachers.courseId, courseId));
    const unique = [...new Set(teacherIds)];
    if (unique.length > 0) {
      await db.insert(courseTeachers).values(unique.map((teacherId) => ({ courseId, teacherId })));
    }
  }
  if (prices) {
    await db.delete(coursePrices).where(eq(coursePrices.courseId, courseId));
    if (prices.length > 0) {
      await db.insert(coursePrices).values(
        prices.map((p) => ({ courseId, tariffId: p.tariffId, amountChf: p.amountChf.toFixed(2) })),
      );
    }
  }
}

/* ----------------------------------------------------------------------------
 * Routen
 * -------------------------------------------------------------------------- */
export function createAdminRoutes(db: Db) {
  const admin = new Hono<{ Variables: { admin: AdminCtx } }>();

  // Auth-Gate für alle /api/admin/* Routen.
  admin.use('/api/admin/*', async (c, next) => {
    const session = verifySession(getCookie(c, SESSION_COOKIE));
    if (!session) return c.json({ error: 'Nicht eingeloggt' }, 401);
    const rows = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.id, session.sub))
      .limit(1);
    const a = rows[0];
    if (!a) return c.json({ error: 'Nicht eingeloggt' }, 401);
    c.set('admin', { id: a.id, role: a.role, email: a.email, displayName: a.displayName });
    await next();
  });

  // Schreib-Gate: teacher_readonly darf nur lesen.
  const requireWrite: MiddlewareHandler<{ Variables: { admin: AdminCtx } }> = async (c, next) => {
    const a = c.get('admin');
    if (a.role === 'teacher_readonly') {
      return c.json({ error: 'Nur Lese-Rechte' }, 403);
    }
    await next();
  };
  admin.post('/api/admin/*', requireWrite);
  admin.patch('/api/admin/*', requireWrite);
  admin.delete('/api/admin/*', requireWrite);

  /* --- Stammdaten für Dropdowns ------------------------------------------ */
  admin.get('/api/admin/meta', async (c) => {
    const [styleRows, rungRows, teacherRows, locRows, tariffRows] = await Promise.all([
      db.select().from(styles),
      db.select().from(levelRungs),
      db.select().from(teachers),
      db.select().from(locations),
      db.select().from(tariffs),
    ]);
    return c.json({
      styles: styleRows
        .map((s) => ({
          id: s.id,
          key: s.key,
          nameDe: s.nameDe,
          nameEn: s.nameEn,
          ladderKey: s.ladderKey,
          sort: s.sort,
        }))
        .sort((a, b) => a.sort - b.sort),
      levelRungs: rungRows
        .map((r) => ({
          id: r.id,
          ladderKey: r.ladderKey,
          ordinal: r.ordinal,
          category: r.category,
          isFlow: r.isFlow,
          labelDe: r.labelDe,
          labelEn: r.labelEn,
        }))
        .sort((a, b) => a.ladderKey.localeCompare(b.ladderKey) || a.ordinal - b.ordinal),
      teachers: teacherRows
        .filter((t) => t.isActive)
        .map((t) => ({ id: t.id, displayName: t.displayName }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName)),
      locations: locRows
        .map((l) => ({ id: l.id, name: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      tariffs: tariffRows
        .map((t) => ({ id: t.id, key: t.key, nameDe: t.nameDe, seats: t.seats, sort: t.sort }))
        .sort((a, b) => a.sort - b.sort),
      weekdays: WEEKDAYS.map((w) => ({ key: w, de: WEEKDAY_DE[w] })),
    });
  });

  /* --- Staffeln (terms) --------------------------------------------------- */
  admin.get('/api/admin/terms', async (c) => {
    const termRows = await db.select().from(terms);
    const courseRows = await db
      .select({ id: courses.id, termId: courses.termId })
      .from(courses);
    const countByTerm = new Map<string, number>();
    for (const cr of courseRows) countByTerm.set(cr.termId, (countByTerm.get(cr.termId) ?? 0) + 1);
    const list = termRows
      .map((t) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        weekCount: t.weekCount,
        isSummer: t.isSummer,
        status: t.status,
        duplicatedFrom: t.duplicatedFrom,
        courseCount: countByTerm.get(t.id) ?? 0,
        createdAt: t.createdAt,
      }))
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1)); // neueste zuerst
    return c.json({ terms: list });
  });

  admin.get('/api/admin/terms/:id', async (c) => {
    const id = c.req.param('id');
    const termRows = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    const term = termRows[0];
    if (!term) return c.json({ error: 'Staffel nicht gefunden' }, 404);
    const courseList = await loadCoursesForTerm(db, id);
    return c.json({ term, courses: courseList });
  });

  admin.post('/api/admin/terms', async (c) => {
    const parsed = termCreateSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    const d = parsed.data;
    const id = randomUUID();
    await db.insert(terms).values({
      id,
      name: d.name.trim(),
      startDate: d.startDate,
      endDate: d.endDate,
      weekCount: d.weekCount ?? 8,
      isSummer: d.isSummer ?? false,
      status: 'draft',
    });
    await audit(db, c.get('admin').id, 'create', 'term', id, { name: d.name });
    return c.json({ id }, 201);
  });

  admin.patch('/api/admin/terms/:id', async (c) => {
    const id = c.req.param('id');
    const parsed = termPatchSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    const existing = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    if (!existing[0]) return c.json({ error: 'Staffel nicht gefunden' }, 404);
    const d = parsed.data;
    await db
      .update(terms)
      .set({
        ...(d.name !== undefined ? { name: d.name.trim() } : {}),
        ...(d.startDate !== undefined ? { startDate: d.startDate } : {}),
        ...(d.endDate !== undefined ? { endDate: d.endDate } : {}),
        ...(d.weekCount !== undefined ? { weekCount: d.weekCount } : {}),
        ...(d.isSummer !== undefined ? { isSummer: d.isSummer } : {}),
        ...(d.status !== undefined ? { status: d.status } : {}),
      })
      .where(eq(terms.id, id));

    // Veröffentlichen heisst "live gehen": die beim Duplizieren als Entwurf
    // angelegten Kurse (status 'draft') werden mit-aktiviert (-> 'open'), damit
    // der Staffel-Wechsel in EINER Aktion öffentlich + buchbar ist (idiotensicher,
    // Etappe 6/16). Nur 'draft' wird umgeschaltet - bewusst auf 'cancelled'/
    // 'finished'/'full' gesetzte Kurse bleiben unangetastet. Beim Zurückziehen
    // auf 'draft' werden Kurse NICHT veraendert (Status bleibt erhalten).
    let activatedCourses = 0;
    if (d.status === 'published') {
      const activated = await db
        .update(courses)
        .set({ status: 'open' })
        .where(and(eq(courses.termId, id), eq(courses.status, 'draft')))
        .returning({ id: courses.id });
      activatedCourses = activated.length;
    }

    await audit(db, c.get('admin').id, 'update', 'term', id, { ...d, activatedCourses });
    return c.json({ ok: true, activatedCourses });
  });

  admin.delete('/api/admin/terms/:id', async (c) => {
    const id = c.req.param('id');
    const existing = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    if (!existing[0]) return c.json({ error: 'Staffel nicht gefunden' }, 404);
    await db.delete(terms).where(eq(terms.id, id)); // courses cascaden (FK onDelete cascade)
    await audit(db, c.get('admin').id, 'delete', 'term', id, { name: existing[0].name });
    return c.json({ ok: true });
  });

  /* --- Duplizieren: Vorschau (kein Schreiben) ----------------------------- */
  admin.get('/api/admin/terms/:id/duplicate-preview', async (c) => {
    const id = c.req.param('id');
    const termRows = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    const source = termRows[0];
    if (!source) return c.json({ error: 'Staffel nicht gefunden' }, 404);

    const rungs = await loadRungs(db);
    const rungById = new Map(rungs.map((r) => [r.id, r]));
    const courseList = await loadCoursesForTerm(db, id);

    const preview = courseList.map((course) => {
      const current = course.levelRungId ? (rungById.get(course.levelRungId) ?? null) : null;
      const p = promote(current, rungs);
      const newLabel = promotionLabel(p, 'de');
      const targetRungId =
        p.kind === 'existing' || p.kind === 'same' ? p.rung.id : null; // 'new' wird beim Commit angelegt
      const changed =
        p.kind === 'existing' || p.kind === 'new'
          ? newLabel !== course.levelDe
          : false;
      return {
        courseId: course.id,
        styleDe: course.styleDe,
        ladderKey: course.ladderKey,
        weekdayDe: course.weekdayDe,
        time: `${course.startTime}-${course.endTime}`,
        onVariant: course.onVariant,
        currentLevelDe: course.levelDe,
        currentRungId: course.levelRungId,
        newLevelDe: newLabel,
        targetRungId, // null wenn ohne Level oder neue Advanced-Stufe
        autoNewAdvanced: p.kind === 'new',
        changed,
      };
    });

    // Vorschlag für Name + Daten der neuen Staffel: direkt im Anschluss an die Quelle.
    const startDate = addDaysISO(source.endDate, 1);
    const endDate = addDaysISO(startDate, (source.weekCount ?? 8) * 7 - 1);
    const suggestedName = `Staffel ${monthYearDe(startDate)}`;

    return c.json({
      source: { id: source.id, name: source.name },
      suggested: {
        name: suggestedName,
        startDate,
        endDate,
        weekCount: source.weekCount ?? 8,
        isSummer: source.isSummer,
      },
      courses: preview,
      changedCount: preview.filter((p) => p.changed).length,
    });
  });

  /* --- Duplizieren: Commit ------------------------------------------------ */
  admin.post('/api/admin/terms/:id/duplicate', async (c) => {
    const id = c.req.param('id');
    const parsed = duplicateSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    const d = parsed.data;

    const termRows = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    const source = termRows[0];
    if (!source) return c.json({ error: 'Quell-Staffel nicht gefunden' }, 404);

    const rungs = await loadRungs(db);
    const rungById = new Map(rungs.map((r) => [r.id, r]));
    const rungByLadderOrdinal = new Map(rungs.map((r) => [`${r.ladderKey}#${r.ordinal}`, r.id]));
    const styleRows = await db.select().from(styles);
    const ladderByStyleId = new Map(styleRows.map((s) => [s.id, s.ladderKey]));
    const sourceCourses = await db.select().from(courses).where(eq(courses.termId, id));
    const overrides = d.overrides ?? {};

    // Neue Staffel.
    const newTermId = randomUUID();
    await db.insert(terms).values({
      id: newTermId,
      name: d.name.trim(),
      startDate: d.startDate,
      endDate: d.endDate,
      weekCount: d.weekCount ?? source.weekCount ?? 8,
      isSummer: d.isSummer ?? source.isSummer,
      status: 'draft',
      duplicatedFrom: source.id,
    });

    let promotedCount = 0;
    for (const sc of sourceCourses) {
      const ladderKey = ladderByStyleId.get(sc.styleId) ?? 'open';
      let targetRungId: string | null;

      const override = overrides[sc.id];
      if (override) {
        // Manuelle Wahl: muss existieren und zur selben Leiter gehoeren.
        const r = rungById.get(override);
        if (!r || r.ladderKey !== ladderKey) {
          return c.json({ error: `Ungültiges Ziel-Level für Kurs ${sc.id}` }, 400);
        }
        targetRungId = r.id;
      } else {
        const current = sc.levelRungId ? (rungById.get(sc.levelRungId) ?? null) : null;
        const p = promote(current, rungs);
        if (p.kind === 'null') {
          targetRungId = null;
        } else if (p.kind === 'same') {
          targetRungId = p.rung.id;
        } else if (p.kind === 'existing') {
          targetRungId = p.rung.id;
          promotedCount++;
        } else {
          // 'new': neue Advanced-Stufe anlegen (oder vorhandene wiederverwenden, falls im Lauf schon angelegt).
          const key = `${p.def.ladderKey}#${p.def.ordinal}`;
          let rid = rungByLadderOrdinal.get(key);
          if (!rid) {
            rid = randomUUID();
            await db.insert(levelRungs).values({
              id: rid,
              ladderKey: p.def.ladderKey,
              ordinal: p.def.ordinal,
              category: p.def.category,
              stufe: p.def.stufe,
              isFlow: p.def.isFlow,
              isOpenEnded: p.def.isOpenEnded,
              labelDe: p.def.labelDe,
              labelEn: p.def.labelEn,
            });
            rungByLadderOrdinal.set(key, rid);
            rungById.set(rid, {
              id: rid,
              ladderKey: p.def.ladderKey,
              ordinal: p.def.ordinal,
              category: p.def.category,
              stufe: p.def.stufe,
              isFlow: p.def.isFlow,
              isOpenEnded: p.def.isOpenEnded,
              labelDe: p.def.labelDe,
              labelEn: p.def.labelEn,
            });
          }
          targetRungId = rid;
          promotedCount++;
        }
      }

      const newCourseId = randomUUID();
      await db.insert(courses).values({
        id: newCourseId,
        termId: newTermId,
        styleId: sc.styleId,
        levelRungId: targetRungId,
        onVariant: sc.onVariant,
        weekday: sc.weekday,
        startTime: sc.startTime,
        endTime: sc.endTime,
        locationId: sc.locationId,
        bookingType: sc.bookingType,
        capacityTotal: sc.capacityTotal,
        allowsLateEntry: sc.allowsLateEntry,
        status: 'draft',
        createdFromCourseId: sc.id,
      });

      // Lehrer + Preise mitkopieren.
      const ct = await db
        .select()
        .from(courseTeachers)
        .where(eq(courseTeachers.courseId, sc.id));
      if (ct.length > 0) {
        await db
          .insert(courseTeachers)
          .values(ct.map((x) => ({ courseId: newCourseId, teacherId: x.teacherId })));
      }
      const cp = await db.select().from(coursePrices).where(eq(coursePrices.courseId, sc.id));
      if (cp.length > 0) {
        await db
          .insert(coursePrices)
          .values(cp.map((x) => ({ courseId: newCourseId, tariffId: x.tariffId, amountChf: x.amountChf })));
      }
    }

    await audit(db, c.get('admin').id, 'duplicate', 'term', newTermId, {
      from: source.id,
      courses: sourceCourses.length,
      promoted: promotedCount,
    });
    return c.json({ id: newTermId, courses: sourceCourses.length, promoted: promotedCount }, 201);
  });

  /* --- Buchungen: Balance-Sicht pro Staffel (Etappe 8) -------------------- */
  // Pro Kurs: bestaetigte Leader vs. Follower, Balance, offene Aushilfe-Bedarfe, Warteliste,
  // plus die Buchungsliste. Ersetzt die heutigen WhatsApp-Aushilfe-Chats (ARCHITEKTUR.md 5.4).
  admin.get('/api/admin/terms/:id/balance', async (c) => {
    const id = c.req.param('id');
    const termRows = await db.select().from(terms).where(eq(terms.id, id)).limit(1);
    if (!termRows[0]) return c.json({ error: 'Staffel nicht gefunden' }, 404);

    const courseList = await loadCoursesForTerm(db, id);
    const out = [];
    for (const course of courseList) {
      const avail = await computeAvailability(db, course.id);
      const list = await bookingsForCourse(db, course.id);
      out.push({
        courseId: course.id,
        styleDe: course.styleDe,
        levelDe: course.levelDe,
        onVariant: course.onVariant,
        weekdayDe: course.weekdayDe,
        time: `${course.startTime}-${course.endTime}`,
        bookingType: course.bookingType,
        capacityTotal: course.capacityTotal,
        availability: avail,
        bookings: list,
      });
    }
    return c.json({ term: termRows[0], courses: out });
  });

  admin.post('/api/admin/bookings/:id/cancel', async (c) => {
    const id = c.req.param('id');
    try {
      // Bezahlte Buchung -> Storno mit Stripe-Refund (Etappe 9). Sonst normaler Storno (Etappe 8).
      const refund = await refundBooking(db, id);
      const r = refund.refunded
        ? { ok: true, promoted: refund.promoted, refunded: true }
        : await cancelBooking(db, id);
      await audit(db, c.get('admin').id, 'booking.cancel', 'booking', id, {
        promoted: r.promoted,
        refunded: refund.refunded,
      });
      return c.json(r);
    } catch (e) {
      if (e instanceof BookingError) return c.json({ error: e.message, code: e.code }, e.status as 400);
      throw e;
    }
  });

  /* --- Kurse -------------------------------------------------------------- */
  admin.post('/api/admin/courses', async (c) => {
    const parsed = courseBodySchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    const d = parsed.data;
    const termRows = await db.select().from(terms).where(eq(terms.id, d.termId)).limit(1);
    if (!termRows[0]) return c.json({ error: 'Staffel nicht gefunden' }, 404);

    const id = randomUUID();
    await db.insert(courses).values({
      id,
      termId: d.termId,
      styleId: d.styleId,
      levelRungId: d.levelRungId ?? null,
      onVariant: d.onVariant ?? null,
      weekday: d.weekday,
      startTime: normTime(d.startTime),
      endTime: normTime(d.endTime),
      locationId: d.locationId,
      bookingType: d.bookingType ?? 'leader_follower',
      capacityTotal: d.capacityTotal ?? 24,
      status: d.status ?? 'draft',
    });
    await setCourseRelations(db, id, d.teacherIds, d.prices);
    await audit(db, c.get('admin').id, 'create', 'course', id, { termId: d.termId });
    return c.json({ id }, 201);
  });

  admin.patch('/api/admin/courses/:id', async (c) => {
    const id = c.req.param('id');
    const parsed = coursePatchSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe', issues: parsed.error.issues }, 400);
    const existing = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    if (!existing[0]) return c.json({ error: 'Kurs nicht gefunden' }, 404);
    const d = parsed.data;
    await db
      .update(courses)
      .set({
        ...(d.styleId !== undefined ? { styleId: d.styleId } : {}),
        ...(d.levelRungId !== undefined ? { levelRungId: d.levelRungId } : {}),
        ...(d.onVariant !== undefined ? { onVariant: d.onVariant } : {}),
        ...(d.weekday !== undefined ? { weekday: d.weekday } : {}),
        ...(d.startTime !== undefined ? { startTime: normTime(d.startTime) } : {}),
        ...(d.endTime !== undefined ? { endTime: normTime(d.endTime) } : {}),
        ...(d.locationId !== undefined ? { locationId: d.locationId } : {}),
        ...(d.bookingType !== undefined ? { bookingType: d.bookingType } : {}),
        ...(d.capacityTotal !== undefined ? { capacityTotal: d.capacityTotal } : {}),
        ...(d.status !== undefined ? { status: d.status } : {}),
      })
      .where(eq(courses.id, id));
    await setCourseRelations(db, id, d.teacherIds, d.prices);
    await audit(db, c.get('admin').id, 'update', 'course', id);
    return c.json({ ok: true });
  });

  admin.delete('/api/admin/courses/:id', async (c) => {
    const id = c.req.param('id');
    const existing = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    if (!existing[0]) return c.json({ error: 'Kurs nicht gefunden' }, 404);
    await db.delete(courses).where(eq(courses.id, id));
    await audit(db, c.get('admin').id, 'delete', 'course', id);
    return c.json({ ok: true });
  });

  return admin;
}

/* ----------------------------------------------------------------------------
 * Datums-Helfer (Vorschlag für die neue Staffel). Reine String/Date-Mathematik.
 * -------------------------------------------------------------------------- */
function addDaysISO(iso: string, days: number): string {
  const [y, m, dd] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
function monthYearDe(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS_DE[(m - 1) % 12]} ${y}`;
}
