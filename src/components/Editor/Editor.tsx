import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useProject } from "../../hooks/useProject";
import { decompressCode } from "../../util/compressCode";
import { configMonaco } from "./monacoConfig";

type Props = {
    onRun: () => void;
    onMount?: (editor: editor.IStandaloneCodeEditor) => void;
    path: string;
};

export type EditorRef = {
    focus: () => void;
    update: () => void;
    setTheme: (theme: string) => void;
};

const IMPORT_CODE_ALERT =
    "Are you sure you want to open this example? This will permanently replace your current project. You can export your current project to save it.";

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const {
        getCurrentFile,
        updateFile,
        replaceProject,
    } = useProject();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);

        const codeUrl = new URL(window.location.href).searchParams.get("code");
        if (!codeUrl) return;

        if (confirm(IMPORT_CODE_ALERT)) {
            replaceProject({
                files: [{
                    isCurrent: true,
                    isEncoded: false,
                    kind: "main",
                    language: "javascript",
                    name: "main.js",
                    value: decompressCode(codeUrl),
                }],
                resources: {},
            });
        }
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        editorRef.current = editor;
        props.onMount?.(editorRef.current);

        editor.setValue(getCurrentFile()?.value ?? "");

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
                props.onRun();
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
    };

    const handleEditorChange = (value: string | undefined) => {
        updateFile(getCurrentFile()!.name, value ?? "");
    };

    useImperativeHandle(ref, () => ({
        update: () => {
            editorRef.current?.setValue(getCurrentFile()?.value ?? "");
        },
        focus: () => editorRef.current?.focus(),
        setTheme: (theme: string) => {
            editorRef.current?.updateOptions({ theme });
        },
    }));

    useEffect(() => {
        const editorValue = editorRef.current?.getValue();
        const fileStoredValue = getCurrentFile()?.value;

        if (editorValue !== fileStoredValue) {
            editorRef.current?.setValue(fileStoredValue ?? "");
        }
    }, [editorRef.current?.getValue()]);

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={getCurrentFile()?.value ?? ""}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            theme="kaplayrk"
            language="javascript"
            options={{
                fontSize: 20,
            }}
            path={getCurrentFile()?.name ?? "main.js"}
        />
    );
});

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
