import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
    id: serial("id").primaryKey(),
    authId: text("auth_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
});

export const codeProjectsTable = pgTable("code_projects_table", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertProject = typeof codeProjectsTable.$inferInsert;
export type SelectProject = typeof codeProjectsTable.$inferSelect;
