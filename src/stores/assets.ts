import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";

export type AssetKind = "sprite" | "sound" | "font";

export type Asset = {
    name: string;
    url: string;
    kind: AssetKind;
};

export type ProjectAsset = {
    name: string;
    url: string;
    kind: AssetKind;
    id: AssetId;
};

export type AssetId = number;

export type AssetInQueue = {
    file: File;
    kind: AssetKind;
};

export interface AssetSlice {
    /** Last asset ID */
    lastAssetId: AssetId;
    /** Assets in queue */
    assetsInQueue: AssetInQueue[];
    /** Add an asset to the queue */
    addAssetToQueue: (asset: AssetInQueue) => void;
    /** Add a array of files to the queue */
    addAssetsToQueue: (assets: File[], kind: AssetKind) => void;
    /** Remove an asset from the queue */
    removeAssetFromQueue: (asset: AssetInQueue) => void;
    /** Add an asset to project */
    addAsset: (asset: Asset) => void;
    /** Remove asset */
    removeAsset: (assetId: AssetId) => void;
}

export const createAssetSlice: StateCreator<
    AssetSlice & ProjectSlice,
    [],
    [],
    AssetSlice
> = (
    set,
    get,
) => ({
    lastAssetId: 0,
    assetsInQueue: [],
    addAssetToQueue(asset) {
        set((state) => ({
            assetsInQueue: [...state.assetsInQueue, asset],
        }));
    },
    addAssetsToQueue(files, kind) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            get().addAssetToQueue({
                file,
                kind,
            });
        }
    },
    removeAssetFromQueue(asset) {
        set((state) => ({
            assetsInQueue: state.assetsInQueue.filter(
                (a) => a.file.name !== asset.file.name,
            ),
        }));
    },
    addAsset(asset) {
        const foundAsset = get().project.assets.find((a) =>
            a.name === asset.name
        );

        if (foundAsset) {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: state.project.assets.map((oldAsset) =>
                        oldAsset.name === asset.name
                            ? { ...asset, id: oldAsset.id }
                            : oldAsset
                    ),
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: [...state.project.assets, {
                        ...asset,
                        id: state.lastAssetId,
                    }],
                },
            }));
        }
    },
    removeAsset(assetId: AssetId) {
        set((state) => ({
            project: {
                ...state.project,
                assets: state.project.assets.filter(
                    (a) => a.id !== assetId,
                ),
            },
        }));
    },
});
