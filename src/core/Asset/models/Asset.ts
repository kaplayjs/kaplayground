import type { AssetUplodaded } from "./AssetUploaded.ts";

export interface Asset extends AssetUplodaded {
    importFunction: string;
}
