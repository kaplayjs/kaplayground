import { assets } from "@kaplayjs/crew";
import { type FC, useRef } from "react";
import { buildProject } from "../../features/Projects/application/buildProject";
import type { Asset } from "../../features/Projects/models/Asset";
import type { File } from "../../features/Projects/models/File";
import type { Project } from "../../features/Projects/models/Project";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { downloadBlob } from "../../util/download";
import { KDropdownMenuSeparator } from "../UI/KDropdown/KDropdownSeparator";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { ToolbarDropdownButton } from "./ToolbarDropdownButton";

export const ToolbarProjectDropdown: FC = () => {
    const run = useEditor((state) => state.run);
    const showNotification = useEditor((state) => state.showNotification);
    const createNewProject = useProject((state) => state.createNewProject);
    const newFileInput = useRef<HTMLInputElement>(null);

    const handleImport = () => {
        if (newFileInput.current) {
            newFileInput.current.click();
        }
    };

    const handleExport = () => {
        const { projectKey, project } = useProject.getState();
        const projectLocal = localStorage.getItem(projectKey ?? "");

        if (!projectLocal) {
            showNotification("No project to export... Remember to save!");
            return;
        }

        const blob = new Blob([projectLocal], {
            type: "application/json",
        });

        downloadBlob(blob, `${project.name.trim()}.kaplay`);
        showNotification("Downloading exported project...");
    };

    const handleHTMLBuild = async () => {
        const { project } = useProject.getState();
        const projectCode = await buildProject();

        if (!projectCode) {
            showNotification("Failed to export project as HTML");
            return;
        }

        const blob = new Blob([projectCode], {
            type: "text/html",
        });

        downloadBlob(blob, `${project.name.trim()}.html`);
        showNotification("Downloading HTML5 game...");
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
        run();
    };

    const handleNewExample = () => {
        createNewProject("ex");
        run();
    };

    return (
        <ToolbarDropdown
            icon={assets.toolbox.outlined}
            text="Project"
            tip="Project Options"
        >
            <ToolbarDropdownButton
                onClick={handleHTMLBuild}
            >
                Build (HTML5)
            </ToolbarDropdownButton>

            <KDropdownMenuSeparator />

            <ToolbarDropdownButton
                onClick={handleImport}
            >
                Import
            </ToolbarDropdownButton>

            <ToolbarDropdownButton
                onClick={handleExport}
            >
                Export
            </ToolbarDropdownButton>

            <KDropdownMenuSeparator />

            <ToolbarDropdownButton
                onClick={handleNewProject}
            >
                Create new project
            </ToolbarDropdownButton>

            <ToolbarDropdownButton
                onClick={handleNewExample}
            >
                Create new example
            </ToolbarDropdownButton>

            <input
                type="file"
                className="hidden"
                onChange={handleProjectUpload}
                accept=".kaplay"
                ref={newFileInput}
            />
        </ToolbarDropdown>
    );
};
