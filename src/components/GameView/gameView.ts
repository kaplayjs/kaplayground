import { $gameViewElement, $playgroundCode } from "../../stores/playground";
import { wrapCode } from "./wrapCode";

export class GameView extends HTMLElement {
    _iframe: HTMLIFrameElement;

    constructor() {
        super();

        const iframe = this.querySelector("iframe");

        if (!iframe) {
            throw new Error("iframe not found in game-view element");
        }

        this._iframe = iframe;
        $gameViewElement.set(this);
    }

    runCode(code: string) {
        this._iframe.srcdoc = wrapCode(code);
    }

    run() {
        this.runCode($playgroundCode.get());
    }

    /** Connect to a source */
    connect(url: string) {
        // remove srcdoc to allow the iframe to load the source
        // this doesn't remove the srcdoc, only sets it to an empty string
        this._iframe.srcdoc = "";
        this._iframe.toggleAttribute("srcdoc", false);
        this._iframe.src = url;
    }

    get iframe() {
        return this._iframe;
    }
}

customElements.define("game-view", GameView);
