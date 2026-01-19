import { validate } from "uuid";
import { type Project } from "../../../features/Projects/models/Project";
import { debug } from "../../../util/logs";
import { uuidv7 } from "../../../util/uuidv7";
import { type Schema } from "../schema";
import { migration } from "../utils";

const PJS_BACKUP_KEY = "pjs-backup";

export default migration({
    up: async (db) => {
        const store = db.createObjectStore("projects", { keyPath: "id" });

        store.createIndex("mode", "mode", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });

        const config = JSON.parse(localStorage.getItem("config") || "{}");

        let pjsCount = 0;
        let pjsToBackup: Record<string, object> = {};

        for (let i = 0, len = localStorage.length; i < len; ++i) {
            const lsKey = localStorage.key(i);
            if (
                !lsKey || (!lsKey.startsWith("pj-") && !lsKey.startsWith("ex-"))
            ) continue;

            const lsVal = localStorage.getItem(lsKey);
            if (!lsVal) continue;

            const rawProject = JSON.parse(lsVal);
            const project = rawProject?.state
                ? rawProject.state.project
                : rawProject;
            project.createdAt ??= project?.updatedAt
                ?? new Date().toISOString();

            const parsedProject = {
                ...project,
                files: new Map(project.files),
                assets: new Map(project.assets),
                buildMode: project.buildMode || "legacy",
                favicon: project.favicon ?? "",
                id: uuidv7({
                    msecs: Date.parse(project.createdAt),
                }),
            } as unknown as Schema["projects"]["value"];

            pjsCount++;

            const key = await store.add(parsedProject);
            if (!key) {
                debug(0, `[DB] Adding project ${lsKey} to DB failed!`);
                continue;
            }

            pjsToBackup[lsKey] = project;

            if (config?.lastOpenedProject == lsKey) {
                localStorage.setItem(
                    "config",
                    JSON.stringify({
                        ...config,
                        lastOpenedProject: parsedProject.id,
                    }),
                );
            }
        }

        const pjsBackupKeys = Object.keys(pjsToBackup);
        const migrationResult = `${pjsBackupKeys.length}/${pjsCount}`;

        if (pjsBackupKeys.length > 0) {
            pjsBackupKeys.forEach(key => localStorage.removeItem(key));
            localStorage.setItem(PJS_BACKUP_KEY, JSON.stringify(pjsToBackup));
            localStorage.setItem("pjs-migrated", migrationResult);
            localStorage.setItem("pjs-migrated-at", new Date().toISOString());
        }

        debug(0, `[DB] Migrated ${migrationResult} projects.`);
    },

    down: async (db) => {
        const projects = await db.getAll(
            "projects",
        ) as unknown as Schema["projects"]["value"][];
        const lsBackup = JSON.parse(
            localStorage.getItem(PJS_BACKUP_KEY) || "{}",
        ) as unknown as Record<string, Project>;

        if (projects) {
            projects.forEach((project, i) =>
                localStorage.setItem(
                    `${project.mode}-${i}`,
                    JSON.stringify({
                        ...project,
                        files: Array.from(project.files.entries()),
                        assets: Array.from(project.assets.entries()),
                    }),
                )
            );
        } else if (lsBackup) {
            Object.entries(lsBackup).forEach(([key, project]) =>
                localStorage.setItem(key, JSON.stringify(project))
            );
        }

        localStorage.removeItem(PJS_BACKUP_KEY);
        localStorage.removeItem("pjs-migrated-at");

        const config = JSON.parse(localStorage.getItem("config") || "{}");
        if (validate(config?.lastOpenedProject)) {
            const currentProjectIdx = projects.findIndex(project =>
                project.id == config.lastOpenedProject
            );

            localStorage.setItem(
                "config",
                JSON.stringify({
                    ...config,
                    lastOpenedProject: `${
                        projects[currentProjectIdx].mode
                    }-${currentProjectIdx}`,
                }),
            );
        }

        db.deleteObjectStore("projects");
    },
});
