import addSriteIcon from "@/assets/add_sprite_icon.png";
import { useProject } from "@/hooks/useProject";
import type { AssetKind } from "@/stores/project/assets";
import { type FC } from "react";

type Props = {
    accept: string;
    kind: AssetKind;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const ResourceAddButton: FC<Props> = ({ accept, kind, inputProps }) => {
    const addAssetsToQueue = useProject((state) => state.addAssetsToQueue);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        addAssetsToQueue(files, kind);
    };

    return (
        <div className="flex justify-end items-center min-h-10">
            <label>
                <div className="btn btn-primary px-2">
                    <img
                        src={addSriteIcon.src}
                        alt="Add sprite"
                        className="w-8 h-8"
                    />
                </div>
                <input
                    {...inputProps}
                    onSubmit={handleChanges}
                    className="hidden"
                    type="file"
                    accept={accept}
                    multiple
                />
            </label>
        </div>
    );
};

export default ResourceAddButton;
