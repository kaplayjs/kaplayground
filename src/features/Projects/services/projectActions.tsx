import { type ReactNode } from "react";
import { toast } from "react-toastify";
import { ProjectDetails } from "../../../components/Project/ProjectDetails";
import { confirm } from "../../../util/confirm";
import { downloadBlob } from "../../../util/download";
import { openDialog } from "../../../util/openDialog";
import { useProject } from "../stores/useProject";

type ToastOptions = {
    toastContainerId?: string;
};

type DeleteOptions = {
    confirmContent?: ReactNode;
    confirmTitle?: string;
    toastContainerId?: string;
    confirmProps?: {
        type?: "danger" | "warning" | "neutral";
        confirmText?: string;
        dismissText?: string;
    };
};

export function openProjectPreferences(key?: string) {
    openDialog("project-preferences", { ...(key && { projectKey: key }) });
}

export function openProjectDetails(
    key: string | null = useProject.getState().projectKey,
) {
    if (!key) {
        throw new Error(
            `Project doesn't exist: ${key}`,
        );
    }

    confirm(
        "Project Details",
        <ProjectDetails
            project={useProject.getState().getProjectMetadata(key)}
        />,
        {
            type: "neutral",
            confirmText: "Close",
        },
    );
}

export function exportProject(
    key: string | null = useProject.getState().projectKey,
    options?: ToastOptions,
) {
    const { saveNewProject, getProjectMetadata } = useProject.getState();

    if (!key) {
        saveNewProject();
        key = useProject.getState().projectKey;
    }

    const projectLocal = localStorage.getItem(key ?? "");

    if (!key || !projectLocal) {
        toast(`Project${key ? ` '${key}'` : ""} does not exist!`, {
            type: "error",
            ...(options?.toastContainerId
                && { containerId: options?.toastContainerId }),
        });
        return;
    }

    const { name } = getProjectMetadata(key);

    const blob = new Blob([projectLocal], {
        type: "application/json",
    });

    downloadBlob(blob, `${name.trim()}.kaplay`);
    toast("Downloading exported project...", {
        ...(options?.toastContainerId
            && { containerId: options?.toastContainerId }),
    });
}

export function cloneProject(key?: string, options?: ToastOptions) {
    const clonedOk = useProject.getState().cloneProject(key);

    toast(
        clonedOk
            ? "Project was cloned successfully!"
            : "Something went wrong, try cloning again!",
        {
            type: clonedOk ? "success" : "error",
            ...(options?.toastContainerId
                && { containerId: options?.toastContainerId }),
        },
    );
}

export async function confirmAndDeleteProject(
    key: string | null = useProject.getState().projectKey,
    options?: DeleteOptions,
): Promise<boolean> {
    const errorToast = () =>
        toast(
            <>
                This project is not saved or doesn't exist! Try to save first or
                {" "}
                <button
                    type="button"
                    className="link"
                    onClick={() => window.location.reload()}
                >
                    reload
                </button>{" "}
                the window.
            </>,
            {
                ...(options?.toastContainerId
                    && { containerId: options?.toastContainerId }),
                type: "error",
            },
        );

    if (!key) {
        errorToast();
        return false;
    }

    const currentProjectKey = useProject.getState().projectKey;

    const projectName =
        useProject.getState().getProjectMetadata(key).formattedName ?? key;
    const title = options?.confirmTitle ?? `Delete project '${projectName}'?`;
    const content = options?.confirmContent
        ?? (
            <>
                <p>
                    If you have the project currently opened, you will be able
                    to re-save it before navigating to any other project.<br />
                    <strong className="font-semibold text-error">
                        Otherwise, it's irreversible.
                    </strong>
                </p>
                <p className="bg-base-200 px-2.5 py-1.5 -mx-2.5 !-mb-1.5 rounded-md">
                    You might want to{" "}
                    <button
                        type="button"
                        className="link text-white"
                        onClick={() =>
                            exportProject(key, {
                                toastContainerId: "confirm-dialog-toasts",
                            })}
                    >
                        export
                    </button>{" "}
                    it first, to make a local back up.
                </p>
            </>
        );

    const confirmOk = await confirm(title, content, {
        type: options?.confirmProps?.type ?? "danger",
        dismissText: options?.confirmProps?.dismissText ?? "No, keep",
        confirmText: options?.confirmProps?.confirmText ?? "Yes, delete",
    });

    if (!confirmOk) return false;

    const serialized = localStorage.getItem(key);
    const result = useProject.getState().removeProject(key);

    if (!result) {
        errorToast();
        return false;
    }

    const successToast = toast(
        <div className="flex items-center justify-between gap-3 text-sm leading-tight">
            Project '{projectName}' was deleted

            {serialized != null && (
                <button
                    type="button"
                    className="btn btn-xs btn-success rounded-md"
                    onClick={() => {
                        if (currentProjectKey == key) {
                            useProject.getState().saveNewProject();
                        } else {
                            localStorage.setItem(key, serialized);
                            useProject.getState().updateSavedProjects();
                        }
                        toast.dismiss(successToast);
                    }}
                >
                    Undo
                </button>
            )}
        </div>,
        {
            ...(options?.toastContainerId
                && { containerId: options?.toastContainerId }),
            type: "success",
        },
    );

    return true;
}
