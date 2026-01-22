import { assets } from "@kaplayjs/crew";
import { type FC, useEffect } from "react";
import { useEditor } from "../../hooks/useEditor";

export const GameView: FC = () => {
    const paused = useEditor((s) => s.paused);
    const setRuntime = useEditor((state) => state.setRuntime);
    const run = useEditor((s) => s.run);

    useEffect(() => {
        if (paused) return;

        const iframe = document.getElementById(
            "game-view",
        ) as HTMLIFrameElement;

        if (!iframe) return;

        const iframeWindow = iframe.contentWindow?.window;
        (window as any).iframeWindow = iframeWindow;

        setRuntime({ iframe: iframe, console: iframeWindow?.console });
    }, [paused]);

    return (
        <div className="relative size-full bg-black/50 rounded-xl z-0">
            {!paused
                ? (
                    <iframe
                        id="game-view"
                        tabIndex={0}
                        src="https://kaplaypreview.kaplayjs.com/"
                        className="bg-black/30 rounded-xl"
                        style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            height: "100%",
                        }}
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
                    />
                )
                : (
                    <div className="relative flex flex-col gap-4 size-full items-center justify-center select-none">
                        <img
                            className="absolute pixelated -z-[1] opacity-[.03] grayscale pointer-events-none"
                            src={assets.pause.outlined}
                            width={300}
                            height={300}
                            aria-hidden="true"
                        />
                        <h2 className="font-semibold text-3xl text-white">
                            Game is paused
                        </h2>
                        <button
                            onClick={run}
                            className="btn btn-ghost btn-sm bg-base-100/70 pl-2.5 py-1.5 h-auto min-h-0"
                        >
                            <img
                                src={assets.play.outlined}
                                className="h-5 w-5 object-contain"
                                aria-hidden="true"
                            />
                            Resume Game
                        </button>
                    </div>
                )}
        </div>
    );
};
