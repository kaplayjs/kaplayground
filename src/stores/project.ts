import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import { defaultProject } from "../config/defaultProject";
import { useEditor } from "../hooks/useEditor";
import type { Asset, AssetsSlice } from "./storage/assets";
import type { File, FilesSlice } from "./storage/files";

export type Project = {
    version: string;
    assets: Map<string, Asset>;
    files: Map<string, File>;
    kaplayConfig: KAPLAYOpt;
    mode?: "example" | "project";
};

export interface ProjectSlice {
    /** The current project */
    project: Project;
    /** Reset the project */
    resetProject: () => void;
    /** Replace the project with a new project */
    replaceProject: (project: Project) => void;
    /** Get project mode */
    getProjectMode: () => Project["mode"];
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
        version: "2.0.0",
        files: new Map(),
        assets: new Map(),
        kaplayConfig: {},
        mode: "project",
    },
    resetProject: () => {
        console.debug("Resetting project");

        const files = new Map();
        const assets = new Map();

        // Load default setup
        get().loadDefaultSetup("project", files, assets);

        console.log("New files", files, assets);

        set(() => ({
            project: {
                version: "2.0.0",
                files: files,
                assets: assets,
                kaplayConfig: {},
                mode: "project",
            },
        }));
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
    getProjectMode: () => {
        return get().project.mode;
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
