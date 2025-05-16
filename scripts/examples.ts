// A script that gets all the examples on kaplay/examples folder and generates a
// list of examples with code and name.

import { execSync } from "child_process";
import { parse } from "comment-parser";
import fs from "fs";
import path from "path";
import type { Packument } from "query-registry";
import examplesData from "../kaplay/examples/examples.json" with {
    type: "json",
};

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

        if (!codeWithoutMeta) return null;

        const tags = codeJsdoc[0]?.tags?.reduce(
            (acc, tag) => {
                acc[tag.tag] = [tag.name.trim(), tag.description.trim()].filter(
                    t => t != "",
                ).join(" ");
                return acc;
            },
            {} as Record<string, string>,
        );

        const sortName = [
            examplesData.categories?.[tags?.category]?.order ?? 9999,
            tags?.category,
            tags?.group ?? "zzzz",
            tags?.groupOrder ?? 9999,
            name,
        ].filter(t => t != undefined).join("-");

        const example: Record<string, any> = {
            id: exampleCount++,
            name,
            formattedName: tags?.file?.trim() || name,
            sortName,
            category: tags?.category || "",
            group: tags?.group || "",
            description: tags?.description || "",
            code: codeWithoutMeta,
            difficulty: parseInt(tags?.difficulty) ?? 4,
            version: (tags?.ver)?.trim() || "master",
            minVersion: (tags?.minver)?.trim() || "",
            tags: tags?.tags?.trim().split(", ") || [],
            createdAt: getFileTimestamp(filePath),
            updatedAt: getFileTimestamp(filePath, "updated"),
        };

        if (tags?.locked != undefined) example.locked = true;

        return example;
    });

    // Write a JSON file with the examples
    fs.writeFileSync(
        path.join(distPath, "exampleList.json"),
        JSON.stringify(examples.filter(Boolean), null, 4),
    );

    console.log("Generated exampleList.json");
};

function getFileTimestamp(
    filePath: string,
    type: "created" | "updated" = "created",
) {
    const cmd = {
        created:
            `git log --diff-filter=A --follow --format=%aI -1 -- "${filePath}"`,
        updated: `git log --follow --format=%aI -1 -- "${filePath}"`,
    };

    try {
        const stdout = execSync(cmd[type], {
            cwd: path.join(import.meta.dirname, "..", "kaplay"),
            encoding: "utf8",
        });
        return stdout.trim();
    } catch (err) {
        console.log(err);
        return "";
    }
}

generateExamples();
