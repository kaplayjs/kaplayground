import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { buildProject } from "../../features/Projects/application/buildProject";
import type { Asset } from "../../features/Projects/models/Asset";
import type { File } from "../../features/Projects/models/File";
import type { Project } from "../../features/Projects/models/Project";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { downloadBlob } from "../../util/download";
import ToolbarButton from "./ToolbarButton";

const Projects: FC = () => {
    const projectKey = useProject((state) => state.projectKey);
    const projectName = useProject((state) => state.project.name);
    const createNewProject = useProject((state) => state.createNewProject);
    const update = useEditor((state) => state.update);
    const run = useEditor((state) => state.run);
    const showNotification = useEditor((state) => state.showNotification);

    const handleDownload = () => {
        const projectLocal = localStorage.getItem(projectKey ?? "");

        if (!projectLocal) {
            showNotification("No project to export... Remember to save!");
            return;
        }

        const blob = new Blob([projectLocal], {
            type: "application/json",
        });

        downloadBlob(blob, `${projectName}.kaplay`);
        showNotification("Exporting the project, check downloads...");
    };

    const handleExportHTML = async () => {
        // get content from sandbox iframe
        const projectCode = await buildProject();

        if (!projectCode) {
            showNotification("Failed to export project as HTML");
            return;
        }

        const blob = new Blob([projectCode], {
            type: "text/html",
        });

        downloadBlob(blob, `${projectName}.html`);
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

            createNewProject(project.state.project.mode, {
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
