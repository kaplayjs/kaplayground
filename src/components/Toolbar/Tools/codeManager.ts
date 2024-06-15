import {
    $editorInstance,
    $gameViewElement,
    $playgroundCode,
} from "../../../stores/playground";
import { download } from "../../../util/download";

const projectExportHTML = document.getElementById("pj-export-html");
const projectExportCode = document.getElementById("pj-export-code");
const projectImportCode = document.getElementById("pj-import-code");
const projectImportCodeInput = projectImportCode?.querySelector<
    HTMLInputElement
>("input");

projectExportHTML?.addEventListener("click", () => {
    const gameView = $gameViewElement.get();
    const iframeContent = gameView?.iframe?.contentDocument?.documentElement
        .outerHTML;

    download(
        iframeContent ?? "",
        "index.html",
        "text/html",
    );
});

projectExportCode?.addEventListener("click", () => {
    download(
        $playgroundCode.get(),
        "index.kaplayground.js",
        "text/javascript",
    );
});

projectImportCodeInput?.addEventListener("change", (e) => {
    const file = (e?.target as any)?.["files"][0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        $playgroundCode.set(e.target!.result);
        $editorInstance.get()?.setValue($playgroundCode.get());
        $gameViewElement.get()?.run();
    };
    reader.readAsText(file);
});
