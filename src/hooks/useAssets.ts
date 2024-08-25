import type {
    Asset,
    AssetId,
    AssetInQueue,
    AssetKind,
    ProjectAsset,
} from "@/stores/assets";
import { fileToBase64 } from "@/util/fileToBase64";
import { useEffect, useMemo } from "react";
import { useProject } from "./useProject";

type UseAssetOpt = {
    kind: AssetKind;
};

type UseAssetsReturn = {
    assets: ProjectAsset[];
    addAsset: (asset: Asset) => void;
    addAssetsToQueue: (assets: File[], kind: AssetKind) => void;
    addAssetToQueue: (asset: AssetInQueue) => void;
    removeAsset: (assetId: AssetId) => void;
};

type UseAssetsHook = (opt: UseAssetOpt) => UseAssetsReturn;

export const useAssets: UseAssetsHook = ({ kind }) => {
    const {
        project: { assets },
        addAsset,
        assetsInQueue,
        addAssetToQueue,
        removeAsset,
        removeAssetFromQueue,
        addAssetsToQueue,
    } = useProject();

    const filteredAssets = useMemo(
        () => assets.filter((asset) => asset.kind === kind),
        [assets, kind],
    );

    useEffect(() => {
        if (assetsInQueue.length === 0) return;

        assetsInQueue.forEach(async (asset) => {
            try {
                addAsset({
                    name: asset.file.name,
                    url: await fileToBase64(asset.file),
                    kind: asset.kind,
                });

                removeAssetFromQueue(asset);
            } catch (e) {
                console.error(e);
            }
        });
    }, [assetsInQueue]);

    return {
        assets: filteredAssets,
        addAsset,
        addAssetsToQueue,
        addAssetToQueue,
        removeAsset,
    };
};
