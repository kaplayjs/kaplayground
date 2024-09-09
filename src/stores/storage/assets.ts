import type { StateCreator } from "zustand";
import type { ProjectSlice } from "../project";

/** The Assets's id */
export type AssetId = number;
/** The Assets's kind */
export type AssetKind = "sprite" | "sound" | "font";

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

export type Asset = UploadAsset & {
    // import function for kaplay
    importFunction: string;
};

export type AssetFile = {
    file: File;
    kind: AssetKind;
};

export interface AssetsSlice {
    /** Last asset ID */
    assetsLastId: AssetId;
    /** Add an asset */
    addAsset: (asset: UploadAsset) => void;
    /** Remove an asset */
    removeAsset: (path: string) => void;
}

type Slice = ProjectSlice & AssetsSlice;

const assetFuncByKind: Record<AssetKind, string> = {
    font: "loadFont",
    sprite: "loadSprite",
    sound: "loadSound",
};

const loadByAsset = (
    assetName: string,
    assetUrl: string,
    assetKind: AssetKind,
) => {
    return `${assetFuncByKind[assetKind]}("${assetName}", "${assetUrl}")`;
};

export const createAssetsSlice: StateCreator<
    Slice,
    [],
    [],
    AssetsSlice
> = (
    set,
    get,
) => ({
    assetsLastId: 0,

    addAsset(asset) {
        console.debug("Adding asset", asset);
        const assets = get().project.assets;

        const foundAsset = assets.has(asset.path)
            ? assets.get(asset.path)
            : null;

        if (foundAsset) {
            assets.set(asset.path, {
                ...foundAsset,
                url: asset.url,
            });

            set({});
        } else {
            assets.set(asset.path, {
                ...asset,
                importFunction: loadByAsset(
                    asset.name,
                    asset.url,
                    asset.kind,
                ),
            });

            set({});
        }
    },
    removeAsset(resourceId) {
        console.debug("Removing asset", resourceId);
        const assets = get().project.assets;

        if (assets.has(resourceId)) {
            assets.delete(resourceId);
        } else {
            console.debug("Asset not found", resourceId);
        }

        set({});
    },
});