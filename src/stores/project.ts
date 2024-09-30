import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import { defaultProject } from "../config/defaultProject";
import examplesList from "../data/exampleList.json";
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
    mode: ProjectMode;
    isDefault?: boolean;
};

export interface ProjectSlice {
    /** The current project */
    project: Project;
    getProject(): Project;
    setProject(project: Partial<Project>): void;
    createNewProject: (filter: ProjectMode, example?: string) => void;
    getSavedProjects: (filter?: "pj" | "ex") => string[];
    projectIsSaved: (name: string, filter: "pj" | "ex") => boolean;
    saveProject: (name: string) => void;
    loadDefaultExample: (example: string) => void;
    loadDefaultSetup: (
        mode: Project["mode"],
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
        saved: false,
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
    createNewProject: (filter: ProjectMode, exampleIndex?: string) => {
        debug(0, "Creating a new project");

        const files = new Map<string, File>();
        const assets = new Map();

        // Load default setup
        if (filter === "pj") {
            get().loadDefaultSetup("pj", files, assets);
            debug(1, "New files for the new project", files, assets);
        } else if (exampleIndex) {
            const example = examplesList.filter(example =>
                example.index === exampleIndex
            )[0];

            files.set("main.js", {
                kind: "main",
                language: "javascript",
                name: "main.js",
                path: "main.js",
                value: example.code,
            });
        } else {
            get().loadDefaultSetup("ex", files, assets);
            debug(1, "New files for the new example project", files, assets);
        }

        useEditor.getState().update(files.get("main.js")?.value);

        useProject.persist.setOptions({
            name: `u${filter}-Untitled`,
        });
        useProject.persist.rehydrate();

        set(() => ({
            project: {
                name: `${filter}#${get().getSavedProjects().length}`,
                version: "2.0.0",
                files: files,
                assets: assets,
                kaplayConfig: {},
                mode: filter,
                saved: false,
                isDefault: exampleIndex ? true : false,
            },
        }));
    },
    saveProject: (name: string) => {
        useProject.persist.setOptions({
            name: `${get().project.mode}-${name}`,
        });

        useProject.persist.rehydrate();

        localStorage.removeItem(`u${get().project.mode}-Untitled`);
    },
    projectIsSaved: (name: string, filter: "pj" | "ex") => {
        return get().getSavedProjects().includes(`${filter}-${name}`);
    },
    getSavedProjects: (filter) => {
        const prefix = filter ? `${filter}-` : "";
        let keys: string[] = [];

        for (let i = 0, len = localStorage.length; i < len; ++i) {
            const localKey = localStorage.key(i);

            if (localKey && localKey.startsWith(prefix)) {
                keys.push(localKey);
            }
        }

        return keys;
    },
    loadDefaultExample: (exampleIndex) => {
        debug(0, "Loading default example", exampleIndex);
        get().createNewProject("ex", exampleIndex);
    },
    loadDefaultSetup: (mode, files, assets) => {
        if (mode === "pj") {
            defaultProject.files.forEach((file) => {
                files.set(file.path, file);
            });
            defaultProject.resources.forEach((asset) => {
                assets.set(asset.path, asset);
            });
        } else {
            files.set("main.js", defaultProject.files[1]);
        }
    },
});
