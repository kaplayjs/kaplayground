import { persistentAtom, persistentMap } from "@nanostores/persistent";
import type { editor } from "monaco-editor";
import { atom } from "nanostores";
import type { FileExplorer } from "../components/FileExplorer/fileExplorer";
import type { GameView } from "../components/GameView/gameView";
import type { Toasty } from "../components/UI/Toasty.astro";

const defaultCode = `const k = kaplay();
    
k.debug.log("welcome to kaplayground!");`;

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

// Editor vs Playground
export const $isPlayground = atom(false);
export const $isEditor = atom(false);

// Editor
export const $isContainerLoading = atom(true);
export const $fileExplorer = atom<FileExplorer | null>(null);
