import { useProject } from "../stores/useProject";

let usedNames: string[] | null = null;
let lastCheckActiveProject: string | null = null;

export const validateProjectName = async (
    name: string,
    key?: string | null,
): Promise<[boolean, string | null]> => {
    const projectStore = useProject.getState();
    const { projectKey, getSavedProjects } = projectStore;

    key ||= projectKey;

    if (!usedNames || lastCheckActiveProject != key) {
        usedNames = (await getSavedProjects())
            .filter(p => p.id !== key)
            .map(p => p.name);
    }

    lastCheckActiveProject = key;
    const nameAlreadyUsed = name && usedNames?.includes(name);

    return [
        !nameAlreadyUsed,
        nameAlreadyUsed ? "Project with that name already exists!" : null,
    ];
};
