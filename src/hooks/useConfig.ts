import { create } from "zustand";
import { persist } from "zustand/middleware";

type Config = {
    lastOpenedProject: string | null;
    debugLevel: number | null;
};

type Store = {
    config: Config;
    setConfig: (config: Partial<Config>) => void;
    getConfig: () => Config;
};

export const useConfig = create<Store>()(persist((set, get) => ({
    config: {
        lastOpenedProject: null,
        debugLevel: null,
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
