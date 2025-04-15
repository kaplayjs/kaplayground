import { assets } from "@kaplayjs/crew";
import { cn } from "../../../../util/cn.ts";
import { useProjects } from "../../../Project/stores/useProjects.ts";

export const ProjectSaveButton = () => {
    const { curProject, ...projects } = useProjects();

    const handleClick = () => {
        projects.saveCurrent();
    };

    return (
        <button
            className={cn(
                "btn btn-xs btn-ghost px-px rounded-sm items-center justify-center h-full",
                {
                    "hover:bg-transparent cursor-default": curProject?.saved,
                },
            )}
            onClick={handleClick}
            data-tooltip-id="global"
            data-tooltip-html={curProject?.saved
                ? `Autosave Enabled`
                : `Save as My Project`}
            data-tooltip-place="bottom-end"
        >
            <img
                src={assets.save.outlined}
                alt="Save Project"
                className={cn("w-6 h-6 transition-all p-[3px]", {
                    "grayscale opacity-30": curProject?.saved,
                })}
            />
        </button>
    );
};
