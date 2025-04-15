import { languages } from "monaco-editor";
import { useEditor } from "../../hooks/useEditor.ts";
import { compMap } from "./snippets/compSnippets.ts";

type CompletionProviderFunc =
    languages.CompletionItemProvider["provideCompletionItems"];

export const addCompletion: CompletionProviderFunc = (model, pos) => {
    const monaco = useEditor.getState().runtime.monaco!;
    const suggestions: languages.CompletionItem[] = [];

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

    // Look for something like "add([" or "k.add(["
    const addCallMatch = /(?:\b(?:k\.)?add\s*\(\s*\[)[^\]]*$/.test(
        textBeforeCursor,
    );

    // Make sure the array closes *after* the cursor
    const arrayIsOpen = /^[^\]]*\]/.test(textAfterCursor);

    if (addCallMatch && arrayIsOpen) {
        const word = model.getWordUntilPosition(pos);
        const range = new monaco.Range(
            pos.lineNumber,
            word.startColumn,
            pos.lineNumber,
            word.endColumn,
        );

        Object.keys(compMap).forEach((compId, i) => {
            const comp = compMap[compId];

            suggestions.push({
                label: `${comp.prettyName} - ${comp.description}`,
                documentation: {
                    value:
                        `${comp.description}\n\n[Check in KAPLAY Docs](https://kaplayjs.com/doc/ctx/${compId})`,
                    isTrusted: true,
                },
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: comp.template,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule
                    .InsertAsSnippet,
                range,
                sortText: "000" + i,
                command: {
                    id: "editor.action.triggerSuggest",
                    title: "Re-trigger completions",
                    tooltip: "Re-trigger completions",
                },
            });
        });
    }

    return { suggestions };
};
