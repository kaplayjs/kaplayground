import AboutDialog from "@/components/About/AboutDialog";
import Editor, { type EditorRef } from "@/components/Editor/Editor";
import FileTree from "@/components/FileTree/FileTree";
import GameView, { type GameViewRef } from "@/components/Playground/GameView";
import LoadingPlayground from "@/components/Playground/LoadingPlayground";
import Resources from "@/components/Resources/Resources";
import Toolbar from "@/components/Toolbar";
import { darkThemes } from "@/components/Toolbar/ThemeToggler";
import { useProject } from "@/hooks/useProject";
import { cn } from "@/util/cn";
import { compressCode } from "@/util/compressCode";
import { Allotment } from "allotment";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import ConfigDialog from "../Config/ConfigDialog";

const Playground = () => {
    const [
        project,
        updateKaboomFile,
        kaboomConfig,
        getCurrentFile,
        setCurrentFile,
    ] = useProject((state) => [
        state.project,
        state.updateKaboomFile,
        state.project.kaboomConfig,
        state.getCurrentFile,
        state.setCurrentFile,
    ]);
    const editorRef = useRef<EditorRef>(null);
    const gameViewRef = useRef<GameViewRef>(null);
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const handleRun = () => {
        gameViewRef.current?.run();
    };

    const handleMount = () => {
        handleRun();
        setLoadingEditor(false);
    };

    const handleProjectReplace = () => {
        handleRun();
        editorRef.current?.update();
    };

    const handleThemeChange = (theme: string) => {
        const isDarkTheme = darkThemes.includes(theme);
        let newTheme = isDarkTheme ? "vs-dark" : "vs-light";

        editorRef.current?.setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    useEffect(() => {
        if (project.files.length > 0) setLoadingProject(false);
    }, [project]);

    // Update kaboom file in real time with configuration
    useEffect(() => {
        updateKaboomFile();
        handleRun();
        const currentFileName = getCurrentFile()?.name;

        if (currentFileName === "kaboom.js") {
            setCurrentFile("kaboom.js");
            editorRef.current?.update();
        }
    }, [kaboomConfig]);

    return (
        <>
            {loadingProject ? <LoadingPlayground isLoading /> : (
                <>
                    <div
                        className={cn("h-full w-screen", {
                            "hidden": loadingEditor,
                        })}
                    >
                        <header className="h-[6%] flex">
                            <Toolbar
                                run={handleRun}
                                onThemeChange={handleThemeChange}
                                onProjectReplace={handleProjectReplace}
                            />
                        </header>
                        <main className="h-[94%] overflow-hidden">
                            <Allotment
                                defaultSizes={[0.5, 2, 2]}
                                vertical={isPortrait}
                            >
                                <Allotment.Pane>
                                    <FileTree />
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <Allotment vertical defaultSizes={[2, 1]}>
                                        <Allotment.Pane>
                                            <Editor
                                                onRun={handleRun}
                                                onMount={handleMount}
                                                path="playground"
                                                ref={editorRef}
                                            />
                                        </Allotment.Pane>
                                        <Allotment.Pane>
                                            <Resources />
                                        </Allotment.Pane>
                                    </Allotment>
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <GameView ref={gameViewRef} />
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
                    </div>
                    <LoadingPlayground isLoading={loadingEditor} />
                </>
            )}
        </>
    );
};

export default Playground;
