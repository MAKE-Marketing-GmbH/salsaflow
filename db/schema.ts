// Salsaflow DC - Datenbankschema (Drizzle ORM, PostgreSQL).
// 1:1-Umsetzung von ARCHITEKTUR.md Abschnitt 2 (vier Bereiche: A Admin/Auth, B Kurse,
// C Buchungen, D Zahlungen). Echtes Postgres-DDL -> portabel zu Supabase/Neon (gleiches Schema).
//
// EINZIGE bewusste Abweichung von ARCHITEKTUR.md (dokumentiert in DECISIONS.md, Etappe 5):
//   admin_profiles ist hier self-contained (email + password_hash) statt FK auf Supabase
//   auth.users, weil Etappe 5 ein LOKAL verifizierbares Admin-Login verlangt (kein Cloud-Auth).
//   Das ist der in ARCHITEKTUR.md 1.2 vorgesehene Fallback (Auth.js-Stil). Bei einem spaeteren
//   Supabase-Deploy kann die id wieder an auth.users gekoppelt werden.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  date,
  time,
  char,
  jsonb,
  bigserial,
  primaryKey,
  unique,
  index,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

/* =========================================================================
 * Enums
 * ========================================================================= */
export const adminRole = pgEnum('admin_role', ['owner', 'admin', 'teacher_readonly']);
export const levelCategory = pgEnum('level_category', [
  'beginner',
  'intermediate',
  'advanced',
  'open',
  'heels',
]);
export const termStatus = pgEnum('term_status', ['draft', 'published', 'archived']);
export const bookingType = pgEnum('booking_type', ['leader_follower', 'open']);
export const onVariant = pgEnum('on_variant', ['on1', 'on2']);
export const courseStatus = pgEnum('course_status', [
  'draft',
  'open',
  'full',
  'cancelled',
  'finished',
]);
export const weekday = pgEnum('weekday', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
export const gender = pgEnum('gender', ['m', 'w', 'd', 'none']);
export const danceRole = pgEnum('dance_role', ['leader', 'follower']);
export const bookingMode = pgEnum('booking_mode', ['solo', 'couple']);
export const bookingStatus = pgEnum('booking_status', [
  'pending_payment',
  'waitlisted',
  'confirmed',
  'cancelled',
  'expired',
  'refunded',
  'completed',
]);
export const paymentProvider = pgEnum('payment_provider', ['stripe']);
export const paymentMethod = pgEnum('payment_method', [
  'twint',
  'card',
  'apple_pay',
  'google_pay',
  'other',
]);
export const paymentStatus = pgEnum('payment_status', [
  'created',
  'pending',
  'succeeded',
  'failed',
  'expired',
  'refunded',
  'partially_refunded',
]);
export const notificationKind = pgEnum('notification_kind', [
  'booking_confirmation',
  'waitlist_promoted',
  'payment_failed',
  'cancellation',
  'refund',
]);

/* =========================================================================
 * Bereich A - Admin / Auth
 * ========================================================================= */
export const adminProfiles = pgTable('admin_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  role: adminRole('role').notNull().default('admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable('audit_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  actorId: uuid('actor_id').references(() => adminProfiles.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* =========================================================================
 * Bereich B - Kurse (Staffeln, Kurse, Stammdaten)
 * ========================================================================= */
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  address: text('address').notNull().default('Elisabethenanlage 7, 4051 Basel'),
  sort: integer('sort').notNull().default(0),
});

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  role: text('role'),
  bioDe: text('bio_de'),
  bioEn: text('bio_en'),
  photoUrl: text('photo_url'),
  isActive: boolean('is_active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
});

export const styles = pgTable('styles', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  nameDe: text('name_de').notNull(),
  nameEn: text('name_en').notNull(),
  ladderKey: text('ladder_key').notNull(),
  sort: integer('sort').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const levelRungs = pgTable(
  'level_rungs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ladderKey: text('ladder_key').notNull(),
    ordinal: integer('ordinal').notNull(),
    category: levelCategory('category').notNull(),
    stufe: integer('stufe'),
    isFlow: boolean('is_flow').notNull().default(false),
    isOpenEnded: boolean('is_open_ended').notNull().default(false),
    labelDe: text('label_de').notNull(),
    labelEn: text('label_en').notNull(),
  },
  (t) => [unique('level_rungs_ladder_ordinal_uq').on(t.ladderKey, t.ordinal)],
);

