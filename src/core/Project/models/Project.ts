import type { Asset } from "../../Asset/models/Asset.ts";
import type { FileSystem } from "../../File/models/FileSystem.ts";
import type { ProjectBase } from "./ProjectBase.ts";

export interface Project extends ProjectBase {
    /** The project is currently saved in the FileSystem */
    saved: boolean;
    codeFiles: FileSystem;
    assets: Map<string, Asset>;
}
