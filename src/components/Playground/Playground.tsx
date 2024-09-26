import { Allotment } from "allotment";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import AboutDialog from "../../components/About/AboutDialog";
import FileTree from "../../components/FileTree/FileTree";
import LoadingPlayground from "../../components/Playground/LoadingPlayground";
import Toolbar from "../../components/Toolbar";
import { useProject } from "../../hooks/useProject";
import { cn } from "../../util/cn";
import Assets from "../Assets/Assets";
import ConfigDialog from "../Config/ConfigDialog";
import Editor from "../Editor/MonacoEditor";
import { ExamplesBrowser } from "../ExamplesBrowser";
import GameView from "./GameView";

const Playground = () => {
    const {
        project,
        getProjectMode,
        createNewProject,
    } = useProject();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const handleMount = () => {
        setLoadingEditor(false);
    };

    useEffect(() => {
        if (project.files.size > 0) setLoadingProject(false);
        else {
            createNewProject();
        }
    }, [project]);

    return (
        <>
            {loadingProject ? <LoadingPlayground isLoading /> : (
                <>
                    <div
                        className={cn("h-full w-screen", {
                            "hidden": loadingEditor,
                        })}
                    >
                        <header className="h-[4%] flex">
                            <Toolbar />
                        </header>

                        <main className="h-[96%] overflow-hidden">
                            <Allotment
                                defaultSizes={[0.5, 2, 2]}
                                vertical={isPortrait}
                            >
                                <Allotment.Pane
                                    snap
                                    minSize={200}
                                    visible={getProjectMode() === "project"}
                                >
                                    <FileTree />
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <Allotment vertical defaultSizes={[2, 1]}>
                                        <Allotment.Pane>
                                            <Editor
                                                onMount={handleMount}
                                            />
                                        </Allotment.Pane>
                                        <Allotment.Pane
                                            snap
                                            visible={getProjectMode()
                                                === "project"}
                                        >
                                            <Assets />
                                        </Allotment.Pane>
                                    </Allotment>
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <GameView />
                                </Allotment.Pane>
                            </Allotment>
                        </main>

                        <AboutDialog />
                        <ConfigDialog />
                        <ToastContainer
                            position="bottom-right"
                            transition={Slide}
                        />
                        <Tooltip id="global" />
                        <ExamplesBrowser />
                    </div>

                    <LoadingPlayground isLoading={loadingEditor} />
                </>
            )}
        </>
    );
};

export default Playground;
