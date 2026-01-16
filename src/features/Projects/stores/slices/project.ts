import { toast } from "react-toastify";
import type { StateCreator } from "zustand";
import { demos, type Example } from "../../../../data/demos";
import { db } from "../../../../db/client/db";
import { Schema } from "../../../../db/client/schema";
import { useConfig } from "../../../../hooks/useConfig";
import { useEditor } from "../../../../hooks/useEditor";
import { debug } from "../../../../util/logs";
import { uuidv7 } from "../../../../util/uuidv7";
import { createDefaultFiles } from "../../application/createDefaultFiles";
import { preferredVersion } from "../../application/preferredVersion";
import { validateProjectName } from "../../application/validateProjectName";
import type { Asset } from "../../models/Asset.ts";
import type { File } from "../../models/File";
import type { Project } from "../../models/Project";
import type { ProjectMode } from "../../models/ProjectMode";
import { type ProjectStore } from "../useProject.ts";

export interface ProjectSlice {
    /**
     * Current project associated idb key
     */
    projectKey: string | null;
    /**
     * Set current project associated idb key
     */
    setProjectKey: (key: string | null) => void;
    /**
     * Get current demo key
     */
    demoKey: string | null;
    /**
     * Set current demo key
     */
    setDemoKey: (key: string | null) => void;
    /**
     * Current project
     */
    project: Project;
    /**
     * Set current project
     *
     * @param project - Project to set
     */
    setProject(project: Partial<Project>): void;
    /**
     * Creates a new project inside KAPLAYGROUND
     *
     * @param mode - Project mode, example or project
     * @param replace - Optional project to replace in creation
     * @param demoName - Optional demo name to load as a demo
     */
    createNewProject(
        mode: ProjectMode,
        replace?: Partial<Project>,
        demoName?: string,
        isShared?: boolean,
    ): void;
    /**
     * Get project metadata compatible with example demos
     *
     * @param id - Project id
     * @returns Project <Example> object with metadata
     */
    getProjectMetadata(id: string): Promise<Example>;
    /**
     * Create and load new project from passed code
     *
     * @sharedCode string - example code
     * @sharedVersion string - kaplay lib version used
     */
    createFromShared(sharedCode: string, sharedVersion?: string): void;
    /**
     * Save project in idb, current if not specified
     *
     * @param id - Optional project id
     * @param project - Optional Project object
     */
    saveProject: (id?: string | null, project?: Project) => void;
    /**
     * Save current project as a new project in idb
     * @returns Newly created project id
     */
    saveNewProject(): string;
    /**
     * Current project edited state
     */
    projectWasEdited: boolean;
    /**
     * Set current project edited state
     *
     * @param bool - If the project was edited
     */
    setProjectWasEdited: (bool: boolean) => void;
    /**
     * Check if a project is saved in idb
     *
     * @param id - Project id
     * @returns If the project is saved
     */
    projectIsSaved(id: string): Promise<boolean>;
    /**
     * Array of saved project ids
     */
    savedProjects: string[];
    /**
     * Get all saved projects in idb
     *
     * @param filter - Optional filter for the projects
     * @returns Array of raw projects from idb
     */
    getSavedProjects(
        filter?: ProjectMode,
    ): Promise<Schema["projects"]["value"][]>;
    /**
    /**
     * Get all ids of saved projects in idb
     *
     * @param filter - Optional filter for the projects
     * @returns Array of saved project ids
     */
    getSavedProjectIds(filter?: ProjectMode): Promise<string[]>;
    /**
     * Refresh savedProjects from idb
     */
    updateSavedProjects(): void;
    /**
     * Get KAPLAY versions used in projects
     *
     * @returns Object of all versions and their cound used in projects
     */
    getProjectVersions(): Promise<Record<string, number>>;
    /**
     * Get KAPLAY minimal versions used in projects
     *
     * @returns Object of all minimal versions and their count used in projects
     */
    getProjectMinVersions(): Promise<Record<string, number>>;
    /**
     * Generate a new id for a project
     *
     * @param createdAt - Optional ISO string date used as the base timestamp
     * @returns Generated project uuidv7 id
     */
    generateId(createdAt?: string): string;
    /**
     * Generate a name based on project mode
     *
     * @param mode - Will be formatted and used as prefix
     * @param isShared - If not own project
     * @returns Generated project name
     */
    generateName(mode: ProjectMode, isShared?: boolean): Promise<string>;
    /**
     * Get project from idb
     *
     * @param id - Project id
     * @returns Project object
     */
    getProject(id: string): Promise<Project>;
    /**
     * Serialize project to a string, current if not specified
     *
     * @param project - Optional Project object
     * @returns Serialized project
     */
    serializeProject(project?: Project): string;
    /**
     * Unserialize a project from idb
     *
     * @param project - Serialized project
     * @returns Project object
     */
    unserializeProject(project: string): Project;
    /**
     * Clone any stored project, current if not specified
     *
     * @param id - Optional roject id
     * @returns If cloned project successfully
     */
    cloneProject(id?: string | null): Promise<boolean>;
    /**
     * Remove project from idb
     *
     * @param id - Project id
     * @returns If removed project successfully
     */
    removeProject(id: string): boolean;
}

