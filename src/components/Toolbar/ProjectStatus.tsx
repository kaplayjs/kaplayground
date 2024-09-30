import { assets } from "@kaplayjs/crew";
import { useProject } from "../../hooks/useProject";

const ProjectStatus = () => {
    const { saveProject, getProject, setProject, projectIsSaved } =
        useProject();

    const handleSaveProject = () => {
        saveProject(getProject().name);
    };

    const handleEditName = () => {
        const projectName = prompt("New project name?");
        if (!projectName) return;

        setProject({ name: projectName });
    };

    if (getProject().isDefault) return;

    return (
        <div className="flex flex-row gap-2">
            <div className="uppercase | badge badge-lg badge-primary">
                {getProject().mode}
            </div>

            <div>
                {getProject().name}
                {!projectIsSaved(getProject().name, getProject().mode) && (
                    <span>*</span>
                )}
            </div>

            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
                onClick={handleEditName}
            >
                <img
                    src={assets.pointer.outlined}
                    alt="Save Project"
                    className="h-4"
                />
            </button>
            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
                onClick={handleSaveProject}
            >
                <img
                    src={assets.save.outlined}
                    alt="Save Project"
                    className="h-4"
                />
            </button>
        </div>
    );
};

export default ProjectStatus;
