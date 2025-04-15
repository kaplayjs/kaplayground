import type { Asset } from "../../../core/Asset/models/Asset.ts";
import type { ProjectBase } from "../../../core/Project/models/ProjectBase.ts";
import type { SerializedFileSystem } from "../../File/models/SerializedFileSystem.ts";

export interface ProjectSerialized extends ProjectBase {
    codeFiles: SerializedFileSystem;
    assets: [string, Asset][];
}
