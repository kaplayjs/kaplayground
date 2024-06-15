import fontIcon from "../../assets/tabs/fonts.png";
import soundIcon from "../../assets/tabs/sounds.png";
import { fileToBase64 } from "../../util/fileToBase64";

export type AssetDef = {
    name: string;
    url: string;
    type: string;
    description?: string;
    subtype?: string;
};

export type AssetBrew = {
    name: string;
    url: string;
    type: string;
    description?: string;
    preview: string;
    import: string;
};

const assetNames: AssetDef[] = [
    {
        name: "bean",
        url: "sprites/bean.png",
        type: "sprite",
        description:
            "Bean, the friend you never knew you needed. He's the foundator of the KAPLAY Crew.",
    },
    {
        name: "apple",
        url: "sprites/apple.png",
        type: "sprite",
        description:
            "Apple, the one who keeps the doctor away. The favorite fruit of the KAPLAY Crew.",
    },
    {
        name: "bag",
        url: "sprites/bag.png",
        type: "sprite",
        description:
            "Bag, the one who carries all the stuff. The most useful member of the KAPLAY Crew.",
    },
    {
        name: "bobo",
        url: "sprites/bobo.png",
        type: "sprite",
        description:
            "Bobo, the one who's always happy. The most positive member of the KAPLAY Crew.",
    },
    {
        name: "btfly",
        url: "sprites/btfly.png",
        type: "sprite",
        description: "Butterfly, the one who's always flying",
    },
    {
        name: "cloud",
        url: "sprites/cloud.png",
        type: "sprite",
        description: "A cloud, a fluffy thing in the sky",
    },
    {
        name: "coin",
        url: "sprites/coin.png",
        type: "sprite",
        description: "A coin, a shiny thing, but don't eat it",
    },
    {
        name: "cursy",
        url: "sprites/cursor_default.png",
        type: "sprite",
        description: "A cursor, a pointer to the future",
    },
    {
        name: "pointer",
        url: "sprites/cursor_pointer.png",
        type: "sprite",
        description: "She's the girlfriend of Cursy",
    },
    {
        name: "tga",
        url: "sprites/dino.png",
        type: "sprite",
        description: "Someones says it's a dinosaur, others say it's a deity",
    },
    {
        name: "egg",
        url: "sprites/egg.png",
        type: "sprite",
        description: "An egg, a potential life for a new Bean",
    },
    {
        name: "ghosty",
        url: "sprites/ghosty.png",
        type: "sprite",
        description: "A ghost, a spooky thing",
    },
    {
        name: "gigagantrum",
        url: "sprites/gigagantrum.png",
        type: "sprite",
        description: "A big tree or big thing",
    },
    {
        name: "grape",
        url: "sprites/grape.png",
        type: "sprite",
        description: "Best friend of the apple",
    },
    {
        name: "grass",
        url: "sprites/grass.png",
        type: "sprite",
        description: "A grass, a green thing",
    },
    {
        name: "gun",
        url: "sprites/gun.png",
        type: "sprite",
        description: "Don't play with it, it's dangerous",
    },
    {
        name: "heart",
        url: "sprites/heart.png",
        type: "sprite",
        description: "A heart, you know what it is",
    },
    {
        name: "jumpy",
        url: "sprites/jumpy.png",
        type: "sprite",
        description: "A jumpy thing",
    },
    {
        name: "k",
        url: "sprites/k.png",
        type: "sprite",
        description: "A letter, the 11th letter of the alphabet",
    },
    {
        name: "kaboom",
        url: "sprites/kaboom.png",
        type: "sprite",
        description: "A big explosion, a big revolution",
    },
    {
        name: "key",
        url: "sprites/key.png",
        type: "sprite",
        description: "The key to enter to the KAPLAY World",
    },
    {
        name: "lightening",
        url: "sprites/lightening.png",
        type: "sprite",
        description: "A lightening, a big spark",
    },
    {
        name: "mark",
        url: "sprites/mark.png",
        type: "sprite",
        description: "ohhi",
    },
    {
        name: "meat",
        url: "sprites/meat.png",
        type: "sprite",
        description: "It's Bean meat, don't eat it, it's a friend",
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
        description: "A mushroom, a fungi",
    },
    {
        name: "note",
        url: "sprites/note.png",
        type: "sprite",
        description: "A note, a musical thing",
    },
    {
        name: "pineapple",
        url: "sprites/pineapple.png",
        type: "sprite",
        description: "Comes from an old world, is the enemy of the pizza",
    },
    {
        name: "portal",
        url: "sprites/portal.png",
        type: "sprite",
        description: "A portal, a gateway to another world",
    },
    {
        name: "spike",
        url: "sprites/spike.png",
        type: "sprite",
        description: "A spike, a sharp thing, don't touch it",
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

export const getImportStatement = (asset: AssetDef) => {
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

export async function getAssets(): Promise<AssetBrew[]> {
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
                    description: asset.description
                        ?? "Another KAPLAY Crew member.",
                } as AssetBrew;
            } catch (e) {
                console.error(e);
            }
        }),
    );

    return toReturnAssets as AssetBrew[];
}

export const assets = await getAssets();
