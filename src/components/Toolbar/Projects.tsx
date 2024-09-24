import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import type { Project } from "../../stores/project";
import { downloadBlob } from "../../util/download";
import ToolbarButton from "./ToolbarButton";

const Projects: FC = () => {
    const { project, replaceProject, createNewProject } = useProject();
    const { update, run, showNotification } = useEditor();

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(project)], {
            type: "application/json",
        });

        downloadBlob(blob, "project.kaplay");
        showNotification("Exporting the project, check downloads...");
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
        createNewProject();
        update();
        run();
    };

    return (
        <div className="dropdown dropdown-end flex-grow-0 flex-shrink-0 basis-24 h-full">
            <ToolbarButton
                icon={assets.toolbox.outlined}
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
                        Create new project
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Projects;
