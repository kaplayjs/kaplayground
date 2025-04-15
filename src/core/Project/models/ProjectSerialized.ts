import type { Asset } from "../../Asset/models/Asset.ts";
import type { File } from "../../File/models/File.ts";
import type { ProjectBase } from "./ProjectBase.ts";

export interface ProjectSerialized extends ProjectBase {
    codeFiles: [string, File][];
    assets: [string, Asset][];
}
