import {
    deleteDB as deleteIDB,
    type IDBPDatabase,
    type IDBPTransaction,
    openDB,
    type StoreNames,
} from "idb";
import { confirm } from "../../util/confirm";
import { confirmNavigate } from "../../util/confirmNavigate";
import { debug } from "../../util/logs";
import { Schema } from "./schema";

export type DB = IDBPDatabase<Schema>;

export interface MigrationObj {
    up: MigrationFn;
    down: MigrationFn;
}

export interface Migration extends MigrationObj {
    name: string;
}

export type MigrationFn = (
    db: IDBPDatabase<Partial<Schema>>,
    transaction: IDBPTransaction<Schema, StoreNames<Schema>[], "versionchange">,
    prevMigration: MigrationObj,
    failedMigrations: ReturnType<typeof getFailedMigrations>,
) => Promise<void>;

const migrations: Migration[] = parseMigrations(
    import.meta.glob<MigrationObj>("./migrations/*.ts", {
        import: "default",
        eager: true,
    }),
);

export const VERSION = Object.keys(migrations).length || 1;
const VERSION_TARGET = parseInt(localStorage.getItem("kadb-v-target") ?? "0");

// IndexedDB will open in VERSION * 10 format, VERSION % 10 is reserved for migration rerun attempt or debugging
const VERSION_CURRENT = getCurrentVersion();
const VERSION_ATTEMPT =
    (VERSION_CURRENT < VERSION * 10 && VERSION == VERSION_TARGET) ? 1 : 0;
const VERSION_OPENED = VERSION > VERSION_TARGET
    ? VERSION * 10
    : Math.min(
        VERSION * 10 + VERSION_CURRENT % 10 + VERSION_ATTEMPT,
        VERSION * 10 + 9,
    );

export let db: DB;

export async function connectDB(): Promise<{
    db: DB;
    error: Error | null;
    failedMigrations: ReturnType<typeof getFailedMigrations>;
}> {
    let error: Error | null = null;

    const dbPromise = openDB<Schema>("kadb", VERSION_OPENED, {
        async upgrade(db, oldVersion, newVersion, transaction) {
            localStorage.setItem("kadb-v-target", `${VERSION}`);

            const isAttempt = (newVersion ?? 0) % 10 > 0;
            let curMigrationVerIdx = (oldVersion - oldVersion % 10) / 10;

            const err = await attemptFailedMigrations(
                db as IDBPDatabase<Partial<Schema>>,
                transaction,
            );
            if (err) {
                debug(0, err.message);
                if (isAttempt) error = err;
            }

            for (
                curMigrationVerIdx;
                curMigrationVerIdx < VERSION;
                curMigrationVerIdx++
            ) {
                const migration = migrations?.[curMigrationVerIdx];

                if (!migration || !migration.up) {
                    error = new Error(
                        `[DB] Migration error: ${
                            migration
                                ? migration.name
                                : "v" + curMigrationVerIdx
                        } migration function does not exist`,
                    );
                    break;
                }

                debug(
                    0,
                    `[DB] Running migration (${
                        curMigrationVerIdx + 1
                    }/${VERSION}):`,
                    migration.name,
                );

                try {
                    await migration.up(
                        db as IDBPDatabase<Partial<Schema>>,
                        transaction,
                        migrations[Math.max(curMigrationVerIdx - 1, 0)],
                        getFailedMigrations(),
                    );
                } catch (err) {
                    debug(0, `[DB] Migration failed`);
                    error = err as Error;
                    break;
                }

                error = null;
                setMigrationSuccessful(migration.name);
            }

            if (error && !isAttempt) {
                if (curMigrationVerIdx == 0) {
                    deleteDB();
                } else {
                    const version = `${(curMigrationVerIdx * 10)}`;
                    localStorage.setItem("kadb-v", version);
                    debug(0, `[DB] Connected version ${version}`);
                }

                await confirm(
                    "Database migration failed!",
                    <div>
                        <p>
                            Please, reload the page to try again. If the issue
                            persists, contact us on{" "}
                            <a
                                href="https://discord.com/invite/aQ6RuQm3TF"
                                target="_blank"
                                className="font-semibold text-indigo-400"
                            >
                                Discord
                            </a>.
                        </p>
                        <code className="block mt-4 -mx-3 -mb-3 px-3 py-2 bg-base-300 text-xs rounded-md">
                            {error.message}
                            <br />
                            {migrations[curMigrationVerIdx].name}
                            <br />
                            Current v{curMigrationVerIdx}, Target v{VERSION}
                        </code>
                    </div>,
                    {
                        type: "neutral",
                        confirmText: "Reload",
                    },
                );

                return location.reload();
            }

            if (error && isAttempt) return;

            debug(0, `[DB] Connected version ${VERSION}`);
            localStorage.setItem(
                "kadb-v",
                (Math.max(VERSION * 10, newVersion ?? 0)).toString(),
            );
            localStorage.setItem("kadb-v-target", `${VERSION}`);
        },

        async blocking() {
            debug(
                0,
                "[DB] Blocking: DB should close to allow new version DB connection",
            );

            await confirm(
                "There is a new version update in progress!",
                "Please, close this window to complete update in the main window or reload if this is your only window.",
                {
                    type: "neutral",
                    confirmText: "Reload",
                },
            );

            confirmNavigate(async () => {
                db?.close();
                location.reload();
            });
        },

        async blocked() {
            debug(
                0,
                "[DB] Blocked: Other DB connections should close to allow new version connection",
            );

            if (
                await confirm(
                    "There is a new version available!",
                    "Please, close other KAPLAYGROUND tabs first and reload the page.",
                    {
                        type: "neutral",
                        confirmText: "Reload",
                    },
                )
            ) location.reload();
        },

        async terminated() {
            debug(0, "[DB] Connection was terminated");

            if (
                await confirm(
                    "Oops, connection to the database was closed!",
                    "Please, try to reconnect or reload the page.",
                    {
                        type: "warning",
                        confirmText: "Reload",
                        dismissText: "Reconnect",
                    },
                )
            ) {
                location.reload();
            } else {
                await connectDB();
            }
        },
    });

    try {
        db = await dbPromise;
    } catch (err) {
        if (!error) {
            error = err as Error;

            await confirm(
                "Connection to the database failed!",
                <>
                    Please, reload the page to try again. If the issue persists,
                    contact us on{" "}
                    <a
                        href="https://discord.com/invite/aQ6RuQm3TF"
                        target="_blank"
                        className="font-semibold text-indigo-400"
                    >
                        Discord
                    </a>.
                </>,
                {
                    type: "neutral",
                    confirmText: "Reload",
                },
            );

            location.reload();
        }
    }

    const failedMigrations = getFailedMigrations();

    if (failedMigrations.length) {
        confirm(
            "Attempt to migrate database failed!",
            <div>
                <p>
                    Please, contact us on{" "}
                    <a
                        href="https://discord.com/invite/aQ6RuQm3TF"
                        target="_blank"
                        className="font-semibold text-indigo-400"
                    >
                        Discord
                    </a>. We recommend exporting your projects as a backup, just
                    in case. The functionality of the app might be limited until
                    the problem is resolved.
                </p>
                <code className="block mt-4 -mx-1 px-3 py-2 bg-base-300 text-xs rounded-md">
                    {error && (
                        <>
                            {error.message}
                            <br />
                        </>
                    )}
                    {failedMigrations.map(m => (
                        <>
                            {m.name}
                            <br />
                        </>
                    ))}
                    Current v{getMigrationVersion(failedMigrations[0].name)
                        - 1}, Target v{VERSION}
                </code>
            </div>,
            {
                type: "warning",
                confirmText: "Contact us on Discord",
                dismissText: "Dismiss",
            },
        ).then(bool =>
            bool
            && window.open("https://discord.com/invite/aQ6RuQm3TF", "_blank")
        );
    }

    return { db, error, failedMigrations: failedMigrations };
}

