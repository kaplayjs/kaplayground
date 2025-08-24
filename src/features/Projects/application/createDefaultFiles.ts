import { assets } from "@kaplayjs/crew";
import { VERSION } from "../../../config/common";
import type { Asset } from "../models/Asset";
import type { File } from "../models/File";
import { getAssetImportFunction } from "../stores/slices/assets";
import { useProject } from "../stores/useProject";

const mainExample = `// Starts a new game
kaplay();

// Load a bean
loadBean();

// Add the bean
const bean = add([
    sprite("bean"), // add sprite
    pos(center()), // set position, center of the screen
    scale(2), // set scale
    anchor("center"), // set anchor, pivot
    rotate(0), // set rotation
]);

// Add the text
add([
    text("Hello, KAWORLD!"), // add text
    pos(center().add(0, -130)), // set position
    anchor("center"), // set anchor, pivot
]);

// Run a function every frame
onUpdate(() => {
    bean.angle += dt() * 90; // rotate the bean
});`;

const gameFile = `import { addWelcomeText } from "../objects/welcomeText.js";

scene("game", () => {
    addWelcomeText();

    add([
        sprite("mark"),
        pos(center()),
        scale(2),
        anchor("center"),
        rotate(0),
    ]);
});`;

const welcomeTextFile = `export function addWelcomeText() {
    const txt = add([
        text("Welcome to\\n KAPLAYGROUND\\n ${VERSION}", { align: "center" }),
        pos(center().add(0, -130)),
        anchor("center"),
    ]);

    return txt;
}
`;

const defaultFiles: File[] = [
    {
        path: "main.js",
        kind: "main",
        value:
            `import "./kaplay.js";\nimport "./assets.js";\nimport "./scenes/game.js"\n\ngo(\"game\");\n`,
        language: "javascript",
    },
    {
        path: "assets.js",
        kind: "assets",
        value: `loadSprite("mark", "assets/sprites/mark.png");\nloadHappy();\n`,
        language: "javascript",
    },
    {
        path: "kaplay.js",
        kind: "kaplay",
        value:
            "kaplay({\n    focus: false,\n    font: \"happy\",\n    background: \"#4a3052\", \n});\n",
        language: "javascript",
    },
    {
        path: "scenes/game.js",
        kind: "scene",
        value: gameFile,
        language: "javascript",
    },
    {
        path: "objects/welcomeText.js",
        kind: "obj",
        value: welcomeTextFile,
        language: "javascript",
    },
];

const defaultAssets: Omit<Asset, "importFunction">[] = [
    {
        name: "mark.png",
        path: "assets/sprites/mark.png",
        url: assets.mark.sprite,
        kind: "sprite",
    },
    {
        name: "mark_voice.wav",
        path: "assets/sounds/mark_voice.wav",
        url: assets.mark_voice.sound,
        kind: "sound",
    },
];

export function createDefaultFiles() {
    const projectStore = useProject.getState();

    if (projectStore.project.mode == "pj") {
        for (const file of defaultFiles) {
            projectStore.addFile(file);
        }

        for (const asset of defaultAssets) {
            projectStore.addAsset({
                ...asset,
                importFunction: getAssetImportFunction(
                    asset.name,
                    asset.kind,
                ),
            });
        }
    } else {
        projectStore.addFile({
            path: "main.js",
            kind: "main",
            value: mainExample,
            language: "javascript",
        });
    }
}
