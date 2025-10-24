import { toast } from "react-toastify";
import type { StateCreator } from "zustand";
import { demos, type Example } from "../../../../data/demos";
import { useConfig } from "../../../../hooks/useConfig";
import { useEditor } from "../../../../hooks/useEditor";
import { debug } from "../../../../util/logs";
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
    /**
     * Save project in localStorage, current if not specified
     *
     * @param id - Optional project id
     * @param project - Optional Project object
     */
    saveProject: (id?: string | null, project?: Project) => void;
    /**
     * Save current project as a new project in localStorage
     */
    saveNewProject(): void;
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
     * Check if a project is saved in localStorage
     *
     * @param id - Project id
     * @returns If the project is saved
     */
    projectIsSaved(id: string): boolean;
    /**
     * Array of saved project ids
     */
    savedProjects: string[];
    /**
     * Get all saved projects in localStorage
     *
     * @param filter - Optional filter for the projects
     * @returns Array of saved project ids
     */
    getSavedProjects: (filter?: ProjectMode) => string[];
    /**
     * Refresh savedProjects from localStorage
     */
    updateSavedProjects(): void;
    /**
     * Get KAPLAY versions used in projects
     *
     * @returns Object of all versions and their cound used in projects
     */
    getProjectVersions: () => Record<string, number>;
    /**
     * Get KAPLAY minimal versions used in projects
     *
     * @returns Object of all minimal versions and their count used in projects
     */
    getProjectMinVersions: () => Record<string, number>;
    /**
     * Generate a new id for a project
     *
     * @param prefix - Prefix for the id
     * @returns Generated project id
     */
    generateId(prefix: ProjectMode): string;
    /**
     * Generate a name from an id
     *
     * @param id - Project id
     * @param prefix - Prefix for the id
     * @param isShared - If not own project
     * @returns Generated project name
     */
    generateName(id: string, prefix: ProjectMode, isShared?: boolean): string;
    /**
     * Serialize project to a string, current if not specified
     *
     * @param project - Optional Project object
     * @returns Serialized project
     */
    serializeProject(project?: Project): string;
    /**
     * Unserialize a project from localStorage
     *
     * @param id - Project id
     * @returns Project object
     */
    unserializeProject(id: string): Project;
    /**
     * Remove project from localStorage, current if not specified
     *
     * @param id - Optional roject id
     * @returns If cloned project successfully
     */
    cloneProject(id?: string | null): boolean;
    /**
     * Remove project from localStorage
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
    projectIsSaved: (id: string) => {
        return get().getSavedProjects().includes(id);
    },
    savedProjects: [],
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
    updateSavedProjects() {
        set(() => ({
            savedProjects: get().getSavedProjects(),
        }));
    },
    getProjectMetadata(key) {
        const project = key == get().projectKey
            ? get().project
            : get().unserializeProject(key);
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
    getProjectVersions() {
        const projectVersions = get().getSavedProjects().map(project =>
            get().getProjectMetadata(project).version
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
    getProjectMinVersions() {
        const projectMinVersions = get().getSavedProjects().map(project =>
            get().getProjectMetadata(project).minVersion
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

    createNewProject(
        mode,
        replace,
        demoName,
        isShared,
    ) {
        const files = new Map<string, File>();
        const assets = new Map<string, Asset>();
        const lastVersion = get().project.kaplayVersion;
        const possibleId = get().generateId(mode);
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
                name: get().generateName(possibleId, mode, isShared),
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
            localStorage.setItem(
                id,
                get().serializeProject({
                    ...project,
                    updatedAt: new Date().toISOString(),
                }),
            );
            set({ savedProjects: [...get().savedProjects] });
        } else {
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

        useEditor.getState().updateEditorLastSavedValue();
        useEditor.getState().updateHasUnsavedChanges();

        set(() => ({
            savedProjects: [...get().savedProjects, id],
        }));
    },

    generateId(prefix) {
        const countWithPrefix = get().getSavedProjects(prefix).length;
        const id = `${prefix}-${countWithPrefix + 1}`;

        return id;
    },

    generateName(id, prefix, isShared = false) {
        const formattedName = prefix == "ex" ? "Example" : "Project";
        const isSharedName = isShared ? " (Shared)" : "";
        return `${formattedName} #${
            id.replace(`${prefix}-`, "")
        }${isSharedName}`;
    },

    serializeProject(project = get().project) {
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

    cloneProject(id = get().projectKey) {
        if (!id) return false;

        const project = id == get().projectKey
            ? get().project
            : get().unserializeProject(id);

        const newId = get().generateId(project.mode);

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

        while (!validateProjectName(newName, id)[0]) {
            newName = suffixedName(newName);
        }

        localStorage.setItem(
            newId,
            get().serializeProject({
                ...project,
                name: newName,
                createdAt: new Date().toISOString(),
            }),
        );

        set(() => ({
            savedProjects: [...get().savedProjects, newId],
        }));

        return true;
    },
    // #endregion

    removeProject(id) {
        if (localStorage.getItem(id) == null) return false;

        localStorage.removeItem(id);

        if (!get().savedProjects.includes(id)) return true;

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