export const createProjectSlice: StateCreator<
    ProjectStore,
    [],
    [],
    ProjectSlice
> = (set, get) => ({
    project: {
        name: "Untitled",
        version: "2.0.0",
        files: new Map(),
        assets: new Map(),
        mode: "pj",
        buildMode: "esbuild",
        kaplayVersion: "",
        createdAt: "",
        updatedAt: "",
        favicon: "",
    },
    projectKey: null,
    setProjectKey(key) {
        set(() => ({
            projectKey: key,
        }));
    },
    demoKey: null,
    setDemoKey(key) {
        set(() => ({
            demoKey: key,
        }));
    },
    setProject: (project) => {
        set(() => ({
            project: {
                ...get().project,
                ...project,
                updatedAt: new Date().toISOString(),
            },
        }));

        get().saveProject();
    },
    projectWasEdited: false,
    setProjectWasEdited(bool) {
        set(() => ({
            projectWasEdited: bool,
        }));
    },
    async projectIsSaved(id: string) {
        return (await get().getSavedProjectIds()).includes(id);
    },
    savedProjects: [],
    async getSavedProjects(filter) {
        return (await db.transaction("projects").store.index("mode").getAll(
            filter,
        ));
    },
    async getSavedProjectIds(filter) {
        return (await get().getSavedProjects(filter)).map(p => p.id);
    },
    async updateSavedProjects() {
        const savedProjects = await get().getSavedProjectIds();

        set(() => ({
            savedProjects,
        }));
    },
    async getProjectMetadata(key) {
        const project = key == get().projectKey
            ? get().project
            : await get().getProject(key);
        const metadata = {
            key: key,
            name: project.name,
            formattedName: project.name,
            type: project.mode == "pj" ? "Project" : "Example",
            category: "KAPLAY",
            code: "",
            group: project.mode == "pj" ? "Projects" : "Examples",
            minVersion: project.kaplayVersion.split(".").slice(0, 2).join("."),
            sortName: project.name,
            locked: true,
            tags: [
                ...project.mode == "pj"
                    ? [{ name: "project", displayName: "Project" }]
                    : [{ name: "example", displayName: "Example" }],
            ],
            description: "",
            version: project.kaplayVersion,
            createdAt: project?.createdAt ?? "",
            updatedAt: project?.updatedAt ?? "",
            buildMode: project.buildMode,
        };

        return metadata satisfies Example;
    },
    async getProjectVersions() {
        const projectVersions = (await get().getSavedProjects()).map(project =>
            project.kaplayVersion
        );

        return Object.fromEntries(
            [...new Set(projectVersions)]
                .sort((a, b) => b.localeCompare(a))
                .map(
                    version => [
                        version,
                        projectVersions.filter(v => v == version).length,
                    ],
                ),
        );
    },
    async getProjectMinVersions() {
        const projectMinVersions = (await get().getSavedProjects()).map(
            project => project.kaplayVersion.split(".").slice(0, 2).join("."),
        );

        return Object.fromEntries(
            [...new Set(projectMinVersions)]
                .sort((a, b) => b.localeCompare(a))
                .map(
                    version => [
                        version,
                        projectMinVersions.filter(v => v == version).length,
                    ],
                ),
        );
    },

    // #region Project Creation

    async createNewProject(
        mode,
        replace,
        demoName,
        isShared,
    ) {
        const files = new Map<string, File>();
        const assets = new Map<string, Asset>();
        const lastVersion = get().project.kaplayVersion;
        let loadDefaultFiles = false;

        let version = preferredVersion();

        if (mode === "ex") {
            if (demoName) {
                const foundDemo = demos.find((demo) => {
                    return demo.name == demoName;
                });

                if (foundDemo === undefined) {
                    debug(2, `[project] Demo with id ${demoName} not found`);
                    return;
                }

                files.set("main.js", {
                    kind: "main",
                    language: "javascript",
                    path: "main.js",
                    value: foundDemo.code,
                });

                version = foundDemo.version;

                debug(0, "[project] Demo loaded", foundDemo.name);
            } else {
                debug(0, "[project] Created a new example project");
                loadDefaultFiles = !replace?.files;
            }
        } else {
            debug(0, "[project] Created a new project");
            loadDefaultFiles = !replace?.files;
        }

        if (lastVersion !== version) {
            toast(
                `KAPLAY version updated to ${version} for this ${
                    mode === "ex" ? "example" : "project"
                }. May take a few seconds to load.`,
            );
        }

        set({
            project: {
                name: await get().generateName(mode, isShared),
                version: "2.0.0", // fixed project version
                files: files,
                assets: assets,
                mode: mode,
                buildMode: "esbuild",
                kaplayVersion: version,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                favicon: "",
                ...replace,
            },
        });

        if (demoName) {
            window.history.replaceState(
                {},
                "",
                `${window.location.origin}/?example=${demoName}`,
            );
        }

        get().setProjectKey(null);
        get().setDemoKey(demoName ?? null);

        if (loadDefaultFiles) {
            createDefaultFiles();
        }

        if (mode === "pj") useEditor.getState().resetEditorModel();
        useEditor.getState().setCurrentFile("main.js");
        useEditor.getState().updateAndRun();
    },

    createFromShared(sharedCode, sharedVersion) {
        get().createNewProject(
            "ex",
            {
                assets: new Map(),
                files: new Map([
                    [
                        "main.js",
                        {
                            kind: "main",
                            language: "javascript",
                            name: "main.js",
                            path: "main.js",
                            value: sharedCode,
                        },
                    ],
                ]),
                kaplayVersion: sharedVersion ?? preferredVersion(),
            },
            undefined,
            true,
        );
    },

    // #endregion

    // #region Project saving

    saveProject(id = get().projectKey, project) {
        if (!id) return;

        debug(0, "[project] Saving changes...");

        if (id !== get().projectKey && project) {
            db.put("projects", {
                ...project,
                updatedAt: new Date().toISOString(),
                id,
            });
            set({ savedProjects: [...get().savedProjects] });
        } else {
            db.put("projects", { ...get().project, id });
            get().setProjectWasEdited(true);
        }
    },

    saveNewProject() {
        debug(0, "[project] Saving new project...");

        const id = get().generateId(get().project.createdAt);
        db.put("projects", { ...get().project, id });

        get().setProjectKey(id);
        get().setDemoKey(null);
        window.history.replaceState(
            {},
            "",
            `${window.location.origin}/`,
        );

        // Update other stores
        useConfig.getState().setConfig({
            lastOpenedProject: id,
        });

        useEditor.getState().updateEditorLastSavedValue();
        useEditor.getState().updateHasUnsavedChanges();

        set(() => ({
            savedProjects: [...get().savedProjects, id],
        }));

        return id;
    },

    generateId(createdAt) {
        return uuidv7(
            createdAt
                ? {
                    msecs: Date.parse(createdAt),
                }
                : {},
        );
    },

    async generateName(mode, isShared = false) {
        const modePrefix = mode == "ex" ? "Example" : "Project";
        const isSharedSufix = isShared ? " (Shared)" : "";
        const projects = await db.transaction("projects").store.index("mode")
            .getAll(mode);

        const name = (num: number) => `${modePrefix} #${num}`;
        const nameIsTaken = (num: number) =>
            projects.some(project =>
                [name(num), name(num) + isSharedSufix].includes(
                    project.name.trim(),
                )
            );

        let num = projects.length + 1;
        while (nameIsTaken(num)) num++;

        return name(num) + isSharedSufix;
    },

    async getProject(id: string) {
        const project = await db.get("projects", id);

        if (!project) {
            throw new Error(
                `Tried to load a project that doesn't exist: ${id}`,
            );
        }

        return project;
    },

    serializeProject(project = get().project) {
        return JSON.stringify({
            ...project,
            files: Array.from(project.files.entries()),
            assets: Array.from(project.assets.entries()),
        });
    },

    unserializeProject(project) {
        const unserialized = JSON.parse(project);

        const parsedProject =
            (unserialized?.state ? unserialized.state.project : unserialized) as
                & Omit<Project, "files" | "assets">
                & {
                    assets: [string, Asset][];
                    files: [string, File][];
                };

        return {
            ...parsedProject,
            kaplayVersion: parsedProject.kaplayVersion == "none"
                ? "master"
                : parsedProject.kaplayVersion,
            buildMode: parsedProject.buildMode || "legacy",
            files: new Map<string, File>(parsedProject.files),
            assets: new Map<string, Asset>(parsedProject.assets),
        };
    },

    async cloneProject(id = get().projectKey) {
        if (!id) return false;

        const project = id == get().projectKey
            ? get().project
            : await get().getProject(id);

        const newId = get().generateId();

        const suffixedName = (name: string): string => {
            const suffix = name.match(/\s*\(copy(?:\s+(\d+))?\)$/);
            if (suffix) {
                const version = parseInt(suffix[1] || "1", 10);
                return name.replace(
                    /\s*\(copy(?:\s+\d+)?\)$/,
                    ` (copy ${version + 1})`,
                );
            }
            return `${name} (copy)`;
        };

        let newName = suffixedName(project.name);

        while (!(await validateProjectName(newName, id))[0]) {
            newName = suffixedName(newName);
        }

        await db.put("projects", {
            ...project,
            name: newName,
            createdAt: new Date().toISOString(),
            id: newId,
        });

        set(() => ({
            savedProjects: [...get().savedProjects, newId],
        }));

        return true;
    },
    // #endregion

    removeProject(id) {
        if (!get().savedProjects.includes(id)) return false;

        db.delete("projects", id);

        set(() => ({
            savedProjects: get().savedProjects.filter(pid => pid != id),
        }));

        if (get().projectKey === id) {
            set(() => ({ projectKey: null, demoKey: null }));
        }

        if (useConfig.getState().config?.lastOpenedProject === id) {
            useConfig.getState().setConfig({ lastOpenedProject: null });
        }

        return true;
    },
});
