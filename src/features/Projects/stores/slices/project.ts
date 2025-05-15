import { toast } from "react-toastify";
import type { StateCreator } from "zustand";
import {
    defaultExampleFile,
    defaultProject,
} from "../../../../config/defaultProject";
import { demos, type Example } from "../../../../data/demos";
import { useConfig } from "../../../../hooks/useConfig";
import { useEditor } from "../../../../hooks/useEditor";
import { debug } from "../../../../util/logs";
import { preferredVersion } from "../../application/preferredVersion";
import type { Asset } from "../../models/Asset";
import type { File } from "../../models/File";
import type { Project } from "../../models/Project";
import type { ProjectMode } from "../../models/ProjectMode";
import { type ProjectStore } from "../useProject.ts";

export interface ProjectSlice {
    /**
     * Current project associated localStorage key
     */
    projectKey: string | null;
    /**
     * Set current project associated localStorage key
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
    getProjectMetadata: (id: string) => Example;
    createFromShared: (sharedCode: string, sharedVersion?: string) => void;
    setDefaultProjectFiles: (
        mode: ProjectMode,
        files: Map<string, File>,
        assets: Map<string, Asset>,
    ) => void;
    /**
     * Save current project in localStorage
     */
    saveProject: () => void;
    /**
     * Save current project as a new project in localStorage
     */
    saveNewProject(): void;
    /**
     * Load a project from localStorage
     *
     * @param id - Project id
     * @returns
     */
    loadProject: (id: string) => void;
    /**
     * Current project edited state
     */
    projectWasEdited: boolean;
    /**
     * Set current project edited state
     */
    setProjectWasEdited: (bool: boolean) => void;
    /**
     * Check if a project is saved in localStorage
     *
     * @param id - Project id
     * @returns If the project is saved
     */
    projectIsSaved(id: string): boolean;
    /**
     * Get all saved projects in localStorage
     *
     * @param filter - Filter for the projects
     */
    getSavedProjects: (filter?: ProjectMode) => string[];
    /**
     * Generate a new id for a project
     *
     * @param prefix - Prefix for the id
     */
    generateId(prefix: ProjectMode): string;
    /**
     * Generate a name from an id
     *
     * @param prefix - Prefix for the id
     */
    generateName(id: string, prefix: ProjectMode, isShared?: boolean): string;
    /**
     * Serialize the current project to a string
     *
     * @returns Serialized project
     */
    serializeProject(): string;
    /**
     * Unserialize a project from localStorage
     *
     * @param id - Project id
     */
    unserializeProject(id: string): Project;
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
        kaplayVersion: preferredVersion(),
        createdAt: "",
        updatedAt: "",
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
    projectIsSaved: (id: string) => {
        return get().getSavedProjects().includes(id);
    },
    getSavedProjects: (filter) => {
        const keys: string[] = [];

        for (let i = 0, len = localStorage.length; i < len; ++i) {
            const localKey = localStorage.key(i);
            if (!localKey) continue;

            if (filter) {
                if (localKey.startsWith(`${filter}-`)) {
                    keys.push(localKey);
                }
            } else {
                if (localKey.startsWith("pj-") || localKey.startsWith("ex-")) {
                    keys.push(localKey);
                }
            }
        }

        return keys;
    },
    getProjectMetadata(key) {
        const project = get().unserializeProject(key);
        const metadata = {
            key: key,
            name: project.name,
            formattedName: project.name,
            type: project.mode == "pj" ? "Projects" : "Examples",
            category: "KAPLAY",
            code: "",
            group: "",
            minVersion: "",
            sortName: project.name,
            locked: false,
            tags: [
                ...project.mode == "pj"
                    ? [{ name: "project", displayName: "Project" }]
                    : [{ name: "example", displayName: "Example" }],
            ],
            description: "",
            version: project.version,
            createdAt: project?.createdAt ?? "",
            updatedAt: project?.updatedAt ?? "",
        };

        return metadata satisfies Example;
    },
    setDefaultProjectFiles: (mode, files, assets) => {
        if (mode === "pj") {
            defaultProject.files.forEach((file) => {
                files.set(file.path, file);
            });
            defaultProject.resources.forEach((asset) => {
                assets.set(asset.path, asset);
            });
        } else {
            files.set("main.js", {
                kind: "main",
                language: "javascript",
                name: "main.js",
                path: "main.js",
                value: defaultExampleFile,
            });
        }
    },

