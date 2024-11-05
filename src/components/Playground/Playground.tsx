import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useConfig } from "../../hooks/useConfig";
import { useProject } from "../../hooks/useProject";
import { decompressCode } from "../../util/compressCode";
import { debug } from "../../util/logs";
import { AboutDialog } from "../About";
import ConfigDialog from "../Config/ConfigDialog";
import { ProjectBrowser } from "../ProjectBrowser";
import ExampleList from "../Toolbar/ExampleList";
import { LoadingPlayground } from "./LoadingPlayground";
import { WorkspaceExample } from "./WorkspaceExample";
import { WorkspaceProject } from "./WorkspaceProject";

const defaultTheme = localStorage.getItem("theme") as string;
const browserPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
).matches;

document.documentElement.setAttribute(
    "data-theme",
    defaultTheme || (browserPrefersDark ? "Spiker" : "Ghostiny"),
);

localStorage.setItem(
    "theme",
    defaultTheme || (browserPrefersDark ? "Spiker" : "Ghostiny"),
);

const Playground = () => {
    const {
        project,
        getProject,
        createNewProject,
        loadProject,
        createNewProjectFromDemo,
        loadSharedDemo,
    } = useProject();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const handleMount = () => {
        setLoadingEditor(false);
    };

    const loadShare = (sharedCode: string) => {
        debug(0, "Importing shared code...", decompressCode(sharedCode));
        loadSharedDemo(decompressCode(sharedCode));
        setLoadingProject(false);
    };

    const loadDemo = (demo: string) => {
        debug(0, "Loading demo...", demo);
        createNewProjectFromDemo(demo);
        setLoadingProject(false);
    };

    const loadNewProject = () => {
        debug(0, "No project found, creating a new one...");
        createNewProject("pj");
        setLoadingProject(false);
    };

    const loadLastOpenedProject = (lastOpenedProjectId: string) => {
        debug(0, "Loading last opened project...");
        loadProject(lastOpenedProjectId);
        setLoadingProject(false);
    };

    // First paint
    useEffect(() => {
        const defaultTheme = localStorage.getItem("theme") as string;
        const browserPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        document.documentElement.setAttribute(
            "data-theme",
            defaultTheme || (browserPrefersDark ? "Spiker" : "Ghostiny"),
        );
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lastOpenedPj = useConfig.getState().getConfig().lastOpenedProject;
        const sharedCode = urlParams.get("code");
        const exampleName = urlParams.get("example");

        if (sharedCode) {
            loadShare(sharedCode);
        } else if (exampleName) {
            loadDemo(exampleName);
        } else if (lastOpenedPj) {
            loadLastOpenedProject(lastOpenedPj);
        } else {
            loadNewProject();
        }
    }, []);

    if (loadingProject) {
        return (
            <LoadingPlayground
                isLoading={loadingEditor}
                isPortrait={isPortrait}
                isProject={project.mode === "pj"}
            />
        );
    }

    if (project.mode === "pj" && isPortrait) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-base-300 p-4 gap-4">
                <img src={assets.burpman.outlined} />

                <p>
                    Projects are currently not supported in mobile! Please use a
                    desktop device, anyway you can still view demos.
                </p>

                <ExampleList />
                <ProjectBrowser />
            </div>
        );
    }

    return (
        <>
            {getProject().mode === "pj"
                ? (
                    <WorkspaceProject
                        editorIsLoading={loadingEditor}
                        isPortrait={isPortrait}
                        onMount={handleMount}
                    />
                )
                : (
                    <WorkspaceExample
                        editorIsLoading={loadingEditor}
                        isPortrait={isPortrait}
                        onMount={handleMount}
                    />
                )}

            <AboutDialog />
            <ConfigDialog />
            <ToastContainer position="bottom-right" transition={Slide} />
            <Tooltip id="global" />
            <ProjectBrowser />
        </>
    );
};

export default Playground;
