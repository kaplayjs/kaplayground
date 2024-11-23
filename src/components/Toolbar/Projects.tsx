import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import type { Project } from "../../stores/project";
import type { Asset } from "../../stores/storage/assets";
import type { File } from "../../stores/storage/files";
import { downloadBlob } from "../../util/download";
import ToolbarButton from "./ToolbarButton";

const Projects: FC = () => {
    const { project: project, createNewProject, loadProject } = useProject();
    const { update, run, showNotification, getRuntime } = useEditor();

    const handleDownload = () => {
        const projectLocal = localStorage.getItem(project.id);

        if (!projectLocal) {
            showNotification("No project to export... Remember to save!");
            return;
        }

        const blob = new Blob([projectLocal], {
            type: "application/json",
        });

        downloadBlob(blob, `${project.name}.kaplay`);
        showNotification("Exporting the project, check downloads...");
    };

    const handleExportHTML = () => {
        const projectCode = getRuntime().iframe?.srcdoc;

        if (!projectCode) {
            showNotification("No project to export... Remember to save!");
            return;
        }

        const blob = new Blob([projectCode], {
            type: "text/html",
        });

        downloadBlob(blob, `${project.name}.html`);
    };

    const handleProjectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const project = JSON.parse(e.target?.result as string) as {
                state: {
                    project: Omit<Project, "files" | "assets"> & {
                        assets: [string, Asset][];
                        files: [string, File][];
                    };
                };
            };

            const fileMap = new Map<string, File>();
            const assetMap = new Map<string, Asset>();

            project.state.project.files.forEach((file) => {
                fileMap.set(file[0], file[1]);
            });

            project.state.project.assets.forEach((asset) => {
                assetMap.set(asset[0], asset[1]);
            });

            loadProject(project.state.project.id, {
                ...project.state.project,
                files: fileMap,
                assets: assetMap,
            });
        };

        reader.readAsText(file);
    };

    const handleNewProject = () => {
        createNewProject("pj");
        update();
        run();
    };

    const handleNewExample = () => {
        createNewProject("ex");
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
                    <button
                        onClick={handleExportHTML}
                    >
                        Export project as .html
                    </button>
                </li>
                <li>
                    <label>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleProjectUpload}
                            accept=".kaplay"
                        />
                        <span>Import project</span>
                    </label>
                </li>
                <li>
                    <button
                        onClick={handleNewProject}
                    >
                        Create new project
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleNewExample}
                    >
                        Create new example
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Projects;
