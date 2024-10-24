import { persistentAtom } from "@nanostores/persistent";
import type { editor } from "monaco-editor";
import { atom } from "nanostores";
import type { GameView } from "./components/GameView/gameView";
import type { Toasty } from "./components/UI/Toasty.astro";

const defaultCode = `kaplay();

loadBean();

add([
    sprite("bean");
]);
`;

export const $playgroundCode = persistentAtom(
    "kaplayground_code",
    defaultCode,
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    },
);

export const $gameViewElement = atom<GameView | null>(null);
export const $toastyElement = atom<Toasty | null>(null);
export const $editorInstance = atom<null | editor.IStandaloneCodeEditor>(null);
export const $editorTheme = atom("kaplayrk");
export const $version = atom("v3001");
