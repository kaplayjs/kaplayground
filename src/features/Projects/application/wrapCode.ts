import { useProject } from "../stores/useProject";

export function wrapCode() {
    let mainFile = useProject.getState().getMainFile()?.value ?? "";
    let parsedFiles = "";

    if (useProject.getState().getProject().mode === "ex") {
        parsedFiles = mainFile;
    } else {
        let sceneFiles = "";
        let objectFiles = "";
        let utilFiles = "";
        let KAPLAYFile = useProject.getState().getKAPLAYFile()?.value ?? "";
        let assetsFile = useProject.getState().getAssetsFile()?.value ?? "";

        useProject.getState().getProject().files.forEach((file) => {
            if (file.kind == "scene") {
                sceneFiles += `\n${file.value}\n`;
            } else if (file.kind == "obj") {
                objectFiles += `\n${file.value}\n`;
            } else if (file.kind == "util") {
                utilFiles += `\n${file.value}\n`;
            }
        });

        parsedFiles = `${KAPLAYFile}\n\n 
                ${assetsFile}\n\n 
                ${utilFiles}\n\n
                ${objectFiles}\n\n
                ${sceneFiles}\n\n 
                ${mainFile}`;
    }

    return parsedFiles;
}
