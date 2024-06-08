/** @satisfies {import('@webcontainer/api').FileSystemTree} */
import kaboomJs from "@/../kaplay/dist/kaboom.js?raw";
import exampleHtml from "./exampleFiles/index.html?raw";
import exampleJs from "./exampleFiles/main.js?raw";
import exampleJson from "./exampleFiles/package.json?raw";

export const files = {
    "index.html": {
        file: {
            contents: exampleHtml,
        },
    },
    "main.js": {
        file: {
            contents: exampleJs,
        },
    },
    "package.json": {
        file: {
            contents: exampleJson,
        },
    },
    "kaboom.js": {
        file: {
            contents: kaboomJs,
        },
    },
};
