import type { KAPLAYOpt } from "kaplay";
import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";
import type { FilesSlice } from "./storage/files";

export interface KAPLAYConfigSlice {
    /** Replace the Kaboom configuration with a new one */
    replaceKAPLAYConfig: (config: KAPLAYOpt) => void;
    /** Update a config key */
    updateKAPLAYConfig: (key: keyof KAPLAYOpt, value: any) => void;
    /** Get KAPLAY Config */
    getKAPLAYConfig: () => KAPLAYOpt;
}

export const createKaboomConfigSlice: StateCreator<
    KAPLAYConfigSlice & ProjectSlice & FilesSlice,
    [],
    [],
    KAPLAYConfigSlice
> = (set, get) => ({
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
    getKAPLAYConfig() {
        return get().project.kaplayConfig;
    },
});
