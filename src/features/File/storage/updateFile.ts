import type { File } from "../../../core/File/models/File.ts";
import { debug } from "../../../util/logs.ts";
import { getProjectByName } from "../../Project/storage/projectStorage.ts";

export function updateFile(
    projectName: string,
    updatedFile: File,
): File | null {
    const project = getProjectByName(projectName);

    if (!project) {
        debug(0, "[File.updateFile] Project not found", projectName);
        return null;
    }

    project?.codeFiles.set(updatedFile.path, updatedFile);

    return updatedFile;
}
