import { type AssetSlice, createAssetSlice } from "@/stores/assets";
import { createFilesSlice, type FilesSlice } from "@/stores/files";
import { createProjectSlice, type ProjectSlice } from "@/stores/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = ProjectSlice & FilesSlice & AssetSlice;

export const useProject = create<Store>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetSlice(...a),
}), {
    name: "kaplay_project",
}));
