import { tags } from "../../kaplay/examples/examples.json";
import examplesList from "./exampleList.json";

export type ExamplesDataRecord = Record<string, {
    displayName?: string;
    description?: string;
    order?: number;
}>;

export type Tag = {
    name: string;
} & ExamplesDataRecord[string];

export type Example = {
    id: number;
    name: string;
    formattedName: string;
    sortName: string;
    category: string;
    description: string | null;
    code: string;
    version: string;
    minVersion: string;
    tags: Tag[];
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
        tags: example.tags.map(tag => ({
            name: tag,
            ...(tags as ExamplesDataRecord)?.[tag],
        })),
        difficulty: difficulties[example.difficulty],
    };

    return obj;
});
