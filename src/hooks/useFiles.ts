import { create } from "zustand";

export type File = {
    name: string;
    language: string;
    value: string;
    kind: "kaboom" | "scene";
    isEncoded: boolean;
};

type FilesStore = {
    files: File[];
    addFile: (file: File) => void;
    removeFile: (name: string) => void;
};

export const useFiles = create<FilesStore>((set) => ({
    files: [{
        name: "kaboom.js",
        language: "javascript",
        value:
            "kaboom()\n\nloadSprite(\"bean\", \"bean.png\")\n\nscene(\"main\", () => {\n\n})",
        kind: "kaboom",
        isEncoded: false,
    }],
    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
    removeFile: (name) =>
        set((state) => ({
            files: state.files.filter((file) => file.name !== name),
        })),
}));
