import { defaultProj } from "@/config/defaultProj";
import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import type { Asset } from "./assets";
import type { File } from "./files";

export type Project = {
    version: string;
    assets: Asset[];
    files: File[];
    kaboomConfig: KAPLAYOpt;
    mode?: "example" | "project";
};

export interface ProjectSlice {
    /** The current project */
    project: Project;
    /** Replace the project with a new project */
    replaceProject: (project: Partial<Project>) => void;
}

export const createProjectSlice: StateCreator<
    ProjectSlice,
    [],
    [],
    ProjectSlice
> = (set) => ({
    project: { ...defaultProj },
    replaceProject: (project) => {
        set(() => ({
            project: {
                ...defaultProj,
                ...project,
            },
        }));
    },
});
