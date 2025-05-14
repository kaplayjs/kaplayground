import {
    type CancellationToken,
    type editor,
    languages,
    type Position,
} from "monaco-editor";

import { useEditor } from "../../../../hooks/useEditor";
import { getMatchingRelativeImports } from "../../../Projects/application/path";

export class ImportPathCompletionProvider
    implements languages.CompletionItemProvider
{
    provideCompletionItems(
        model: editor.ITextModel,
        pos: Position,
        _context: languages.CompletionContext,
        _token: CancellationToken,
    ): languages.ProviderResult<languages.CompletionList> {
        const suggestions: languages.CompletionItem[] = [];
        const typedImport = getCurrentImportPath(model, pos);
        const monaco = useEditor.getState().runtime.monaco!;

        if (typedImport) {
            const relativeImports = getMatchingRelativeImports(
                useEditor.getState().runtime.currentFile,
                typedImport || "",
            );

            relativeImports.forEach((relativeImport) => {
                suggestions.push({
                    label: relativeImport,
                    kind: monaco.languages.CompletionItemKind.File,
                    insertText: relativeImport,
                    range: new monaco.Range(
                        pos.lineNumber,
                        pos.column - typedImport.length,
                        pos.lineNumber,
                        pos.column,
                    ),
                });
            });
        }

        return { suggestions };
    }
}

/**
 * Check if the current line is an import statement and return the path
 *
 * @returns The typed import path or null if not found
 */
function getCurrentImportPath(
    model: editor.ITextModel,
    position: Position,
): string | null {
    const lineContent = model.getLineContent(position.lineNumber);
    const textBeforeCursor = lineContent.substring(0, position.column - 1);

    const importMatch = textBeforeCursor.match(
        /(?:import(?:\s+.*?\s+from)?\s*\(?\s*)["']([^"']*)$/,
    );
    if (importMatch) {
        return importMatch[1];
    }

    return null;
}
