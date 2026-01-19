// A script to generate a new IndexedDB migration file
// Close dev server before running the script

import { readdirSync, writeFileSync } from "fs";

const MIGRATIONS_DIR = "src/db/client/migrations";
const migrationsCount = readdirSync(MIGRATIONS_DIR).length;

const name = process.argv[2] || `v${migrationsCount + 1}`;
const datetime = new Date().toISOString().replace(/[^\d]/g, "").slice(0, 14);

const template = `
import { migration } from "../utils";

export default migration({
    up: async (db, tsx, prevMigration, failedMigrations) => {

    },

    down: async (db, tsx, prevMigration, failedMigrations) => {

    },
});
`.trimStart();

writeFileSync(`${MIGRATIONS_DIR}/${datetime}_${name}.ts`, template);
