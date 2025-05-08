import { create } from "zustand";
import { type AssetsSlice, createAssetsSlice } from "./slices/assets";
import { createFilesSlice, type FilesSlice } from "./slices/files";
import { createProjectSlice, type ProjectSlice } from "./slices/project.ts";

export type ProjectStore = ProjectSlice & FilesSlice & AssetsSlice;

export const useProject = create<ProjectStore>((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetsSlice(...a),
}));
