import type { Asset } from "../../Asset/models/Asset.ts";
import type { File } from "../../File/models/File.ts";
import type { ProjectBase } from "./ProjectBase.ts";

export interface ProjectUnserialized extends ProjectBase {
    codeFiles: Map<string, File>;
    assets: Map<string, Asset>;
}
