import tippy from "tippy.js";

class Tooltip extends HTMLElement {
    constructor() {
        super();

        tippy(`#${this.id}`, {
            content: this.dataset.tooltip,
            appendTo: () => document.querySelector("dialog")!,
        });
    }
}

customElements.define("tooltip-with", Tooltip);
