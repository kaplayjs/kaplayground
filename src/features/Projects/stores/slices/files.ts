import type { StateCreator } from "zustand";
import { debug } from "../../../../util/logs";
import type { File, RealFile } from "../../models/File";
import type { ProjectStore } from "../useProject.ts";

export interface FilesSlice {
    /** Add a file. */
    addFile: (file: File) => void;
    /** Remove a file with the path/ */
    removeFile: (path: string) => void;
    /** Update a file with the path. */
    updateFile: (path: string, value: string) => void;
    /** Get a file */
    getFile: (path: string) => RealFile | null;
    /** Get all tree for a path */
    getTreeByPath: (path: "root" | string & {}) => File[];
}

export const wrapKAPLAYConfig = (config: string) => `
kaplay(${config});
`;

export const createFilesSlice: StateCreator<ProjectStore, [], [], FilesSlice> =
    (set, get) => ({
        addFile(file) {
            debug(0, "[files] Adding file", file.path);

            get().project.files.set(file.path, file);
            get().setProject({});
        },

        removeFile(path) {
            debug(0, "Removing file", path);
            const files = get().project.files;

            const foundFile = files.has(path) ? files.get(path) : null;
            if (!foundFile) return console.debug("File not found", path);

            get().project.files.delete(path);
            get().setProject({});
        },

        getFile(path) {
            const extension = path.split(".").pop();
            if (!extension) {
                throw new Error(
                    "Invalid file path, it should have an extension",
                );
            }

            return get().project.files.get(path) as RealFile | null;
        },

        updateFile(path, value) {
            debug(0, "[files] Updating file", path);

            const foundFile = get().getFile(path);
            if (!foundFile) return debug(2, "File not found", path);

            if (get().getProject().isDefault) {
                debug(0, "Default project, dettaching", path);
                get().setProject({
                    isDefault: false,
                });
            }

            get().addFile({
                ...foundFile,
                value: value,
            });

            get().setProject({
                updatedAt: new Date().toISOString(),
            });

            set({});
        },

        getTreeByPath(path) {
            const tree: File[] = [];
            const files = get().project.files;

            Array.from(files.values()).forEach((entry) => {
                const entryPath = entry.path.split("/");

                if (entryPath.length === 1 && path === "root") {
                    tree.push(entry);
                } else {
                    const folderPath = entryPath.slice(0, -1).join("/");

                    if (folderPath === path) {
                        tree.push(entry);
                    }
                }
            });

            return tree;
        },
    });
