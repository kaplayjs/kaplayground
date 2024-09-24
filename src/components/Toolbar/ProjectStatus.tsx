import { assets } from "@kaplayjs/crew";
import { useProject } from "../../hooks/useProject";

const ProjectStatus = () => {
    const {
        getProjectMode,
        project,
        saveProject,
        getProjectName,
        setProjectName,
        isProjectSaved,
    } = useProject();

    const handleSaveProject = () => {
        saveProject(getProjectName());
    };

    const handleEditName = () => {
        const projectName = prompt("Project name");
        if (!projectName) return;

        setProjectName(projectName);
    };

    return (
        <div className="flex flex-row gap-2">
            <div className="uppercase | badge badge-lg badge-primary">
                {getProjectMode() === "project" ? "PJ" : "EX"}
            </div>

            <div>
                {project.name || "Untitled Project"}
                {!isProjectSaved(getProjectName()) && <span>*</span>}
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
