import type { Project } from "../models/Project.ts";
import type { ProjectMode } from "../models/ProjectMode.ts";

export interface ProjectCollection {
    /**
     * Initializates project
     *
     * If there's a project saved as last project, return it, if not, create a
     * new project
     */
    init(): Project;
    /**
     * Create a new project
     *
     * @param projectName The name of the project to create
     * @param projectMode The mode to create the project
     */
    create(projectName: string, projectMode: ProjectMode): Project;
    /**
     * Update an existent project
     *
     * @param oldProject The old project to update
     * @param newProject An object with the properties to update
     */
    update(oldProject: Project, newProject: Partial<Project>): Project;
    /**
     * Save a project to persist
     *
     * @param project The project to save
     * @returns The project saved or null in case of error
     */
    save(project: Project): Project | null;
    /**
     * Delete a project from persist
     *
     * @param projectName The project to remove
     */
    delete(projectName: string): void;
    /**
     * If project exists in persist
     *
     * @param projectName The project to check
     */
    has(projectName: string): boolean;
    /**
     * Get a project from persist
     *
     * @param name The project to find
     */
    getByName(name: string): Project | null;
    /**
     * Get the latest project from save
     */
    getLast(): Project | null;
}
