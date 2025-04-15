import type { File } from "../../File/models/File.ts";

export const defaultCodeFiles: Record<string, File> = {
    "/objects/kat.js": {
        name: "kat",
        content: "function addKat() {\n}",
        kind: "object",
        path: "/objects/kat.js",
        language: "javascript",
    },
};
