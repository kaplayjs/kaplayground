// A script that fetches all KAPLAY lib versions and generates a JSON file

import { writeFileSync } from "fs";
import path from "path";
import type { Packument } from "query-registry";

// @ts-ignore
async function getPackageInfo(name: string): Promise<Packument> {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data as Packument;
}

const distPath = path.join(import.meta.dirname, "..", "src", "data");

export const generateVersions = async () => {
    const kaplayInfo = await getPackageInfo("kaplay");

    const data = {
        kaplayVersions: [
            "master",
            ...Object.keys(kaplayInfo.versions).reverse(),
        ],
    };

    // Write a JSON file with the KAPLAY versions
    writeFileSync(
        path.join(distPath, "kaplayVersions.json"),
        JSON.stringify(data, null, 4),
    );

    console.log("Generated kaplayVersions.json");
};

generateVersions();
