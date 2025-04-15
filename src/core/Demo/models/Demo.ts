import type { DemoDifficulty } from "./DemoDifficulty.ts";

/**
 * A demo is something that will be converted in a project later
 */
export interface Demo {
    name: string;
    code: string;
    description: string;
    formattedName: string;
    version: string;
    tags: string[];
    difficulty: DemoDifficulty;
    locked?: boolean;
}
