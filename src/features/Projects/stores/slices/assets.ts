import type { StateCreator } from "zustand";
import { debug } from "../../../../util/logs";
import { removeExtension } from "../../../../util/removeExtensions";
import type { AssetKind } from "../../models/AssetKind";
import type { UploadAsset } from "../../models/UploadAsset";
import type { ProjectStore } from "../useProject.ts";

export interface AssetsSlice {
    assetsLastId: number;
    addAsset: (asset: UploadAsset) => void;
    removeAsset: (path: string) => void;
}

const assetFuncByKind: Record<AssetKind, string> = {
    font: "loadFont",
    sprite: "loadSprite",
    sound: "loadSound",
};

const loadByAsset = (
    assetName: string,
    assetKind: AssetKind,
) => {
    return `${assetFuncByKind[assetKind]}("${
        removeExtension(assetName)
    }", "assets/${assetKind}s/${assetName}");`;
};

export const createAssetsSlice: StateCreator<
    ProjectStore,
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
            console.debug(
                "Asset added",
                asset,
                loadByAsset(
                    asset.name,
                    asset.kind,
                ),
            );

            assets.set(asset.path, {
                ...asset,
                importFunction: loadByAsset(
                    asset.name,
                    asset.kind,
                ),
            });

            set({});
        }
    },
    removeAsset(resourceId) {
        debug(0, "Removing asset", resourceId);

        const assets = get().project.assets;

        if (assets.has(resourceId)) {
            assets.delete(resourceId);
        } else {
            debug(0, "Tried to remove, asset not found", resourceId);
        }

        set({});
    },
});
