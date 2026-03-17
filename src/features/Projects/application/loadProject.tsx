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
    const prevMode = projectStore.project.mode;
    const isInitialLoad = !projectStore.project.createdAt;

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

    useProject.setState({
        projectKey,
        projectWasEdited: false,
        demoKey: null,
        project: {
            ...project,
            files: new Map(project.files),
            assets: new Map(project.assets),
            buildMode: project.buildMode || "legacy",
            favicon: project.favicon ?? "",
        },
    });

    editorStore.setCurrentFile("main.js");

    configStore.setConfig({
        lastOpenedProject: projectKey,
    });

    // It's already updated and run on mount by editor
    if (!isInitialLoad && prevMode == project.mode) {
        editorStore.updateAndRun();
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("example");
    window.history.replaceState({}, "", url);
};
