CREATE TYPE "public"."admin_role" AS ENUM('owner', 'admin', 'teacher_readonly');--> statement-breakpoint
CREATE TYPE "public"."booking_mode" AS ENUM('solo', 'couple');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending_payment', 'waitlisted', 'confirmed', 'cancelled', 'expired', 'refunded', 'completed');--> statement-breakpoint
CREATE TYPE "public"."booking_type" AS ENUM('leader_follower', 'open');--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('draft', 'open', 'full', 'cancelled', 'finished');--> statement-breakpoint
CREATE TYPE "public"."dance_role" AS ENUM('leader', 'follower');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('m', 'w', 'd', 'none');--> statement-breakpoint
CREATE TYPE "public"."level_category" AS ENUM('beginner', 'intermediate', 'advanced', 'open', 'heels');--> statement-breakpoint
CREATE TYPE "public"."notification_kind" AS ENUM('booking_confirmation', 'waitlist_promoted', 'payment_failed', 'cancellation', 'refund');--> statement-breakpoint
CREATE TYPE "public"."on_variant" AS ENUM('on1', 'on2');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('twint', 'card', 'apple_pay', 'google_pay', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('created', 'pending', 'succeeded', 'failed', 'expired', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."term_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."weekday" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "admin_role" DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"role" "dance_role",
	"mode" "booking_mode" DEFAULT 'solo' NOT NULL,
	"partner_participant_id" uuid,
	"partner_role" "dance_role",
	"needs_aushilfe" boolean DEFAULT false NOT NULL,
	"tariff_id" uuid NOT NULL,
	"amount_chf" numeric(8, 2) NOT NULL,
	"status" "booking_status" DEFAULT 'pending_payment' NOT NULL,
	"waitlist_position" integer,
	"language" text DEFAULT 'de' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"payment_deadline" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "course_prices" (
	"course_id" uuid NOT NULL,
	"tariff_id" uuid NOT NULL,
	"amount_chf" numeric(8, 2) NOT NULL,
	CONSTRAINT "course_prices_course_id_tariff_id_pk" PRIMARY KEY("course_id","tariff_id")
);
--> statement-breakpoint
CREATE TABLE "course_teachers" (
	"course_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	CONSTRAINT "course_teachers_course_id_teacher_id_pk" PRIMARY KEY("course_id","teacher_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"style_id" uuid NOT NULL,
	"level_rung_id" uuid,
	"on_variant" "on_variant",
	"weekday" "weekday" NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"location_id" uuid NOT NULL,
	"booking_type" "booking_type" DEFAULT 'leader_follower' NOT NULL,
	"capacity_total" integer DEFAULT 24 NOT NULL,
	"capacity_leader" integer,
	"capacity_follower" integer,
	"allows_late_entry" boolean DEFAULT true NOT NULL,
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"created_from_course_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_rungs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ladder_key" text NOT NULL,
	"ordinal" integer NOT NULL,
	"category" "level_category" NOT NULL,
	"stufe" integer,
	"is_flow" boolean DEFAULT false NOT NULL,
	"is_open_ended" boolean DEFAULT false NOT NULL,
	"label_de" text NOT NULL,
	"label_en" text NOT NULL,
	CONSTRAINT "level_rungs_ladder_ordinal_uq" UNIQUE("ladder_key","ordinal")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text DEFAULT 'Elisabethenanlage 7, 4051 Basel' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"kind" "notification_kind" NOT NULL,
	"to_email" text NOT NULL,
	"language" text DEFAULT 'de' NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"gender" "gender" DEFAULT 'none' NOT NULL,
	"default_tariff_id" uuid,
	"source" text,
	"marketing_optin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_event_id" text NOT NULL,
	"payment_id" uuid,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	CONSTRAINT "payment_events_provider_event_id_unique" UNIQUE("provider_event_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider" "payment_provider" DEFAULT 'stripe' NOT NULL,
	"checkout_session_id" text,
	"payment_intent_id" text,
	"amount_chf" numeric(8, 2) NOT NULL,
	"currency" char(3) DEFAULT 'CHF' NOT NULL,
	"method" "payment_method",
	"status" "payment_status" DEFAULT 'created' NOT NULL,
	"refund_amount_chf" numeric(8, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	CONSTRAINT "payments_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name_de" text NOT NULL,
	"name_en" text NOT NULL,
	"ladder_key" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "styles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "tariffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name_de" text NOT NULL,
	"name_en" text NOT NULL,
	"seats" integer DEFAULT 1 NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "tariffs_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"role" text,
	"bio_de" text,
	"bio_en" text,
	"photo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"week_count" integer DEFAULT 8 NOT NULL,
	"is_summer" boolean DEFAULT false NOT NULL,
	"status" "term_status" DEFAULT 'draft' NOT NULL,
	"duplicated_from" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_admin_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_partner_participant_id_participants_id_fk" FOREIGN KEY ("partner_participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tariff_id_tariffs_id_fk" FOREIGN KEY ("tariff_id") REFERENCES "public"."tariffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_prices" ADD CONSTRAINT "course_prices_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_prices" ADD CONSTRAINT "course_prices_tariff_id_tariffs_id_fk" FOREIGN KEY ("tariff_id") REFERENCES "public"."tariffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_level_rung_id_level_rungs_id_fk" FOREIGN KEY ("level_rung_id") REFERENCES "public"."level_rungs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_from_course_id_courses_id_fk" FOREIGN KEY ("created_from_course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_default_tariff_id_tariffs_id_fk" FOREIGN KEY ("default_tariff_id") REFERENCES "public"."tariffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_duplicated_from_terms_id_fk" FOREIGN KEY ("duplicated_from") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_course_status_role_idx" ON "bookings" USING btree ("course_id","status","role");