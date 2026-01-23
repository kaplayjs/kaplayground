import type { Monaco } from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { editor } from "monaco-editor";
import { toast } from "react-toastify";
import { create } from "zustand";
import { kaplayVersions } from "../data/kaplayVersions.json";
import { wrapGame } from "../features/Projects/application/wrapGame";
import { useProject } from "../features/Projects/stores/useProject";
import { parseAssetPath } from "../util/assetsParsing";
import { debug } from "../util/logs";
import { MATCH_ASSET_URL_REGEX } from "../util/regex";

interface EditorRuntime {
    /**
     * The monaco code editor instance
     */
    editor: editor.IStandaloneCodeEditor | null;
    /**
     * The monaco instance
     */
    monaco: Monaco | null;
    /**
     * The stored view states for each file
     */
    viewStates: Record<string, editor.ICodeEditorViewState | null>;
    /**
     * The current selection in the editor
     */
    currentFile: string;
    /**
     * The last saved editor value
     */
    editorLastSavedValue: string | null;
    /**
     * If file was modified and not saved
     */
    hasUnsavedChanges: boolean;
    /**
     * Decorations for the gylph images
     */
    gylphDecorations: editor.IEditorDecorationsCollection | null;
    /**
     * Iframe element for the game view
     */
    iframe: HTMLIFrameElement | null;
    /**
     * Console element for the game view
     */
    console: Console | null;
    /**
     * Versions cached
     */
    kaplayVersions: string[];
    /**
     * The confetti canvas
     */
    confettiCanvas:
        | HTMLCanvasElement & {
            confetti: confetti.CreateTypes;
        }
        | null;
}

export interface EditorStore {
    runtime: EditorRuntime;
    stopped: boolean;
    update: (value?: string) => void;
    run: () => void;
    pause: () => void;
    stop: () => void;
    getRuntime: () => EditorRuntime;
    setRuntime: (runtime: Partial<EditorRuntime>) => void;
    setCurrentFile: (currentFile: string) => void;
    resetEditorModel: () => void;
    setTheme: (theme: string) => void;
    /**
     * Update Gylph image decorations for loadXXXX functions
     */
    updateImageDecorations: () => void;
    updateModelMarkers: () => void;
    showNotification: (message: string) => void;
    setEditorValue: (value: string) => void;
    updateEditorLastSavedValue: (value?: string) => void;
    updateHasUnsavedChanges: () => void;
    updateAndRun: () => void;
}

