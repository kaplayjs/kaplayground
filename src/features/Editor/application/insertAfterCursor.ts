import { useEditor } from "../../../hooks/useEditor";

export const insertAfterCursor = (text: string) => {
    const monacoEditor = useEditor.getState().runtime.editor;

    if (monacoEditor) {
        const model = monacoEditor.getModel();
        const selection = monacoEditor.getSelection();
        const position = selection?.getPosition();

        if (model && position) {
            const newText = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            }) + text;

            model.pushEditOperations(
                [],
                [
                    {
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column,
                        },
                        text: newText,
                        forceMoveMarkers: true,
                    },
                ],
                () => null,
            );
        }
    }
};
