import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { createRef, type MutableRefObject } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { parseAssets, wrapGame } from "../util/compiler";
import { useProject } from "./useProject";

/** The internal API to interact with the editor */
type EditorStore = {
    /** Monaco's editor instance */
    editor: editor.IStandaloneCodeEditor | null;
    /** Set Monaco's editor instance */
    setEditor: (editor: editor.IStandaloneCodeEditor) => void;
    /** Monaco instance */
    monaco: Monaco | null;
    /** Set Monaco instance */
    setMonaco: (monaco: Monaco) => void;
    /** The current file */
    currentFile: string;
    /** Set the current file */
    setCurrentFile: (path: string) => void;
    /** Gylph decorations */
    gylphDecorations: editor.IEditorDecorationsCollection | null;
    /** Set gylph decorations */
    setGylphDecorations: (
        gylphDecorations: editor.IEditorDecorationsCollection,
    ) => void;
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
    /** Update image decorations */
    updateImageDecorations: () => void;
    /** Display notification */
    showNotification: (message: string) => void;
};

export const useEditor = create<EditorStore>((set, get) => ({
    editor: null,
    setEditor: (editor) => {
        set({ editor });
    },
    monaco: null,
    setMonaco: (monaco) => {
        set({ monaco });
    },
    gylphDecorations: null,
    setGylphDecorations: (gylphDecorations) => {
        set({ gylphDecorations });
    },
    currentFile: "main.js",
    setCurrentFile: (path) => {
        set({ currentFile: path });
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
    updateImageDecorations() {
        const editor = get().editor;
        const monaco = get().monaco;
        const model = editor?.getModel();
        const gylphDecorations = get().gylphDecorations;

        if (!editor || !monaco || !model || !gylphDecorations) {
            return console.error("No editor");
        }

        const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*\)/g;

        // for each every line
        const lines = editor.getModel()?.getLinesContent() ?? [];
        let linesRange: {
            image: string;
            line: number;
        }[] = [];

        lines.forEach((line, index) => {
            const match = line.match(regexLoad);
            if (!match) return;

            const url = line.replace(regexLoad, (_, url) => {
                return url;
            });

            const normalizedUrl = url.replace(/^\/|\/$/g, "").replace(
                /"/g,
                "",
            ).replace(";", "");

            linesRange.push({
                image: normalizedUrl,
                line: index + 1,
            });
        });

        gylphDecorations.set(linesRange.map(({ image, line }) => ({
            range: new monaco.Range(line, 1, line, 1),
            options: {
                glyphMarginClassName: "monaco-glyph-margin",
                glyphMarginHoverMessage: {
                    value: `![image](http://localhost:5173/${image})`,
                    isTrusted: true,
                },
            },
        })));
    },
    showNotification(message) {
        toast(message);
    },
}));
