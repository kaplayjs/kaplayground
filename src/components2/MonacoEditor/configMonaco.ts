import kaboomGlobal from "@/../kaplay/dist/global.d.ts?raw";
import kaboomModule from "@/../kaplay/dist/kaboom.d.ts?raw";
import type { Monaco } from "@monaco-editor/react";

const kaboomFunctionImports = `
import { PluginList, MergePlugins, KaboomOpt } from "./kaboom"
`;

const kaboomFunctionDt = `declare global { 
    function kaboom<T extends PluginList<unknown> = [undefined]>(options?: KaboomOpt<T>): T extends [undefined] ? KaboomCtx : KaboomCtx & MergePlugins<T>;
    function kaplay<T extends PluginList<unknown> = [undefined]>(options?: KaboomOpt<T>): T extends [undefined] ? KaboomCtx : KaboomCtx & MergePlugins<T>;
}`;

const dataUrlRegex = /data:[^;]+;base64,[A-Za-z0-9+\/]+={0,2}/g;

export const configMonaco = (monaco: Monaco) => {
    // Add global kaboom types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaboomFunctionImports + kaboomGlobal + kaboomFunctionDt,
        "global.d.ts",
    );

    // Add kaboom module types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaboomModule,
        "kaboom.d.ts",
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
};
