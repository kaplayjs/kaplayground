import { type FC } from "react";
import addSriteIcon from "../../assets/add_sprite_icon.png";
import type { AssetKind } from "../../stores/storage/assets";

type Props = {
    accept: string;
    kind: AssetKind;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const AssetsAddButton: FC<Props> = ({ accept, inputProps }) => {
    return (
        <div className="flex justify-end items-center min-h-10">
            <label>
                <div className="btn btn-primary px-2">
                    <img
                        src={addSriteIcon}
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
