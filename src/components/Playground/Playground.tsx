import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { DEFAULT_KAPLAY_VERSION } from "../../config/common";
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
        loadDefaultExample,
        importProject,
    } = useProject();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const handleMount = () => {
        setLoadingEditor(false);
    };

    const loadShare = (shareCode: string) => {
        if (!shareCode) return;

        debug(
            0,
            "Importing shared code...",
            shareCode,
            decompressCode(shareCode),
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
                        value: decompressCode(shareCode),
                    },
                ],
            ]),
            mode: "ex",
            id: "ex-shared",
            kaplayConfig: {},
            kaplayVersion: DEFAULT_KAPLAY_VERSION,
            name: "Shared Example",
            version: "2.0.0",
            isDefault: true,
        });

        loadProject("shared");
        setLoadingProject(false);

        return;
    };

    const loadExample = (exampleName: string) => {
        loadDefaultExample(exampleName);
        setLoadingProject(false);
    };

    const loadNew = () => {
        debug(0, "No project found, creating a new one...");
        createNewProject("pj");
        setLoadingProject(false);
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
        const urlParams = new URLSearchParams(window.location.search);
        const lastOpenedPj = useConfig.getState().getConfig().lastOpenedProject;
        const sharedCode = urlParams.get("code");
        const exampleName = urlParams.get("example");

        if (sharedCode) {
            loadShare(sharedCode);
        } else if (exampleName) {
            loadExample(exampleName);
        } else if (lastOpenedPj) {
            loadProject(lastOpenedPj);
            setLoadingProject(false);
        } else {
            loadNew();
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
