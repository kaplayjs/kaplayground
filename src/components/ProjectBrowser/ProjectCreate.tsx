import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { useProject } from "../../hooks/useProject";
import type { ProjectMode } from "../../stores/project";

type Props = {
    mode: ProjectMode;
    tooltipContent?: string;
};

export const ProjectCreate: FC<Props> = ({ mode, tooltipContent }) => {
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
            className="gap-2 py-4 border-[0.1875rem] border-dashed border-base-300 bg-base-200/30 cursor-pointer min-h-20 items-center rounded-lg hover:bg-base-content/10 hover:border-base-content/10 focus-visible:outline-none focus-visible:border-base-content/50 transition-colors"
            onClick={handleClick}
            data-tooltip-id="projects-browser"
            data-tooltip-place="bottom"
            data-tooltip-content={tooltipContent}
        >
            <span className="flex flex-col items-center gap-1">
                <img
                    src={assets.plus.outlined}
                    className="h-6"
                    aria-hidden="true"
                />
                <span className="font-medium text-white">
                    Create {mode === "pj" ? "Project" : "Example"}
                </span>
            </span>
        </button>
    );
};
