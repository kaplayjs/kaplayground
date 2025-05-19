import { assets } from "@kaplayjs/crew";
import type { Asset } from "../models/Asset";
import type { File } from "../models/File";
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
    pos(center().add(0, -80)), // set position
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
        sprite("bean"),
        pos(center()),
        scale(2),
        anchor("center"),
        rotate(0),
    ]);
});`;

const welcomeTextFile = `export function addWelcomeText() {
    const txt = add([
        text("Welcome to KAPLAYGROUND"),
        pos(center().add(0, -100)),
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
        value: `loadSprite("bean", "assets/sprites/bean.png");\n`,
        language: "javascript",
    },
    {
        path: "kaplay.js",
        kind: "kaplay",
        value: "kaplay({\n    focus: false,\n});\n",
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
        name: "bean",
        path: "assets/sprites/bean.png",
        url: assets.bean.sprite,
        kind: "sprite",
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
