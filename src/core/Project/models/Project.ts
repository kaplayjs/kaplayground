import type { Asset } from "../../Asset/models/Asset.ts";
import type { File } from "../../File/models/File.ts";
import type { ProjectBase } from "./ProjectBase.ts";

export interface Project extends ProjectBase {
    id: string;
    schemaVersion: string;
    metadata: {
        kaplayVersion: string;
        createdAt: Date;
        lastModified?: Date;
    };
    codeFiles: Map<string, File>;
    assets: Map<string, Asset>;
}
