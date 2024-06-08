import type { GameViewElement } from "@/components2/GameView/GameView.astro";
import type { Toasty } from "@/components2/UI/Toasty.astro";
import { persistentAtom } from "@nanostores/persistent";
import type { editor } from "monaco-editor";
import { atom } from "nanostores";

const defaultCode = `const k = kaplay();
    
k.debug.log("welcome to kaplayground!");`;

export const playgroundCode = persistentAtom("kaplayground_code", defaultCode, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const gameViewElement = atom<GameViewElement | null>(null);
export const toastyElement = atom<Toasty | null>(null);
export const editorInstance = atom<null | editor.IStandaloneCodeEditor>(null);
