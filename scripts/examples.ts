// A script that gets all the examples on kaplay/examples folder and generates a
// list of examples with code and name.

import { parse } from "comment-parser";
import fs from "fs";
import path from "path";
import type { Packument } from "query-registry";

// @ts-ignore
async function getPackageInfo(name: string): Promise<Packument> {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data as Packument;
}

const defaultExamplesPath = path.join(
    import.meta.dirname,
    "..",
    "kaplay",
    "examples",
);
const distPath = path.join(import.meta.dirname, "..", "src", "data");

export const generateExamples = async (examplesPath = defaultExamplesPath) => {
    let exampleCount = 0;

    const examples = fs.readdirSync(examplesPath).map((file) => {
        if (!file.endsWith(".js")) return null;

        const filePath = path.join(examplesPath, file);
        const code = fs.readFileSync(filePath, "utf-8");
        const name = file.replace(".js", "");

        const codeJsdoc = parse(code);
        const codeWithoutMeta = code.replace(/\/\/ @ts-check\n/g, "").replace(
            /\/\*\*[\s\S]*?\*\//gm,
            "",
        ).trim();

        const tags = codeJsdoc[0].tags?.reduce(
            (acc, tag) => {
                acc[tag.tag] = tag.name + " " + tag.description;
                return acc;
            },
            {} as Record<string, string>,
        );

        const example: Record<string, any> = {
            name,
            formattedName: tags?.file?.trim() || name,
            description: tags?.description || "",
            code: codeWithoutMeta,
            difficulty: parseInt(tags?.difficulty) ?? 4,
            id: exampleCount++,
            version: "master",
            minVersion: (tags?.minver)?.trim() || "noset",
            tags: tags.tags?.trim().split(", ") || "",
        };

        if (tags.locked) example.locked = true;

        return example;
    });

    // Write a JSON file with the examples
    fs.writeFileSync(
        path.join(distPath, "exampleList.json"),
        JSON.stringify(examples.filter(Boolean), null, 4),
    );

    console.log("Generated exampleList.json");
};

generateExamples();
