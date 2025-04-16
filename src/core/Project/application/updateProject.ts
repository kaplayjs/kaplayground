import type { Project } from "../models/Project.ts";
import type { ProjectRepository } from "../ports/ProjectRepository.ts";

export function updateProject(
    repo: ProjectRepository,
    project: Project,
    newProject: Partial<Project>,
): Promise<Project> {
    if (!newProject.name) {
        throw new Error(
            "[Project.updateProject] Project cannot have an empty name",
        );
    }

    const updatedProject = repo.update(project, newProject);

    return updatedProject;
}
