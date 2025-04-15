import type { ProjectUnserialized } from "./ProjectUnserialized.ts";

export interface Project extends ProjectUnserialized {
    /** The project is currently saved in the FileSystem */
    saved: boolean;
}
