import type { AssetKind } from "./AssetKind";

export interface UploadAsset {
    name: string;
    kind: AssetKind;
    path: string;
    file?: File;
    url?: string;
}
