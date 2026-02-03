import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type FC, useEffect } from "react";
import {
    FocusFrame,
    useFocusFrameRef,
} from "../../../components/UI/FocusFrame";
import { useBeforeUnload } from "../../../hooks/useBeforeUnload";
import { useConfig } from "../../../hooks/useConfig.ts";
import { useEditor } from "../../../hooks/useEditor.ts";
import { useProject } from "../../Projects/stores/useProject.ts";
import { loadFileInModel } from "../application/loadFileInModel";
import makeKeybindingsGlobal from "../application/makeKeybindingsGlobal";
import { formatAction } from "../monaco/actions/format.ts";
import { createConfetti } from "../monaco/fun/createConfetti";
import { configMonaco } from "../monaco/monacoConfig.ts";

interface MonacoEditorProps {
    onMount?: () => void;
}

export const MonacoEditor: FC<MonacoEditorProps> = (props) => {
    const updateFile = useProject((s) => s.updateFile);
    const getFile = useProject((s) => s.getFile);
    const projectIsSaved = useProject((s) => s.projectIsSaved);
    const run = useEditor((s) => s.run);
    const pause = useEditor((s) => s.pause);
    const stop = useEditor((s) => s.stop);
    const update = useEditor((s) => s.update);
    const updateImageDecorations = useEditor((s) => s.updateImageDecorations);
    const setRuntime = useEditor((s) => s.setRuntime);
    const getRuntime = useEditor((s) => s.getRuntime);
    const focusGame = useEditor((s) => s.focusGame);
    const updateEditorLastSavedValue = useEditor((s) =>
        s.updateEditorLastSavedValue
    );
    const updateHasUnsavedChanges = useEditor((s) => s.updateHasUnsavedChanges);
    const hasUnsavedChanges = useEditor((s) =>
        s.getRuntime().hasUnsavedChanges
    );
    const getConfig = useConfig((s) => s.getConfig);
    const setConfigKey = useConfig((s) => s.setConfigKey);
    const focusFrameRef = useFocusFrameRef();

    useBeforeUnload(hasUnsavedChanges);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);
        run();
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        setRuntime({
            editor,
            monaco,
            confettiCanvas: createConfetti(),
        });

        const currentFile = getRuntime().currentFile;

        props.onMount?.();
        editor.setValue(getFile(currentFile)?.value ?? "");

        editor.onDidChangeModelContent((ev) => {
            if (ev.isFlush) return;

            const currentProjectFile = getFile(getRuntime().currentFile);

            if (!currentProjectFile) {
                throw new Error(
                    "[monaco] Tried to update a file that doesn't exist",
                );
            }

            updateFile(currentProjectFile.path, editor.getValue());
            updateImageDecorations();
        });

        editor.onDidChangeModel(() => {
            updateImageDecorations();
        });

        editor.onDidChangeModelContent(() => {
            const projectKey = useProject.getState().projectKey;
            const isSaved = projectKey && projectIsSaved(projectKey);
            if (isSaved) updateEditorLastSavedValue();
            updateHasUnsavedChanges();
        });

        // Editor Shortcuts
        editor.addAction(makeKeybindingsGlobal({
            id: "run-game",
            label: "Run Game",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            ],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            run: () => {
                run();

                if (getConfig().autoFormat) {
                    editor.getAction("format-kaplay")?.run();
                }
            },
        }));

        editor.addAction(makeKeybindingsGlobal({
            id: "pause-resume-game",
            label: "Pause/Resume Game",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
            ],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.51,
            run: () => {
                pause();
            },
        }));

        editor.addAction(makeKeybindingsGlobal({
            id: "stop-game",
            label: "Stop Game",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyP,
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyS,
            ],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.52,
            run: () => {
                stop();
            },
        }));

        editor.addAction({
            id: "sync-file",
            label: "Sync File with Project",
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.6,
            run: () => {
                update();
            },
        });

        editor.addAction(formatAction(editor));

        editor.addAction({
            id: "toggle-word-wrap",
            label: "Toggle Word Wrap",
            keybindings: [
                monaco.KeyMod.Alt | monaco.KeyCode.KeyZ,
            ],
            run: () => {
                const isOn = editor.getRawOptions().wordWrap === "on";
                editor.updateOptions({ wordWrap: isOn ? "off" : "on" });
                setConfigKey("wordWrap", !isOn);
            },
        });

        editor.addAction(makeKeybindingsGlobal({
            id: "focus-editor",
            label: "Focus Editor",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE,
            ],
            run: () => {
                editor.focus();
                focusFrameRef.current?.blink();
            },
        }));

        editor.addAction(makeKeybindingsGlobal({
            id: "focus-editor-game",
            label: "Focus between Editor and Game",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote,
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backslash,
            ],
            run: () => {
                if (editor?.hasTextFocus() && getRuntime().iframe) {
                    focusGame();
                } else {
                    editor.focus();
                    focusFrameRef.current?.blink();
                }
            },
        }));

        let decorations = editor.createDecorationsCollection([]);

        setRuntime({
            glyphDecorations: decorations,
        });

        updateImageDecorations();

        for (const file of useProject.getState().project.files.values()) {
            loadFileInModel(file);
        }
    };

    useEffect(() => {
        useConfig.subscribe((state) => {
            useEditor.getState().runtime.editor?.updateOptions({
                wordWrap: state.config.wordWrap ? "on" : "off",
            });
        });
    }, []);

    return (
        <div
            id="monaco-editor-wrapper"
            className="h-full bg-base-200 rounded-xl relative"
        >
            <Editor
                defaultPath={getRuntime().currentFile}
                defaultLanguage="javascript"
                defaultValue={getFile(getRuntime().currentFile)?.value}
                beforeMount={handleEditorBeforeMount}
                onMount={handleEditorMount}
                theme={"Spiker"}
                loading={null}
                language="javascript"
                options={{
                    fontFamily: "\"DM Mono\", monospace",
                    fontSize: 16,
                    lineHeight: 25,
                    tabSize: 4,
                    insertSpaces: true,
                    trimAutoWhitespace: true,
                    padding: {
                        top: 12,
                    },
                    glyphMargin: true,
                    lineNumbersMinChars: 2,
                    folding: true,
                    minimap: {
                        enabled: false,
                    },
                    scrollbar: {
                        useShadows: false,
                        verticalScrollbarSize: 12,
                        horizontalScrollbarSize: 12,
                    },
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    wordWrap: getConfig().wordWrap ? "on" : "off",
                    smoothScrolling: true,
                    fixedOverflowWidgets: true,
                }}
            />

            <FocusFrame ref={focusFrameRef} />
        </div>
    );
};
