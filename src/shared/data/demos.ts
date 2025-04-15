import type { Demo } from "../../core/Demo/models/Demo.ts";
import demoJson from "../../data/exampleList.json";

export const difficulties = [
    "easy",
    "medium",
    "hard",
    "auto",
    "unknown",
] as const;

export const demos = demoJson.map((example) => {
    const obj: Demo = {
        ...example,
        difficulty: difficulties[example.difficulty],
    };

    return obj;
});
