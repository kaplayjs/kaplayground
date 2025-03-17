// A script that gets all the examples on kaplay/examples folder and generates a
// list of examples with code and name.

import fs from "fs";
import path from "path";
import type { Packument } from "query-registry";

async function getPackageInfo(name: string): Promise<Packument> {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
}

const defaultExamplesPath = path.join(
    import.meta.dirname,
    "..",
    "kaplay",
    "examples",
);
const distPath = path.join(import.meta.dirname, "..", "src", "data");

export const generateExamples = async (examplesPath = defaultExamplesPath) => {
    const defaultVersion = Object.keys(
        (await getPackageInfo("kaplay")).versions,
    ).reverse().find((v) => {
        return v.startsWith("3001");
    });
    let exampleCount = 0;

    const examples = fs.readdirSync(examplesPath).map((file) => {
        if (!file.endsWith(".js")) return null;

        const filePath = path.join(examplesPath, file);
        const code = fs.readFileSync(filePath, "utf-8");
        const name = file.replace(".js", "");

        return {
            name,
            code: code.replace("// @ts-check\n\n", "").replace(
                "// @ts-check\n",
                "",
            ),
            index: (exampleCount++).toString(),
            version: defaultVersion,
        };
    });

    // Write a JSON file with the examples
    fs.writeFileSync(
        path.join(distPath, "exampleList.json"),
        JSON.stringify(examples.filter(Boolean), null, 4),
    );

    console.log("Generated exampleList.json");
};

generateExamples();
