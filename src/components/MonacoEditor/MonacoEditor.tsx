import { Editor, type Monaco } from "@monaco-editor/react";
import { useStore } from "@nanostores/react";
import type { FileNode } from "@webcontainer/api";
import type { editor } from "monaco-editor";
import { type FC, useEffect } from "react";
import {
    $editorInstance,
    $fileExplorer,
    $gameViewElement,
    $isEditor,
    $isPlayground,
    $playgroundCode,
} from "../../stores/playground";
import { $currentEditingFile, $project } from "../../stores/project";
import { configMonaco } from "./configMonaco";
import EditorLoading from "./EditorLoading";

const langByExt = {
    ".html": "html",
    ".css": "css",
    ".js": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".ts": "typescript",
    ".json": "json",
    ".jsx": "javascript",
};

const getLanguage = (path: string) => {
    const ext = path.split(".").pop();
    return langByExt[`.${ext}` as keyof typeof langByExt] ?? "plaintext";
};

const MonacoEditor: FC<{}> = () => {
    const currentEditingFile = useStore($currentEditingFile);
    const project = useStore($project);

    const handleChange = (value: string | undefined) => {
        $playgroundCode.set(value ?? "");

        if ($isEditor.get()) {
            $project.setKey("files", {
                ...$project.get().files,
                [currentEditingFile]: {
                    file: {
                        contents: value ?? "",
                    },
                    saved: false,
                },
            });

            $fileExplorer.get()?.syncFile(currentEditingFile);
        }
    };

    const handleMount = (editor: editor.IStandaloneCodeEditor) => {
        $editorInstance.set(editor);
        $gameViewElement.get()?.run();

        if (!$isPlayground.get()) return;
        editor.setValue($playgroundCode.get());
    };

    useEffect(() => {
        if (!$isEditor.get()) return;

        const file = project.files[currentEditingFile] as FileNode;

        if (file) {
            $editorInstance.get()?.setValue(file.file.contents.toString());
        }
    }, [currentEditingFile]);

    return (
        <Editor
            defaultValue={$playgroundCode.get()}
            theme="vs-dark"
            language={getLanguage(currentEditingFile) ?? "javascript"}
            options={{
                fontSize: 20,
            }}
            path={currentEditingFile ?? "main.js"}
            onChange={handleChange}
            beforeMount={configMonaco}
            onMount={handleMount}
            loading={<EditorLoading />}
        />
    );
};

export default MonacoEditor;
