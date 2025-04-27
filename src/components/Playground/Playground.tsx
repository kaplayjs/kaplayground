import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useProject } from "../../features/Projects/stores/useProject";
import { useConfig } from "../../hooks/useConfig";
import { useEditor } from "../../hooks/useEditor.ts";
import { decompressCode } from "../../util/compressCode";
import { debug } from "../../util/logs";
import { getPackageInfo } from "../../util/npm.ts";
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
    const projectMode = useProject((state) => state.project.mode);
    const createNewProject = useProject((state) => state.createNewProject);
    const createNewProjectFromDemo = useProject((state) =>
        state.createNewProjectFromDemo
    );
    const loadProject = useProject((state) => state.loadProject);
    const loadSharedDemo = useProject((state) => state.loadSharedDemo);
    const setRuntime = useEditor((state) => state.setRuntime);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);

    const handleMount = () => {
        setLoadingEditor(false);
    };

    const loadShare = (sharedCode: string, sharedVersion?: string) => {
        debug(0, "Importing shared code...", decompressCode(sharedCode));
        loadSharedDemo(decompressCode(sharedCode), sharedVersion);
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
        debug(0, "[project] Loading last opened project...");
        loadProject(lastOpenedProjectId);
        setLoadingProject(false);
    };

    // First paint
    useEffect(() => {
        // Save in memory current versions
        getPackageInfo("kaplay").then((info) => {
            setRuntime({
                kaplayVersions: Object.keys(info.versions).reverse(),
            });
        });

        // Loading the project, default project, shared project, etc.
        const urlParams = new URLSearchParams(window.location.search);
        const lastOpenedPj = useConfig.getState().getConfig().lastOpenedProject;
        const sharedCode = urlParams.get("code");
        const sharedVersion = urlParams.get("version");
        const exampleName = urlParams.get("example");

        if (sharedCode) {
            loadShare(sharedCode, sharedVersion ?? undefined);
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
                isProject={projectMode === "pj"}
            />
        );
    }

    if (projectMode === "pj" && isPortrait) {
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
            {projectMode === "pj"
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
