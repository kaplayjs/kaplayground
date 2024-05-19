import type { KaboomOpt } from "kaboom";
import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";

export interface KaboomConfigSlice {
    /** Replace the Kaboom configuration with a new one */
    replaceKaboomConfig: (config: KaboomOpt) => void;
    /** Update a config key */
    updateKaboomConfig: (key: keyof KaboomOpt, value: any) => void;
}

export const createKaboomConfigSlice: StateCreator<
    KaboomConfigSlice & ProjectSlice,
    [],
    [],
    KaboomConfigSlice
> = (set) => ({
    replaceKaboomConfig(config) {
        set((state) => ({
            project: {
                ...state.project,
                kaboomConfig: {
                    ...config,
                },
            },
        }));
    },
    updateKaboomConfig(key, value) {
        set((state) => ({
            project: {
                ...state.project,
                kaboomConfig: {
                    ...state.project.kaboomConfig,
                    [key]: value,
                },
            },
        }));
    },
});
