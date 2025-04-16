import { assets } from "@kaplayjs/crew";
import { useMemo } from "react";
import { cn } from "../../../../util/cn.ts";
import { useProjectStore } from "../../../Project/store/useProject.ts";
export const ProjectSaveButton = () => {
    const { currentProject, saveProject } = useProjectStore();
    if (!currentProject) {
        return <div className="badge badge-error">No current project!</div>;
    }

    const isSaved = useMemo(() => {
        return currentProject.saved;
    }, [currentProject]);

    const handleClick = () => {
        saveProject();
    };

    return (
        <button
            className={cn(
                "btn btn-xs btn-ghost px-px rounded-sm items-center justify-center h-full",
                {
                    "hover:bg-transparent cursor-default": isSaved,
                },
            )}
            onClick={handleClick}
            data-tooltip-id="global"
            data-tooltip-html={isSaved
                ? `Autosave Enabled`
                : `Save as My Project`}
            data-tooltip-place="bottom-end"
        >
            <img
                src={assets.save.outlined}
                alt="Save Project"
                className={cn("w-6 h-6 transition-all p-[3px]", {
                    "grayscale opacity-30": isSaved,
                })}
            />
        </button>
    );
};
