import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { configMonaco } from "./monacoConfig";

type Props = {};

export type EditorRef = {
    getValue: () => string | undefined;
};

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorBeforeMount = (monaco: Monaco) => {
        configMonaco(monaco);
    };

    const handleEditorMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) => {
        editorRef.current = editor;
    };

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
    }));

    return (
        <Editor
            height="100%"
            width={800}
            defaultLanguage="javascript"
            defaultValue="// some comment"
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

export default MonacoEditor;
