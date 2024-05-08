import { useFiles } from "@/hooks/useFiles";
import { useRef, useState } from "react";
import { Resplit } from "react-resplit";
import { compressCode, decompressCode } from "../util/compressCode";
import AboutDialog from "./About/AboutDialog";
import Editor, { type EditorRef } from "./Editor/Editor";
import GameView, { type GameViewRef } from "./GameView";
import Header from "./Header";
import Tabs from "./Tabs/Tabs";
import { darkThemes } from "./ThemeToggler";

const Playground = () => {
    const [code, setCode] = useState<string>("");
    const [files, setFiles] = useFiles((state) => [
        state.files,
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
        navigator.clipboard.writeText(url.toString());
    };

    const handleThemeChange = (theme: string) => {
        const isDarkTheme = darkThemes.includes(theme);
        let newTheme = isDarkTheme ? "vs-dark" : "vs-light";

        editorRef.current?.setTheme(newTheme);
    };

    return (
        <div className="h-full">
            <Header
                run={handleRun}
                onThemeChange={handleThemeChange}
                onShare={handleShare}
            />
            <main className="h-[94%] overflow-hidden">
                <Resplit.Root direction="horizontal" className="h-full">
                    <Resplit.Pane order={1} initialSize="1fr" minSize="0.5fr">
                        <Resplit.Root
                            direction="vertical"
                            className="h-full"
                        >
                            <Resplit.Pane
                                order={0}
                                initialSize="1fr"
                                minSize="0.5fr"
                                className="h-full w-full overflow-auto"
                            >
                                <Editor
                                    onRun={handleRun}
                                    onMount={handleRun}
                                    path="playground"
                                    ref={editorRef}
                                />
                            </Resplit.Pane>

                            <Resplit.Splitter order={1} size="10px" />

                            <Resplit.Pane
                                order={2}
                                initialSize="0.5fr"
                                minSize="0.25fr"
                                collapsible
                            >
                                <Tabs />
                            </Resplit.Pane>
                        </Resplit.Root>
                    </Resplit.Pane>

                    <Resplit.Splitter order={2} size="10px" />

                    <Resplit.Pane order={3} initialSize="1fr" minSize="0.5fr">
                        <GameView code={code} ref={gameViewRef} />
                    </Resplit.Pane>
                </Resplit.Root>
                <AboutDialog />
            </main>
        </div>
    );
};

export default Playground;
