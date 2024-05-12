import { useProject } from "@/hooks/useProject";
import { decompressCode } from "@/util/compressCode";
import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { configMonaco } from "./monacoConfig";

type Props = {
    onRun: () => void;
    onMount?: (editor: editor.IStandaloneCodeEditor) => void;
    path: string;
};

export type EditorRef = {
    getValue: () => string | undefined;
    setValue: (value: string) => void;
    focus: () => void;
    setTheme: (theme: string) => void;
};

const IMPORT_CODE_ALERT =
    "Are you sure you want to open this example? This will permanently replace your current project. You can export your current project to save it.";

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const [
        getCurrentFile,
        updateFile,
        replaceProject,
    ] = useProject((state) => [
        state.getCurrentFile,
        state.updateFile,
        state.replaceProject,
    ]);
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
                    kind: "kaboom",
                    language: "javascript",
                    name: "kaboom.js",
                    value: decompressCode(codeUrl),
                }],
                assets: [],
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
    };

    const handleEditorChange = (value: string | undefined) => {
        updateFile(getCurrentFile()!.name, value ?? "");
    };

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
        setValue: (value: string) => editorRef.current?.setValue(value),
        focus: () => editorRef.current?.focus(),
        setTheme: (theme: string) => {
            editorRef.current?.updateOptions({ theme });
        },
    }));

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={""}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            theme="vs-dark"
            language="javascript"
            options={{
                fontSize: 20,
            }}
            path={getCurrentFile()?.name ?? "kaboom.js"}
        />
    );
});

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
