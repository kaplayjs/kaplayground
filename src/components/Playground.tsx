import { useRef, useState } from "react";
import Editor, { type EditorRef } from "./Editor/Editor";
import GameView, { type GameViewRef } from "./GameView";
import Header from "./Header";

function Playground() {
    const [code, setCode] = useState<string>("");
    const editorRef = useRef<EditorRef>(null);
    const gameViewRef = useRef<GameViewRef>(null);

    const handleRun = () => {
        const code = editorRef.current?.getValue();

        if (code) {
            setCode(code);
            gameViewRef.current?.run(code);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header run={handleRun} />
            <main className="flex flex-row h-full">
                <div>
                    <Editor ref={editorRef} />
                </div>

                <GameView code={code} ref={gameViewRef} />
            </main>
        </div>
    );
}

export default Playground;
