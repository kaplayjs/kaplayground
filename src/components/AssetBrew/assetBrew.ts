import type { AssetDef } from "./assets";

export const typeByExtension = (ext: string) => {
    if (
        ext === "png"
        || ext === "jpg"
        || ext === "jpeg"
        || ext === "gif"
        || ext === "svg"
        || ext === "bmp"
        || ext === "webp"
    ) return "sprite";
    else if (
        ext === "mp3" || ext === "wav" || ext === "ogg"
    ) return "sound";
};

export const getImportStatement = (asset: AssetDef) => {
    switch (asset.type) {
        case "sprite":
            return `\nloadSprite("${asset.name}", "${asset.url}")`;
        case "sound":
            return `\nloadSound("${asset.name}", "${asset.url}")`;
        case "bitmapfont":
            return `\nloadBitmapFont("${asset.name}", "${asset.url}", ${asset.subtype.width}, ${asset.subtype.height})`;
        default:
            return "";
    }
};
