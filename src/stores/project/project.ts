import { defaultProj } from "@/config/defaultProj";
import type { KaboomOpt } from "kaboom";
import type { StateCreator } from "zustand";
import type { Asset } from "./assets";
import type { File } from "./files";

export type Project = {
    version: string;
    assets: Asset[];
    files: File[];
    kaboomConfig: KaboomOpt;
    /**
     * The mode of the project
     *
     * classic: kaboom() is in the main file
     * new: kaboom() is in a separate file
     */
    mode?: "classic" | "new";
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
