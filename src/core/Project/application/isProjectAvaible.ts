import type { ProjectRepository } from "../ports/ProjectRepository.ts";

export function isProjectAvailable(
    repo: ProjectRepository,
    id: string,
): Promise<boolean> {
    return repo.has(id);
}
