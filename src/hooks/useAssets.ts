import { defaultAssets } from "@/config/assets";
import { create } from "zustand";

export type Asset = {
    name: string;
    url: string;
    kind: "sprite" | "sound";
};

type AssetsStore = {
    assets: Asset[];
    addAsset: (asset: Asset) => void;
    removeAsset: (name: string) => void;
};

export const useAssets = create<AssetsStore>((set, get) => ({
    assets: [
        ...defaultAssets,
    ],
    addAsset: (asset) => {
        const foundAsset = get().assets.find((a) => a.name === asset.name);

        if (foundAsset) {
            set((state) => ({
                assets: state.assets.map((oldAsset) =>
                    oldAsset.name === asset.name ? { ...asset } : oldAsset
                ),
            }));
        } else {
            set((state) => ({ assets: [...state.assets, asset] }));
        }
    },
    removeAsset: (name) =>
        set((state) => ({
            assets: state.assets.filter((asset) => asset.name !== name),
        })),
}));