function parseMigrations(glob: Record<string, MigrationObj>): Migration[] {
    return Object.entries(glob).map(([path, migration]) => ({
        name: path.split("/")?.pop()?.split(".")[0] ?? "",
        ...migration,
    }));
}

export function getFailedMigrations() {
    if (VERSION_CURRENT == 0) return [];
    const completed = JSON.parse(
        localStorage.getItem("kadb-migrations") || "[]",
    );
    return migrations.filter(m => !completed.includes(m.name));
}

async function attemptFailedMigrations(
    db: IDBPDatabase<Partial<Schema>>,
    transaction: IDBPTransaction<Schema, StoreNames<Schema>[], "versionchange">,
): Promise<void | Error> {
    const failedMigrations = getFailedMigrations();

    for (const [i, migration] of failedMigrations.entries()) {
        debug(
            0,
            `[DB] Attempt to rerun migration (${
                i + 1
            }/${failedMigrations.length}):`,
            migration.name,
        );

        try {
            await migration.up(
                db,
                transaction,
                failedMigrations[getMigrationVersion(migration.name) - 2],
                failedMigrations,
            );
        } catch (err) {
            return err as Error;
        }

        debug(0, `[DB] Attempt successful`, migration.name);

        setMigrationSuccessful(migration.name);
        localStorage.setItem(
            "kadb-v",
            `${getMigrationVersion(migration.name) * 10}`,
        );
    }
}

export function getMigrationVersion(name: string) {
    return migrations.findIndex(m => m.name == name) + 1;
}

export function setMigrationSuccessful(name: string) {
    if (!migrations.find(m => m.name == name)) {
        throw Error(`Migration '${name}' not found!`);
    }

    localStorage.setItem(
        "kadb-migrations",
        JSON.stringify(
            Array.from(
                new Set(
                    [
                        ...JSON.parse(
                            localStorage.getItem("kadb-migrations") ?? "[]",
                        ),
                        name,
                    ].sort(),
                ),
            ),
        ),
    );
}

export function getCurrentVersion() {
    return parseInt(localStorage.getItem("kadb-v") ?? "0");
}

export async function deleteDB() {
    db.close();
    await deleteIDB("kadb");
    Object.keys(localStorage).forEach(key =>
        key?.startsWith("kadb") && localStorage.removeItem(key)
    );
}
