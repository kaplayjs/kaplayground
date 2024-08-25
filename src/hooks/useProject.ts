import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilesSlice, type FilesSlice } from "../stores/files";
import {
    createKaboomConfigSlice,
    type KaboomConfigSlice,
} from "../stores/kaboomConfig";
import { createProjectSlice, type ProjectSlice } from "../stores/project";
import {
    createResourcesSlice,
    type ResourcesSlice,
} from "../stores/storage/resoures";

type Store = ProjectSlice & FilesSlice & ResourcesSlice & KaboomConfigSlice;

export const useProject = create<Store>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createResourcesSlice(...a),
    ...createKaboomConfigSlice(...a),
}), {
    name: "kaplay_project",
}));
