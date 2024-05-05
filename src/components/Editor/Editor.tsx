import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { decompressCode } from "../../util/compressCode";
import { configMonaco } from "./monacoConfig";

type Props = {
    onRun: () => void;
    onMount?: (editor: editor.IStandaloneCodeEditor) => void;
};

export type EditorRef = {
    getValue: () => string | undefined;
    focus: () => void;
    setTheme: (theme: string) => void;
};

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    let [defaultCode, setDefaultCode] = useState<string | null>(null);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);

        const codeUrl = new URL(window.location.href).searchParams.get("code");

        try {
            if (!codeUrl) {
                return setDefaultCode(
                    "kaboom();\nloadBean();\n\nadd([\n    sprite(\"bean\")\n]);\n\ndebug.log(\"ohhi\");",
                );
            }

            setDefaultCode(
                decompressCode(codeUrl),
            );
        } catch {
            setDefaultCode("kaboom()\n\ndebug.log(\"ohhi\");");
        }
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        editorRef.current = editor;
        props.onMount?.(editorRef.current);

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

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
        focus: () => editorRef.current?.focus(),
        setTheme: (theme: string) => {
            editorRef.current?.updateOptions({ theme });
        },
    }));

    return (
        <Editor
            height="100%"
            width={800}
            defaultLanguage="javascript"
            value={defaultCode!}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            theme="vs-dark"
            language="javascript"
            options={{
                fontSize: 20,
            }}
        />
    );
});

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
