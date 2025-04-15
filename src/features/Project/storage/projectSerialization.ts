import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectSerialized } from "../../../core/Project/models/ProjectSerialized.ts";

export function serializeProject(project: Project): ProjectSerialized {
    const arrayCodeFiles = Array.from(project.codeFiles.entries());
    const arrayAssets = Array.from(project.assets.entries());

    return {
        ...project,
        codeFiles: arrayCodeFiles,
        assets: arrayAssets,
    };
}

export function deserializeProject(data: ProjectSerialized): Project {
    return {
        ...data,
        saved: true,
        codeFiles: new Map(data.codeFiles),
        assets: new Map(data.assets),
    };
}
