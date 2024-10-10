import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useProject } from "../../hooks/useProject";
import { AboutDialog } from "../About";
import ConfigDialog from "../Config/ConfigDialog";
import { ExamplesBrowser } from "../ExamplesBrowser";
import ExampleList from "../Toolbar/ExampleList";
import { LoadingPlayground } from "./LoadingPlayground";
import { WorkspaceExample } from "./WorkspaceExample";
import { WorkspaceProject } from "./WorkspaceProject";

const Playground = () => {
    const {
        project,
        getProject,
        createNewProject,
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
        document.documentElement.setAttribute(
            "data-theme",
            defaultTheme || "Ghostiny",
        );
    }, []);

    useEffect(() => {
        if (project.files.size > 0) {
            setLoadingProject(false);
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCode = urlParams.get("code");
            if (sharedCode) {
            }
        } else {
            createNewProject("pj");
        }
    }, [project]);

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
