import { filesystem } from "@neutralinojs/lib";
import { createProject } from "../../../core/Project/factories/createProject.ts";
import { updateProject } from "../../../core/Project/factories/updateProject.ts";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectBase } from "../../../core/Project/models/ProjectBase.ts";
import type { ProjectRepository } from "../../../core/Project/ports/ProjectRepository.ts";

type SerializedProject = Omit<Project, "codeFiles" | "assets">;

export class FileSystemProjectRepository implements ProjectRepository {
    // Base directory for storing projects
    private baseDir = "projects";
    // The index file, to store data that maps project id to project path
    private indexFile = `${this.baseDir}/data.json`;

    constructor() {
        this.ensureBaseDirs();
    }

    async create(base: ProjectBase): Promise<Project> {
        const name = base.name;
        const project = createProject(base, name);
        const projectDir = `${this.baseDir}/${name}`;

        await this.saveProjectFile(project, projectDir);
        await this.updateIndex(project.id, `${projectDir}/kaplay.project.json`);

        return project;
    }

    async get(id: string): Promise<Project> {
        const index = await this.getIndex();
        const filePath = index[id];

        if (!filePath) {
            throw new Error(`[fileSystem] Project with name ${id} not found`);
        }

        try {
            const serializedProject = await filesystem.readFile(filePath);
            return this.deserializeProject(
                JSON.parse(serializedProject) as SerializedProject,
            );
        } catch {
            throw new Error(
                `[fileSystem] Failed to read project with name ${id}`,
            );
        }
    }

    async update(
        project: Project,
        newProject: Partial<Project>,
    ): Promise<Project> {
        const updatedProject = updateProject(project, newProject);
        const projectDir = `${this.baseDir}/${updatedProject.name}`;

        await this.saveProjectFile(updatedProject, projectDir);
        return updatedProject;
    }

    save(project: Project): void {
        const projectDir = `${this.baseDir}/${project.name}`;
        this.saveProjectFile(project, projectDir);
    }

    async delete(name: string): Promise<void> {
        const index = await this.getIndex();
        const filePath = index[name];
        if (!filePath) {
            throw new Error(`[FileSystem] Project with name ${name} not found`);
        }

        const projectDir = filePath.substring(0, filePath.lastIndexOf("/"));
        try {
            await filesystem.remove(projectDir);
            await this.removeFromIndex(name);
        } catch {
            throw new Error(
                `[FileSystem] Failed to delete project with name ${name}`,
            );
        }
    }

    private async saveProjectFile(
        project: Project,
        projectDir: string,
    ): Promise<void> {
        const filePath = `${projectDir}/kaplay.project.json`;
        const serializedProject = this.serializeProject(project);

        try {
            await filesystem.createDirectory(projectDir);
        } catch {
            throw new Error(
                `[FileSystem] Failed to create directory: ${projectDir}`,
            );
        }

        await filesystem.writeFile(filePath, serializedProject);
    }

    async has(name: string): Promise<boolean> {
        const index = await this.getIndex();
        return name in index;
    }

    async generateId(): Promise<string> {
        const index = await this.getIndex();
        const currentCount = Object.keys(index).length;
        return Promise.resolve(`${currentCount}`);
    }

    private async ensureBaseDirs() {
        try {
            await filesystem.readDirectory(this.baseDir);
        } catch {
            try {
                await filesystem.createDirectory(this.baseDir);
            } catch {
                throw new Error(
                    `[fileSystem] Failed to create base directory: ${this.baseDir}`,
                );
            }
        }

        try {
            await filesystem.readFile(this.indexFile);
        } catch {
            await filesystem.writeFile(
                this.indexFile,
                JSON.stringify({}, null, 2),
            );
        }
    }

    private async updateIndex(id: string, path: string): Promise<void> {
        const index = await this.getIndex();
        index[id] = path;

        await filesystem.writeFile(
            this.indexFile,
            JSON.stringify(index, null, 2),
        );
    }

    private async removeFromIndex(id: string): Promise<void> {
        const index = await this.getIndex();
        delete index[id];

        await filesystem.writeFile(
            this.indexFile,
            JSON.stringify(index, null, 2),
        );
    }

    private async getIndex(): Promise<Record<string, string>> {
        const serializedIndex = await filesystem.readFile(this.indexFile);
        return JSON.parse(serializedIndex) as Record<string, string>;
    }

    private serializeProject(project: Project): string {
        const { codeFiles, assets, ...rest } = project;

        const obj: SerializedProject = {
            ...rest,
        };

        return JSON.stringify(obj, null, 2);
    }

    private deserializeProject(
        serializedProject: SerializedProject,
    ): Project {
        const project: Project = {
            ...serializedProject,
            codeFiles: new Map(),
            assets: new Map(),
        };

        return project;
    }
}
