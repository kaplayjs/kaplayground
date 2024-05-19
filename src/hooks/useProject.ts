import { type AssetSlice, createAssetSlice } from "@/stores/project/assets";
import { createFilesSlice, type FilesSlice } from "@/stores/project/files";
import {
    createKaboomConfigSlice,
    type KaboomConfigSlice,
} from "@/stores/project/kaboomConfig";
import {
    createProjectSlice,
    type ProjectSlice,
} from "@/stores/project/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = ProjectSlice & FilesSlice & AssetSlice & KaboomConfigSlice;

export const useProject = create<Store>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetSlice(...a),
    ...createKaboomConfigSlice(...a),
}), {
    name: "kaplay_project",
}));
