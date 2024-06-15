import { $isEditor, $isPlayground } from "../stores/playground";

// SET MODE in client
const html = document.documentElement;
const playgroundMode = html?.dataset.mode;

$isEditor.set(playgroundMode === "editor");
$isPlayground.set(playgroundMode === "playground");
