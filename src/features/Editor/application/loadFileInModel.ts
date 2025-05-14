import { useEditor } from "../../../hooks/useEditor";
import { debug } from "../../../util/logs";
import type { File } from "../../Projects/models/File";

export const loadFileInModel = async (file: File) => {
    const runtime = useEditor.getState().runtime;
    const editor = runtime.editor;
    const monaco = runtime.monaco;

    if (!editor || !monaco) {
        throw new Error("Tried to use Monaco editor before it was mounted");
    }

    if (monaco.editor.getModel(monaco.Uri.parse(file.path))) {
        return;
    }

    monaco.editor.createModel(
        file.value,
        "javascript",
        monaco.Uri.parse(file.path),
    );

    debug(0, "[editor] loaded model", file.path);
};
