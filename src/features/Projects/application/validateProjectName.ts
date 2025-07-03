import { useProject } from "../stores/useProject";

let usedNames: string[] | null = null;
let lastCheckActiveProject: string | null = null;

export const validateProjectName = (name: string): [boolean, string | null] => {
    const projectStore = useProject.getState();
    const { projectKey, getSavedProjects, getProjectMetadata } = projectStore;

    if (!usedNames || lastCheckActiveProject != projectKey) {
        usedNames = getSavedProjects()
            .filter(k => k !== projectKey)
            .map(k => getProjectMetadata(k).name);
    }

    lastCheckActiveProject = projectKey;
    const nameAlreadyUsed = name && usedNames?.includes(name);

    return [
        !nameAlreadyUsed,
        nameAlreadyUsed ? "Project with that name already exists!" : null,
    ];
};
