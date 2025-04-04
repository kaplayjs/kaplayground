import { Editor, type Monaco } from "@monaco-editor/react";
import confetti from "canvas-confetti";
import type { editor } from "monaco-editor";
import { type FC } from "react";
import { useConfig } from "../../hooks/useConfig.ts";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { debug } from "../../util/logs";
import { configMonaco } from "./monacoConfig";

type Props = {
    onMount?: () => void;
    defaultTheme?: string;
};

export const MonacoEditor: FC<Props> = (props) => {
    const { updateFile, getFile } = useProject();
    const {
        run,
        update,
        updateImageDecorations,
        getRuntime,
        setRuntime,
    } = useEditor();
    const { getConfig } = useConfig();

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

        editor.onDidChangeModel((ev) => {
            debug(0, "Model changed", ev.newModelUrl);
            editor.getModel()?.setValue(
                getFile(getRuntime().currentFile)?.value ?? "",
            );

            updateImageDecorations();
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

        editor.addAction({
            id: "format-kaplay",
            label: "Format file using KAPLAYGROUND",
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            run: () => {
                editor.getAction("editor.action.formatDocument")?.run();

                if (!getConfig().funFormat) return;

                var duration = 0.5 * 1000;
                var animationEnd = Date.now() + duration;

                (function frame() {
                    var timeLeft = animationEnd - Date.now();

                    canvas.confetti({
                        particleCount: 3,
                        spread: 1,
                        origin: {
                            x: Math.random(),
                            y: -0.05,
                        },
                        angle: 270,
                        startVelocity: 10,
                        gravity: 0.5,
                        ticks: 50,
                        colors: ["#fcef8d", "#abdd64", "#d46eb3"],
                    });

                    if (timeLeft > 0) {
                        requestAnimationFrame(frame);
                    }
                })();
            },
        });

        let decorations = editor.createDecorationsCollection([]);
        getRuntime().gylphDecorations = decorations;

        run();
    };

    return (
        <div id="monaco-editor-wrapper" className="h-full rounded-xl relative">
            <Editor
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
                        top: 10,
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
                }}
                path={getRuntime().currentFile}
            />
        </div>
    );
};
