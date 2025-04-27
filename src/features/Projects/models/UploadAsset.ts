import type { AssetKind } from "./AssetKind";

export type UploadAsset = {
    // name of the resource including the extension
    name: string;
    // the url of the resource, base64 encoded
    url: string;
    // the kind of the resource (will determine the folder)
    kind: AssetKind;
    // the final path of the resource
    path: string;
};
