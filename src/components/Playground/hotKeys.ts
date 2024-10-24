import { format, save } from "../../actions";

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();

        save();
        format();
    }
});

document.addEventListener("keypress", function(event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
    }
});
