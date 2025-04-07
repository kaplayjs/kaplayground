import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { useProject } from "../../hooks/useProject";
import type { ProjectMode } from "../../stores/project";

type Props = {
    mode: ProjectMode;
};

export const ProjectCreate: FC<Props> = ({ mode }) => {
    const { createNewProject } = useProject();

    const handleClick = () => {
        const dialog = document.querySelector<HTMLDialogElement>(
            "#examples-browser",
        );

        if (!dialog?.open) return;

        if (mode === "pj") {
            createNewProject("pj");
        } else {
            createNewProject("ex");
        }

        dialog?.close();
    };

    return (
        <button
            className="gap-2 py-4 border-[0.1875rem] border-dashed border-base-300 bg-base-200/30 cursor-pointer min-h-20 items-center rounded-lg hover:bg-base-content/10 hover:border-base-content/10 focus:outline-none focus:border-base-content/50 transition-colors"
            onClick={handleClick}
        >
            <span className="flex flex-col items-center gap-1">
                <img
                    src={assets.plus.outlined}
                    alt="Create Project"
                    className="h-6"
                />
                <span className="font-medium text-white">
                    Create {mode === "pj" ? "Project" : "Example"}
                </span>
            </span>
        </button>
    );
};
