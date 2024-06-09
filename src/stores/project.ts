import { persistentMap } from "@nanostores/persistent";
import type { FileSystemTree } from "@webcontainer/api";
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
