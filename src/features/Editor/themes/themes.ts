import type { editor } from "monaco-editor";

export const themes = {
    "Spiker": {
        base: "vs-dark",
        inherit: true,
        rules: [
            {
                "foreground": "c4d6dd",
                "token": "identifier",
            },
            {
                "foreground": "a78bfa",
                "token": "keyword",
            },
            {
                "foreground": "e9967a",
                "token": "string",
            },
            {
                "foreground": "7f848e",
                "token": "comment",
            },
            {
                "foreground": "b5d982",
                "token": "number",
            },
            {
                "foreground": "b2ccd6",
                "token": "delimiter",
            },
            {
                "foreground": "e5c07b",
                "token": "variable",
            },
            {
                "foreground": "b2ccd6",
                "token": "operator",
            },
            {
                "foreground": "d56c62",
                "token": "tag",
            },
            {
                "foreground": "e5c07b",
                "token": "attribute",
            },
        ],
        colors: {
            "focusBorder": "#abdd64",
            "background": "#242933",
            "foreground": "#b2ccd6",
            "disabledForeground": "#b2ccd640",
            "selection.background": "#b2ccd61a",
            "icon.foreground": "#b2ccd6",
            "sash.hoverBorder": "#abdd64",

            "textLink.foreground": "#abdd64",
            "textLink.activeForeground": "#abdd64",

            "input.background": "#2a303c",
            "input.foreground": "#b2ccd6",
            "inputOption.activeBorder": "#abdd64cc",
            "inputOption.activeBackground": "#abdd6433",

            "list.hoverBackground": "#b2ccd61a",
            "list.highlightForeground": "#abdd64",
            "list.focusHighlightForeground": "#abdd64",

            "widget.shadow": "#0000001A",
            "widget.border": "#b2ccd615",

            "editor.background": "#242933",
            "editor.foreground": "#b2ccd6",
            "editor.selectionBackground": "#465061",
            "editor.lineHighlightBackground": "#2b313b",
            "editor.lineHighlightBorder": "#00000000",
            "editor.findMatchBackground": "#b2ccd620",
            "editor.findMatchHighlightBackground": "#b2ccd620",
            "editor.findMatchBorder": "#b2ccd615",

            "editorCursor.foreground": "#b5d982",
            "editorLineNumber.foreground": "#55626c",
            "editorActiveLineNumber.foreground": "#a6adbb",

            "editorIndentGuide.background1": "#b2ccd61a",
            "editorIndentGuide.activeBackground1": "#b2ccd640",

            "editorBracketMatch.border": "#b2ccd640",
            "editorBracketHighlight.foreground1": "#abdd64",
            "editorBracketHighlight.foreground2": "#d46eb3",
            "editorBracketHighlight.foreground3": "#6d80fa",

            "editorOverviewRuler.findMatchForeground": "#b2ccd633",

            "scrollbarSlider.background": "#b2ccd633",
            "scrollbarSlider.hoverBackground": "#b2ccd64d",
            "scrollbarSlider.activeBackground": "#b2ccd680",

            "editorGutter.foldingControlForeground": "#b2ccd6cc",

            "editorWidget.background": "#20252e",
            "editorWidget.resizeBorder": "#b2ccd633",

            "editorSuggestWidget.background": "#20252e",
            "editorSuggestWidget.border": "#b2ccd61a",
            "editorSuggestWidget.foreground": "#b2ccd6",
            "editorSuggestWidget.selectedBackground": "#b2ccd61a",
            "editorSuggestWidget.highlightForeground": "#abdd64",
            "editorSuggestWidget.focusHighlightForeground": "#abdd64",
            "editorSuggestWidgetStatus.foreground": "#b2ccd680",

            "editorHoverWidget.background": "#20252e",
            "editorHoverWidget.foreground": "#b2ccd6",
            "editorHoverWidget.border": "#b2ccd61a",
            "editorHoverWidget.statusBarBackground": "#191e24",

            "menu.background": "#2a303c",
            "menu.foreground": "#b2ccd6",
            "menu.selectionBackground": "#b2ccd61a",
            "menu.separatorBackground": "#b2ccd61a",

            "quickInput.background": "#2a303c",
            "quickInput.foreground": "#b2ccd6",
            "quickInputTitle.background": "#b2ccd61a",
            "quickInputList.focusBackground": "#b2ccd64d",
            "pickerGroup.foreground": "#abdd64",
        },
    },
} satisfies {
    [key: string]: editor.IStandaloneThemeData;
};
