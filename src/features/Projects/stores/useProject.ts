import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { type AssetsSlice, createAssetsSlice } from "./slices/assets";
import { createFilesSlice, type FilesSlice } from "./slices/files";
import { createProjectSlice, type ProjectSlice } from "./slices/project.ts";

export type ProjectStore = ProjectSlice & FilesSlice & AssetsSlice;

export const useProject = create<ProjectStore>()(persist((...a) => ({
    ...createProjectSlice(...a),
    ...createFilesSlice(...a),
    ...createAssetsSlice(...a),
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
        setItem: (name, newValue: StorageValue<ProjectStore>) => {
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