export const useEditor = create<EditorStore>((set, get) => ({
    runtime: {
        editor: null,
        monaco: null,
        currentFile: "main.js",
        editorLastSavedValue: null,
        hasUnsavedChanges: false,
        gylphDecorations: null,
        iframe: null,
        console: null,
        viewStates: {},
        kaplayVersions: kaplayVersions,
        confettiCanvas: null,
    },
    stopped: (new URL(window.location.href)).searchParams.has("stopped"),
    setRuntime: (runtime) => {
        set((state) => ({
            runtime: {
                ...state.runtime,
                ...runtime,
            },
        }));
    },
    getRuntime: () => get().runtime,
    setCurrentFile: (newCurrentFile) => {
        const editor = get().runtime.editor;
        const monaco = get().runtime.monaco;
        const currentFile = get().runtime.currentFile;
        const viewStates = get().runtime.viewStates;
        // remove initial /
        newCurrentFile = newCurrentFile.replace(/^\/|\/$/g, "");

        if (!editor || !monaco) {
            return set({
                runtime: {
                    ...get().runtime,
                    currentFile: newCurrentFile,
                },
            });
        }

        // Previous view state saving
        viewStates[currentFile] = editor.saveViewState();

        // Model changing logic
        let currentFileModel = monaco.editor.getModel(
            monaco.Uri.file(newCurrentFile),
        );

        if (!currentFileModel) {
            currentFileModel = monaco.editor.createModel(
                useProject.getState().getFile(newCurrentFile)?.value ?? "",
                "javascript",
                monaco.Uri.file(newCurrentFile),
            );
        }

        editor.setModel(currentFileModel);

        // Load new view state
        const viewState = viewStates[newCurrentFile];

        if (viewState) {
            editor.restoreViewState(viewState);
        }

        editor.focus();

        set((state) => ({
            runtime: {
                ...state.runtime,
                currentFile: newCurrentFile,
                viewStates: viewStates,
            },
        }));

        get().updateEditorLastSavedValue();
    },
    resetEditorModel: () => {
        const monaco = get().runtime.monaco;
        if (!monaco) return;

        set((state) => ({
            runtime: {
                ...state.runtime,
                viewStates: {},
            },
        }));

        monaco.editor.getModels().forEach(model => model.dispose());
    },
    update: (customValue?: string) => {
        if (customValue) {
            debug(0, "[codeEditor] Editor value updated with custom value");

            get().setEditorValue(customValue);
            return;
        }

        const currentFile = useProject.getState().getFile(
            get().getRuntime().currentFile,
        );
        if (!currentFile) return;

        debug(
            0,
            "[monaco] Editor value forced updated with",
            currentFile.path.slice(0, 25) + "...",
        );

        get().updateEditorLastSavedValue(currentFile.value);

        get().setEditorValue(currentFile.value);
        get().updateImageDecorations();
    },
    setTheme: (theme: string) => {
        const editor = get().runtime.editor;
        if (!editor) return;

        editor.updateOptions({
            theme,
        });
    },
    run() {
        if (
            get().stopped
            && new URLSearchParams(window.location.search).has("stopped")
        ) {
            const url = new URL(window.location.href);
            url.searchParams.delete("stopped");
            window.history.replaceState({}, "", url);
            return;
        }

        set({ stopped: false });

        const iframe = document.querySelector<HTMLIFrameElement>(
            "#game-view",
        );

        // Refresh the iframe
        if (iframe) iframe.src = iframe.src;

        window.addEventListener(
            "message",
            ({ data, source }: MessageEvent<{ type: string }>) => {
                if (data.type != "READY") return;

                console.log("[game] iframe loaded");
                const code = wrapGame();
                const iframeContentWindow = source as Window;

                if (!iframeContentWindow) return;

                code.then((d) => {
                    iframeContentWindow.postMessage(
                        {
                            type: "UPDATE_CODE",
                            code: d,
                        },
                        "*",
                    );
                });
            },
            { once: true, passive: true },
        );
    },
    pause() {
        if (!get().stopped) {
            get().runtime.iframe?.contentWindow?.postMessage(
                { type: "PAUSE" },
                "*",
            );
        } else {
            get().run();
        }
    },
    stop() {
        set({ stopped: true });
    },
    updateImageDecorations() {
        debug(0, "[monaco] Updating gylph decorations");
        const editor = get().runtime.editor;
        const monaco = get().runtime.monaco;
        const gylphDecorations = get().runtime.gylphDecorations;
        const model = editor?.getModel();

        if (!editor || !monaco || !model || !gylphDecorations) return;

        // for each every line
        const lines = editor.getModel()?.getLinesContent() ?? [];

        let linesRange: {
            image: string;
            line: number;
        }[] = [];

        lines.forEach((line, index) => {
            if (index < editor.getVisibleRanges()[0].startLineNumber - 1) {
                return;
            }

            const match = [...line.matchAll(MATCH_ASSET_URL_REGEX)]?.[0];
            const url = match?.[1];

            if (!url || match?.[0]?.includes("Sound")) return;

            linesRange.push({
                image: parseAssetPath(url, match[0]),
                line: index + 1,
            });
        });

        const decorations = linesRange.map(
            ({ image, line }) => {
                return {
                    range: new monaco.Range(line, 1, line, 1),
                    options: {
                        glyphMarginClassName:
                            "monaco-glyph-margin-preview-image",
                        glyphMarginHoverMessage: {
                            value: `![image](${image})`,
                            isTrusted: true,
                        },
                        hoverMessage: {
                            value: image,
                        },
                    },
                } satisfies editor.IModelDeltaDecoration;
            },
        );

        gylphDecorations.set(decorations);
    },
    updateModelMarkers() {
        debug(0, "[monaco] Updating gylph decorations");
        const editor = get().runtime.editor;
        const monaco = get().runtime.monaco;
        const model = editor?.getModel();

        if (!editor || !monaco || !model) return;

        const regexAdd = /add\(\[[^"]\]\)/g;

        // for each every line
        const lines = editor.getModel()?.getLinesContent() ?? [];

        let linesRange: {
            image: string;
            line: number;
        }[] = [];

        lines.forEach((line, index) => {
            const match = line.match(regexAdd);
            if (!match) return;

            const url = line.replace(regexAdd, (_, url) => {
                return url;
            });

            const normalizedUrl = url.replace(/^\/|\/$/g, "").replace(
                /"/g,
                "",
            ).replace(";", "");

            const projectAsset = useProject.getState().project.assets
                .get(
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
    },
    showNotification(message) {
        toast(message);
    },
    setEditorValue(value) {
        const editor = get().runtime.editor;
        if (!editor) return;

        debug(
            0,
            "[editor] Setting editor value to",
            value.slice(0, 25) + "...",
        );

        editor.setValue(value);
    },
    updateEditorLastSavedValue(value) {
        set((state) => ({
            runtime: {
                ...state.runtime,
                editorLastSavedValue:
                    (value ?? get().runtime.editor?.getValue()) ?? null,
            },
        }));
    },
    updateHasUnsavedChanges() {
        const editor = get().runtime.editor;
        if (!editor) return;

        set((state) => ({
            runtime: {
                ...state.runtime,
                hasUnsavedChanges: get().getRuntime().editorLastSavedValue
                    != editor.getValue(),
            },
        }));
    },
    updateAndRun() {
        get().getRuntime().editor?.setScrollTop(0);
        get().update();
        get().run();
    },
}));
