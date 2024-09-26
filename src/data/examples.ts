import examplesList from "./exampleList.json";

export type Example = {
    name: string;
    code: string;
    index: string;
    description: string | null;
    formatedName: string;
    version?: string;
    tags?: string[];
    difficulty?: "easy" | "medium" | "hard" | "auto";
    image?: string;
};

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
        version: "4000",
    },
    "component": {
        formatedName: "Component",
        description: "How to create and use components.",
        tags: ["basic concepts"],
        difficulty: "easy",
    },
    "concert": {
        formatedName: "Concert",
        description: "Celebrate Kaboom.js v2000 and back to the old days.",
        tags: ["games"],
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
        tags: ["basic concepts", "games"],
        difficulty: "medium",
    },
    "drag": {
        formatedName: "Drag",
        description: "Make game objects draggable.",
        tags: ["ui"],
        difficulty: "medium",
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
        tags: ["games"],
        difficulty: "medium",
    },
    "egg": {
        formatedName: "Egg",
        description: "A game about eggs.",
        tags: ["games"],
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
        version: "4000",
    },
    "fall": {
        formatedName: "Fall",
        description: "How to make game objects fall.",
        tags: ["basic concepts", "physics"],
        difficulty: "easy",
    },
};

export const examples = examplesList.filter((example) =>
    examplesMetaData[example.name]?.version !== "4000"
).map((example) => {
    return {
        ...example,
        description: examplesMetaData[example.name]?.description ?? null,
        formatedName: examplesMetaData[example.name]?.formatedName
            ?? example.name,
        tags: examplesMetaData[example.name]?.tags ?? [],
        difficulty: examplesMetaData[example.name]?.difficulty ?? "medium",
    };
});
