import type { Project } from "../models/Project.ts";
import type { ProjectRepository } from "../ports/ProjectRepository.ts";

export async function getProject(
    repo: ProjectRepository,
    id: string,
): Promise<Project> {
    const project = await repo.get(id);

    if (!project) throw new Error("[project] The project doesn't exist");

    return project;
}
