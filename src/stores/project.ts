import { defaultProject } from "@/config/defaultProject";
import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import type { ProjectAsset } from "./assets";
import type { File } from "./files";

export type Project = {
    version: string;
    assets: ProjectAsset[];
    files: File[];
    kaboomConfig: KAPLAYOpt;
    mode?: "example" | "project";
};

export interface ProjectSlice {
    /** The current project */
    project: Project;
    /** Replace the project with a new project */
    replaceProject: (project: Partial<Project>) => void;
    /** Get project mode */
    getProjectMode: () => Project["mode"];
}

export const createProjectSlice: StateCreator<
    ProjectSlice,
    [],
    [],
    ProjectSlice
> = (set, get) => ({
    project: { ...defaultProject },
    replaceProject: (project) => {
        set(() => ({
            project: {
                ...defaultProject,
                ...project,
            },
        }));
    },
    getProjectMode: () => {
        return get().project.mode;
    },
});
