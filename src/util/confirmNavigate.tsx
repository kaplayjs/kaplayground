import { useProject } from "../features/Projects/stores/useProject";
import { useEditor } from "../hooks/useEditor";
import { confirm, type ConfirmContent, type ConfirmOptions } from "./confirm";

export type unsavedChangesConfirm = {
    title?: string;
    content?: ConfirmContent;
    options?: ConfirmOptions;
};

export const confirmNavigate = async (
    to: () => void,
    { title, content, options }: unsavedChangesConfirm = {},
) => {
    if (!useEditor.getState().getRuntime().hasUnsavedChanges) return to();

    if (
        await confirm(
            title || "You have unsaved changes!",
            content ?? (
                <p>
                    You will loose your changes if you continue without
                    saving.<br />
                    <span className="text-sm">
                        Your project will{" "}
                        <strong className="text-white">auto-save</strong>{" "}
                        after the first inital save.
                    </span>
                </p>
            ),
            options ?? {
                confirmText: "Save as Project and continue",
                dismissText: "Discard and continue",
            },
        )
    ) useProject.getState().saveNewProject();

    to?.();
};
