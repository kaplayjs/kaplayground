import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { decompressCode } from "../../util/compressCode";
import { configMonaco } from "./monacoConfig";

type Props = {
    onMount?: () => void;
};

const IMPORT_CODE_ALERT =
    "Are you sure you want to open this example? This will permanently replace your current project. You can export your current project to save it.";

const MonacoEditor: FC<Props> = (props) => {
    const { updateFile, replaceProject, addFile, getFile } = useProject();
    const { setEditor, run, update, currentFile } = useEditor();

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
            label: "Sync Game",
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            run: () => {
                update();
            },
        });

        editor.createDecorationsCollection([
            {
                options: {
                    isWholeLine: true,
                    glyphMarginClassName: "image-glyph",
                },
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 1,
                    endColumn: 1,
                },
            },
        ]);

        run();
    };

    const handleEditorChange = (value: string | undefined) => {
        console.debug("Editor changed value");
        const currentProjectFile = getFile(currentFile);

        if (!currentProjectFile) return console.debug("Current file not found");

        updateFile(currentFile, value ?? "");
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
            }}
            path={getFile(currentFile)?.path ?? "main.js"}
        />
    );
};

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;