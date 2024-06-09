import { $gameViewElement } from "../../stores/playground";

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();

        $gameViewElement.get()?.run();
    }
});

document.addEventListener("keypress", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
    }
});
