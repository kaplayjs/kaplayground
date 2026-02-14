import { assets } from "@kaplayjs/crew";
import { type FC } from "react";
import type { AssetKind } from "../../features/Projects/models/AssetKind";

interface DrawButtonProps {
    onClick: () => void;
    kind: AssetKind;
}

export const AssetsDrawButton: FC<DrawButtonProps> = ({ onClick }) => {
    return (
        <div className="absolute bottom-0 left-0 flex justify-end items-center min-h-10">
            <label>
                <div className="btn px-2">
                    <img
                        src={assets.pencil.outlined}
                        alt="Add sprite"
                        className="w-8 h-8"
                    />
                </div>
                <button
                    className="hidden"
                    onClick={onClick}
                ></button>
            </label>
        </div>
    );
};