    // #region Project Creation

    createNewProject(
        filter,
        replace,
        demoName,
        isShared,
    ) {
        const files = new Map<string, File>();
        const assets = new Map<string, Asset>();
        const lastVersion = get().project.kaplayVersion;
        const possibleId = get().generateId(filter);

        let version = preferredVersion();

        if (filter === "ex") {
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
                    name: "main.js",
                    path: "main.js",
                    value: foundDemo.code,
                });

                version = foundDemo.version;

                debug(1, "[project] Demo loaded", foundDemo.name);
            } else {
                // Create a new project with default files and assets for examples
                get().setDefaultProjectFiles("ex", files, assets);
                debug(1, "[project] New files for the new example project");
            }
        } else {
            // Create a new project with default files and assets
            get().setDefaultProjectFiles("pj", files, assets);
            debug(2, "Default files loaded");
        }

        if (lastVersion !== version) {
            toast(
                `KAPLAY version updated to ${version} for this ${
                    filter === "ex" ? "example" : "project"
                }. May take a few seconds to load.`,
            );
        }

        set(() => ({
            project: {
                name: get().generateName(possibleId, filter, isShared),
                version: "2.0.0", // fixed project version
                files: files,
                assets: assets,
                mode: filter,
                kaplayVersion: version,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        }));

        if (replace) {
            set({
                project: {
                    ...get().project,
                    ...replace,
                },
            });
        }

        if (demoName) {
            window.history.replaceState(
                {},
                "",
                `${window.location.origin}/?example=${demoName}`,
            );
        }

        // Editor update
        get().setProjectKey(null);
        get().setDemoKey(demoName ?? null);
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

    saveProject() {
        const id = get().projectKey;

        if (id) {
            debug(0, "[project] Saving changes...");
            localStorage.setItem(id, get().serializeProject());
            get().setProjectWasEdited(true);
        }
    },

    saveNewProject() {
        debug(0, "[project] Saving new project...");

        const id = get().generateId(get().project.mode);
        localStorage.setItem(id, get().serializeProject());

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
    },

    loadProject(id) {
        debug(0, "[project] Loading project", id);

        const project = get().unserializeProject(id);

        set({
            project: {
                ...project,
                files: new Map(project.files),
                assets: new Map(project.assets),
            },
        });

        get().setProjectKey(id);
        get().setDemoKey(null);
        get().setProjectWasEdited(false);

        window.history.replaceState(
            {},
            "",
            `${window.location.origin}/`,
        );

        // Editor stuff
        useConfig.getState().setConfig({
            lastOpenedProject: id,
        });
        useEditor.getState().updateAndRun();
    },

    generateId(prefix) {
        const countWithPrefix = get().getSavedProjects(prefix).length;
        const id = `${prefix}-${countWithPrefix + 1}`;

        return id;
    },

    generateName(id, prefix, isShared = false) {
        const formattedName = prefix == "ex" ? "Example" : "Project";
        const isSharedName = isShared ? "(Shared)" : "";
        return `${formattedName} #${
            id.replace(`${prefix}-`, "")
        } ${isSharedName}`;
    },

    serializeProject() {
        const project = get().project;

        return JSON.stringify({
            ...project,
            files: Array.from(project.files.entries()),
            assets: Array.from(project.assets.entries()),
        });
    },

    unserializeProject(id: string) {
        const projectSerialized = localStorage.getItem(id);

        if (!projectSerialized) {
            throw new Error(
                `Tried to load a project that doesn't exist: ${id}`,
            );
        }

        const savedProject = JSON.parse(projectSerialized);
        let project = null;

        if (savedProject.state?.project) {
            project = savedProject.state.project;
        } else {
            project = savedProject;
        }

        return {
            ...project,
            files: new Map(project.files),
            assets: new Map(project.assets),
        };
    },
    // #endregion
});
