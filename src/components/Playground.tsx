import { useFiles } from "@/hooks/useFiles";
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

const Playground = () => {
    const [code, setCode] = useState<string>("");
    const [currentFile, setFiles] = useFiles((state) => [
        state.getCurrentFile,
        state.addFile,
    ]);
    const editorRef = useRef<EditorRef>(null);
    const gameViewRef = useRef<GameViewRef>(null);

    const handleRun = () => {
        const code = editorRef.current?.getValue();

        if (code) {
            setCode(code);
            gameViewRef.current?.run(code);
            setTimeout(() => {
                editorRef.current?.focus();
            }, 1000);
        }
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
        <div className="h-full">
            <header className="h-[6%] flex">
                <Toolbar
                    run={handleRun}
                    onThemeChange={handleThemeChange}
                    onShare={handleShare}
                />
            </header>
            <main className="h-[94%] overflow-hidden">
                <Allotment>
                    <Allotment.Pane snap>
                        <Allotment vertical>
                            <Allotment.Pane>
                                <Editor
                                    onRun={handleRun}
                                    onMount={handleRun}
                                    path="playground"
                                    ref={editorRef}
                                    file={currentFile()}
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
    );
};

export default Playground;
