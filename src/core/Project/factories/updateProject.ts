import type { Project } from "../models/Project.ts";

export function updateProject(
    oldProject: Project,
    newProject: Partial<Project>,
): Project {
    if (!newProject.name) {
        throw new Error(
            "[Project.updateProject] Project cannot have an empty name",
        );
    }

    const updatedProject = {
        ...oldProject,
        ...newProject,
    };

    return updatedProject;
}
