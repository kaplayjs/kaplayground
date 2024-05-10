import { Allotment } from "allotment";
import { useRef, useState } from "react";
import { compressCode } from "../util/compressCode";
import AboutDialog from "./About/AboutDialog";
import Editor, { type EditorRef } from "./Editor/Editor";
import GameView, { type GameViewRef } from "./GameView";
import Tabs from "./Tabs/Tabs";
import Toolbar from "./Toolbar";
import { darkThemes } from "./Toolbar/ThemeToggler";
import "allotment/dist/style.css";
import { useProject } from "@/hooks/useProject";
import { cn } from "@/util/cn";
import clsx from "clsx";

const Playground = () => {
    const [getKaboomFile] = useProject((state) => [
        state.getCurrentFile,
    ]);
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const editorRef = useRef<EditorRef>(null);
    const gameViewRef = useRef<GameViewRef>(null);

    const handleRun = () => {
        const code = getKaboomFile()?.value;

        if (code) {
            setCode(code);
            gameViewRef.current?.run(code);
        }
    };

    const handleMount = () => {
        handleRun();
        setLoading(false);
    };

    const handleProjectReplace = () => {
        editorRef.current?.setValue(getKaboomFile()?.value ?? "");
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
    };

    return (
        <>
            <div
                className={cn("h-full w-screen", {
                    "hidden": loading,
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
                    <Allotment>
                        <Allotment.Pane snap>
                            <Allotment vertical>
                                <Allotment.Pane>
                                    <Editor
                                        onRun={handleRun}
                                        onMount={handleMount}
                                        path="playground"
                                        ref={editorRef}
                                    />
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <Tabs />
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                        <Allotment.Pane snap>
                            <GameView code={code} ref={gameViewRef} />
                        </Allotment.Pane>
                    </Allotment>
                </main>
                <AboutDialog />
            </div>
            <div
                className={clsx("h-full flex items-center justify-center", {
                    "hidden": !loading,
                })}
            >
                <span className="loading loading-dots loading-lg text-primary">
                </span>
            </div>
        </>
    );
};

export default Playground;
