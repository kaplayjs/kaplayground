import {
    difficulties as difficultiesData,
    tags,
} from "../../kaplay/examples/examples.json";
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
    group: string;
    description: string | null;
    code: string;
    version: string;
    minVersion: string;
    tags: Tag[];
    difficulty: {
        level: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    locked?: boolean;
};

export const difficulties = [
    ...difficultiesData.map(({ displayName }, index: number) => ({
        level: index,
        name: displayName,
    })),
    {
        level: difficultiesData.length,
        name: "Unknown",
    },
];

export const difficultyByName = (name: string) =>
    difficulties.find(d => d.name === name);

export const demos = examplesList.map((example) => {
    const obj: Example = {
        ...example,
        tags: example.tags.map(tag => ({
            name: tag,
            ...(tags as ExamplesDataRecord)?.[tag],
        })),
        difficulty: difficulties[example.difficulty]
            ?? difficulties[difficulties.length - 1],
    };

    return obj;
});
