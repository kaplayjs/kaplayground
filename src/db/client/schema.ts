import { DBSchema } from "idb";
import { Project } from "../../features/Projects/models/Project";

export interface Schema extends DBSchema {
    projects: {
        key: string;
        value: Project & {
            id: string; // uuidv7
        };
        indexes: {
            mode: Project["mode"];
            updatedAt: Project["updatedAt"];
        };
    };
}
