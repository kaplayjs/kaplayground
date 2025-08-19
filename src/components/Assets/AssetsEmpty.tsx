import { assets } from "@kaplayjs/crew";
import { FC } from "react";

interface AssetsEmptyProps {
    kind: "sprite" | "font" | "sound";
}

const kindsData = {
    "sprite": {
        name: "Sprites",
        icon: assets.art.outlined,
    },
    "font": {
        name: "Fonts",
        icon: assets.fonts.outlined,
    },
    "sound": {
        name: "Sounds",
        icon: assets.sounds.outlined,
    },
};

export const AssetsEmpty: FC<AssetsEmptyProps> = ({ kind }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto pt-1 pb-4 min-h-full">
            <div className="flex flex-col items-center justify-center gap-0.5 text-center">
                <img
                    src={kindsData[kind].icon}
                    alt={kindsData[kind].name + " icon"}
                    className="h-16 object-contain pixelated grayscale opacity-20"
                >
                </img>

                <h2 className="mt-0.5 font-bold text-lg">
                    No {kindsData[kind].name}, yet
                </h2>
                <h2 className="text-sm">
                    Click plus or drag & drop to upload
                </h2>
            </div>
        </div>
    );
};
