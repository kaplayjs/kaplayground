import { type FC } from "react";

type GameViewProps = {
    onLoad?: () => void;
};

export const GameView: FC<GameViewProps> = ({ onLoad }) => {
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
