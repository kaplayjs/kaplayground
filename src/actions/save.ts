import type { FileNode } from "@webcontainer/api";
import {
    $gameViewElement,
    $isEditor,
    $playgroundCode,
} from "../stores/playground";
import {
    $currentEditingFile,
    $project,
    $webContainer,
} from "../stores/project";

export const save = () => {
    if ($isEditor) {
        $webContainer.get()?.fs.writeFile(
            $currentEditingFile.get(),
            (($project.get().files[$currentEditingFile.get()]) as FileNode)
                .file.contents.toString(),
        );
    } // run code
    else {
        $gameViewElement.get()?.runCode($playgroundCode.get());
    }
};
