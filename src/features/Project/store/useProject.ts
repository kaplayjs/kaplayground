import { create } from "zustand";
import { getProject } from "../../../core/Project/application/getProject.ts";
import { initProject } from "../../../core/Project/application/initProject.ts";
import { isProjectAvailable } from "../../../core/Project/application/isProjectAvaible.ts";
import { saveProject } from "../../../core/Project/application/saveProject.ts";
import { updateProject } from "../../../core/Project/application/updateProject.ts";
import type { Project } from "../../../core/Project/models/Project.ts";
import type { ProjectRepository } from "../../../core/Project/ports/ProjectRepository.ts";

interface RuntimeProject extends Project {
    saved: boolean;
}

type ProjectStore = {
    projectRepository: ProjectRepository | null;
    currentProject: RuntimeProject | null;
    setProjectRepository: (repo: ProjectRepository) => void;
    getProjectRepository: () => ProjectRepository;
    init(): void;
    setCurrentProject: (project: Project) => void;
    updateProject: (data: Partial<Project>) => void;
    saveProject: () => void;
    loadProject: (id: string) => void;
    deleteProject: (id: string) => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
    currentProject: null,
    projectRepository: null,

    setCurrentProject: async (project) => {
        const projectIsSaved = await isProjectAvailable(
            get().getProjectRepository(),
            project.id,
        );

        set({
            currentProject: {
                ...project,
                saved: projectIsSaved,
            },
        });
    },

    setProjectRepository: (repo) => {
        set({ projectRepository: repo });
    },

    getProjectRepository: () => {
        const repo = get().projectRepository;

        if (!repo) {
            console.error("XD");
            throw new Error("Project repository is not initialized");
        }

        return repo;
    },

    async init() {
        const project = await initProject(get().getProjectRepository());
        get().setCurrentProject(project);
    },

    updateProject: async (data) => {
        const current = get().currentProject;
        if (!current) return;

        const updated = await updateProject(
            get().getProjectRepository(),
            current,
            data,
        );
        get().setCurrentProject(updated);

        if (current.saved) {
            get().saveProject();
        }
    },

    saveProject: () => {
        const current = get().currentProject;
        if (!current) return;

        saveProject(current, get().getProjectRepository());
        get().setCurrentProject({ ...current });
    },

    loadProject: async (id) => {
        const project = await getProject(get().getProjectRepository(), id);
        get().setCurrentProject(project);
    },

    deleteProject: (id) => {
        get().getProjectRepository().delete(id);
        const current = get().currentProject;
        if (current?.id === id) {
            set({ currentProject: null });
        }
    },
}));
