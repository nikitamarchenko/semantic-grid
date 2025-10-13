CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "dashboard_items" ALTER COLUMN "item_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."dashboard_item_type";--> statement-breakpoint
CREATE TYPE "public"."dashboard_item_type" AS ENUM('chart', 'table');--> statement-breakpoint
ALTER TABLE "dashboard_items" ALTER COLUMN "item_type" SET DATA TYPE "public"."dashboard_item_type" USING "item_type"::"public"."dashboard_item_type";--> statement-breakpoint
ALTER TABLE "dashboards" ADD COLUMN "owner_user_id" uuid DEFAULT null;--> statement-breakpoint
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;