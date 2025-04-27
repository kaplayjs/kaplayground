import { create } from "zustand";
import { persist } from "zustand/middleware";
import { debug } from "../util/logs.ts";

// This interacts with the local storage to save/load data about the layout,
// configuration and persisted data not related to the project itself.

/**
 * Playground related configuration.
 */
export interface Config {
    /** The last opened project, used for reload the playground */
    lastOpenedProject: string | null;
    /** It defines how deep it's the debugging logging in the browser console */
    debugLevel: number | null;
    /** If Editor should auto-run the format command */
    autoFormat: boolean;
    /** If on formatting format will do a fun effect */
    funFormat: boolean;
    /** Toggles editor word-wrapping */
    wordWrap: boolean;
}

type Store = {
    config: Config;
    setConfigKey: <T extends keyof Config>(key: T, value: Config[T]) => void;
    setConfig: (config: Partial<Config>) => void;
    getConfig: () => Config;
};

export const useConfig = create<Store>()(persist((set, get) => ({
    config: {
        lastOpenedProject: null,
        debugLevel: null,
        autoFormat: true,
        funFormat: false,
        wordWrap: false,
    },
    setConfigKey(key, value) {
        debug(0, "[config] Setting config key", key, "to", value);

        set((state) => ({
            config: {
                ...state.config,
                [key]: value,
            },
        }));
    },
    setConfig: (config) => {
        set(() => ({
            config: {
                ...get().config,
                ...config,
            },
        }));
    },
    getConfig: () => {
        return get().config;
    },
}), {
    name: "config",
}));
