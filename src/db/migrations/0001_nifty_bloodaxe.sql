ALTER TABLE "code_projects_table" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "code_projects_table" ADD CONSTRAINT "code_projects_table_slug_unique" UNIQUE("slug");