import type { StateCreator } from "zustand";
import { fileToBase64 } from "../../../../util/fileToBase64";
import { debug } from "../../../../util/logs";
import { removeExtension } from "../../../../util/removeExtensions";
import type { Asset } from "../../models/Asset";
import type { AssetKind } from "../../models/AssetKind";
import type { UploadAsset } from "../../models/UploadAsset";
import type { ProjectStore } from "../useProject.ts";

export interface AssetsSlice {
    assetsLastId: number;
    uploadingAssets: Map<string, UploadAsset>;
    addAsset: (asset: Asset) => void;
    uploadAsset: (asset: UploadAsset) => void;
    removeAsset: (path: string) => void;
}

const assetFuncByKind: Record<AssetKind, string> = {
    font: "loadFont",
    sprite: "loadSprite",
    sound: "loadSound",
};

export const getAssetImportFunction = (
    assetName: string,
    assetKind: AssetKind,
    url?: string,
) => {
    const importSource = url ? url : `assets/${assetKind}s/${assetName}`;

    return `${assetFuncByKind[assetKind]}("${
        removeExtension(assetName)
    }", "${importSource}");`;
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
    uploadingAssets: new Map(),
    addAsset(asset) {
        const assets = get().project.assets;
        assets.set(asset.path, asset);

        debug(0, "[assets] Asset added:", asset.name);

        get().setProject({});
    },
    uploadAsset(asset) {
        const assets = get().project.assets;

        const foundAsset = assets.has(asset.path)
            ? assets.get(asset.path)
            : null;

        if (foundAsset) {
            // assets.set(asset.path, {
            //     ...foundAsset,
            //     url: asset.url,
            // });

            set({});
        } else {
            debug(0, "[assets] Adding asset:", asset.name);
            get().uploadingAssets.set(asset.path, asset);
            const { file, ...sanitizedAsset } = asset;

            if (asset.url) {
                get().addAsset({
                    ...sanitizedAsset,
                    url: asset.url,
                    importFunction: getAssetImportFunction(
                        asset.name,
                        asset.kind,
                        asset.url,
                    ),
                });

                get().uploadingAssets.delete(asset.path);
                set({});
                return;
            }

            if (!file) {
               console.error("Asset upload failed: no file provided");
               return;
            }

            fileToBase64(file).then((url) => {
                get().addAsset({
                    ...sanitizedAsset,
                    url: url,
                    importFunction: getAssetImportFunction(
                        asset.name,
                        asset.kind,
                    ),
                });

                get().uploadingAssets.delete(asset.path);

                set({});
            }).catch(() => {
            });

            set({});
        }
    },
    removeAsset(resourceId) {
        debug(0, "[assets] Removing asset", resourceId);

        const assets = get().project.assets;

        if (assets.has(resourceId)) {
            assets.delete(resourceId);
        } else {
            debug(0, "Tried to remove, asset not found", resourceId);
        }

        set({});
        get().setProject({});
    },
});
