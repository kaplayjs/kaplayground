import { useEditor } from "../../../hooks/useEditor";

export const clearModels = () => {
    const { monaco, editor } = useEditor.getState().runtime;

    if (!editor || !monaco) {
        throw new Error("Tried to use Monaco editor before it was mounted");
    }

    const models = monaco.editor.getModels();

    for (const model of models) {
        model.dispose();
    }
};
