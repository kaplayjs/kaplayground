import { examples } from "../../components/Toolbar/examples";
import { $gameViewElement, $playgroundCode } from "../../stores/playground";
import { decompressCode } from "../../util/compressCode";

// get examples from url
const urlExample = new URLSearchParams(window.location.search).get(
    "example",
);
const example = examples.find((e: any) => e?.name === urlExample);

// get code from url
const urlCode = new URLSearchParams(window.location.search).get("code");
const code = decompressCode(urlCode ?? "");

// prefer code over example
if (example && !urlCode) {
    $playgroundCode.set(example.content);
    $gameViewElement.get()?.run();

    console.debug("Loaded example from URL");
} else if (code) {
    $playgroundCode.set(code);
    $gameViewElement.get()?.run();

    console.debug("Loaded code from URL");
} else {
    $gameViewElement.get()?.run();

    console.debug("No code or example found in URL");
}
