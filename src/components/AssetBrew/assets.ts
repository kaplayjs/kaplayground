import fs from "fs";
import assetsSource from "../../../assets.json";
import fontIcon from "../../assets/tabs/fonts.png";
import soundIcon from "../../assets/tabs/sounds.png";
import { getImportStatement } from "./assetBrewUtil";

export type AssetDef = {
    name: string;
    url: string;
    type: string;
    description?: string;
    subtype?: any;
};

export type AssetBrew = {
    name: string;
    url: string;
    type: string;
    description?: string;
    preview: string;
    import: string;
};

export const getAssetPreview = (assetType: string) => {
    switch (assetType) {
        case "sprite":
            return null;
        case "sound":
            return soundIcon.src;
        case "bitmapfont":
            return fontIcon.src;
        default:
            return "";
    }
};

export async function getAssets(): Promise<AssetBrew[]> {
    const assets = assetsSource.map((asset) => {
        return {
            name: asset.name,
            url: asset.url,
            type: asset.type,
            preview: getAssetPreview(asset.type),
            import: getImportStatement({
                type: asset.type,
                url: asset.url ?? "",
                name: asset.name,
                subtype: asset.subtype,
            }),
            description: asset.description
                ?? "Another KAPLAY Crew member.",
        } as AssetBrew;
    });

    return assets as AssetBrew[];
}

export const assets = await getAssets();
