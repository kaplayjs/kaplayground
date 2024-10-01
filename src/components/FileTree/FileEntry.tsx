import { assets } from "@kaplayjs/crew";
import type { FC, MouseEventHandler } from "react";
import { useProject } from "../../hooks/useProject";
import type { File } from "../../stores/storage/files";
import { cn } from "../../util/cn";
import { removeExtension } from "../../util/removeExtensions";
import "./FileEntry.css";
import { useEditor } from "../../hooks/useEditor";

type Props = {
    file: File;
};

const logoByKind = {
    kaplay: assets.dino.outlined,
    scene: assets.art.outlined,
    main: assets.play.outlined,
    assets: assets.assetbrew.outlined,
};

const FileEntry: FC<Props> = ({ file }) => {
    const { removeFile } = useProject();
    const { getRuntime, setCurrentFile } = useEditor();

    const handleClick: MouseEventHandler = () => {
        setCurrentFile(file.path);
    };

    const handleDelete: MouseEventHandler = (e) => {
        e.stopPropagation();

        if (file.kind === "kaplay" || file.kind === "main") {
            return alert("You cannot remove this file");
        }

        if (confirm("Are you sure you want to remove this scene?")) {
            removeFile(file.path);
            setCurrentFile("main.js");
        }
    };

    return (
        <div
            className={cn(
                "file | btn btn-sm w-full justify-start rounded-none px-2",
                {
                    "btn-primary": getRuntime().currentFile === file.path,
                    "btn-ghost": getRuntime().currentFile !== file.path,
                },
            )}
            onClick={handleClick}
            data-file-kind={file.kind}
        >
            <span className="text-left truncate w-[50%]">
                {removeExtension(file.name)}
            </span>
            <div role="toolbar" className="file-actions hidden">
                <button
                    className="btn btn-ghost btn-xs rounded-sm px-1"
                    onClick={handleDelete}
                >
                    <img
                        src={assets.trash.outlined}
                        alt="Delete"
                        className="h-4"
                    />
                </button>
            </div>
            <img
                src={logoByKind[file.kind]}
                alt={file.kind}
                className="w-4 h-4 ml-auto object-scale-down"
            />
        </div>
    );
};

export default FileEntry;
