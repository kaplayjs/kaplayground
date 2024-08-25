import { type FC } from "react";
import addSriteIcon from "../../assets/add_sprite_icon.png";
import { useResources } from "../../hooks/useResources";
import type { ResourceKind } from "../../stores/storage/resoures";

type Props = {
    accept: string;
    kind: ResourceKind;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const ResourceAddButton: FC<Props> = ({ accept, kind, inputProps }) => {
    const {
        uploadFilesAsResources,
    } = useResources({
        kind,
    });

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        uploadFilesAsResources(files, kind);
    };

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
