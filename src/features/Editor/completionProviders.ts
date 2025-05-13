import { languages } from "monaco-editor";
import { useEditor } from "../../hooks/useEditor.ts";
import { compMap } from "./monaco/snippets/compSnippets.ts";

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

    // Check that we're inside something like "add(["
    const isInsideAdd = /(?:\b(?:k\.)?add\s*\(\s*\[)[^\]]*$/.test(
        textBeforeCursor,
    );

    // Check that the array is not closed yet after the cursor
    const isInsideArray = /^[^\]]*\]/.test(textAfterCursor);

    // Count brackets only inside the array (after the `add([`)
    const textInsideArray =
        textBeforeCursor.split(/(?:\b(?:k\.)?add\s*\(\s*\[)/).pop() || "";

    let openParens = 0;
    let openBrackets = 0;
    let openBraces = 0;

    for (const char of textInsideArray) {
        if (char === "(") openParens++;
        if (char === ")") openParens--;
        if (char === "[") openBrackets++;
        if (char === "]") openBrackets--;
        if (char === "{") openBraces++;
        if (char === "}") openBraces--;
    }

    const isInsideNested = openParens > 0 || openBrackets > 0
        || openBraces > 0;

    if (isInsideAdd && isInsideArray && !isInsideNested) {
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
