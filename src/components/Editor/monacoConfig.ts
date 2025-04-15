import type { Monaco } from "@monaco-editor/react";
import docTs from "../../../lib.d.ts?raw";
import {
    COLOR_HEX_STRING,
    COLOR_RGB_FUNC,
    DATA_URL_REGEX,
} from "../../util/regex";
import { objPreviewCodeLens } from "../ObjPreview/provider/objPreviewCodeLens.ts";
import { themes } from "./config/themes";
import { addCompletion } from "./providers/completion/addCompletion.ts";
import { goCompletion } from "./providers/completion/goCompletion.ts";

export const configMonaco = (monaco: Monaco) => {
    // Add global KAPLAY types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        docTs,
        "kaplay.d.ts",
    );

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        allowJs: true,
    });

    // Hover dataUrl images
    monaco.languages.registerHoverProvider("javascript", {
        provideHover(model, position) {
            const line = model.getLineContent(position.lineNumber);
            const dataUrisInLine = line.match(DATA_URL_REGEX);
            if (!dataUrisInLine) return null;

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
        },
    });

    monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems(...args) {
            return addCompletion(...args);
        },
    });

    monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems(...args) {
            return goCompletion(...args);
        },
    });

    monaco.languages.registerColorProvider("javascript", {
        provideColorPresentations: (_model, colorInfo) => {
            const color = colorInfo.color;
            const red256 = Math.round(color.red * 255);
            const green256 = Math.round(color.green * 255);
            const blue256 = Math.round(color.blue * 255);

            let label;

            label = "rgb(" + red256 + ", " + green256 + ", " + blue256
                + ")";

            return [
                {
                    label: label,
                },
            ];
        },

        provideDocumentColors: (model) => {
            const code = model.getValue();
            const hexColors = code.matchAll(COLOR_HEX_STRING);
            const rgbColors = code.matchAll(COLOR_RGB_FUNC);

            const colorRanges = [];

            for (const color of hexColors) {
                const lineNumber = model.getPositionAt(color.index!).lineNumber;
                const startColumn = model.getPositionAt(color.index!).column;
                const endColumn = startColumn + color[0].length;

                colorRanges.push({
                    color: {
                        red: parseInt(color[2].slice(1, 3), 16) / 255,
                        green: parseInt(color[2].slice(3, 5), 16) / 255,
                        blue: parseInt(color[2].slice(5, 7), 16) / 255,
                        alpha: 1,
                    },
                    range: {
                        startLineNumber: lineNumber,
                        startColumn,
                        endLineNumber: lineNumber,
                        endColumn,
                    },
                });
            }

            for (const color of rgbColors) {
                const lineNumber = model.getPositionAt(color.index!).lineNumber;
                const startColumn = model.getPositionAt(color.index!).column;
                const endColumn = startColumn + color[0].length;

                colorRanges.push({
                    color: {
                        red: parseInt(color[1]) / 255,
                        green: parseInt(color[2]) / 255,
                        blue: parseInt(color[3]) / 255,
                        alpha: 1,
                    },
                    range: {
                        startLineNumber: lineNumber,
                        startColumn,
                        endLineNumber: lineNumber,
                        endColumn,
                    },
                });
            }

            return colorRanges;
        },
    });

    monaco.languages.registerCodeLensProvider("javascript", objPreviewCodeLens);

    // Themes
    monaco.editor.defineTheme("Spiker", themes.Spiker);
};
