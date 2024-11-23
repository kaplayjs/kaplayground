import { type FC, useEffect } from "react";
import { useEditor } from "../../hooks/useEditor";

type GameViewProps = {
    onLoad?: () => void;
};

export const GameView: FC<GameViewProps> = ({ onLoad }) => {
    const { setRuntime } = useEditor();

    useEffect(() => {
        const iframe = document.getElementById(
            "game-view",
        ) as HTMLIFrameElement;

        setRuntime({ iframe: iframe });
    }, []);

    return (
        <iframe
            id="game-view"
            tabIndex={0}
            onLoad={onLoad}
            style={{
                border: "none",
                width: "100%",
                height: "100%",
            }}
            sandbox="allow-scripts"
        />
    );
};
