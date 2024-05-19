import type { StateCreator } from "zustand";
import type { ProjectSlice } from "./project";

export type AssetKind = "sprite" | "sound" | "font";

export type Asset = {
    name: string;
    url: string;
    kind: AssetKind;
};

export interface AssetSlice {
    /** Add an asset */
    addAsset: (asset: Asset) => void;
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
    addAsset(asset) {
        const foundAsset = get().project.assets.find((a) =>
            a.name === asset.name
        );

        if (foundAsset) {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: state.project.assets.map((oldAsset) =>
                        oldAsset.name === asset.name ? { ...asset } : oldAsset
                    ),
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    assets: [...state.project.assets, asset],
                },
            }));
        }
    },
});
