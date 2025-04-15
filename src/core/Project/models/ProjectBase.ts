import type { ProjectMode } from "./ProjectMode.ts";

export interface ProjectBase {
    name: string;
    version: string;
    mode: ProjectMode;
    kaplayVersion: string;
}
