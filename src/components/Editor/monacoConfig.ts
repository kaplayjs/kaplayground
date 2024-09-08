import type { Monaco } from "@monaco-editor/react";
import kaplayGlobal from "../../../node_modules/kaplay/dist/declaration/global.d.ts?raw";
import kaplayModule from "../../../node_modules/kaplay/dist/doc.d.ts?raw";

const dataUrlRegex = /data:[^;]+;base64,[A-Za-z0-9+\/]+={0,2}/g;

export const configMonaco = (monaco: Monaco) => {
    // Add global KAPLAY types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaplayGlobal,
        "global.d.ts",
    );

    // Add the KAPLAY module
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaplayModule,
        "kaplay.d.ts",
    );

    // Hover dataUrl images
    monaco.languages.registerHoverProvider("javascript", {
        provideHover(model, position) {
            const line = model.getLineContent(position.lineNumber);
            const dataUrisInLine = line.match(dataUrlRegex);

            if (!dataUrisInLine) {
                return null;
            }

            const lineIndex = position.lineNumber - 1;
            const charIndex = line.indexOf(dataUrisInLine[0]);
            const length = dataUrisInLine[0].length;

            return {
                range: new monaco.Range(
                    lineIndex,
                    charIndex,
                    lineIndex,
                    length,
                ),
                contents: [
                    {
                        supportHtml: true,
                        value: `<img src="${dataUrisInLine[0]}" />`,
                    },
                ],
            };
        },
    });

    monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems(_model, position) {
            return {
                suggestions: [
                    {
                        label: "k-init",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: "kaplay();\nloadBean();",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                    },
                    {
                        label: "k-object",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: "const ${1:obj} = add([\n    ${2}\n]);",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-add",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: "add([\n    ${1}\n]);",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-onKeyPress",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText:
                            "onKeyPress(\"${1:f}\", () => {\n    ${2}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-onKeyRelease",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText:
                            "onKeyRelease(\"${1:f}\", () => {\n    ${2}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-onKeyDown",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText:
                            "onKeyDown(\"${1:f}\", () => {\n    ${2}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-onUpdate",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: "onUpdate(() => {\n    ${1}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-arrows",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText:
                            "onKeyPress(\"up\", () => {\n    ${1}\n});\nonKeyPress(\"down\", () => {\n    ${2}\n});\nonKeyPress(\"left\", () => {\n    ${3}\n});\nonKeyPress(\"right\", () => {\n    ${4}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-arrows-down",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText:
                            "onKeyDown(\"up\", () => {\n    ${1}\n});\nonKeyDown(\"down\", () => {\n    ${2}\n});\nonKeyDown(\"left\", () => {\n    ${3}\n});\nonKeyDown(\"right\", () => {\n    ${4}\n});",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                    {
                        label: "k-debug",
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: "debug.inspect = true;",
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column - 1,
                            position.lineNumber,
                            position.column,
                        ),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                    },
                ],
            };
        },
    });

    // Themes
    monaco.editor.defineTheme("kaplayrk", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#242933",
        },
    });

    monaco.editor.defineTheme("kaplight", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#F2F2F2",
        },
    });
};
