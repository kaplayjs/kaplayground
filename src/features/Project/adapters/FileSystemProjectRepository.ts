import { filesystem } from "@neutralinojs/lib";
import type { File } from "../../../core/File/models/File.ts";
import { createProject } from "../../../core/Project/factories/createProject.ts";
import { updateProject } from "../../../core/Project/factories/updateProject.ts";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectBase } from "../../../core/Project/models/ProjectBase.ts";
import type { ProjectRepository } from "../../../core/Project/ports/ProjectRepository.ts";

type SerializedProject = Omit<Project, "codeFiles" | "assets">;

export class FileSystemProjectRepository implements ProjectRepository {
    private projectsDir = "projects";
    private dataDir = `${this.projectsDir}/data.json`;

    constructor() {
        this.ensureBaseDirs();
    }

    // #region Implementation

    async create(base: ProjectBase): Promise<Project> {
        const name = base.name;
        const project = createProject(base, name);
        const projectDir = `${this.projectsDir}/${name}`;

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
        const projectDir = `${this.projectsDir}/${updatedProject.name}`;

        await this.saveProjectFile(updatedProject, projectDir);
        return updatedProject;
    }

    async save(project: Project): Promise<void> {
        const projectDir = `${this.projectsDir}/${project.name}`;
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

    async has(name: string): Promise<boolean> {
        const index = await this.getIndex();
        return name in index;
    }

    async generateId(): Promise<string> {
        const index = await this.getIndex();
        const currentCount = Object.keys(index).length;
        return Promise.resolve(`${currentCount}`);
    }

    async createNew(): Promise<Project> {
        return Promise.resolve(
            createProject(
                {
                    name: "New Project",
                    mode: "project",
                },
                "New Project",
            ),
        );
    }

    async createFile(projectId: string, file: File): Promise<File> {
        const index = await this.getIndex();
        const project = index[projectId];

        if (!project) {
            throw new Error(
                `[FileSystem] Project with id ${projectId} not found`,
            );
        }

        const filePath = `${project}/${file.name}`;
        filesystem.writeFile(filePath, JSON.stringify(file));

        return Promise.resolve(file);
    }

    // #endregion

    // #region Private Helpers

    /**
     * Before using the repository, ensure all the base directories
     * are created.
     */
    private async ensureBaseDirs() {
        try {
            await this.ensure(this.projectsDir, "directory");
            await this.ensure(this.dataDir, "file");
        } catch (e) {
            throw new ProjectRepoFSError(
                `Failed to create base directories: ${this.projectsDir}`,
            );
        }
    }

    /**
     * Ensures that the given path exists. If it doesn't, it will
     * create it.
     *
     * @param path The path to ensure/create
     * @param mode The mode to create the path in
     */
    private async ensure(
        path: string,
        mode: "directory" | "file" = "file",
    ): Promise<void> {
        try {
            const read = mode === "file"
                ? filesystem.readFile
                : filesystem.readDirectory;
            const create = mode === "file"
                ? filesystem.writeFile
                : filesystem.createDirectory;

            read(path).then((e) => {
                console.log(e);
            }).catch(async () => {
                try {
                    await create(path, "");
                } catch (e) {
                    throw new Error(
                        `Failed to create ${mode}: ${path}`,
                    );
                }
            });
        } catch (e) {
            throw new ProjectRepoFSError(
                `Failed to read ${mode}: ${path}`,
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
            throw new ProjectRepoFSError(
                `Failed to create project directory: ${projectDir}`,
            );
        }

        await filesystem.writeFile(filePath, serializedProject);
    }

    private async updateIndex(id: string, path: string): Promise<void> {
        const index = await this.getIndex();
        index[id] = path;

        await filesystem.writeFile(
            this.dataDir,
            JSON.stringify(index, null, 2),
        );
    }

    private async removeFromIndex(id: string): Promise<void> {
        const index = await this.getIndex();
        delete index[id];

        await filesystem.writeFile(
            this.dataDir,
            JSON.stringify(index, null, 2),
        );
    }

    private async getIndex(): Promise<Record<string, string>> {
        const serializedIndex = await filesystem.readFile(this.dataDir);
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

    // #endregion
}

// #region Errors
class ProjectRepoFSError extends Error {
    constructor(message: string) {
        super(`[ProjectRepository.FileSystem] ${message}`);
        this.name = "FileSystemProjectRepositoryError";
    }
}

// #endregion
