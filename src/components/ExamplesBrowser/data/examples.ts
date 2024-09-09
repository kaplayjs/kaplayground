import addExample from "../../../../../kaplay/examples/add.js?raw";
import movementExample from "./../../../../kaplay/examples/movement.js?raw";
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
];
