import { create } from "zustand";

export type File = {
    name: string;
    language: string;
    value: string;
    kind: "kaboom" | "scene";
    isEncoded: boolean;
    isCurrent: boolean;
};

type FilesStore = {
    files: File[];
    addFile: (file: File) => void;
    removeFile: (name: string) => void;
    updateFile: (name: string, value: string) => void;
    getCurrentFile: () => File;
};

export const useFiles = create<FilesStore>((set, get) => ({
    files: [{
        name: "kaboom.js",
        language: "javascript",
        value: "kaboom();\nloadBean();\n\nadd([\n    sprite(\"bean\"),\n]);\n",
        kind: "kaboom",
        isEncoded: false,
        isCurrent: true,
    }],
    addFile: (file) => {
        const thereIsFile = get().files.find((f) => f.name === file.name);

        if (thereIsFile) {
            set((state) => ({
                files: state.files.map((oldFile) =>
                    oldFile.name === file.name ? { ...file } : file
                ),
            }));
        } else {
            set((state) => ({ files: [...state.files, file] }));
        }
    },
    removeFile: (name) =>
        set((state) => ({
            files: state.files.filter((file) => file.name !== name),
        })),
    updateFile: (name, value) => {
        const file = get().files.find((file) => file.name === name);

        if (file) {
            set((state) => ({
                files: state.files.map((file) =>
                    file.name === name ? { ...file, value } : file
                ),
            }));
        }
    },
    getCurrentFile: () => {
        return get().files.find((file) => file.isCurrent) || get().files[0];
    },
}));
