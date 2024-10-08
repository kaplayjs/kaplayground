import { useEditor } from "../hooks/useEditor";

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        event.stopPropagation();
        useEditor.getState().run();
    }
});
