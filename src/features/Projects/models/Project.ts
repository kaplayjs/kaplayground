import type { Asset } from "./Asset";
import type { File } from "./File";
import type { ProjectMode } from "./ProjectMode";

export type Project = {
    name: string;
    version: string;
    assets: Map<string, Asset>;
    files: Map<string, File>;
    kaplayVersion: string;
    mode: ProjectMode;
    createdAt: string;
    updatedAt: string;
};
