import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { createRef, type MutableRefObject } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { wrapGame } from "../util/compiler";
import { debug } from "../util/logs";
import { useProject } from "./useProject";

/** The internal API to interact with the editor */
type EditorStore = {
    /** Monaco's editor instance */
    editor: editor.IStandaloneCodeEditor | null;
    /** Monaco instance */
    monaco: Monaco | null;
    /** The current file */
    currentFile: string;
    /** Gylph decorations */
    gylphDecorations: editor.IEditorDecorationsCollection | null;
    /** Set Monaco's editor instance */
    setEditor: (editor: editor.IStandaloneCodeEditor) => void;
    /** Set Monaco instance */
    setMonaco: (monaco: Monaco) => void;
    /** Set the current file */
    setCurrentFile: (path: string) => void;
    /** Get the current file path */
    getCurrentFile: () => string;
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
    /** Set value in Monaco instance */
    setEditorValue: (value: string) => void;
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
        get().update();
    },
    getCurrentFile: () => {
        return get().currentFile;
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
        const currentFile = useProject.getState().getFile(
            get().getCurrentFile(),
        );
        if (!currentFile) return;

        console.debug(
            "Editor value updated with currentFile",
            currentFile.path,
        );

        get().setEditorValue(currentFile.value);
        get().updateImageDecorations();
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

        iframe.srcdoc = wrapGame(parsedFiles);
    },
    updateImageDecorations() {
        debug(0, "Updating gylph decorations");
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

            const projectAsset = useProject.getState().project.assets.get(
                normalizedUrl.replace("assets/", ""),
            );

            if (projectAsset) {
                return linesRange.push({
                    image: projectAsset.url,
                    line: index + 1,
                });
            }

            linesRange.push({
                image: `http://localhost:5173/${normalizedUrl}`,
                line: index + 1,
            });
        });

        gylphDecorations.set(linesRange.map(({ image, line }) => ({
            range: new monaco.Range(line, 1, line, 1),
            options: {
                glyphMarginClassName: "monaco-glyph-margin",
                glyphMarginHoverMessage: {
                    value: `![image](${image})`,
                    isTrusted: true,
                },
            },
        })));
    },
    showNotification(message) {
        toast(message);
    },
    setEditorValue(value) {
        console.debug("Setting editor value to", value);

        const editor = get().editor;
        if (!editor) return console.error("No editor");

        editor.setValue(value);
    },
}));
