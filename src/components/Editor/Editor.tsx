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

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const [
        getCurrentFile,
        updateFile,
    ] = useProject((state) => [
        state.getCurrentFile,
        state.updateFile,
    ]);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);

        const codeUrl = new URL(window.location.href).searchParams.get("code");

        if (!codeUrl) return;
        updateFile(getCurrentFile()!.name, decompressCode(codeUrl));
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
