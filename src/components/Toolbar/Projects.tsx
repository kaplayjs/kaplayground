import type { FC } from "react";
import { toast } from "react-toastify";
import projectIcon from "../../assets/toolbar/project.png";
import { useProject } from "../../hooks/useProject";
import type { Project } from "../../stores/project";
import ToolbarButton from "./ToolbarButton";

const Projects: FC = () => {
    const { project, replaceProject, resetProject } = useProject();

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(project)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "project.kaplay";
        a.click();

        toast("Project exporting, check downloads");

        URL.revokeObjectURL(url);
    };

    const handleProjectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const project = JSON.parse(e.target?.result as string) as Project;
            replaceProject(project);
        };

        reader.readAsText(file);
    };

    const handleProjectReset = () => {
        resetProject();
    };

    return (
        <div className="dropdown dropdown-end flex-grow-0 flex-shrink-0 basis-24 h-full">
            <ToolbarButton
                icon={projectIcon}
                text="Project"
                tabIndex={0}
                tip="Project Export/Import"
            />
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
            >
                <li>
                    <button
                        onClick={handleDownload}
                    >
                        Export project
                    </button>
                </li>
                <li>
                    <label>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleProjectUpload}
                        />
                        <span>Import project</span>
                    </label>
                </li>
                <li>
                    <button
                        onClick={handleProjectReset}
                    >
                        Reset project
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Projects;
