import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import {
    createKaboomConfigSlice,
    type KAPLAYConfigSlice,
} from "../stores/kaplayConfig";
import { createProjectSlice, type ProjectSlice } from "../stores/project";
import { type AssetsSlice, createAssetsSlice } from "../stores/storage/assets";
import { createFilesSlice, type FilesSlice } from "../stores/storage/files";

type Store = ProjectSlice & FilesSlice & AssetsSlice & KAPLAYConfigSlice;

export const useProject = create<Store>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetsSlice(...a),
    ...createKaboomConfigSlice(...a),
}), {
    name: "upj-Untitled",
    storage: {
        getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const existingValue = JSON.parse(str);

            return {
                ...existingValue,
                state: {
                    ...existingValue.state,
                    project: {
                        ...existingValue.state.project,
                        files: new Map(existingValue.state.project.files),
                        assets: new Map(
                            existingValue.state.project.assets,
                        ),
                    },
                },
            };
        },
        setItem: (name, newValue: StorageValue<Store>) => {
            const str = JSON.stringify({
                ...newValue,
                state: {
                    ...newValue.state,
                    project: {
                        ...newValue.state.project,
                        files: Array.from(
                            newValue.state.project.files.entries(),
                        ),
                        assets: Array.from(
                            newValue.state.project.assets.entries(),
                        ),
                    },
                },
            });

            localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
    },
}));
