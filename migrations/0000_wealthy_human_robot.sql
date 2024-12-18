CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"label" text,
	"email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"first_name" text,
	"last_name" text,
	"phone" varchar(256),
	"email" text
);
