import type { File } from "../../../core/File/models/File.ts";
import { debug } from "../../../util/logs.ts";
import { getProjectByName } from "../../Project/storage/projectStorage.ts";

export function saveFile(projectName: string, file: File): File | null {
    const project = getProjectByName(projectName);

    if (!project) {
        debug(0, "[File.saveFile] Project not found", projectName);
        return null;
    }

    project?.codeFiles.set(file.path, file);

    return file;
}
