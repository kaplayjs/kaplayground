import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./src/db/migrations",
    schema: "./src/db/schemas.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
