import type { SerializedFile } from "./SerializedFile.ts";

export type SerializedFolder = {
    type: "folder";
    data: [string, SerializedFolder | SerializedFile][];
};
