import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProject } from "../../hooks/useProject";

const ProjectStatus = () => {
    const { saveProject, getProject, projectIsSaved } = useProject();
    const [name, setName] = useState(getProject().name);

    const handleSaveProject = () => {
        saveProject(name, getProject().id);
    };

    const handleEditName = () => {
        const projectName = prompt("New project name?");
        if (!projectName) return;

        setName(projectName);
        toast("Project name updated, remember save now!");
    };

    useEffect(() => {
        setName(getProject().name);
    }, [getProject().name]);

    if (getProject().isDefault) return;

    return (
        <div className="flex flex-row gap-2">
            <div className="uppercase | badge badge-lg badge-primary">
                {getProject().mode === "pj" ? "Project" : "Example"}
            </div>

            <div>
                {name}
                {!projectIsSaved(name, getProject().mode) && <span>*</span>}
            </div>

            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
                onClick={handleEditName}
                data-tooltip-id="global"
                data-tooltip-html={`Edit name`}
                data-tooltip-place="bottom-end"
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
                data-tooltip-id="global"
                data-tooltip-html={`Save project`}
                data-tooltip-place="bottom-end"
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
