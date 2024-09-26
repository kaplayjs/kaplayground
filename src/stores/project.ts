import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import { defaultProject } from "../config/defaultProject";
import { useEditor } from "../hooks/useEditor";
import { useProject } from "../hooks/useProject";
import { debug } from "../util/logs";
import type { Asset, AssetsSlice } from "./storage/assets";
import type { File, FilesSlice } from "./storage/files";

export type Project = {
    name: string;
    version: string;
    assets: Map<string, Asset>;
    files: Map<string, File>;
    kaplayConfig: KAPLAYOpt;
    mode?: "example" | "project";
};

export interface ProjectSlice {
    /** The current project */
    project: Project;
    /** Creates a new project */
    createNewProject: () => void;
    /** Replace the project with a new project */
    replaceProject: (project: Project) => void;
    /** Set the project mode */
    setProjectMode: (mode: Project["mode"]) => void;
    /** Get project mode */
    getProjectMode: () => Project["mode"];
    /** Get project name */
    getProjectName: () => string;
    /** Get the list of saved projects */
    getSavedProjects: () => string[];
    /** Project exists */
    isProjectSaved: (name: string) => boolean;
    /** Set project name */
    setProjectName: (name: string) => void;
    /** Save a project */
    saveProject: (name: string) => void;
    /** Load defaut setup for every project mode */
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
        name: "Untitled Project",
        version: "2.0.0",
        files: new Map(),
        assets: new Map(),
        kaplayConfig: {},
        mode: "project",
    },
    createNewProject: () => {
        debug(0, "creating a new project");

        const files = new Map();
        const assets = new Map();

        // Load default setup
        get().loadDefaultSetup("project", files, assets);
        debug(1, "New files for the new project", files, assets);

        useProject.persist.setOptions({
            name: "Untitled Project",
        });
        useProject.persist.rehydrate();

        set(() => ({
            project: {
                name: "Project #" + get().getSavedProjects().length,
                version: "2.0.0",
                files: files,
                assets: assets,
                kaplayConfig: {},
                mode: "project",
            },
        }));

        useEditor.getState().update();
    },
    replaceProject: (project) => {
        const { run, update } = useEditor.getState();

        set(() => ({
            project: project,
        }));

        window.history.replaceState({}, document.title, "/");
        update();
        run();
    },
    getProjectName: () => {
        return get().project.name;
    },
    setProjectName: (name: string) => {
        set(() => ({
            project: {
                ...get().project,
                name: name,
            },
        }));
    },
    setProjectMode: (mode) => {
        set(() => ({
            project: {
                ...get().project,
                mode: mode,
            },
        }));
    },
    getProjectMode: () => {
        return get().project.mode;
    },
    saveProject: (name: string) => {
        useProject.persist.setOptions({
            name: `pj-${name}`,
        });

        useProject.persist.rehydrate();

        localStorage.removeItem(`Untitled Project`);
    },
    isProjectSaved: (name: string) => {
        return get().getSavedProjects().includes(`pj-${name}`);
    },
    getSavedProjects: () => {
        let keys: string[] = [];

        for (let i = 0, len = localStorage.length; i < len; ++i) {
            const localKey = localStorage.key(i);

            if (localKey && localKey.startsWith("pj-")) {
                keys.push(localKey);
            }
        }

        return keys;
    },
    loadDefaultSetup: (mode, files, assets) => {
        if (mode === "project") {
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
