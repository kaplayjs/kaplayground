import {
    type CancellationToken,
    type editor,
    languages,
    type Position,
} from "monaco-editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export class KSnippetsProvider implements languages.CompletionItemProvider {
    triggerCharacters = ["k-"];
    provideCompletionItems(
        _model: editor.ITextModel,
        position: Position,
        _context: languages.CompletionContext,
        _token: CancellationToken,
    ): languages.ProviderResult<languages.CompletionList> {
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
                    label: "k-obj",
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
                    insertText: "onKeyPress(\"${1:f}\", () => {\n    ${2}\n});",
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
                    insertText: "onKeyDown(\"${1:f}\", () => {\n    ${2}\n});",
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
                {
                    label: "k-onLoad",
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText: "onLoad(() => {\n    ${1}\n});",
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
                    label: "k-scene",
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText:
                        "scene(\"${1:sceneName}\", () => {\n    ${2}\n});",
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
                    label: "k-onCollide",
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText:
                        "onCollide(\"${1:tag1}\", \"${2:tag2}\", () => {\n    ${3}\n});",
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
                    label: "k-level",
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText: `addLevel([
    "     $$",
    "=======",
], {
    tileWidth: 64,
    tileHeight: 64,
    pos: vec2(100, 200),
    tiles: {
        "=": () => [
            rect(64, 64),
            area(),
            body({ isStatic: true }),
            color("#6bc96c"),
            outline(4),
            anchor("bot"),
        ],
        "$": () => [
            circle(16),
            area(),
            color("#fcef8d"),
            outline(4),
            anchor("bot")
        ],
    }
})`,
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
    }
}
