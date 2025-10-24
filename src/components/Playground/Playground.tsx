import { assets } from "@kaplayjs/crew";
import * as esbuild from "esbuild-wasm";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { loadProject } from "../../features/Projects/application/loadProject";
import { preferredVersion } from "../../features/Projects/application/preferredVersion";
import { useProject } from "../../features/Projects/stores/useProject";
import { useConfig } from "../../hooks/useConfig";
import { decompressCode } from "../../util/compressCode";
import { debug } from "../../util/logs";
import { AboutDialog } from "../About";
import ConfigDialog from "../Config/ConfigDialog";
import ProjectPreferences from "../Project/ProjectPreferences";
import { ProjectBrowser } from "../ProjectBrowser";
import ExampleList from "../Toolbar/ExampleList";
import { ConfirmDialog } from "../UI/ConfirmDialog";
import { LoadingPlayground } from "./LoadingPlayground";
import { WelcomeDialog } from "./WelcomeDialog";
import { WorkspaceExample } from "./WorkspaceExample";
import { WorkspaceProject } from "./WorkspaceProject";

const defaultTheme = localStorage.getItem("theme") as string;
const browserPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
).matches;

document.documentElement.setAttribute(
    "data-theme",
    defaultTheme || (browserPrefersDark ? "Spiker" : "Spiker"),
);

localStorage.setItem(
    "theme",
    defaultTheme || (browserPrefersDark ? "Spiker" : "Spiker"),
);

const Playground = () => {
    const loadConfig = useConfig((state) => state.loadConfig);
    const projectMode = useProject((state) => state.project.mode);
    const createNewProject = useProject((state) => state.createNewProject);
    const loadSharedDemo = useProject((state) => state.createFromShared);
    const setProject = useProject((state) => state.setProject);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);

    const handleMount = () => {
        setLoadingEditor(false);
    };

    const loadShare = (sharedCode: string, sharedVersion?: string) => {
        debug(0, "[init] Importing shared code...", decompressCode(sharedCode));
        loadSharedDemo(decompressCode(sharedCode), sharedVersion);
        setLoadingProject(false);
    };

    const loadDemo = (demo: string) => {
        debug(0, "[init] Loading demo...", demo);
        createNewProject("ex", undefined, demo);
        setLoadingProject(false);
    };

    const loadNewProject = () => {
        debug(0, "[init] No project found, creating a new one...");
        createNewProject("pj");
        setLoadingProject(false);
    };

    const loadLastOpenedProject = (lastOpenedProjectId: string) => {
        debug(0, "[init] Loading last opened project...");
        loadProject(lastOpenedProjectId);
        setLoadingProject(false);
    };

    // First paint
    useEffect(() => {
        // Load global config
        loadConfig();

        // Set initial project KAPLAY version
        setProject({
            kaplayVersion: preferredVersion(),
        });

        // Init saved projects array
        useProject.getState().updateSavedProjects();

        // Initialize ESBuild
        esbuild.initialize({
            wasmURL: "https://unpkg.com/esbuild-wasm@0.25.8/esbuild.wasm",
            worker: true,
        }).then(() => {
            // Loading the project, default project, shared project, etc.
            const urlParams = new URLSearchParams(window.location.search);
            const lastOpenedPj =
                useConfig.getState().getConfig().lastOpenedProject;
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
        });
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

            <ToastContainer position="bottom-right" transition={Slide} />
            <AboutDialog />
            <ConfigDialog />
            <Tooltip id="global" />
            <Tooltip id="global-open" isOpen={true} />
            <ProjectBrowser />
            <ProjectPreferences />
            <WelcomeDialog isLoading={loadingEditor} />
            <ConfirmDialog />
        </>
    );
};

export default Playground;
