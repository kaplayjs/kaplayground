import { db } from "../../../db/client/db";
import { useConfig } from "../../../hooks/useConfig";
import { useEditor } from "../../../hooks/useEditor";
import { debug } from "../../../util/logs";
import { clearModels } from "../../Editor/application/clearModels";
import { useProject } from "../stores/useProject";

export const loadProject = async (projectKey: string) => {
    const projectStore = useProject.getState();
    const editorStore = useEditor.getState();
    const configStore = useConfig.getState();

    debug(0, "[project] Loading project", projectKey);

    const project = await db.get("projects", projectKey);

    if (!project) {
        throw new Error(
            `Tried to load a project that doesn't exist: ${projectKey}`,
        );
    }

    if (editorStore.runtime.editor) {
        clearModels();
    }

    projectStore.setProjectKey(projectKey);
    projectStore.setProjectWasEdited(false);
    projectStore.setDemoKey(null);
    editorStore.setCurrentFile("main.js");

    useProject.setState({
        project: {
            ...project,
            files: new Map(project.files),
            assets: new Map(project.assets),
            buildMode: project.buildMode || "legacy",
            favicon: project.favicon ?? "",
        },
    });

    configStore.setConfig({
        lastOpenedProject: projectKey,
    });

    editorStore.updateAndRun();
};
