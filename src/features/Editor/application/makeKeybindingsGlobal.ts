import { type editor, KeyCode, KeyMod } from "monaco-editor";

export const keybindings = new Map<number, Function>();

export const toMonacoKey = (e: KeyboardEvent): number => {
    const eKey = e.key.toLowerCase();
    let key = 0;

    if (e.ctrlKey || e.metaKey) key |= KeyMod.CtrlCmd;
    if (e.shiftKey) key |= KeyMod.Shift;
    if (e.altKey) key |= KeyMod.Alt;

    if (eKey == "s") key |= KeyCode.KeyS;
    if (eKey == "p") key |= KeyCode.KeyP;

    return key;
};

export const makeKeybindingsGlobal = (action: editor.IActionDescriptor) => {
    if (!action.keybindings) return action;

    action.keybindings.forEach(kb => keybindings.set(kb, action.run));

    return action;
};

window.addEventListener("keydown", e => {
    if (
        (e.key.length > 1 && e.key != "Escape")
        || !(e.ctrlKey || e.metaKey || e.altKey)
    ) return;

    if (
        e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || (e.target as HTMLElement)?.isContentEditable
    ) return;

    const action = keybindings.get(toMonacoKey(e));

    if (action) {
        e.preventDefault();
        action();
    }
});

window.addEventListener(
    "message",
    ({ data }: MessageEvent<{ type: string; e: Partial<KeyboardEvent> }>) => {
        if (data.type != "KEY_BINDING") return;

        const action = keybindings.get(toMonacoKey(data.e as KeyboardEvent));
        if (action) action();
    },
);

export default makeKeybindingsGlobal;
