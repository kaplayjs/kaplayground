import type { Monaco } from "@monaco-editor/react";
import globalDts from "../../../kaplay/dist/declaration/global.d.ts?raw";
import kaplayDts from "../../../kaplay/dist/declaration/kaplay.d.ts?raw";
import docTs from "../../../kaplay/dist/doc.d.ts?raw";

const dataUrlRegex = /data:[^;]+;base64,[A-Za-z0-9+\/]+={0,2}/g;

const globalImport = `
import type { PluginList, MergePlugins, ButtonsDef } from "./types";

declare global {

const kaplay: <TPlugins extends PluginList<unknown> = [
	undefined
], TButtons extends ButtonsDef = {}, TButtonsName extends string = keyof TButtons & string>(gopt?: KAPLAYOpt<TPlugins, TButtons>) => TPlugins extends [
	undefined
] ? KAPLAYCtx<TButtons, TButtonsName> : KAPLAYCtx<TButtons, TButtonsName> & MergePlugins<TPlugins>;
 
}


`;

export const configMonaco = (monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        globalDts,
        "global.d.ts",
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaplayDts,
        "index.d.ts",
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        docTs,
        "types.d.ts",
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        globalImport,
        "global2.d.ts",
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
