import type { FileKind } from "./FileKind";

export interface File {
    path: string;
    language: string;
    value: string;
    kind: FileKind;
}
