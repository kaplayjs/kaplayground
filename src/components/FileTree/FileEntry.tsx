import { assets } from "@kaplayjs/crew";
import type { FC, MouseEventHandler } from "react";
import sceneIcon from "../../assets/filetree/scene.png";
import { useProject } from "../../hooks/useProject";
import type { File } from "../../stores/files";
import { cn } from "../../util/cn";
import { removeExtension } from "../../util/removeExtensions";
import "./FileEntry.css";

type Props = {
    file: File;
};

const logoByKind = {
    kaplay: assets.dino.outlined,
    scene: sceneIcon,
    main: assets.dino.outlined,
    assets: assets.bag.outlined,
};

const FileEntry: FC<Props> = ({ file }) => {
    const { removeFile, setCurrentFile, getCurrentFile } = useProject();
    const { name, kind } = file;

    const handleClick: MouseEventHandler = () => {
        setCurrentFile(name);
    };

    const handleDelete: MouseEventHandler = (e) => {
        e.stopPropagation();

        if (file.kind === "kaplay" || file.kind === "main") {
            return alert("You cannot remove this file");
        }

        if (confirm("Are you sure you want to remove this scene?")) {
            removeFile(file.name);
            setCurrentFile("main.js");
        }
    };

    return (
        <div
            className={cn(
                "file | btn btn-sm w-full justify-start rounded-none px-2",
                {
                    "btn-primary": getCurrentFile()?.name === name,
                    "btn-ghost": getCurrentFile()?.name !== name,
                },
            )}
            onClick={handleClick}
            data-file-kind={kind}
        >
            <span className="text-left truncate w-[50%]">
                {removeExtension(name)}
            </span>
            <div role="toolbar" className="file-actions hidden">
                <button
                    className="btn btn-ghost btn-xs rounded-sm px-1"
                    onClick={handleDelete}
                >
                    <img
                        src={assets.bag.outlined}
                        alt="Delete"
                        className="h-4"
                    />
                </button>
            </div>
            <img
                src={logoByKind[kind]}
                alt={kind}
                className="w-4 h-4 ml-auto object-scale-down"
            />
        </div>
    );
};

export default FileEntry;
