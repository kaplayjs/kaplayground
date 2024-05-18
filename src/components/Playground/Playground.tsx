import AboutDialog from "@/components/About/AboutDialog";
import Editor, { type EditorRef } from "@/components/Editor/Editor";
import GameView, { type GameViewRef } from "@/components/Playground/GameView";
import Tabs from "@/components/Tabs/Tabs";
import Toolbar from "@/components/Toolbar";
import { darkThemes } from "@/components/Toolbar/ThemeToggler";
import { compressCode } from "@/util/compressCode";
import { Allotment, LayoutPriority } from "allotment";
import { useEffect, useRef, useState } from "react";
import "allotment/dist/style.css";
import FileTree from "@/components/FileTree/FileTree";
import LoadingPlayground from "@/components/Playground/LoadingPlayground";
import { useProject } from "@/hooks/useProject";
import { cn } from "@/util/cn";
import { useMediaQuery } from "react-responsive";

const Playground = () => {
    const [project, getKaboomFile] = useProject((state) => [
        state.project,
        state.getKaboomFile,
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
    };

    const handleShare = () => {
        const code = editorRef.current?.getValue();
        const url = new URL(window.location.href);
        url.searchParams.set("code", compressCode(code ?? "") || "");

        if (url.toString().length > 3000) {
            alert(
                "The URL is too lengthy; it has been copied, but using the new project import/export feature is recommended.",
            );
        }

        navigator.clipboard.writeText(url.toString());
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
                                onShare={handleShare}
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
                                            <Tabs />
                                        </Allotment.Pane>
                                    </Allotment>
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <GameView ref={gameViewRef} />
                                </Allotment.Pane>
                            </Allotment>
                        </main>
                        <AboutDialog />
                    </div>
                    <LoadingPlayground isLoading={loadingEditor} />
                </>
            )}
        </>
    );
};

export default Playground;