export const terms = pgTable('terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  weekCount: integer('week_count').notNull().default(8),
  isSummer: boolean('is_summer').notNull().default(false),
  status: termStatus('status').notNull().default('draft'),
  duplicatedFrom: uuid('duplicated_from').references((): AnyPgColumn => terms.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  termId: uuid('term_id')
    .notNull()
    .references(() => terms.id, { onDelete: 'cascade' }),
  styleId: uuid('style_id')
    .notNull()
    .references(() => styles.id),
  levelRungId: uuid('level_rung_id').references(() => levelRungs.id),
  onVariant: onVariant('on_variant'),
  weekday: weekday('weekday').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  locationId: uuid('location_id')
    .notNull()
    .references(() => locations.id),
  bookingType: bookingType('booking_type').notNull().default('leader_follower'),
  // Ein gemeinsamer Platzpool. Leader/Follower bleibt nur eine Buchungsinformation.
  capacityTotal: integer('capacity_total').notNull().default(24),
  allowsLateEntry: boolean('allows_late_entry').notNull().default(true),
  status: courseStatus('status').notNull().default('draft'),
  createdFromCourseId: uuid('created_from_course_id').references((): AnyPgColumn => courses.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courseTeachers = pgTable(
  'course_teachers',
  {
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => teachers.id),
  },
  (t) => [primaryKey({ columns: [t.courseId, t.teacherId] })],
);

export const tariffs = pgTable('tariffs', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  nameDe: text('name_de').notNull(),
  nameEn: text('name_en').notNull(),
  seats: integer('seats').notNull().default(1),
  sort: integer('sort').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const coursePrices = pgTable(
  'course_prices',
  {
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    tariffId: uuid('tariff_id')
      .notNull()
      .references(() => tariffs.id),
    amountChf: numeric('amount_chf', { precision: 8, scale: 2 }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.courseId, t.tariffId] })],
);

/* =========================================================================
 * Bereich C - Buchungen (Teilnehmer, Buchung, Warteliste)
 * ========================================================================= */
export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  gender: gender('gender').notNull().default('none'),
  defaultTariffId: uuid('default_tariff_id').references(() => tariffs.id),
  source: text('source'),
  marketingOptin: boolean('marketing_optin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id),
    participantId: uuid('participant_id')
      .notNull()
      .references(() => participants.id),
    role: danceRole('role'),
    mode: bookingMode('mode').notNull().default('solo'),
    partnerParticipantId: uuid('partner_participant_id').references(() => participants.id),
    partnerRole: danceRole('partner_role'),
    needsAushilfe: boolean('needs_aushilfe').notNull().default(false),
    tariffId: uuid('tariff_id')
      .notNull()
      .references(() => tariffs.id),
    amountChf: numeric('amount_chf', { precision: 8, scale: 2 }).notNull(),
    status: bookingStatus('status').notNull().default('pending_payment'),
    waitlistPosition: integer('waitlist_position'),
    language: text('language').notNull().default('de'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    paymentDeadline: timestamp('payment_deadline', { withTimezone: true }),
  },
  (t) => [index('bookings_course_status_role_idx').on(t.courseId, t.status, t.role)],
);

/* =========================================================================
 * Bereich D - Zahlungen (Zahlung, Webhook-Events, Mails)
 * ========================================================================= */
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id)
    .unique(),
  provider: paymentProvider('provider').notNull().default('stripe'),
  checkoutSessionId: text('checkout_session_id'),
  paymentIntentId: text('payment_intent_id'),
  amountChf: numeric('amount_chf', { precision: 8, scale: 2 }).notNull(),
  currency: char('currency', { length: 3 }).notNull().default('CHF'),
  method: paymentMethod('method'),
  status: paymentStatus('status').notNull().default('created'),
  refundAmountChf: numeric('refund_amount_chf', { precision: 8, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
});

export const paymentEvents = pgTable('payment_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerEventId: text('provider_event_id').notNull().unique(),
  paymentId: uuid('payment_id').references(() => payments.id),
  type: text('type').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  kind: notificationKind('kind').notNull(),
  toEmail: text('to_email').notNull(),
  language: text('language').notNull().default('de'),
  status: text('status').notNull().default('queued'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* Sammel-Export, damit Migrator/Seed alle Tabellen kennt. */
export const schema = {
  adminProfiles,
  auditLog,
  locations,
  teachers,
  styles,
  levelRungs,
  terms,
  courses,
  courseTeachers,
  tariffs,
  coursePrices,
  participants,
  bookings,
  payments,
  paymentEvents,
  notifications,
};
