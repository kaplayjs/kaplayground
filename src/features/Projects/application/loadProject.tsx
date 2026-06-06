import { toast } from "react-toastify";
import { db } from "../../../db/client/db";
import { useConfig } from "../../../hooks/useConfig";
import { useEditor } from "../../../hooks/useEditor";
import { confirm } from "../../../util/confirm";
import { debug } from "../../../util/logs";
import { siteStorageUsage } from "../../../util/siteStorageUsage";
import { clearModels } from "../../Editor/application/clearModels";
import { useProject } from "../stores/useProject";

export const loadProject = async (projectKey: string) => {
    const projectStore = useProject.getState();
    const editorStore = useEditor.getState();
    const configStore = useConfig.getState();
    const prevMode = projectStore.project.mode;
    const isInitialLoad = !projectStore.project.createdAt;
    const createNewProject = useProject.getState().createNewProject;

    debug(0, "[project] Loading project", projectKey);

    const project = await db.get("projects", projectKey);

    if (!project) {
        await createNewProject("pj");

        const dbCount = await db.count("projects");
        const storageUsed = !dbCount ? await siteStorageUsage() : null;

        if (isInitialLoad) {
            confirm(
                "Failed to load the last project",
                <>
                    <p>
                        <span className="text-subheadings">
                            Tried to load a project that doesn't exist:
                        </span>
                        <br />
                        <span className="text-white">{projectKey}</span>
                    </p>
                    {dbCount === 0 && (
                        <p>
                            It looks like your projects are empty!
                            {storageUsed !== null && (
                                <>
                                    {" "}Either you or your browser may have
                                    cleared the site data. This can happen if
                                    your device is low on storage (not just site
                                    storage).
                                </>
                            )}
                        </p>
                    )}

                    <p className="text-sm">
                        We recommend you to do a manual backup once in a while
                        (in the navbar:{" "}
                        <span className="text-subheadings">
                            Project{" "}
                            <span className="font-mono leading-none">&gt;</span>
                            {" "}
                            Export
                        </span>).
                    </p>

                    {storageUsed !== null && (
                        <p className="text-sm text-subheadings">
                            Site storage used:{" "}
                            {storageUsed.value}% ({storageUsed.details})
                        </p>
                    )}
                </>,
                {
                    type: dbCount ? "warning" : "neutral",
                    confirmText: dbCount
                        ? "Reload to try again"
                        : "Browse Projects",
                    dismissText: "Browse Projects",
                },
            ).then((r) => {
                if (r && dbCount) {
                    location.reload();
                    return;
                }
                document.querySelector<HTMLDialogElement>("#examples-browser")
                    ?.showModal();
            });
        } else {
            toast(
                `Tried to load a project that doesn't exist: '${projectKey}'`,
                {
                    type: "error",
                },
            );
        }

        return;
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
