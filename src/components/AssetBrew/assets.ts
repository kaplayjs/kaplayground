import fontIcon from "../../assets/tabs/fonts.png";
import soundIcon from "../../assets/tabs/sounds.png";
import { fileToBase64 } from "../../util/fileToBase64";

export type AssetBrew = {
    name: string;
    url: string;
    type: string;
    subtype?: string;
};

const assetNames = [
    {
        name: "apple",
        url: "sprites/apple.png",
        type: "sprite",
    },
    {
        name: "bag",
        url: "sprites/bag.png",
        type: "sprite",
    },
    {
        name: "bean",
        url: "sprites/bean.png",
        type: "sprite",
    },
    {
        name: "bobo",
        url: "sprites/bobo.png",
        type: "sprite",
    },
    {
        name: "btfly",
        url: "sprites/btfly.png",
        type: "sprite",
    },
    {
        name: "cloud",
        url: "sprites/cloud.png",
        type: "sprite",
    },
    {
        name: "coin",
        url: "sprites/coin.png",
        type: "sprite",
    },
    {
        name: "cursor_default",
        url: "sprites/cursor_default.png",
        type: "sprite",
    },
    {
        name: "cursor_pointer",
        url: "sprites/cursor_pointer.png",
        type: "sprite",
    },
    {
        name: "tga",
        url: "sprites/dino.png",
        type: "sprite",
    },
    {
        name: "egg",
        url: "sprites/egg.png",
        type: "sprite",
    },
    {
        name: "ghosty",
        url: "sprites/ghosty.png",
        type: "sprite",
    },
    {
        name: "gigagantrum",
        url: "sprites/gigagantrum.png",
        type: "sprite",
    },
    {
        name: "grape",
        url: "sprites/grape.png",
        type: "sprite",
    },
    {
        name: "grass",
        url: "sprites/grass.png",
        type: "sprite",
    },
    {
        name: "gun",
        url: "sprites/gun.png",
        type: "sprite",
    },
    {
        name: "heart",
        url: "sprites/heart.png",
        type: "sprite",
    },
    {
        name: "jumpy",
        url: "sprites/jumpy.png",
        type: "sprite",
    },
    {
        name: "k",
        url: "sprites/k.png",
        type: "sprite",
    },
    {
        name: "kaboom",
        url: "sprites/kaboom.png",
        type: "sprite",
    },
    {
        name: "key",
        url: "sprites/key.png",
        type: "sprite",
    },
    {
        name: "lightening",
        url: "sprites/lightening.png",
        type: "sprite",
    },
    {
        name: "mark",
        url: "sprites/mark.png",
        type: "sprite",
    },
    {
        name: "meat",
        url: "sprites/meat.png",
        type: "sprite",
    },
    {
        name: "moon",
        url: "sprites/moon.png",
        type: "sprite",
    },
    {
        name: "mushroom",
        url: "sprites/mushroom.png",
        type: "sprite",
    },
    {
        name: "note",
        url: "sprites/note.png",
        type: "sprite",
    },
    {
        name: "pineapple",
        url: "sprites/pineapple.png",
        type: "sprite",
    },
    {
        name: "portal",
        url: "sprites/portal.png",
        type: "sprite",
    },
    {
        name: "spike",
        url: "sprites/spike.png",
        type: "sprite",
    },
    {
        name: "bell",
        url: "sounds/bell.mp3",
        type: "sound",
    },
    {
        name: "blip",
        url: "sounds/blip.mp3",
        type: "sound",
    },
    {
        name: "OtherworldlyFoe",
        url: "sounds/OtherworldlyFoe.mp3",
        type: "sound",
    },
    {
        name: "bug",
        url: "sounds/bug.mp3",
        type: "sound",
    },
    {
        name: "burp",
        url: "sounds/burp.mp3",
        type: "sound",
    },
    {
        name: "computer",
        url: "sounds/computer.mp3",
        type: "sound",
    },
    {
        name: "danger",
        url: "sounds/danger.mp3",
        type: "sound",
    },
    {
        name: "dune",
        url: "sounds/dune.mp3",
        type: "sound",
    },
    {
        name: "error",
        url: "sounds/error.mp3",
        type: "sound",
    },
    {
        name: "explode",
        url: "sounds/explode.mp3",
        type: "sound",
    },
    {
        name: "hit",
        url: "sounds/hit.mp3",
        type: "sound",
    },
    {
        name: "kaboom2000",
        url: "sounds/kaboom2000.mp3",
        type: "sound",
    },
    {
        name: "mystic",
        url: "sounds/mystic.mp3",
        type: "sound",
    },
    {
        name: "notice",
        url: "sounds/notice.mp3",
        type: "sound",
    },
    {
        name: "off",
        url: "sounds/off.mp3",
        type: "sound",
    },
    {
        name: "portal",
        url: "sounds/portal.mp3",
        type: "sound",
    },
    {
        name: "powerup",
        url: "sounds/powerup.mp3",
        type: "sound",
    },
    {
        name: "robot",
        url: "sounds/robot.mp3",
        type: "sound",
    },
    {
        name: "score",
        url: "sounds/score.mp3",
        type: "sound",
    },
    {
        name: "shoot",
        url: "sounds/shoot.mp3",
        type: "sound",
    },
    {
        name: "signal",
        url: "sounds/signal.mp3",
        type: "sound",
    },
    {
        name: "spring",
        url: "sounds/spring.mp3",
        type: "sound",
    },
];

export const getImportStatement = (asset: AssetBrew) => {
    switch (asset.type) {
        case "sprite":
            return `\nloadSprite("${asset.name}", "${asset.url}")`;
        case "sound":
            return `\nloadSound("${asset.name}", "${asset.url}")`;
        default:
            return "";
    }
};

export const getAssetPreview = (assetType: string) => {
    switch (assetType) {
        case "sprite":
            return null;
        case "sound":
            return soundIcon.src;
        default:
            return "";
    }
};

// server-side
async function imageUrlToBase64(url: string) {
    try {
        const response = await fetch("http://localhost:4321/" + url);

        const blob = await response.arrayBuffer();

        const contentType = response.headers.get("content-type");

        const base64String = `data:${contentType};base64,${
            Buffer.from(
                blob,
            ).toString("base64")
        }`;

        return base64String;
    } catch (err) {
        console.log(err);
    }
}

export async function getAssets() {
    const toReturnAssets = await Promise.all(
        assetNames.map(async (asset, index) => {
            try {
                const assetLoaded = await imageUrlToBase64(asset.url);

                return {
                    name: asset.name,
                    url: assetLoaded,
                    type: asset.type,
                    preview: getAssetPreview(asset.type),
                    import: getImportStatement({
                        type: asset.type,
                        url: assetLoaded ?? "",
                        name: asset.name,
                    }),
                };
            } catch (e) {
                console.error(e);
            }
        }),
    );

    return toReturnAssets;
}

export const assets = await getAssets();
