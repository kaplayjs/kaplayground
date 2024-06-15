import { $isEditor, $isPlayground } from "../../stores/playground";

// SET MODE in client
const playground = document.getElementById("kaplayground");
const playgroundMode = playground?.dataset.mode;

$isEditor.set(playgroundMode === "editor");
$isPlayground.set(playgroundMode === "playground");

// Set window size
window.addEventListener("resize", () => {
    const mode = document.getElementById("kaplayground")?.dataset.mode;

    if (mode === "playground") {
        const isLg = window.innerWidth > 1024;
        const wrapper = document.getElementById("wrapper");

        if (isLg) {
            wrapper?.setAttribute("data-flex-splitter-horizontal", "");
            wrapper?.removeAttribute("data-flex-splitter-vertical");
        } else {
            wrapper?.setAttribute("data-flex-splitter-vertical", "");
            wrapper?.removeAttribute("data-flex-splitter-horizontal");
        }
    }
});
