import type { StateCreator } from "zustand";
import { debug } from "../../../../util/logs";
import type { File } from "../../models/File";
import type { FileFolder } from "../../models/FileFolder";
import type { FileKind } from "../../models/FileKind";
import type { ProjectStore } from "../useProject.ts";

export const folderByKind: Record<FileKind, FileFolder> = {
    kaplay: "root",
    main: "root",
    scene: "scenes",
    assets: "assets",
    util: "utils",
    obj: "objects",
};

export interface FilesSlice {
    /** Add a file. */
    addFile: (file: File) => void;
    /** Remove a file with the path/ */
    removeFile: (path: string) => void;
    /** Update a file with the path. */
    updateFile: (path: string, value: string) => void;
    /** Get the KAPLAY file */
    getKAPLAYFile: () => File | null;
    /** Get the assets file */
    getAssetsFile: () => File | null;
    /** Get the main file */
    getMainFile: () => File | null;
    /** Get a file */
    getFile: (path: string) => File | null;
    /**
     * Search
     *
     * @param path To saerch for tree
     * @returns Tree of file paths
     */
    getTree: (path: string) => string[];
    /** Get files by folder */
    getFilesByFolder: (folder: FileFolder) => File[];
}

export const wrapKAPLAYConfig = (config: string) => `
kaplay(${config});
`;

export const createFilesSlice: StateCreator<ProjectStore, [], [], FilesSlice> =
    (_set, get) => ({
        addFile(file) {
            debug(0, "[files] Adding file", file.path);
            get().project.files.set(file.path, file);
            get().setProject({});
        },

        removeFile(path) {
            debug(0, "[files] Removing file", path);
            const files = get().project.files;

            const foundFile = files.has(path) ? files.get(path) : null;
            if (!foundFile) return console.debug("File not found", path);

            get().project.files.delete(path);
            get().setProject({});
        },

        getFile(path) {
            return get().project.files.get(path) ?? null;
        },

        updateFile(path, value) {
            const files = get().project.files;

            const foundFile = files.has(path) ? files.get(path) : null;
            if (!foundFile) throw new Error("[files] File not found");

            debug(0, "[files] Updating file", foundFile.path);

            get().project.files.set(foundFile.path, {
                ...foundFile,
                value,
            });
            get().setProject({});
        },

        getKAPLAYFile() {
            return get().getFile("kaplay.js");
        },

        getMainFile() {
            return get().getFile("main.js");
        },

        getAssetsFile() {
            return get().getFile("assets.js");
        },

        getTree(path) {
            const files = get().project.files;
            const tree: string[] = [];

            for (const file of files.values()) {
                if (file.path.startsWith(path)) {
                    tree.push(file.path);
                }
            }

            return tree;
        },

        getFilesByFolder(folder) {
            if (folder === "root") {
                return Array.from(get().project.files.values()).filter(
                    (file) =>
                        file.kind === "kaplay" || file.kind === "main"
                        || file.kind === "assets",
                );
            }

            return Array.from(get().project.files.values()).filter(
                (file) => file.path.startsWith(folder),
            );
        },
    });
