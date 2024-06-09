import { persistentMap } from "@nanostores/persistent";
import type { FileSystemTree } from "@webcontainer/api";

type Project = {
    files: FileSystemTree;
};

export const $project = persistentMap<Project>("project:", {
    files: {
        "index.html": {
            file: {
                contents: ``,
            },
        },
    },
}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});
