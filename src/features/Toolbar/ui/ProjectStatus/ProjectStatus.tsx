import { useProjectStore } from "../../../Project/store/useProject.ts";
import { ProjectNameInput } from "./ProjectNameInput.tsx";
import { ProjectSaveButton } from "./ProjectSaveButton.tsx";

export const ProjectStatus = () => {
    const { currentProject } = useProjectStore();

    if (!currentProject) {
        return (
            <div className="badge badge-error">
                No current project!
            </div>
        );
    }

    return (
        <div className="flex flex-row gap-2 items-center h-full">
            <div className="uppercase badge badge-sm px-2 py-[3px] h-auto font-semibold tracking-wider bg-base-50 rounded-xl">
                {currentProject?.mode}
            </div>

            <ProjectNameInput />
            <ProjectSaveButton />
        </div>
    );
};
