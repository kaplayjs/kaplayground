import { defaultProj } from "@/config/defaultProj";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Asset = {
    name: string;
    url: string;
    kind: "sprite" | "sound";
};

export type File = {
    name: string;
    language: string;
    value: string;
    kind: "kaboom" | "scene";
    isEncoded: boolean;
    isCurrent: boolean;
};

export type Project = {
    assets: Asset[];
    files: File[];
};

type ProjectStore = {
    project: Project;
    /** Replace the project with a new project */
    replaceProject: (project: Project) => void;
    /** Add an asset */
    addAsset: (asset: Asset) => void;
    /** Add a file */
    addFile: (file: File) => void;
    /** Remove a file */
    removeFile: (name: string) => void;
    /** Update a file */
    updateFile: (name: string, value: string) => void;
    /** Get current file */
    getCurrentFile: () => File | null;
    /** Get the main (kaboom) file */
    getKaboomFile: () => File | null;
    /** Set the current file */
    setCurrentFile: (name: string) => void;
};

export const useProject = create<ProjectStore>()(persist((set, get) => ({
    project: {
        assets: [...defaultProj.assets],
        files: [...defaultProj.files],
    },

    replaceProject: (project) => {
        set(() => ({
            project,
        }));
    },

    addAsset(asset) {
        const foundAsset = get().project.assets.find((a) =>
            a.name === asset.name
        );

        if (foundAsset) {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: state.project.assets.map((oldAsset) =>
                        oldAsset.name === asset.name ? { ...asset } : oldAsset
                    ),
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: [...state.project.assets, asset],
                },
            }));
        }
    },

    addFile(file) {
        const foundFile = get().project.files.find((f) => f.name === file.name);

        if (foundFile) {
            set((state) => ({
                project: {
                    ...state.project,
                    files: state.project.files.map((oldFile) =>
                        oldFile.name === file.name ? { ...file } : oldFile
                    ),
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    files: [...state.project.files, file],
                },
            }));
        }
    },

    removeFile(name) {
        set((state) => ({
            project: {
                ...state.project,
                files: state.project.files.filter((file) => file.name !== name),
            },
        }));
    },

    updateFile(name, value) {
        const file = get().project.files.find((file) => file.name === name);

        if (file) {
            set((state) => ({
                project: {
                    ...state.project,
                    files: state.project.files.map((file) =>
                        file.name === name ? { ...file, value } : file
                    ),
                },
            }));
        }
    },

    getCurrentFile() {
        return get().project.files.find((file) => file.isCurrent) ?? null;
    },

    getKaboomFile() {
        return get().project.files.find((file) => file.kind === "kaboom")
            ?? null;
    },

    setCurrentFile(name) {
        set((state) => ({
            project: {
                ...state.project,
                files: state.project.files.map((file) => ({
                    ...file,
                    isCurrent: file.name === name,
                })),
            },
        }));
    },
}), {
    name: "kaplay_project",
}));
