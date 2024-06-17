import { persistentMap } from "@nanostores/persistent";
import {
    type DirectoryNode,
    type FileNode,
    type FileSystemTree,
    WebContainer,
} from "@webcontainer/api";
import { atom } from "nanostores";
import indexHTML from "./defaultProject/index.html?raw";
import mainJS from "./defaultProject/main.js?raw";
import packageJSON from "./defaultProject/package.json?raw";
import viteConfigMJS from "./defaultProject/vite.config.mjs?raw";

export interface ProjectFile extends FileNode {
    file: {
        contents: string;
    };
    saved: boolean;
}

interface ProjectFileSystem extends FileSystemTree {
    [name: string]: ProjectFile | DirectoryNode;
}

type Project = {
    files: ProjectFileSystem;
};

export const $project = persistentMap<Project>("project:", {
    files: {
        "index.html": {
            file: {
                contents: indexHTML,
            },
            saved: true,
        },
        "main.js": {
            file: {
                contents: mainJS,
            },
            saved: true,
        },
        "package.json": {
            file: {
                contents: packageJSON,
            },
            saved: true,
        },
        "vite.config.mjs": {
            file: {
                contents: viteConfigMJS,
            },
            saved: true,
        },
    },
}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $webContainer = atom<WebContainer | null>(null);
export const $currentEditingFile = atom<string>("main.js");
