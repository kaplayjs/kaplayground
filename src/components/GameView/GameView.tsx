// This components basically is the compiler of the project, it takes the code from the editor and runs it in an iframe.

import { useProject } from "@/hooks/useProject";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { wrapGame } from "./wrapGame";

type GameViewProps = {
    onLoad?: () => void;
};

export type GameViewRef = {
    run: () => void;
};

const GameView = forwardRef<GameViewRef, GameViewProps>(({
    onLoad,
}, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [files] = useProject((state) => [state.project.files]);

    useImperativeHandle(ref, () => ({
        run() {
            // if (!iframeRef.current) return;
            // const iframe = iframeRef.current;
            // iframe.srcdoc = wrapGame(files);
        },
    }));

    return (
        <iframe
            ref={iframeRef}
            tabIndex={0}
            onLoad={onLoad}
            style={{
                border: "none",
                width: "100%",
                height: "100%",
            }}
            id="game-view"
        />
    );
});

GameView.displayName = "GameView";

export default GameView;
