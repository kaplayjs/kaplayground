import examplesList from "./exampleList.json";

export type Example = {
    name: string;
    code: string;
    id: number;
    description: string | null;
    formattedName: string;
    version: string;
    tags: string[];
    difficulty: "easy" | "medium" | "hard" | "auto" | "unknown";
    locked?: boolean;
};

export const difficulties = [
    "easy",
    "medium",
    "hard",
    "auto",
    "unknown",
] as const;

export const demos = examplesList.map((example) => {
    const obj: Example = {
        ...example,
        difficulty: difficulties[example.difficulty],
    };

    return obj;
});
