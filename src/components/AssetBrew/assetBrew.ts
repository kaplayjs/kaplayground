import { $editorInstance } from "../../stores/playground.ts";
import { getImportStatement, typeByExtension } from "./assetBrewUtil.ts";

const assets = document.querySelectorAll<HTMLElement>(".asset");
const assetbrewModal = document.querySelector<HTMLDialogElement>(
    "#assetbrew-modal",
);
const assetbrewFileInput = document.querySelector<HTMLInputElement>(
    "#assetbrew-fileinput",
);

assetbrewFileInput?.addEventListener("change", (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    const reader = new FileReader();

    const type = file?.type.split("/")[1];
    const name = file?.name.split(".")[0];

    if (!type) return alert("Invalid file type");

    reader.onload = (event) => {
        const data = event.target?.result as string;
        $editorInstance.get()?.executeEdits("", [
            {
                range: $editorInstance.get()?.getSelection()!,
                text: getImportStatement({
                    name: name ?? "asset",
                    type: typeByExtension(type!) ?? "sprite",
                    url: data,
                }),
                forceMoveMarkers: true,
            },
        ]);
    };

    reader.readAsDataURL(file!);
    assetbrewModal?.close();
});

assets.forEach((asset) => {
    asset.addEventListener("click", () => {
        assetbrewModal?.close();

        $editorInstance.get()?.executeEdits("", [
            {
                range: $editorInstance.get()?.getSelection()!,
                text: asset.dataset.import ?? "",
                forceMoveMarkers: true,
            },
        ]);
    });
});
