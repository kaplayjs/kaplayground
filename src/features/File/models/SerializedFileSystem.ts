import type { SerializedFile } from "./SerializedFile.ts";
import type { SerializedFolder } from "./SerializedFold.ts";

export type SerializedFileSystem = [
    string,
    SerializedFolder | SerializedFile,
][];
