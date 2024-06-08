import {
    editorInstance,
    gameViewElement,
    playgroundCode,
} from "@/stores/playground";
import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { FC } from "react";
import { configMonaco } from "./configMonaco";
import EditorLoading from "./EditorLoading";

const MonacoEditor: FC<{}> = () => {
    const handleChange = (value: string | undefined) => {
        playgroundCode.set(value ?? "");
    };

    const handleMount = (editor: editor.IStandaloneCodeEditor) => {
        editor.setValue(playgroundCode.get());
        editorInstance.set(editor);
        gameViewElement.get()?.runCode(playgroundCode.get());
    };

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={""}
            theme="vs-dark"
            language="javascript"
            options={{
                fontSize: 20,
            }}
            path={"main.js"}
            onChange={handleChange}
            beforeMount={configMonaco}
            onMount={handleMount}
            loading={<EditorLoading />}
        />
    );
};

export default MonacoEditor;
