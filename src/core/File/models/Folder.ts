import type { File } from "./File.ts";

export type Folder = Map<string, Folder | File>;
