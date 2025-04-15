import { create } from "zustand";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectCollection } from "../../../core/Project/ports/ProjectCollection.ts";
import { ProjectService } from "../../../core/Project/services/ProjectService.ts";
import { debug } from "../../../util/logs.ts";
import {
    deleteProject,
    getProjectByLast,
    getProjectByName,
    isProjectSaved,
    saveProject,
} from "../storage/projectStorage.ts";

interface ProjectsStore extends ProjectCollection {
    curProject: Project | null;
    loadProject(projectName: string): void;
    saveCurrent(): Project | null;
    updateCurProject(newProject: Partial<Project>): Project | null;
    hasCurrentProject(): boolean;
}

const projectService = new ProjectService();

export const useProjects = create<ProjectsStore>((set, get) => ({
    curProject: null,
    loadProject(projectName) {
        const projectToLoad = get().getByName(projectName);

        if (projectToLoad) {
            set({
                curProject: projectToLoad,
            });
        }
    },
    init() {
        const project = projectService.initProject(get());

        set({
            curProject: project,
        });

        return project;
    },
    create(projectName, projectMode) {
        return projectService.createProject(projectName, projectMode);
    },
    update(oldProject, newProject) {
        return projectService.updateProject(get(), oldProject, newProject);
    },
    updateCurProject(newProject) {
        const curProject = get().curProject;

        if (!curProject) {
            debug(0, "[project] no cur project for update");
            return null;
        }

        const updatedProject = projectService.updateProject(
            get(),
            curProject,
            newProject,
        );

        set({
            curProject: updatedProject,
        });

        return updatedProject;
    },
    save(project) {
        return saveProject(project);
    },
    delete(projectName) {
        deleteProject(projectName);
    },
    saveCurrent() {
        const curProject = get().curProject;

        if (!curProject) {
            debug(0, "[project] no cur project for save");
            return null;
        }

        const savedProject = get().save(curProject);

        if (!savedProject) {
            debug(0, "[project] error saving project");
        }

        set({
            curProject: savedProject,
        });

        return savedProject;
    },
    has(projectName) {
        return isProjectSaved(projectName);
    },
    hasCurrentProject() {
        const curProject = get().curProject;

        if (!curProject) {
            debug(0, "[project] no cur project for update");
            return false;
        }

        return isProjectSaved(curProject.name);
    },
    getByName(name) {
        return getProjectByName(name);
    },
    getLast() {
        return getProjectByLast();
    },
}));
