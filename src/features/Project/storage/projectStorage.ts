import type { Project } from "../../../core/Project/models/Project.ts";
import { isTauri } from "../../../util/env.ts";
import {
    deserializeProject,
    serializeProject,
} from "./projectSerialization.ts";

export function saveProject(project: Project): Project | null {
    if (isTauri()) {
        console.log("F XD");
        return null;
    } else {
        project.saved = true;
        const serializedProject = serializeProject(project);

        localStorage.setItem(
            `pj-${project.name}`,
            JSON.stringify(serializedProject),
        );

        return project;
    }
}

export function deleteProject(projectName: string): void {
    if (isTauri()) {
        console.log("F XD");
        return;
    } else {
        localStorage.removeItem(`pj-${projectName}`);
    }
}

export function getProjectByName(projectName: string): Project | null {
    if (isTauri()) {
        console.log("F XD");
        return null;
    } else {
        const storedProject = getProjectFromLocalStorage(projectName);
        if (!storedProject) return null;

        const serializedProject = JSON.parse(storedProject);
        const deserializedProject = deserializeProject(serializedProject);

        return deserializedProject;
    }
}

export function getProjectByLast(): Project | null {
    if (isTauri()) {
        console.log("F XD");
        return null;
    } else {
        const lastProject = localStorage.getItem("last-project");
        if (!lastProject) return null;

        const storedProject = getProjectFromLocalStorage(lastProject);
        const serializedProject = JSON.parse(storedProject!);
        const deserializedProject = deserializeProject(serializedProject);

        return deserializedProject;
    }
}

export function getProjectFromLocalStorage(projectName: string) {
    return localStorage.getItem(
        `pj-${projectName}`,
    ) || localStorage.getItem(`ex-${projectName}`);
}

export function isProjectSaved(projectName: string): boolean {
    return getProjectFromLocalStorage(projectName) != null;
}
