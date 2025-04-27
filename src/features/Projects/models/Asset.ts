import type { UploadAsset } from "./UploadAsset";

export type Asset = UploadAsset & {
    // import function for kaplay
    importFunction: string;
};
