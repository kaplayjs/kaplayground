import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import { defaultProject } from "../config/defaultProject";
import type { File } from "./files";
import type { Resource } from "./storage/resoures";

export type Project = {
    version: string;
    resources: Record<string, Resource>;
    files: File[];
    kaplayConfig: KAPLAYOpt;
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
