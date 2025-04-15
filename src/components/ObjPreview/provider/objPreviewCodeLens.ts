import { languages } from "monaco-editor";
import { useEditor } from "../../Editor/hooks/useEditor.ts";

export const objPreviewCodeLens: languages.CodeLensProvider = {
    provideCodeLenses: (model) => {
        const editorState = useEditor.getState();
        const code = model.getValue();
        const runObjPreviewId = editorState.runtime.commandIds.runObjPreview;
        let name = useEditor.getState().runtime.currentFile;

        if (!name.endsWith(".js") || !name.startsWith("objects/")) return;
        name = name.slice(8, -3); // Remove "objects/" and ".js"

        const regex = new RegExp(`\\badd[_]*${name}\\s*\\(`, "i");
        const match = code.match(regex);

        if (!match) {
            return null;
        }

        const start = match.index!;
        const end = start + match[0].length;
        const startLineNumber = model.getPositionAt(start).lineNumber;
        const startColumn = model.getPositionAt(start).column;
        const endLineNumber = model.getPositionAt(end).lineNumber;
        const endColumn = model.getPositionAt(end).column;

        return {
            lenses: [
                {
                    range: {
                        startLineNumber,
                        startColumn,
                        endLineNumber,
                        endColumn,
                    },
                    id: "First Line",
                    command: {
                        id: runObjPreviewId!,
                        title: "Preview Object",
                        arguments: [model],
                    },
                },
            ],
            dispose: () => {},
        };
    },
    resolveCodeLens: (_model, codeLens) => {
        return codeLens;
    },
};
