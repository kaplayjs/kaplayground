import type { ProjectRepository } from "../ports/ProjectRepository.ts";

export function initProject(repo: ProjectRepository) {
    try {
        return repo.create({
            mode: "project",
            name: "New Project",
        });
    } catch (error) {
        console.error("Failed to initialize project:", error);
        throw new Error("Failed to initialize project");
    }
}
