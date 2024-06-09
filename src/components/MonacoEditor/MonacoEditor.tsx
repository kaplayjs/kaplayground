import { Editor, type Monaco } from "@monaco-editor/react";
import { useStore } from "@nanostores/react";
import type { FileNode } from "@webcontainer/api";
import type { editor } from "monaco-editor";
import { type FC, useEffect } from "react";
import {
    $editorInstance,
    $gameViewElement,
    $isEditor,
    $isPlayground,
    $playgroundCode,
} from "../../stores/playground";
import {
    $currentEditingFile,
    $project,
    $webContainer,
} from "../../stores/project";
import { configMonaco } from "./configMonaco";
import EditorLoading from "./EditorLoading";

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
                },
            });
        }
    };

    const handleMount = (editor: editor.IStandaloneCodeEditor) => {
        if (!$isPlayground.get()) return;

        editor.setValue($playgroundCode.get());
        $editorInstance.set(editor);
        $gameViewElement.get()?.runCode($playgroundCode.get());
    };

    useEffect(() => {
        const file = project.files[currentEditingFile] as FileNode;

        if (file) {
            $editorInstance.get()?.setValue(file.file.contents.toString());
        }
    }, [currentEditingFile]);

    return (
        <Editor
            defaultLanguage="javascript"
            defaultValue={(project.files[currentEditingFile] as FileNode)?.file
                .contents.toString() ?? ""}
            theme="vs-dark"
            language="javascript"
            options={{
                fontSize: 20,
            }}
            path={currentEditingFile}
            onChange={handleChange}
            beforeMount={configMonaco}
            onMount={handleMount}
            loading={<EditorLoading />}
        />
    );
};

export default MonacoEditor;
