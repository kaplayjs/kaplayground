import type { Project } from "../models/Project.ts";
import type { ProjectRepository } from "../ports/ProjectRepository.ts";

export function saveProject(
    project: Project,
    repo: ProjectRepository,
): void {
    try {
        repo.save(project);
    } catch (error) {
        console.error("Error saving project:", error);
    }
}
