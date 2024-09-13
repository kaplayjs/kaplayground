import addExample from "../../../../../kaplay/examples/add.js?raw";
import audioExample from "./../../../../kaplay/examples/audio.js?raw";
import movementExample from "./../../../../kaplay/examples/movement.js?raw";
import sceneExample from "./../../../../kaplay/examples/scenes.js?raw";
import spriteExample from "./../../../../kaplay/examples/sprite.js?raw";
import textExample from "./../../../../kaplay/examples/text.js?raw";
import addImage from "../assets/add.png";
import movementImage from "../assets/movement.png";

export const examples = [
    {
        name: "Adding objects",
        description: "Add objects to the scene",
        code: addExample,
        image: addImage,
    },
    {
        name: "Movement",
        description: "Move objects in the scene",
        code: movementExample,
        image: movementImage,
    },
    {
        name: "Sprite Component",
        description: "Add sprites to the scene",
        code: spriteExample,
    },
    {
        name: "Text Component",
        description: "Add text to the scene",
        code: textExample,
    },
    {
        name: "Audio Component",
        description: "Add audio to the project",
        code: audioExample,
    },
    {
        name: "Scenes",
        description: "Using scenes in KAPLAY",
        code: sceneExample,
    },
];
