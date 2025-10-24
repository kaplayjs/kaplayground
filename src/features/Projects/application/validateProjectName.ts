import { useProject } from "../stores/useProject";

let usedNames: string[] | null = null;
let lastCheckActiveProject: string | null = null;

export const validateProjectName = (
    name: string,
    key?: string | null,
): [boolean, string | null] => {
    const projectStore = useProject.getState();
    const { projectKey, getSavedProjects, getProjectMetadata } = projectStore;

    key ||= projectKey;

    if (!usedNames || lastCheckActiveProject != key) {
        usedNames = getSavedProjects()
            .filter(k => k !== key)
            .map(k => getProjectMetadata(k).name);
    }

    lastCheckActiveProject = key;
    const nameAlreadyUsed = name && usedNames?.includes(name);

    return [
        !nameAlreadyUsed,
        nameAlreadyUsed ? "Project with that name already exists!" : null,
    ];
};
