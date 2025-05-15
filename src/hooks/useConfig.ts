import { create } from "zustand";
import { debug } from "../util/logs.ts";

// This interacts with the local storage to save/load data about the layout,
// configuration and persisted data not related to the project itself.

/**
 * Playground related configuration.
 */
export interface Config {
    /** The last opened project, used for reload the playground */
    lastOpenedProject: string | null;
    /** Preferred KAPLAY version used as default */
    preferredVersion: string;
    /** It defines how deep it's the debugging logging in the browser console */
    debugLevel: number | null;
    /** If Editor should auto-run the format command */
    autoFormat: boolean;
    /** If on formatting format will do a fun effect */
    funFormat: boolean;
    /** Toggles editor word-wrapping */
    wordWrap: boolean;
}

const defaultConfig: Config = {
    lastOpenedProject: null,
    preferredVersion: "3001.0",
    debugLevel: null,
    autoFormat: true,
    funFormat: false,
    wordWrap: false,
};

type Store = {
    config: Config;
    setConfigKey: <T extends keyof Config>(key: T, value: Config[T]) => void;
    setConfig: (config: Partial<Config>) => void;
    getConfig: () => Config;
    loadConfig: () => void;
    saveConfig: () => void;
};

export const useConfig = create<Store>()((set, get) => ({
    config: defaultConfig,
    setConfigKey(key, value) {
        debug(0, "[config] Setting config key", key, "to", value);

        set((state) => ({
            config: {
                ...state.config,
                [key]: value,
            },
        }));

        get().saveConfig();
    },
    setConfig: (config) => {
        set(() => ({
            config: {
                ...get().config,
                ...config,
            },
        }));

        get().saveConfig();
    },
    getConfig: () => {
        return get().config;
    },
    saveConfig: () => {
        const config = get().config;
        localStorage.setItem("config", JSON.stringify(config));
    },
    loadConfig: () => {
        const config = localStorage.getItem("config");

        if (config) {
            set(() => ({
                config: {
                    ...defaultConfig,
                    ...JSON.parse(config),
                },
            }));
        }
    },
}));
