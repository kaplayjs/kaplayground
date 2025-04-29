import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { insertAfterCursor } from "../../features/Editor/application/insertAfterCursor";

interface AssetBrewItemProps {
    asset: keyof typeof assets;
}

export const AssetBrewItem: FC<AssetBrewItemProps> = ({ asset }) => {
    const handleClick = () => {
        insertAfterCursor(
            `\nloadSprite("${asset}", "/crew/${asset}.png");`,
        );
    };

    const handleResourceDrag = (e: React.DragEvent) => {
        e.dataTransfer.setData(
            "text",
            `loadSprite("${asset}", "/crew/${asset}.png");`,
        );
    };

    return (
        <div
            className="flex items-center justify-center bg-base-300 min-w-14 min-h-14 rounded-lg cursor-grab hover:bg-base-100 active:bg-base-50 transition-colors"
            draggable
            onClick={handleClick}
            onDragStartCapture={handleResourceDrag}
        >
            <img
                src={assets[asset].sprite}
                className="h-10 w-10 object-scale-down"
                draggable={false}
                alt={assets[asset].name}
                title={assets[asset].name}
            >
            </img>
        </div>
    );
};
