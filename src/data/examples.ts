import { DEFAULT_KAPLAY_VERSION } from "../config/common";
import examplesList from "./exampleList.json";

export type Tag =
    | "basic concepts"
    | "physics"
    | "animation"
    | "ui"
    | "ai"
    | "audio"
    | "testing"
    | "input"
    | "effects"
    | "math"
    | "game"
    | "project"
    | "example";

export type Example = {
    name: string;
    code: string;
    index: string;
    description: string | null;
    formatedName: string;
    hidden?: boolean;
    version?: string;
    tags?: Tag[];
    difficulty?: "easy" | "medium" | "hard" | "auto";
    image?: string;
};

const VERSION_4000 = "4000.0.0-alpha.14";

export const examplesMetaData: Record<string, Partial<Example>> = {
    "add": {
        formatedName: "Add game objects",
        description: "How to add game objects to the scene.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "ai": {
        formatedName: "AI with State Machine",
        description: "How to create a simple AI.",
        tags: ["basic concepts", "ai"],
        difficulty: "easy",
    },
    "animation": {
        formatedName: "Animation",
        description: "How to animate game objects properties.",
        tags: ["basic concepts", "animation"],
        difficulty: "easy",
    },
    "audio": {
        formatedName: "Audio",
        description: "How to play audio files and change volume, speed, etc.",
        tags: ["basic concepts", "audio"],
        difficulty: "easy",
    },
    "bench": {
        formatedName: "Benchmark",
        description: "A benchmark to see sprite rendering perfomance",
        tags: ["testing"],
        difficulty: "auto",
    },
    "binding": {
        formatedName: "Input bindings",
        description:
            "How to set common names as jump, shoot to keys/mouse/gamepad buttons.",
        tags: ["basic concepts", "input"],
        difficulty: "easy",
    },
    "burp": {
        formatedName: "Burp",
        description: "One of the KAPLAY's core features.",
        tags: ["basic concepts"],
        difficulty: "hard",
    },
    "button": {
        formatedName: "Button",
        description: "How to create a button and handle click events.",
        tags: ["basic concepts", "ui"],
        difficulty: "easy",
    },
    "camera": {
        formatedName: "Camera",
        description: "How to handle with camera and its properties.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "children": {
        formatedName: "Children",
        description: "How to create children on game objects.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "collision": {
        formatedName: "Collision",
        description: "How to handle collision between game objects.",
        tags: ["basic concepts", "physics"],
        difficulty: "easy",
    },
    "collisionshapes": {
        formatedName: "Collision Shapes",
        description: "How to create different collision shapes.",
        tags: ["physics"],
        difficulty: "medium",
        version: VERSION_4000,
    },
    "component": {
        formatedName: "Component",
        description: "How to create and use components.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "clip": {
        formatedName: "Clip",
        version: VERSION_4000,
        hidden: true,
    },
    "concert": {
        formatedName: "Concert",
        description: "Celebrate Kaboom.js v2000 and back to the old days.",
        tags: ["game"],
        difficulty: "medium",
    },
    "confetti": {
        formatedName: "Confetti",
        description: "How to create a confetti effect.",
        tags: ["effects"],
        difficulty: "medium",
    },
    "curves": {
        formatedName: "Curves",
        description: "Something I don't understand.",
        tags: ["math"],
        difficulty: "hard",
    },
    "dialog": {
        formatedName: "Dialog",
        description: "How to create a dialog box with a typewriter.",
        tags: ["ui"],
        difficulty: "medium",
    },
    "doublejump": {
        formatedName: "Double Jump",
        description: "How to add a double jump.",
        tags: ["basic concepts", "game"],
        difficulty: "easy",
    },
    "drag": {
        formatedName: "Drag",
        description: "Make game objects draggable.",
        tags: ["ui"],
        difficulty: "easy",
    },
    "draw": {
        formatedName: "Draw",
        description: "How to use KAPLAY as a canvas draw library.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "easing": {
        formatedName: "Tween Easings",
        description: "How to use easing functions on tweens.",
        tags: ["basic concepts", "animation"],
    },
    "eatlove": {
        formatedName: "Eat Love",
        description: "A simple game to eat love.",
        tags: ["game"],
        difficulty: "medium",
    },
    "egg": {
        formatedName: "Egg",
        description: "A game about eggs.",
        tags: ["game"],
        difficulty: "medium",
    },
    "fadeIn": {
        formatedName: "Fade In",
        description: "How to fade in game objects.",
        tags: ["effects"],
        difficulty: "easy",
    },
    "fakeMouse": {
        formatedName: "Fake Mouse",
        description: "How to create a fake mouse in-game.",
        tags: ["ui", "input"],
        difficulty: "easy",
        version: VERSION_4000,
    },
    // TODO: This could be better explained, it actually makes use of debug.stepFrame()
    //  so you could argue this is testing
    "fall": {
        formatedName: "Fall",
        description: "How to make game objects fall.",
        tags: ["basic concepts", "physics"],
        difficulty: "easy",
    },
    "fixedUpdate": {
        formatedName: "Fixed update",
        description: "How to use fixed update.",
        tags: ["basic concepts", "physics"],
        difficulty: "medium",
    },
    "flamebar": {
        formatedName: "Flame bar",
        description: "How to make mario-like flame bars using parent/children.",
        tags: ["basic concepts"],
        difficulty: "medium",
    },
    "flappy": {
        formatedName: "Flappy bird",
        description: "How to make popular game flappy bird.",
        tags: ["game", "ui"],
        difficulty: "medium",
    },
    "friction": {
        formatedName: "Friction",
        description: "Slipperiness.",
        tags: ["physics"],
        difficulty: "easy",
        version: VERSION_4000,
    },
    "gamepad": {
        formatedName: "Gamepad",
        description: "How to use gamepads in your game.",
        tags: ["input"],
        difficulty: "easy",
    },
    "ghosthunting": {
        formatedName: "Ghost hunting",
        description: "How to make a top-down shooter game.",
        tags: ["game", "ai", "effects"],
        difficulty: "hard",
    },
    "gravity": {
        formatedName: "Gravity",
        description: "How to make use of gravity and simple physics.",
        tags: ["physics"],
        difficulty: "easy",
    },
    "hover": {
        formatedName: "Hover",
        description: "How to manage hovers using the mouse.",
        tags: ["ui"],
        difficulty: "easy",
    },
    // TODO: This example shouldn't be on the examples list i think...
    "inspectExample": {
        formatedName: "Inspect example",
        description:
            "How to add custom inspect properties to a custom component.",
        tags: ["testing"],
        difficulty: "easy",
        hidden: true,
    },
    "kaboom": {
        formatedName: "Kaboom!",
        description: "How to KABOOM.",
        tags: ["effects"],
        difficulty: "easy",
    },
    "largeTexture": {
        formatedName: "Large texture",
        description: "How to manage large textures (+1000px).",
        tags: ["ui"],
        difficulty: "easy",
    },
    "layer": {
        formatedName: "Simple layers",
        description: "How to make use of a simple layering system.",
        tags: ["ui"],
        difficulty: "easy",
    },
    "layers": {
        formatedName: "Layers",
        description: "How to make use of a KAPLAY's layering system.",
        tags: ["ui"],
        difficulty: "easy",
    },
    "level": {
        formatedName: "Levels",
        description: "How to create levels using layouts and symbols.",
        tags: ["basic concepts"],
        difficulty: "medium",
    },
    // TODO: im not sure what this is
    "levelraycast": {
        formatedName: "Level raycast",
        description: "How to create levels using layouts and symbols.",
        tags: ["basic concepts"],
        difficulty: "medium",
        hidden: true,
    },
    "linecap": {
        formatedName: "Line cap",
        description: "How to add caps to lines.",
        tags: ["ui"],
        difficulty: "medium",
    },
    "linejoin": {
        formatedName: "Line join",
        description: "How to set the way lines join.",
        tags: ["ui"],
        difficulty: "medium",
    },
    "loader": {
        formatedName: "Custom loading",
        description: "How to make a custom loading screen.",
        tags: ["ui"],
        difficulty: "medium",
    },
    "maze": {
        formatedName: "Maze",
        description: "How to make a maze.",
        tags: ["game", "math"],
        difficulty: "hard",
    },
    "mazeRaycastedLight": {
        formatedName: "Maze (raycasted light)",
        description: "How to make a maze (and raycast a light).",
        tags: ["game", "math", "effects"],
        difficulty: "hard",
    },
    "movement": {
        formatedName: "Simple movement",
        description: "How to make simple directional movement.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "multigamepad": {
        formatedName: "Multi gamepad",
        description: "How to use multiple gamepads in your game.",
        tags: ["input"],
        difficulty: "easy",
    },
    "out": {
        formatedName: "Out of screen",
        description:
            "How to handle behaviour for objects that got out of the screen.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "overlap": {
        formatedName: "Overlap",
        description: "How to detect overlap of shapes.",
        tags: ["math"],
        difficulty: "medium",
    },
    "particle": {
        formatedName: "Particle",
        description: "How to use KAPLAY's particle system.",
        tags: ["effects"],
        difficulty: "medium",
    },
    "pauseMenu": {
        formatedName: "Pause menu",
        description: "How to make a simple pause menu.",
        tags: ["ui", "game"],
        difficulty: "medium",
    },
    // TODO: Not sure what this is either
    "physics": {
        formatedName: "Physics",
        description: "How to predict physics?.",
        tags: ["math"],
        difficulty: "hard",
    },
    "physicsfactory": {
        formatedName: "Physics Factory",
        description: "How to make use of various types of physics.",
        tags: ["math"],
        difficulty: "hard",
    },
    "platformBox": {
        formatedName: "Odd Uses of platformEffector()",
        description: "How to allow the player to decide whether they want to push something.",
        tags: ["physics"],
        difficulty: "medium",
        version: VERSION_4000,
    },
    "platformEffector": {
        formatedName: "Jump-Through Platforms",
        description: "How to make platforms that the player can jump through going up and down at will.",
        tags: ["physics"],
        difficulty: "medium",
        version: VERSION_4000,
    },
    "platformer": {
        formatedName: "Platformer",
        description: "How to make a platformer game.",
        tags: ["game", "basic concepts"],
        difficulty: "easy",
    },
    "polygon": {
        formatedName: "Polygon",
        description: "How to draw a polygon.",
        tags: ["math"],
        difficulty: "medium",
    },
    "prettyDebug": {
        formatedName: "Nice debug.log()",
        description: "How debug.log() can help you.",
        tags: ["testing"],
        difficulty: "easy",
    },
    // TODO: Not sure what this is
    "polygonuv": {
        formatedName: "PolygonUV",
        description: "Wobbly ghosts.",
        tags: ["math"],
        difficulty: "medium",
    },
    "pong": {
        formatedName: "Pong",
        description: "How to make pong.",
        tags: ["game", "basic concepts"],
        difficulty: "easy",
    },
    "postEffect": {
        formatedName: "Post Effect",
        description: "How to apply shaders in the screen (post effects).",
        tags: ["effects"],
        difficulty: "medium",
    },
    "query": {
        formatedName: "Query",
        description: "How to search for objects (multiple conditions).",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    // TODO: Is this meant to be a debug test, could it be removed or hidden?
    "raycastLevelTest": {
        formatedName: "Raycast level test",
        description: "How to search for objects (multiple conditions).",
        tags: ["basic concepts"],
        difficulty: "easy",
        hidden: true,
    },
    "raycastObject": {
        formatedName: "Raycasts objects",
        description: "How to shoot a raycast and make it bounce off the bounding boxes of objects.",
        tags: ["math"],
        difficulty: "medium",
    },
    "raycastShape": {
        formatedName: "Raycasts shapes",
        description: "How to shoot a raycast and make it bounce off the actual shapes of objects.",
        tags: ["math"],
        difficulty: "medium",
    },
    "raycaster3d": {
        formatedName: "3D Raycaster",
        description: "Basically, how to make 3D in KAPLAY.",
        tags: ["math", "effects"],
        difficulty: "hard",
    },
    "restitution": {
        formatedName: "Restitution",
        description: "Bounciness.",
        tags: ["physics"],
        difficulty: "easy",
        version: VERSION_4000,
    },
    "rect": {
        formatedName: "Rectangle",
        description: "Rect() component for making rectangle objects.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "rpg": {
        formatedName: "RPG",
        description: "How to make a RPG type game in KAPLAY.",
        tags: ["game"],
        difficulty: "medium",
    },
    "runner": {
        formatedName: "Runner",
        description: "How to make a runner type game in KAPLAY.",
        tags: ["game"],
        difficulty: "easy",
    },
    "scenes": {
        formatedName: "Scenes",
        description: "How to make use of scenes and states.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "shader": {
        formatedName: "Shader",
        description: "How to make use of shaders.",
        tags: ["basic concepts", "effects"],
        difficulty: "medium",
    },
    "shooter": {
        formatedName: "Shooter",
        description: "How to make a shooter type game in KAPLAY.",
        tags: ["game"],
        difficulty: "easy",
    },
    "size": {
        formatedName: "Scale of game",
        description: "How to manage a project's resolution and scale.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "slice9": {
        formatedName: "Slice9",
        description: "How to make use of slice9-type sprites.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "sprite": {
        formatedName: "Sprite",
        description: "How to add your own sprites and animate them.",
        tags: ["basic concepts", "animation"],
        difficulty: "easy",
    },
    "spriteatlas": {
        formatedName: "Sprite atlases",
        description: "How to make use of sprite atlases.",
        tags: ["basic concepts", "animation"],
        difficulty: "easy",
    },
    "text": {
        formatedName: "Text",
        description: "How to add text.",
        tags: ["basic concepts", "ui"],
        difficulty: "easy",
    },
    "textInput": {
        formatedName: "Text Input",
        description: "How to receive and display text.",
        tags: ["input", "ui"],
        difficulty: "easy",
    },
    "tiled": {
        formatedName: "Tiled sprites",
        description: "How to tile sprites.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "timer": {
        formatedName: "Timer",
        description: "How to wait and loop functions.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    // TODO: idk what this is neither
    "transformShape": {
        formatedName: "Transform shape",
        description: "Something.",
        tags: ["math"],
        difficulty: "easy",
    },
    "tween": {
        formatedName: "Tweens",
        description: "How to tween properties of an object.",
        tags: ["basic concepts", "math"],
        difficulty: "easy",
    },
    "weirdTextTags": {
        formatedName: "Weird text tags",
        description: "How to insert text with brackets without messing up formatting.",
        tags: ["testing"],
        difficulty: "easy",
    },
};

export const examples = examplesList.filter((example) =>
    !examplesMetaData[example.name]?.hidden
).map((example) => {
    return {
        ...example,
        description: examplesMetaData[example.name]?.description ?? null,
        formatedName: examplesMetaData[example.name]?.formatedName
            ?? example.name,
        tags: examplesMetaData[example.name]?.tags ?? [],
        difficulty: examplesMetaData[example.name]?.difficulty ?? "medium",
        version: examplesMetaData[example.name]?.version
            ?? DEFAULT_KAPLAY_VERSION,
    };
});
