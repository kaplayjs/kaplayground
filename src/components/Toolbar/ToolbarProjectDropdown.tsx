import { assets } from "@kaplayjs/crew";
import { type FC, useRef, useState } from "react";
import { buildProject } from "../../features/Projects/application/buildProject";
import {
    confirmAndDeleteProject,
    exportProject,
    openProjectDetails,
    openProjectPreferences,
} from "../../features/Projects/services/projectActions";
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
    const unserializeProject = useProject((state) => state.unserializeProject);
    const projectKey = useProject((state) => state.projectKey);
    const newFileInput = useRef<HTMLInputElement>(null);
    const importButton = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleImport = () => {
        if (newFileInput.current) {
            newFileInput.current.click();
        }
    };

    const handleExport = async () => await exportProject();

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
            const project = unserializeProject(e.target?.result as string);
            createNewProject(project.mode, project);
        };

        reader.readAsText(file);
        setOpen(false);
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
            open={open}
            setOpen={setOpen}
        >
            <ToolbarDropdownButton
                onClick={() => openProjectPreferences()}
            >
                Preferences
            </ToolbarDropdownButton>

            <ToolbarDropdownButton
                onClick={handleHTMLBuild}
            >
                Build (HTML5)
            </ToolbarDropdownButton>

            <ToolbarDropdownButton
                onClick={() => openProjectDetails()}
                disabled={projectKey == null}
            >
                Details
            </ToolbarDropdownButton>

            <ToolbarDropdownButton
                onClick={() => confirmAndDeleteProject()}
                type="danger"
                disabled={projectKey == null}
            >
                Delete
            </ToolbarDropdownButton>

            <KDropdownMenuSeparator />

            <ToolbarDropdownButton
                ref={importButton}
                onClick={handleImport}
                onSelect={(e) => {
                    e.preventDefault();
                }}
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
