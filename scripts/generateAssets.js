const assetNames = [
    {
        name: "bean",
        url: "assets/sprites/bean.png",
        type: "sprite",
        description:
            "Bean, the friend you never knew you needed, also the lead of the KAPLAY Crew",
    },
    {
        name: "apple",
        url: "assets/sprites/apple.png",
        type: "sprite",
        description: "The favorite fruit of the KAPLAY Crew",
    },
    {
        name: "bag",
        url: "assets/sprites/bag.png",
        type: "sprite",
        description: "Bag, the one who carries all the stuff",
    },
    {
        name: "bobo",
        url: "assets/sprites/bobo.png",
        type: "sprite",
        description: "Bobo, the one who's always happy",
    },
    {
        name: "btfly",
        url: "assets/sprites/btfly.png",
        type: "sprite",
        description: "Simple, a butterfly, with a ",
    },
    {
        name: "cloud",
        url: "assets/sprites/cloud.png",
        type: "sprite",
        description: "A cloud, a fluffy thing in the sky",
    },
    {
        name: "coin",
        url: "assets/sprites/coin.png",
        type: "sprite",
        description: "A coin, a shiny thing, but don't eat it",
    },
    {
        name: "cursy",
        url: "assets/sprites/cursor_default.png",
        type: "sprite",
        description: "A cursor, a pointer to the future",
    },
    {
        name: "pointer",
        url: "assets/sprites/cursor_pointer.png",
        type: "sprite",
        description: "She's the girlfriend of Cursy",
    },
    {
        name: "tga",
        url: "assets/sprites/dino.png",
        type: "sprite",
        description: "Someones says it's a dinosaur, others say it's a deity",
    },
    {
        name: "egg",
        url: "assets/sprites/egg.png",
        type: "sprite",
        description: "An egg, a potential life for a new Bean",
    },
    {
        name: "ghosty",
        url: "assets/sprites/ghosty.png",
        type: "sprite",
        description: "A ghost, a spooky thing",
    },
    {
        name: "ghostiny",
        url: "assets/sprites/ghostiny.png",
        type: "sprite",
        description: "A baby ghost, the little brother of Ghosty",
    },
    {
        name: "gigagantrum",
        url: "assets/sprites/gigagantrum.png",
        type: "sprite",
        description: "A big tree or big thing",
    },
    {
        name: "grape",
        url: "assets/sprites/grape.png",
        type: "sprite",
        description: "Best friend of the apple",
    },
    {
        name: "grass",
        url: "assets/sprites/grass.png",
        type: "sprite",
        description: "A grass, a green thing",
    },
    {
        name: "gun",
        url: "assets/sprites/gun.png",
        type: "sprite",
        description: "Don't play with it, it's dangerous",
    },
    {
        name: "heart",
        url: "assets/sprites/heart.png",
        type: "sprite",
        description: "A heart, you know what it is",
    },
    {
        name: "jumpy",
        url: "assets/sprites/jumpy.png",
        type: "sprite",
        description: "A jumpy thing",
    },
    {
        name: "k",
        url: "assets/sprites/k.png",
        type: "sprite",
        description: "A letter, the 11th letter of the alphabet",
    },
    {
        name: "kaboom",
        url: "assets/sprites/kaboom.png",
        type: "sprite",
        description: "A big explosion, a big revolution",
    },
    {
        name: "key",
        url: "assets/sprites/key.png",
        type: "sprite",
        description: "The key to enter to the KAPLAY World",
    },
    {
        name: "lightening",
        url: "assets/sprites/lightening.png",
        type: "sprite",
        description: "A lightening, a big spark",
    },
    {
        name: "mark",
        url: "assets/sprites/mark.png",
        type: "sprite",
        description: "ohhi",
    },
    {
        name: "meat",
        url: "assets/sprites/meat.png",
        type: "sprite",
        description: "It's Bean meat, don't eat it, it's a friend",
    },
    {
        name: "moon",
        url: "assets/sprites/moon.png",
        type: "sprite",
    },
    {
        name: "mushroom",
        url: "assets/sprites/mushroom.png",
        type: "sprite",
        description: "A mushroom, a fungi",
    },
    {
        name: "note",
        url: "assets/sprites/note.png",
        type: "sprite",
        description: "A note, a musical thing",
    },
    {
        name: "pineapple",
        url: "assets/sprites/pineapple.png",
        type: "sprite",
        description: "Comes from an old world, is the enemy of the pizza",
    },
    {
        name: "portal",
        url: "assets/sprites/portal.png",
        type: "sprite",
        description: "A portal, a gateway to another world",
    },
    {
        name: "spike",
        url: "assets/sprites/spike.png",
        type: "sprite",
        description: "A spike, a sharp thing, don't touch it",
    },
    {
        name: "bell",
        url: "examples/sounds/bell.mp3",
        type: "sound",
    },
    {
        name: "blip",
        url: "examples/sounds/blip.mp3",
        type: "sound",
    },
    {
        name: "OtherworldlyFoe",
        url: "examples/sounds/OtherworldlyFoe.mp3",
        type: "sound",
    },
    {
        name: "bug",
        url: "examples/sounds/bug.mp3",
        type: "sound",
    },
    {
        name: "burp",
        url: "examples/sounds/burp.mp3",
        type: "sound",
    },
    {
        name: "computer",
        url: "examples/sounds/computer.mp3",
        type: "sound",
    },
    {
        name: "danger",
        url: "examples/sounds/danger.mp3",
        type: "sound",
    },
    {
        name: "dune",
        url: "examples/sounds/dune.mp3",
        type: "sound",
    },
    {
        name: "error",
        url: "examples/sounds/error.mp3",
        type: "sound",
    },
    {
        name: "explode",
        url: "examples/sounds/explode.mp3",
        type: "sound",
    },
    {
        name: "hit",
        url: "examples/sounds/hit.mp3",
        type: "sound",
    },
    {
        name: "kaboom2000",
        url: "examples/sounds/kaboom2000.mp3",
        type: "sound",
    },
    {
        name: "mystic",
        url: "examples/sounds/mystic.mp3",
        type: "sound",
    },
    {
        name: "notice",
        url: "examples/sounds/notice.mp3",
        type: "sound",
    },
    {
        name: "off",
        url: "examples/sounds/off.mp3",
        type: "sound",
    },
    {
        name: "portal",
        url: "examples/sounds/portal.mp3",
        type: "sound",
    },
    {
        name: "powerup",
        url: "examples/sounds/powerup.mp3",
        type: "sound",
    },
    {
        name: "robot",
        url: "examples/sounds/robot.mp3",
        type: "sound",
    },
    {
        name: "score",
        url: "examples/sounds/score.mp3",
        type: "sound",
    },
    {
        name: "shoot",
        url: "examples/sounds/shoot.mp3",
        type: "sound",
    },
    {
        name: "signal",
        url: "examples/sounds/signal.mp3",
        type: "sound",
    },
    {
        name: "spring",
        url: "examples/sounds/spring.mp3",
        type: "sound",
    },
    {
        name: "happy",
        url: "examples/fonts/happy_28x36.png",
        type: "bitmapfont",
        subtype: {
            width: 28,
            height: 36,
        },
    },
];

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
                        subtype: asset.subtype,
                    }),
                    description: asset.description
                        ?? "Another KAPLAY Crew member.",
                };
            } catch (e) {
                console.error(e);
            }
        }),
    );

    return toReturnAssets;
}
