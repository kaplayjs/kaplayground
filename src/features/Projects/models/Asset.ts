import type { AssetKind } from "./AssetKind";

export interface Asset {
    name: string;
    kind: AssetKind;
    path: string;
    url: string;
    // import function for kaplay
    importFunction: string;
}
