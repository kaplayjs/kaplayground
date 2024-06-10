import { $isEditor, $isPlayground } from "../../stores/playground";

// SET MODE in client
const playground = document.getElementById("kaplayground");
const playgroundMode = playground?.dataset.mode;

$isEditor.set(playgroundMode === "editor");
$isPlayground.set(playgroundMode === "playground");
