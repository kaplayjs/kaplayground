import type { Monaco } from "@monaco-editor/react";
import docTs from "../../../lib.d.ts?raw";
import { useEditor } from "../../hooks/useEditor.ts";
import { DATA_URL_REGEX } from "../../util/regex.ts";
import { useProject } from "../Projects/stores/useProject.ts";
import { CompletionAddProvider } from "./completion/CompletionAddProvider";
import { KSnippetsProvider } from "./completion/KSnippets.ts";
import { themes } from "./themes/themes.ts";

let providersRegistered = false;

// create monaco instance

export const configMonaco = (monaco: Monaco) => {
    if (providersRegistered) return;
    providersRegistered = true;

    // Add global KAPLAY types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        docTs,
        "kaplay.d.ts",
    );

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        allowJs: true,
        moduleResolution: 2,
        baseUrl: ".",
        paths: {
            "*": ["*"],
        },
    });

    monaco.editor.registerEditorOpener({
        openCodeEditor(_source, resource, selectionOrPosition) {
            if (useProject.getState().hasFile(resource.path)) {
                useEditor.getState().setCurrentFile(resource.path);
                // use selectionOrPosition to set the cursor position

                if (
                    selectionOrPosition
                    && monaco.Range.isIRange(selectionOrPosition)
                ) {
                    const range = new monaco.Range(
                        selectionOrPosition.startLineNumber,
                        selectionOrPosition.startColumn,
                        selectionOrPosition.endLineNumber,
                        selectionOrPosition.endColumn,
                    );

                    useEditor.getState().getRuntime().editor?.setSelection(
                        range,
                    );
                } else if (selectionOrPosition) {
                    const position = new monaco.Position(
                        selectionOrPosition.lineNumber,
                        selectionOrPosition.column,
                    );

                    useEditor.getState().getRuntime().editor?.setPosition(
                        position,
                    );
                }

                return true;
            }

            return false;
        },
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

    monaco.languages.registerCompletionItemProvider(
        "javascript",
        new KSnippetsProvider(),
    );

    monaco.languages.registerCompletionItemProvider(
        "javascript",
        new CompletionAddProvider(),
    );

    // Themes
    monaco.editor.defineTheme("Spiker", themes.Spiker);
};
