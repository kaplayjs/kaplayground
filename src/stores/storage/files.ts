import type { StateCreator } from "zustand";
import { debug } from "../../util/logs";
import type { KAPLAYConfigSlice } from "../kaplayConfig";
import type { ProjectSlice } from "../project";

export type FileKind = "kaplay" | "main" | "scene" | "assets" | "util" | "obj";
export type FileFolder = "root" | "scenes" | "assets" | "utils" | "objects";

export type File = {
    name: string;
    path: string;
    language: string;
    value: string;
    kind: FileKind;
};

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
    /** Update KAPLAY file with configurations. */
    syncKAPLAYFile: () => void;
    /** Get the KAPLAY file */
    getKAPLAYFile: () => File | null;
    /** Get the assets file */
    getAssetsFile: () => File | null;
    /** Get the main file */
    getMainFile: () => File | null;
    /** Get a file */
    getFile: (path: string) => File | null;
    /** Get files by folder */
    getFilesByFolder: (folder: FileFolder) => File[];
}

export const wrapKAPLAYConfig = (config: string) => `
kaplay(${config});
`;

export const createFilesSlice: StateCreator<
    FilesSlice & ProjectSlice & KAPLAYConfigSlice,
    [],
    [],
    FilesSlice
> = (set, get) => ({
    addFile(file) {
        debug(0, "Adding file", file.path);
        get().project.files.set(file.path, file);
        set({});
    },

    removeFile(path) {
        debug(0, "Removing file", path);
        const files = get().project.files;

        const foundFile = files.has(path) ? files.get(path) : null;
        if (!foundFile) return console.debug("File not found", path);

        get().project.files.delete(path);
        set({});
    },

    getFile(path) {
        return get().project.files.get(path) ?? null;
    },

    updateFile(path, value) {
        debug(0, "Updating file", path);
        const files = get().project.files;

        const foundFile = files.has(path) ? files.get(path) : null;
        if (!foundFile) return debug(2, "File not found", path);

        if (get().getProject().isDefault) {
            debug(0, "Default project, dettaching", path);
            get().setProject({
                isDefault: false,
            });
        }

        get().addFile({
            ...foundFile,
            value,
        });

        set({});
    },

    syncKAPLAYFile() {
        console.debug("Syncing KAPLAY file");
        const files = get().project.files;

        const kaplayFile = files.has("kaplay.js")
            ? files.get("kaplay.js")
            : null;
        if (!kaplayFile) return console.debug("KAPLAY file not found");

        const kaplayConfig = get().getKAPLAYConfig();
        const newKAPLAYFileContent = wrapKAPLAYConfig(
            JSON.stringify(kaplayConfig, null, 4),
        );

        get().updateFile(kaplayFile.path, newKAPLAYFileContent);
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
