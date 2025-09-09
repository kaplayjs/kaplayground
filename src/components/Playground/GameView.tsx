import { type FC, useEffect } from "react";
import { useEditor } from "../../hooks/useEditor";

export const GameView: FC = () => {
    const setRuntime = useEditor((state) => state.setRuntime);

    useEffect(() => {
        const iframe = document.getElementById(
            "game-view",
        ) as HTMLIFrameElement;

        const iframeWindow = iframe.contentWindow?.window;
        (window as any).iframeWindow = iframeWindow;

        setRuntime({ iframe: iframe, console: iframeWindow?.console });
    }, []);

    return (
        <iframe
            id="game-view"
            tabIndex={0}
            src="https://kaplaypreview.kaplayjs.com/"
            className="rounded-xl"
            style={{
                border: "none",
                outline: "none",
                width: "100%",
                height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
        />
    );
};
