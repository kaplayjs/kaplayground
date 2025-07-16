import type { Asset } from "./Asset";
import type { File } from "./File";
import type { ProjectBuildMode } from "./ProjectBuildMode";
import type { ProjectMode } from "./ProjectMode";

export type Project = {
    name: string;
    version: string;
    assets: Map<string, Asset>;
    files: Map<string, File>;
    kaplayVersion: string;
    mode: ProjectMode;
    buildMode: ProjectBuildMode;
    favicon: string;
    createdAt: string;
    updatedAt: string;
};
