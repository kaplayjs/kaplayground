import { defaultProj } from "@/config/defaultProj";
import { type AssetSlice, createAssetSlice } from "@/stores/assets";
import { createFilesSlice, type FilesSlice } from "@/stores/files";
import { createProjectSlice, type ProjectSlice } from "@/stores/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AssetKind = "sprite" | "sound" | "font";
export type FileKind = "kaboom" | "main" | "scene";

export type Asset = {
    name: string;
    url: string;
    kind: AssetKind;
};

export type File = {
    name: string;
    language: string;
    value: string;
    kind: FileKind;
    isEncoded: boolean;
    isCurrent: boolean;
};

export type Project = {
    version: string;
    assets: Asset[];
    files: File[];
};

type ProjectStore = {
    project: Project;
    /** Replace the project with a new project */
    replaceProject: (project: Partial<Project>) => void;
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
    /** Get the main file */
    getMainFile: () => File | null;
    /** Set the current file */
    setCurrentFile: (name: string) => void;
};

type Store = ProjectSlice & FilesSlice & AssetSlice;

export const useProject = create<Store>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetSlice(...a),
}), {
    name: "kaplay_project",
}));
