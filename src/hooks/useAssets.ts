import { defaultAssets } from "@/config/assets";
import { create } from "zustand";

export type Asset = {
    name: string;
    url: string;
    kind: "sprite" | "sound";
};

type AssetsStore = {
    assets: Map<string, Asset>;
    addAsset: (asset: Asset) => void;
    removeAsset: (name: string) => void;
    loadDefaultAssets: () => void;
};

export const useAssets = create<AssetsStore>((set) => ({
    assets: new Map(),
    addAsset: (asset) =>
        set((state) => ({
            assets: new Map(state.assets).set(asset.name, asset),
        })),
    removeAsset: (name) =>
        set((state) => {
            const assets = new Map(state.assets);
            assets.delete(name);

            return { assets };
        }),
    loadDefaultAssets: () => set(() => ({})),
}));
