import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import { defaultProject } from "../config/defaultProject";
import examplesList from "../data/exampleList.json";
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
    /** The current project */
    project: Project;
    getProject(): Project;
    setProject(project: Partial<Project>): void;
    createNewProject: (filter: ProjectMode, example?: string) => void;
    getSavedProjects: (filter?: "pj" | "ex") => string[];
    projectIsSaved: (name: string, filter: "pj" | "ex") => boolean;
    saveProject: (newId: string, oldId: string) => void;
    importProject: (project: Project) => void;
    loadProject: (project: string) => void;
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
        kaplayVersion: "3001.0.1",
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
    importProject: (project: Project) => {
        useProject.persist.setOptions({
            name: project.name,
        });

        useProject.persist.rehydrate();

        set(() => ({
            project: {
                ...project,
            },
        }));
    },
    createNewExampleProject() {
    },
    createNewProject: (filter: ProjectMode, exampleIndex?: string) => {
        debug(0, "Creating a new project");

        const files = new Map<string, File>();
        const assets = new Map();
        let id = `u${filter}-Untitled`;

        // Load default setup
        if (filter === "pj") {
            get().loadDefaultSetup("pj", files, assets);
            debug(1, "New files for the new project", files, assets);
        } else if (exampleIndex) {
            const example = examplesList.filter(example =>
                example.index === exampleIndex || example.name === exampleIndex
            )[0];

            files.set("main.js", {
                kind: "main",
                language: "javascript",
                name: "main.js",
                path: "main.js",
                value: example.code,
            });

            id = example.name;
        } else {
            get().loadDefaultSetup("ex", files, assets);
            debug(1, "New files for the new example project", files, assets);
        }

        useEditor.getState().update(files.get("main.js")?.value);

        useProject.persist.setOptions({
            name: `u${filter}-Untitled`,
        });
        useProject.persist.rehydrate();

        useConfig.setState({
            config: {
                lastOpenedProject: `u${filter}-Untitled`,
            },
        });

        set(() => ({
            project: {
                name: `${filter}#${get().getSavedProjects("pj").length}`,
                version: "2.0.0",
                files: files,
                assets: assets,
                kaplayConfig: {},
                mode: filter,
                kaplayVersion: "3001.0.1",
                isDefault: exampleIndex ? true : false,
                id: id,
            },
        }));
    },
    saveProject: (id: string, oldId: string) => {
        useProject.persist.setOptions({
            name: `${get().project.mode}-${id}`,
        });

        useProject.persist.rehydrate();

        localStorage.removeItem(oldId);

        useConfig.setState({
            config: {
                lastOpenedProject: `${get().project.mode}-${id}`,
            },
        });

        set({
            project: {
                ...get().project,
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
    loadProject(project: string) {
        useProject.persist.setOptions({
            name: project,
        });

        useProject.persist.rehydrate();

        useEditor.getState().runtime.editor?.setScrollTop(0);
        useEditor.getState().update();
        useEditor.getState().run();

        useConfig.getState().setConfig({
            lastOpenedProject: project,
        });

        set({});
    },
});
