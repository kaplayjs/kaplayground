import { useProjects } from "../../../Project/stores/useProjects.ts";
import { ProjectNameInput } from "./ProjectNameInput.tsx";
import { ProjectSaveButton } from "./ProjectSaveButton.tsx";

export const ProjectStatus = () => {
    const projects = useProjects();
    const curProject = projects.curProject;

    if (!curProject) return;

    return (
        <div className="flex flex-row gap-2 items-center h-full">
            <div className="uppercase badge badge-sm px-2 py-[3px] h-auto font-semibold tracking-wider bg-base-50 rounded-xl">
                {curProject.mode}
            </div>

            <ProjectNameInput />
            <ProjectSaveButton />
        </div>
    );
};
