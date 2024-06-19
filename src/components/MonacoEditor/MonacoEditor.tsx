import { Editor, type Monaco } from "@monaco-editor/react";

import type { editor } from "monaco-editor";
import { type FC, useEffect } from "react";
import { $editorInstance, $editorTheme, $playgroundCode } from "../../stores";
import { configMonaco } from "./configMonaco";
import EditorLoading from "./EditorLoading";

const MonacoEditor: FC<{}> = () => {
    const handleChange = (value: string | undefined) => {
        $playgroundCode.set(value ?? "");
    };

    const handleMount = (editor: editor.IStandaloneCodeEditor) => {
        $editorInstance.set(editor);
        editor.setValue($playgroundCode.get());
    };

    useEffect(() => {
        $editorTheme.subscribe((theme) => {
            if ($editorInstance.get()) {
                $editorInstance.get()?.updateOptions({
                    theme,
                });
            }
        });
    }, []);

    return (
        <Editor
            theme="kaplayrk"
            language={"javascript"}
            options={{
                fontSize: 20,
                fontFamily: "Fira Code",
                fontLigatures: true,
            }}
            defaultValue={$playgroundCode.get()}
            path={"main.js"}
            onChange={handleChange}
            beforeMount={configMonaco}
            onMount={handleMount}
            loading={<EditorLoading />}
        />
    );
};

export default MonacoEditor;
