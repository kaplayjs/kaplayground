import tippy from "tippy.js";

class Tooltip extends HTMLElement {
    constructor() {
        super();

        console.log("added tooltip");

        tippy(`#${this.id}`, {
            content: this.dataset.tooltip,
            appendTo: () => document.querySelector("dialog")!,
        });
    }
}

customElements.define("tooltip-with", Tooltip);
