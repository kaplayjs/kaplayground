import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type FC, useEffect } from "react";
import { useConfig } from "../../../hooks/useConfig.ts";
import { useEditor } from "../../../hooks/useEditor.ts";
import { useProject } from "../../Projects/stores/useProject.ts";
import { formatAction } from "../monaco/actions/format.ts";
import { createConfetti } from "../monaco/fun/createConfetti";
import { configMonaco } from "../monaco/monacoConfig.ts";

interface MonacoEditorProps {
    onMount?: () => void;
}

export const MonacoEditor: FC<MonacoEditorProps> = (props) => {
    const updateFile = useProject((s) => s.updateFile);
    const getFile = useProject((s) => s.getFile);
    const run = useEditor((s) => s.run);
    const update = useEditor((s) => s.update);
    const updateImageDecorations = useEditor((s) => s.updateImageDecorations);
    const setRuntime = useEditor((s) => s.setRuntime);
    const getRuntime = useEditor((s) => s.getRuntime);
    const getConfig = useConfig((s) => s.getConfig);
    const setConfigKey = useConfig((s) => s.setConfigKey);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);
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

        editor.onDidScrollChange(() => {
            updateImageDecorations();
        });

        editor.onDidChangeModelDecorations(() => {
            const decorations = document.querySelectorAll<HTMLElement>(
                ".monaco-glyph-margin-preview-image",
            );

            decorations.forEach((e, i) => {
                const decRange = getRuntime().gylphDecorations?.getRange(i);
                if (!decRange) return;

                const dec = editor.getDecorationsInRange(decRange)?.[0];
                const realImage = dec?.options.hoverMessage!;

                if (!Array.isArray(realImage) && realImage?.value) {
                    e.style.setProperty("--image", `url("${realImage.value}")`);
                }
            });
        });

        // Editor Shortcuts
        editor.addAction({
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
        });

        editor.addAction({
            id: "sync-file",
            label: "Sync File with Project",
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
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

        let decorations = editor.createDecorationsCollection([]);

        setRuntime({
            gylphDecorations: decorations,
        });

        updateImageDecorations();
        run();
    };

    useEffect(() => {
        useConfig.subscribe((state) => {
            useEditor.getState().runtime.editor?.updateOptions({
                wordWrap: state.config.wordWrap ? "on" : "off",
            });
        });
    }, []);

    return (
        <div id="monaco-editor-wrapper" className="h-full rounded-xl relative">
            <Editor
                defaultPath={getRuntime().currentFile}
                defaultLanguage="javascript"
                defaultValue={getFile(getRuntime().currentFile)?.value}
                beforeMount={handleEditorBeforeMount}
                onMount={handleEditorMount}
                theme={"Spiker"}
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
                }}
            />
        </div>
    );
};
