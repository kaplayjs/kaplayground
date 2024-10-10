import type { editor } from "monaco-editor";

export const themes = {
    "Spiker": {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#242933",
            "editor.selectionBackground": "#6BC46B",
            "editor.lineHighlightBorder`": "#CBDC2F38",
        },
    },
    "Ghostiny": {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#F2F2F2",
        },
    },
} satisfies {
    [key: string]: editor.IStandaloneThemeData;
};
