import { useMemo } from "react";
import type { Asset } from "../features/Projects/models/Asset";
import type { AssetKind } from "../features/Projects/models/AssetKind";
import type { UploadAsset } from "../features/Projects/models/UploadAsset";
import type { AssetsSlice } from "../features/Projects/stores/slices/assets";
import { useProject } from "../features/Projects/stores/useProject";

type UseAssetsOpt = {
    kind?: AssetKind;
};

type UseAssetsHookReturn = Omit<AssetsSlice, "assets" | "uploadingAssets"> & {
    assets: Asset[];
    uploadingAssets: UploadAsset[];
};

export const useAssets = ({ kind }: UseAssetsOpt): UseAssetsHookReturn => {
    const assetsLastId = useProject((s) => s.assetsLastId);
    const removeAsset = useProject((s) => s.removeAsset);
    const addAsset = useProject((s) => s.addAsset);
    const uploadAsset = useProject((s) => s.uploadAsset);
    const assets = useProject((s) => s.project.assets);
    const uploadingAssets = useProject((s) => s.uploadingAssets);

    const filteredAssets = useMemo(() => {
        if (!kind) return Object.values(assets);

        return Array.from(assets).filter(
            ([_, asset]) => asset.kind === kind,
        ).map(([_, asset]) => asset);
    }, [JSON.stringify(Array.from(assets))]);

    const filteredUploadingAssets = useMemo(() => {
        if (!kind) return Object.values(assets);

        return Array.from(uploadingAssets).filter(
            ([_, asset]) => asset.kind === kind,
        ).map(([_, asset]) => asset);
    }, [JSON.stringify(Array.from(uploadingAssets))]) as UploadAsset[];

    return {
        addAsset: addAsset,
        uploadAsset: uploadAsset,
        removeAsset,
        assetsLastId,
        assets: filteredAssets,
        uploadingAssets: filteredUploadingAssets,
    };
};
