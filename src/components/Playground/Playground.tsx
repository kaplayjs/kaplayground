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
import { ExamplesBrowser } from "../ExamplesBrowser";
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
        importProject,
        projectIsSaved,
    } = useProject();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const handleMount = () => {
        setLoadingEditor(false);
    };

    // First useEffect
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
        const lastOpenedProject =
            useConfig.getState().getConfig().lastOpenedProject;
        const urlParams = new URLSearchParams(window.location.search);
        const sharedCode = urlParams.get("code");

        const loadShare = () => {
            if (!sharedCode) return;
            debug(
                0,
                "Importing shared code...",
                sharedCode,
                decompressCode(sharedCode),
            );

            importProject({
                assets: new Map(),
                files: new Map([
                    [
                        "main.js",
                        {
                            kind: "main",
                            language: "javascript",
                            name: "main.js",
                            path: "main.js",
                            value: decompressCode(sharedCode),
                        },
                    ],
                ]),
                mode: "ex",
                id: "ex-shared",
                kaplayConfig: {},
                kaplayVersion: "3001.0.1",
                name: "Shared Example",
                version: "2.0.0",
                isDefault: true,
            });

            loadProject("shared");
            setLoadingProject(false);

            return;
        };

        const loadSide = () => {
            if (projectIsSaved("shared", "ex")) {
                if (!sharedCode) return;

                const response = window.confirm(
                    "Do you want to load the shared example? This will overwrite the current shared project.",
                );

                if (response) {
                    loadShare();
                    return;
                }
            }

            if (sharedCode) {
                loadShare();
                return;
            }

            if (lastOpenedProject) {
                debug(0, "Loading last opened project...");
                loadProject(lastOpenedProject);
                setLoadingProject(false);
                return;
            }
        };

        if (project.files.size > 0) {
            loadSide();
        } else {
            if (lastOpenedProject || sharedCode) {
                loadSide();
            } else {
                debug(0, "No project found, creating a new one...");
                createNewProject("pj");
                setLoadingProject(false);
            }
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
                    desktop device, anyway you can still view examples.
                </p>

                <ExampleList />
                <ExamplesBrowser />
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
            <ExamplesBrowser />
        </>
    );
};

export default Playground;
