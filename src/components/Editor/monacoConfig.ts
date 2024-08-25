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
