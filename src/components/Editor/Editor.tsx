import { type File, useFiles } from "@/hooks/useFiles";
import { decompressCode } from "@/util/compressCode";
import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { configMonaco } from "./monacoConfig";

type Props = {
    onRun: () => void;
    onMount?: (editor: editor.IStandaloneCodeEditor) => void;
    path: string;
    file?: File;
};

export type EditorRef = {
    getValue: () => string | undefined;
    focus: () => void;
    setTheme: (theme: string) => void;
};

const MonacoEditor = forwardRef<EditorRef, Props>((props, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [files, getCurrentFile, updateFile] = useFiles((state) => [
        state.files,
        state.getCurrentFile,
        state.updateFile,
    ]);
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

            updateFile(getCurrentFile().name, decompressCode(codeUrl));
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

        editor.setValue(getCurrentFile().value);

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
        updateFile(props.file?.name!, value ?? "");
    };

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
        focus: () => editorRef.current?.focus(),
        setTheme: (theme: string) => {
            editorRef.current?.updateOptions({ theme });
        },
    }));

    useEffect(() => {
        if (editorRef.current?.getValue() !== getCurrentFile().value) {
            editorRef.current?.setValue(getCurrentFile().value);
        }
    }, [files]);

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={getCurrentFile().value}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            theme="vs-dark"
            language="javascript"
            options={{
                fontSize: 20,
            }}
            path={props.file?.name}
        />
    );
});

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
