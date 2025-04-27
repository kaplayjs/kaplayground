import { assets } from "@kaplayjs/crew";
import { type FC } from "react";
import type { AssetKind } from "../../features/Projects/stores/slices/assets";

interface AddButtonProps {
    accept: string;
    kind: AssetKind;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const AssetsAddButton: FC<AddButtonProps> = ({ accept, inputProps }) => {
    return (
        <div className="absolute bottom-0 right-0 flex justify-end items-center min-h-10">
            <label>
                <div className="btn px-2">
                    <img
                        src={assets.plus.outlined}
                        alt="Add sprite"
                        className="w-8 h-8"
                    />
                </div>
                <input
                    {...inputProps}
                    className="hidden"
                    type="file"
                    accept={accept}
                    multiple
                />
            </label>
        </div>
    );
};

export default AssetsAddButton;
