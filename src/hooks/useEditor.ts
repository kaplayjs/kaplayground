import type { editor } from "monaco-editor";
import { createRef, type MutableRefObject } from "react";
import { create } from "zustand";
import { parseAssets, wrapGame } from "../util/compiler";
import { useProject } from "./useProject";

type EditorStore = {
    /** Monaco's editor instance */
    editor: editor.IStandaloneCodeEditor | null;
    /** The current file */
    currentFile: string;
    /** Set the current file */
    setCurrentFile: (path: string) => void;
    /** Set Monaco's editor instance */
    setEditor: (editor: editor.IStandaloneCodeEditor) => void;
    /** Sync content of the current file and Monaco view */
    update: () => void;
    /** Set's Monaco's theme */
    setTheme: (theme: string) => void;
    /** GameView iFrame */
    iframe: MutableRefObject<HTMLIFrameElement>;
    /** Set iFrame */
    setIframe: (iframe: HTMLIFrameElement) => void;
    /** Run the game */
    run: () => void;
};

export const useEditor = create<EditorStore>((set, get) => ({
    editor: null,
    currentFile: "main.js",
    setCurrentFile: (path) => {
        set({ currentFile: path });
    },
    setEditor: (editor) => {
        set({ editor });
    },
    update: () => {
        const currentFile = useProject.getState().getFile(get().currentFile);
        if (!currentFile) return;

        const editor = get().editor;
        if (!editor) return;

        editor.setValue(currentFile.value);
    },
    setTheme: (theme: string) => {
        const editor = get().editor;
        if (!editor) return;

        editor.updateOptions({
            theme,
        });
    },
    iframe: createRef() as MutableRefObject<HTMLIFrameElement>,
    setIframe: (iframe) => {
        if (!iframe) {
            return;
        }
        const newRef = createRef() as MutableRefObject<HTMLIFrameElement>;
        newRef.current = iframe;

        set({ iframe: newRef });
    },
    run() {
        const iframe = get().iframe.current;
        const {
            getKAPLAYFile,
            getMainFile,
            getAssetsFile,
            getProjectMode,
            project: { files },
        } = useProject
            .getState();
        if (!iframe) return;

        let KAPLAYFile = "";
        let mainFile = "";
        let assetsFile = "";
        let sceneFiles = "";
        let parsedFiles = "";

        KAPLAYFile = getKAPLAYFile()?.value ?? "";
        mainFile = getMainFile()?.value ?? "";
        assetsFile = getAssetsFile()?.value ?? "";

        files.forEach((file) => {
            if (file.kind !== "scene") return;

            sceneFiles += `\n${file.value}\n`;
        });

        if (getProjectMode() === "project") {
            parsedFiles =
                `${KAPLAYFile}\n\n ${assetsFile}\n\n ${sceneFiles}\n\n ${mainFile}`;
        } else {
            parsedFiles = mainFile;
        }

        const finalCode = parseAssets(parsedFiles);
        iframe.srcdoc = wrapGame(finalCode);
    },
}));
