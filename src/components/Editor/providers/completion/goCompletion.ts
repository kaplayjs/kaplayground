import { languages } from "monaco-editor";
import { SCENE_NAME_REGEX } from "../../../../util/regex.ts";
import { useEditor } from "../../hooks/useEditor.ts";

type CompletionProviderFunc =
    languages.CompletionItemProvider["provideCompletionItems"];

export const goCompletion: CompletionProviderFunc = (model, pos) => {
    const monaco = useEditor.getState().runtime.monaco!;
    const suggestions: languages.CompletionItem[] = [];
    const code = model.getValue();
    const scenes = [...code.matchAll(SCENE_NAME_REGEX)].map(match => match[1]);

    const textBeforeCursor = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: pos.lineNumber,
        endColumn: pos.column,
    });

    const textAfterCursor = model.getValueInRange({
        startLineNumber: pos.lineNumber,
        startColumn: pos.column,
        endLineNumber: model.getLineCount(),
        endColumn: model.getLineMaxColumn(model.getLineCount()),
    });

    const goCallMatch = /(?:\b(?:k\.)?go\s*\(\s*)[^\]]*$/.test(
        textBeforeCursor,
    );

    // Make sure the array closes *after* the cursor
    const bracketsAreOpen = /^[^\]]*\)/.test(textAfterCursor);

    if (goCallMatch && bracketsAreOpen) {
        const word = model.getWordUntilPosition(pos);
        const range = new monaco.Range(
            pos.lineNumber,
            word.startColumn,
            pos.lineNumber,
            word.endColumn,
        );

        scenes.forEach((scene, i) => {
            suggestions.push({
                label: `${scene}`,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${scene}"`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule
                    .InsertAsSnippet,
                range,
                sortText: "000" + i,
            });
        });
    }

    return { suggestions };
};
