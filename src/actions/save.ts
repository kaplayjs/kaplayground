import {
    $fileExplorer,
    $gameViewElement,
    $isEditor,
    $playgroundCode,
} from "../stores/playground";
import {
    $currentEditingFile,
    $project,
    $webContainer,
    type ProjectFile,
} from "../stores/project";

export const save = () => {
    if ($isEditor.get()) {
        const currentEditingFile = $currentEditingFile.get();
        const project = $project.get();
        const projectFile = project.files[currentEditingFile] as ProjectFile;

        projectFile.saved = true;

        $webContainer.get()?.fs.writeFile(
            currentEditingFile,
            projectFile.file.contents.toString(),
        );

        $fileExplorer.get()?.syncFile(currentEditingFile);
    } // run code
    else {
        $gameViewElement.get()?.run();
    }
};
