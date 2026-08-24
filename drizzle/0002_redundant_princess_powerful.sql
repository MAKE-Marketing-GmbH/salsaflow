CREATE TYPE "public"."event_format" AS ENUM('danceflow', 'workshop', 'anniversary', 'floweekend', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"format" "event_format" DEFAULT 'other' NOT NULL,
	"title_de" text NOT NULL,
	"title_en" text NOT NULL,
	"summary_de" text NOT NULL,
	"summary_en" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"start_time" time,
	"end_time" time,
	"location" text DEFAULT 'Elisabethenanlage 7, 4051 Basel' NOT NULL,
	"ticket_url" text,
	"detail_url" text,
	"image_url" text,
	"image_alt_de" text,
	"image_alt_en" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "events_status_date_idx" ON "events" USING btree ("status","start_date");