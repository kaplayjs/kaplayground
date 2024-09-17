import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { decompressCode } from "../../util/compressCode";
import { debug } from "../../util/logs";
import { configMonaco } from "./monacoConfig";

type Props = {
    onMount?: () => void;
};

const IMPORT_CODE_ALERT =
    "Are you sure you want to open this example? This will permanently replace your current project. You can export your current project to save it.";

const MonacoEditor: FC<Props> = (props) => {
    const { updateFile, replaceProject, addFile, getFile } = useProject();
    const {
        setEditor,
        run,
        update,
        currentFile,
        setMonaco,
        updateImageDecorations,
        setGylphDecorations,
        getCurrentFile,
    } = useEditor();

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);

        const codeUrl = new URL(window.location.href).searchParams.get("code");
        if (!codeUrl) return;

        if (confirm(IMPORT_CODE_ALERT)) {
            replaceProject({
                files: new Map(),
                assets: new Map(),
                kaplayConfig: {},
                version: "2.0.0",
                mode: "example",
            });

            const code = decompressCode(codeUrl);

            addFile({
                name: "main.js",
                value: code,
                kind: "main",
                language: "javascript",
                path: "main.js",
            });
        }
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        setEditor(editor);
        setMonaco(monaco);
        props.onMount?.();
        editor.setValue(getFile(currentFile)?.value ?? "");

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
        setGylphDecorations(decorations);

        run();
    };

    const handleEditorChange = (value: string | undefined) => {
        const currentProjectFile = getFile(getCurrentFile());
        if (!currentProjectFile) return debug(0, "Current file not found");

        debug(
            0,
            "Due to editor change, updating file",
            currentProjectFile.path,
        );

        updateFile(currentProjectFile.path, value ?? "");
        updateImageDecorations();
    };

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={getFile(currentFile)?.value}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
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

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
