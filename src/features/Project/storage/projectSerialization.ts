import type { FileSystem } from "../../../core/File/models/FileSystem.ts";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { SerializedFileSystem } from "../../File/models/SerializedFileSystem.ts";
import type { ProjectSerialized } from "../models/ProjectSerialized.ts";

export function serializeFileSystem(fs: FileSystem): SerializedFileSystem {
    return Array.from(fs.entries()).map(([key, value]) => {
        if (value instanceof Map) {
            value;
            return [key, { type: "folder", data: serializeFileSystem(value) }];
        }
        return [key, { type: "file", data: value }];
    });
}

export function deserializeFileSystem(data: SerializedFileSystem): FileSystem {
    const fs: FileSystem = new Map();

    for (const [key, value] of data) {
        if (value.type === "folder") {
            fs.set(key, deserializeFileSystem(value.data));
        } else {
            fs.set(key, value.data);
        }
    }

    return fs;
}

export function serializeProject(project: Project): ProjectSerialized {
    const serializedFs = serializeFileSystem(project.codeFiles);
    const arrayAssets = Array.from(project.assets.entries());

    return {
        ...project,
        codeFiles: serializedFs,
        assets: arrayAssets,
    };
}

export function deserializeProject(data: ProjectSerialized): Project {
    return {
        ...data,
        saved: true,
        codeFiles: deserializeFileSystem(data.codeFiles),
        assets: new Map(data.assets),
    };
}
