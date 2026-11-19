CREATE TYPE "public"."addon_type" AS ENUM('extra_person', 'extra_kid', 'extra_pet', 'extra_print', 'raw_soft_copies', 'advance_edit', 'usb', 'other');--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'gotyme' BEFORE 'bank_transfer';--> statement-breakpoint
CREATE TABLE "reservation_addons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_id" uuid NOT NULL,
	"addon_type" "addon_type" NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "guest_email" text;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "total_pax" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "kids_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "pets_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "backdrop_choice" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "base_pax" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "max_pax" integer DEFAULT 8 NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_prints" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_soft_copies" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_addons" ADD CONSTRAINT "reservation_addons_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;