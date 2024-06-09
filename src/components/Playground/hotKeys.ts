import { save } from "../../actions/save";

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();

        save();
    }
});

document.addEventListener("keypress", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
    }
});
