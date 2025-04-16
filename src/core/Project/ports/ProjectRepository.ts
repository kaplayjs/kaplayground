import type { Project } from "../models/Project.ts";
import type { ProjectBase } from "../models/ProjectBase.ts";

/**
 * Repository for CRUD Projects
 */
export interface ProjectRepository {
    // Project Managment

    create(base: ProjectBase): Promise<Project>;
    get(id: string): Promise<Project>;
    update(project: Project, newProject: Partial<Project>): Promise<Project>;
    delete(id: string): void;
    save(project: Project): void;
    has(id: string): Promise<boolean>;
    /**
     * Generates a unique ID for a new project.
     */
    generateId(): Promise<string>;
}
