import { Editor, type Monaco } from "@monaco-editor/react";
import confetti from "canvas-confetti";
import type { editor } from "monaco-editor";
import { type FC } from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { useConfig } from "../../hooks/useConfig.ts";
import { useEditor } from "../../hooks/useEditor";
import { debug } from "../../util/logs";
import { formatAction } from "./actions/format";
import { configMonaco } from "./monacoConfig";

type Props = {
    onMount?: () => void;
    defaultTheme?: string;
};

export const MonacoEditor: FC<Props> = (props) => {
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
        setRuntime({ editor, monaco });
        const currentFile = getRuntime().currentFile;

        // Create canvas
        const canvas = document.createElement("canvas") as HTMLCanvasElement & {
            confetti: confetti.CreateTypes;
        };
        canvas.style.position = "absolute";
        canvas.style.pointerEvents = "none"; // Prevent interactions
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        document.getElementById("monaco-editor-wrapper")!.appendChild(canvas);

        // Confetti thing setup
        canvas.confetti = confetti.create(canvas, { resize: true });

        props.onMount?.();
        editor.setValue(getFile(currentFile)?.value ?? "");

        editor.onDidChangeModelContent((ev) => {
            if (ev.isFlush) {
            } else {
                const currentProjectFile = getFile(getRuntime().currentFile);
                if (!currentProjectFile) {
                    return debug(0, "Current file not found");
                }

                debug(
                    0,
                    "Due to text editor change, updating file",
                    currentProjectFile.path,
                );

                updateFile(currentProjectFile.path, editor.getValue());
            }

            updateImageDecorations();
        });

        editor.onDidChangeModel((e) => {
            console.log(
                "tried to change model to",
                e.oldModelUrl,
                e.newModelUrl,
            );
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

        editor.addAction(formatAction(editor, getConfig(), canvas));

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

    return (
        <div id="monaco-editor-wrapper" className="h-full rounded-xl relative">
            <Editor
                defaultPath={getRuntime().currentFile}
                defaultLanguage="javascript"
                defaultValue={getFile(getRuntime().currentFile)?.value}
                beforeMount={handleEditorBeforeMount}
                onMount={handleEditorMount}
                theme={localStorage.getItem("theme") || "Spiker"}
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
