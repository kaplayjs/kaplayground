import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";

export type Plugin = {
    /** Name of the plugin */
    name: string;
    /** Author of the plugin */
    author: string;
    /**
     * Plugin's sentence to be loaded in Kaboom
     *
     * @example
     * kaboomPlugin: "kaplugin"
     *
     * or if your plugin accepts options:
     * kaboomPlugin: "kaplugin({ option: value })"
     */
    kaboomPlugin: string;
    /** The script of the plugin to be imported */
    url: string;
    /** The global types of the plugin */
    types?: string;
};

export interface PluginsSlice {
    /** Add a plugin */
    addPlugin: (plugin: Plugin) => void;
    /** Remove a plugin */
    removePlugin: (name: string) => void;
}
