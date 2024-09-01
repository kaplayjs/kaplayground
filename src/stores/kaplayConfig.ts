import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";

export interface KAPLAYConfigSlice {
    /** Replace the Kaboom configuration with a new one */
    replaceKAPLAYConfig: (config: KAPLAYOpt) => void;
    /** Update a config key */
    updateKAPLAYConfig: (key: keyof KAPLAYOpt, value: any) => void;
}

export const createKaboomConfigSlice: StateCreator<
    KAPLAYConfigSlice & ProjectSlice,
    [],
    [],
    KAPLAYConfigSlice
> = (set) => ({
    replaceKAPLAYConfig(config) {
        set((state) => ({
            project: {
                ...state.project,
                kaplayConfig: {
                    ...config,
                },
            },
        }));
    },
    updateKAPLAYConfig(key, value) {
        set((state) => ({
            project: {
                ...state.project,
                kaplayConfig: {
                    ...state.project.kaplayConfig,
                    [key]: value,
                },
            },
        }));
    },
});
