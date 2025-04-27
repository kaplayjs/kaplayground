import type { FileKind } from "./FileKind";

export type File = {
    name: string;
    path: string;
    language: string;
    value: string;
    kind: FileKind;
};
