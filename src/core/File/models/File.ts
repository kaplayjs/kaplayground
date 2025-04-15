import type { FileKind } from "./FileKind.ts";
import type { FileLanguage } from "./FileLanguage.ts";

export interface File {
    /** The file name, basically without path, /objects/main.js -> main */
    name: string;
    path: string;
    language: FileLanguage;
    kind: FileKind;
    content: string;
}
