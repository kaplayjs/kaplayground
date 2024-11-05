import type { KAPLAYOpt } from "kaplay";
import { toast } from "react-toastify";
import type { StateCreator } from "zustand";
import { DEFAULT_KAPLAY_VERSION } from "../config/common";
import { defaultExampleFile, defaultProject } from "../config/defaultProject";
import { examples } from "../data/examples";
import { useConfig } from "../hooks/useConfig";
import { useEditor } from "../hooks/useEditor";
import { useProject } from "../hooks/useProject";
import { debug } from "../util/logs";
import type { Asset, AssetsSlice } from "./storage/assets";
import type { File, FilesSlice } from "./storage/files";

export type ProjectMode = "ex" | "pj";

export type Project = {
    name: string;
    version: string;
    assets: Map<string, Asset>;
    files: Map<string, File>;
    kaplayConfig: KAPLAYOpt;
    kaplayVersion: string;
    mode: ProjectMode;
    id: string;
    isDefault?: boolean;
};

export interface ProjectSlice {
    project: Project;
    getProject(): Project;
    setProject(project: Partial<Project>): void;
    createNewProject: (mode: ProjectMode, example?: string) => void;
    createNewProjectFromDemo: (demo: string) => void;
    projectIsSaved: (id: string, mode: ProjectMode) => boolean;
    getSavedProjects: (filter?: ProjectMode) => string[];
    saveProject: (newProjectId: string, oldProjectId: string) => void;
    loadProject: (projectId: string, replaceProject?: Project) => void;
    loadSharedDemo: (sharedCode: string) => void;
    setDefaultProjectFiles: (
        mode: ProjectMode,
        files: Map<string, File>,
        assets: Map<string, Asset>,
    ) => void;
}

export const createProjectSlice: StateCreator<
    FilesSlice & ProjectSlice & AssetsSlice,
    [],
    [],
    ProjectSlice
> = (set, get) => ({
    project: {
        name: "Untitled",
        version: "2.0.0",
        files: new Map(),
        assets: new Map(),
        kaplayConfig: {},
        mode: "pj",
        kaplayVersion: DEFAULT_KAPLAY_VERSION,
        id: `upj-Untitled`,
    },
    getProject: () => {
        return get().project;
    },
    setProject: (project) => {
        set(() => ({
            project: {
                ...get().project,
                ...project,
            },
        }));
    },
    createNewProject: (filter: ProjectMode, demo?: string) => {
        const files = new Map<string, File>();
        const assets = new Map<string, Asset>();
        const lastVersion = get().project.kaplayVersion;

        let version = DEFAULT_KAPLAY_VERSION;
        let id = `u${filter}-Untitled`;

        if (filter === "pj") {
            // Create a new project with default files and assets
            get().setDefaultProjectFiles("pj", files, assets);
            debug(2, "Default files loaded");
        } else if (demo) {
            // Load a demo
            const foundDemo = examples.filter(example =>
                example.index === demo || example.name === demo
            )[0];

            if (!foundDemo) {
                debug(2, "Demo not found", demo);
                return;
            }

            files.set("main.js", {
                kind: "main",
                language: "javascript",
                name: "main.js",
                path: "main.js",
                value: foundDemo.code,
            });

            id = foundDemo.name;
            version = foundDemo.version;

            debug(0, "Demo loaded", foundDemo.name);
        } else {
            // Create a new project with default files and assets for examples
            get().setDefaultProjectFiles("ex", files, assets);
            debug(1, "New files for the new example project", files, assets);
        }

        useEditor.getState().update(files.get("main.js")?.value);

        useProject.persist.setOptions({
            name: `u${filter}-Untitled`,
        });
        useProject.persist.rehydrate();

        useConfig.getState().setConfig({
            lastOpenedProject: `u${filter}-Untitled`,
        });

        if (lastVersion !== version) {
            toast(
                `KAPLAY version updated to ${version} for this example. May take a few seconds to load.`,
            );
        }

        set(() => ({
            project: {
                name: `${filter}#${get().getSavedProjects("pj").length}`,
                version: "2.0.0",
                files: files,
                assets: assets,
                kaplayConfig: {},
                mode: filter,
                kaplayVersion: version,
                isDefault: demo ? true : false,
                id: id,
            },
        }));

        // Editor stuff
        useEditor.getState().updateAndRun();
    },
    createNewProjectFromDemo(demo?: string) {
        get().createNewProject("ex", demo);
    },
    saveProject: (id: string, oldId: string) => {
        useProject.persist.setOptions({
            name: `${get().project.mode}-${id}`,
        });

        useProject.persist.rehydrate();

        localStorage.removeItem(oldId);

        useConfig.getState().setConfig({
            lastOpenedProject: `${get().project.mode}-${id}`,
        });

        set({
            project: {
                ...get().project,
                name: id,
                id: `${get().project.mode}-${id}`,
            },
        });
    },
    projectIsSaved: (name: string, filter: "pj" | "ex") => {
        return get().getSavedProjects().includes(`${filter}-${name}`);
    },
    getSavedProjects: (filter) => {
        const prefix = filter ? `${filter}-` : "pj-";
        const secondPrefix = "ex-";
        let keys: string[] = [];

        for (let i = 0, len = localStorage.length; i < len; ++i) {
            const localKey = localStorage.key(i);

            if (
                (localKey && localKey.startsWith(prefix))
                || (localKey && localKey.startsWith(secondPrefix))
            ) {
                keys.push(localKey);
            }
        }

        return keys;
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
    // Should be used to load already created projects
    // If not, createProject or createProjectFromExample should be used
    loadProject(projectId: string, replaceProject?: Project) {
        useProject.persist.setOptions({
            name: projectId,
        });

        if (replaceProject) {
            set({
                project: {
                    ...replaceProject,
                },
            });
        }

        useProject.persist.rehydrate();

        useConfig.getState().setConfig({
            lastOpenedProject: projectId,
        });

        set({});

        // Editor stuff
        useEditor.getState().updateAndRun();
    },
    loadSharedDemo(sharedCode: string) {
        get().loadProject("ex-shared", {
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
            mode: "ex",
            id: "ex-shared",
            kaplayConfig: {},
            kaplayVersion: DEFAULT_KAPLAY_VERSION,
            name: "Shared Example",
            version: "2.0.0",
            isDefault: false,
        });
    },
});
