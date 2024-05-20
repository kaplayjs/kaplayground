import type { Asset, AssetInQueue, AssetKind } from "@/stores/project/assets";
import { fileToBase64 } from "@/util/fileToBase64";
import { useEffect, useMemo } from "react";
import { useProject } from "./useProject";

type UseAssetOpt = {
    kind: AssetKind;
};
type UseAassetsReturn = {
    assets: Asset[];
    addAsset: (asset: Asset) => void;
    addAssetsToQueue: (assets: File[], kind: AssetKind) => void;
    addAssetToQueue: (asset: AssetInQueue) => void;
};
type UseAssetsHook = (opt: UseAssetOpt) => UseAassetsReturn;

export const useAssets: UseAssetsHook = ({ kind }) => {
    const [
        assets,
        addAsset,
        assetsInQueue,
        addAssetsToQueue,
        addAssetToQueue,
        removeAssetFromQueue,
    ] = useProject((state) => [
        state.project.assets,
        state.addAsset,
        state.assetsInQueue,
        state.addAssetsToQueue,
        state.addAssetToQueue,
        state.removeAssetFromQueue,
    ]);
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
    };
};
