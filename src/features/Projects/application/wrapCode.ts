import { useProject } from "../stores/useProject";

/**
 * Wrap code using legacy auto-import by file order system.
 *
 * @returns - The wrapped code as a string.
 */
export function wrapCode() {
    const projectState = useProject.getState();

    const mainFile = projectState.getFile("main.js")?.value ?? "";
    let parsedFiles = "";

    if (projectState.project.mode === "ex") {
        parsedFiles = mainFile;
    } else {
        let sceneFiles = "";
        let objectFiles = "";
        let utilFiles = "";
        let KAPLAYFile = projectState.getFile("kaplay.js")?.value ?? "";
        let assetsFile = projectState.getFile("assets.js")?.value ?? "";

        projectState.project.files.forEach((file) => {
            if (file.kind === "folder") return;

            if (file.path.startsWith("scenes/")) {
                sceneFiles += `\n${file.value}\n`;
            } else if (file.path.startsWith("objects/")) {
                objectFiles += `\n${file.value}\n`;
            } else if (file.path.startsWith("utils/")) {
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
