import { eq } from "drizzle-orm";
import { db } from "./client";
import {
    codeProjectsTable,
    type InsertProject,
    type InsertUser,
    usersTable,
} from "./schemas";

export async function createUser(data: InsertUser) {
    await db.insert(usersTable).values(data);
}

export async function findUserByEmail(findEmail: string) {
    return await db.select().from(usersTable).where(({ email }) =>
        eq(email, findEmail)
    );
}

export async function findFirstUserByName(findName: string) {
    return (await db.select().from(usersTable).where(({ name }) =>
        eq(name, findName)
    ))[0];
}

export async function createProject(data: InsertProject) {
    await db.insert(codeProjectsTable).values(data);
}
