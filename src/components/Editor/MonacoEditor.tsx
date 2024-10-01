import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { debug } from "../../util/logs";
import { configMonaco } from "./monacoConfig";

type Props = {
    onMount?: () => void;
};

const MonacoEditor: FC<Props> = (props) => {
    const { updateFile, getFile } = useProject();
    const { run, update, updateImageDecorations, getRuntime, setRuntime } =
        useEditor();

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        setRuntime({ editor, monaco });
        const currentFile = getRuntime().currentFile;

        props.onMount?.();
        editor.setValue(getFile(currentFile)?.value ?? "");

        editor.onDidChangeModelContent((ev) => {
            if (ev.isFlush) {
                // set value

                updateImageDecorations();
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

        let decorations = editor.createDecorationsCollection([]);
        getRuntime().gylphDecorations = decorations;

        run();
    };

    return (
        <Editor
            defaultLanguage="javascript"
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            theme="kaplayrk"
            language="javascript"
            options={{
                fontSize: 20,
                glyphMargin: true,
                lineNumbersMinChars: 2,
                folding: false,
            }}
        />
    );
};

export default MonacoEditor;
