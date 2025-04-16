import type { Project } from "../models/Project.ts";
import type { ProjectBase } from "../models/ProjectBase.ts";

export function createProject(base: ProjectBase, id: string): Project {
    return {
        assets: new Map(),
        codeFiles: new Map(),
        id: id,
        metadata: {
            createdAt: new Date(),
            kaplayVersion: "master",
            lastModified: new Date(),
        },
        mode: base.mode,
        name: base.name,
        schemaVersion: "3.0.0",
    };
}
