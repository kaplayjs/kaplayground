import type { Project } from "../models/Project.ts";
import type { ProjectMode } from "../models/ProjectMode.ts";
import type { ProjectCollection } from "../ports/ProjectCollection.ts";

export class ProjectService {
    createProject(name: string, mode: ProjectMode): Project {
        return {
            name,
            mode,
            version: "2.0.0",
            kaplayVersion: "master",
            saved: false,
            assets: new Map(),
            codeFiles: new Map(),
        };
    }

    updateProject(
        projectCol: ProjectCollection,
        oldProject: Project,
        newProject: Partial<Project>,
    ): Project {
        const oldName = oldProject.name;
        const newName = newProject.name;
        let wasSaved = false;

        if (projectCol.has(oldName)) {
            wasSaved = true;
        }

        const updatedProject = {
            ...oldProject,
            ...newProject,
            saved: false,
        };

        // Auto-save for name changes
        if (wasSaved && newName) {
            projectCol.delete(oldName);
            projectCol.save(updatedProject);
            updatedProject.saved = true;
        }

        return updatedProject;
    }

    initProject(projectCol: ProjectCollection): Project {
        const project = projectCol.getLast();
        return project ?? this.createProject("Project #1", "project");
    }

    getModeIdentificator(mode: ProjectMode): string {
        const map: Record<string, string> = {
            example: "ex",
            project: "pj",
        };

        return map[mode];
    }
}
