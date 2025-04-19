import type { Asset } from "../../../core/Asset/models/Asset.ts";
import type { File } from "../../../core/File/models/File.ts";
import { createProject } from "../../../core/Project/factories/createProject.ts";
import { updateProject } from "../../../core/Project/factories/updateProject.ts";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectBase } from "../../../core/Project/models/ProjectBase.ts";
import type { ProjectRepository } from "../../../core/Project/ports/ProjectRepository.ts";

type SerializedProject = {
    codeFiles: File[];
    assets: Asset[];
} & Omit<Project, "codeFiles" | "assets">;

export class LocalStorageProjectRepository implements ProjectRepository {
    private storageKey = "projects";

    async create(base: ProjectBase): Promise<Project> {
        return createProject(base, await this.generateId());
    }

    async get(id: string): Promise<Project> {
        const projects = this.getAllProjects();
        const serializedProject = projects[id];

        if (!serializedProject) {
            throw new Error(`[localStorage] Project with id ${id} not found`);
        }

        return this.deserializeProject(serializedProject);
    }

    async update(
        project: Project,
        newProject: Partial<Project>,
    ): Promise<Project> {
        const updatedProject = updateProject(project, newProject);

        return updatedProject;
    }

    async delete(id: string): Promise<void> {
        const projects = this.getAllProjects();

        if (!projects[id]) {
            throw new Error(`[localStorage] Project with id ${id} not found`);
        }

        delete projects[id];
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }

    async save(project: Project): Promise<void> {
        const projects = this.getAllProjects();
        const serializedProject = this.serializeProject(project);

        projects[project.id] = serializedProject;

        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }

    async has(id: string): Promise<boolean> {
        const projects = this.getAllProjects();

        return Boolean(projects[id]);
    }

    async generateId(): Promise<string> {
        const projects = this.getAllProjects();
        const currentCount = Object.keys(projects).length;

        return `${currentCount}`;
    }

    async createNew(): Promise<Project> {
        return createProject(
            {
                name: "New Project",
                mode: "project",
            },
            await this.generateId(),
        );
    }

    async createFile(projectId: string, file: File): Promise<File> {
        const projects = this.getAllProjects();
        const serializedProject = projects[projectId];

        if (!serializedProject) {
            throw new Error(
                `[localStorage] Project with id ${projectId} not found`,
            );
        }

        const project = this.deserializeProject(serializedProject);
        project.codeFiles.set(file.path, file);

        await this.save(project);

        return file;
    }

    private serializeProject(project: Project): SerializedProject {
        const serializedProject: SerializedProject = {
            ...project,
            codeFiles: Array.from(project.codeFiles.values()),
            assets: Array.from(project.assets.values()),
        };

        return serializedProject;
    }

    private deserializeProject(serializedProject: SerializedProject): Project {
        const project: Project = {
            ...serializedProject,
            codeFiles: new Map(
                serializedProject.codeFiles.map((file) => [file.path, file]),
            ),

            assets: new Map(
                serializedProject.assets.map((asset) => [asset.path, asset]),
            ),
        };

        return project;
    }

    private getAllProjects(): Record<string, SerializedProject> {
        const projects = localStorage.getItem(this.storageKey);

        if (!projects) {
            return {};
        }

        return JSON.parse(projects);
    }
}
