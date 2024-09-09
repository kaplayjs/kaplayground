import { type FC } from "react";
import { useEditor } from "../../hooks/useEditor";

type GameViewProps = {
    onLoad?: () => void;
};

const GameView: FC<GameViewProps> = ({ onLoad }) => {
    const {
        setIframe,
    } = useEditor();

    return (
        <iframe
            ref={setIframe}
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

GameView.displayName = "GameView";

export default GameView;
