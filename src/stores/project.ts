import type { Terminal } from "@altronix/xterm";
import { persistentMap } from "@nanostores/persistent";
import { type FileSystemTree, WebContainer } from "@webcontainer/api";
import { atom } from "nanostores";
import indexHTML from "./defaultProject/index.html?raw";
import mainJS from "./defaultProject/main.js?raw";
import packageJSON from "./defaultProject/package.json?raw";
import viteConfigMJS from "./defaultProject/vite.config.mjs?raw";

type Project = {
    files: FileSystemTree;
};

export const $project = persistentMap<Project>("project:", {
    files: {
        "index.html": {
            file: {
                contents: indexHTML,
            },
        },
        "main.js": {
            file: {
                contents: mainJS,
            },
        },
        "package.json": {
            file: {
                contents: packageJSON,
            },
        },
        "vite.config.mjs": {
            file: {
                contents: viteConfigMJS,
            },
        },
    },
}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $webContainer = atom<WebContainer | null>(null);
export const $currentEditingFile = atom<string>("main.js");
export const $terminal = atom<Terminal | null>(null);
