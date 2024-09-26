// A script that gets all the examples on kaplay/examples folder and generates a
// list of examples with code and name.

import fs from "fs";
import path from "path";

const examplesPath = path.join(import.meta.dirname, "..", "kaplay", "examples");
const distPath = path.join(import.meta.dirname, "..", "src", "data");

let exampleCount = 0;

const examples = fs.readdirSync(examplesPath).map((file) => {
    if (!file.endsWith(".js")) return null;

    const filePath = path.join(examplesPath, file);
    const code = fs.readFileSync(filePath, "utf-8");
    const name = file.replace(".js", "");

    return { name, code, index: (exampleCount++).toString() };
});

// Write a JSON file with the examples
fs.writeFileSync(
    path.join(distPath, "examples.json"),
    JSON.stringify(examples.filter(Boolean), null, 4),
);
