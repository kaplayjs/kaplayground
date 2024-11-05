import { assets } from "@kaplayjs/crew";
import type { FC, MouseEventHandler } from "react";
import { useProject } from "../../hooks/useProject";
import type { File, FileKind } from "../../stores/storage/files";
import { cn } from "../../util/cn";
import { removeExtension } from "../../util/removeExtensions";
import "./FileEntry.css";
import { useEditor } from "../../hooks/useEditor";

type Props = {
    file: File;
};

export const logoByKind: Record<FileKind, string> = {
    kaplay: assets.dino.outlined,
    scene: assets.art.outlined,
    main: assets.play.outlined,
    assets: assets.assetbrew.outlined,
    obj: assets.burpman.outlined,
    util: assets.toolbox.outlined,
};

const FileButton: FC<{
    onClick: MouseEventHandler;
    icon: keyof typeof assets;
    rotate?: 0 | 90 | 180 | 270;
    hidden?: boolean;
}> = (props) => {
    return (
        <button
            className="btn btn-ghost btn-xs rounded-sm px-1"
            onClick={props.onClick}
            hidden={props.hidden}
        >
            <img
                src={assets[props.icon].outlined}
                alt="Delete"
                className="h-4 data-[rotation=90]:rotate-90 data-[rotation=180]:rotate-180 data-[rotation=270]:-rotate-90"
                data-rotation={props.rotate}
            />
        </button>
    );
};

export const FileEntry: FC<Props> = ({ file }) => {
    const { removeFile, project: project, setProject } = useProject();
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

    const handleMoveUp: MouseEventHandler = (e) => {
        e.stopPropagation();

        // order the map with the file one step up
        const files = project.files;
        const order = Array.from(files.keys());
        const index = order.indexOf(file.path);

        if (index === 0) return;

        const newOrder = [...order];
        newOrder.splice(index, 1);

        newOrder.splice(index - 1, 0, file.path);

        const newFiles = new Map(
            newOrder.map((path) => [path, files.get(path)!]),
        );

        setProject({
            ...project,
            files: newFiles,
        });
    };

    const handleMoveDown: MouseEventHandler = (e) => {
        e.stopPropagation();

        // order the map with the file one step down
        const files = project.files;
        const order = Array.from(files.keys());
        const index = order.indexOf(file.path);

        if (index === order.length - 1) return;

        const newOrder = [...order];
        newOrder.splice(index, 1);

        newOrder.splice(index + 1, 0, file.path);

        const newFiles = new Map(
            newOrder.map((path) => [path, files.get(path)!]),
        );

        setProject({
            ...project,
            files: newFiles,
        });
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
            <img
                src={logoByKind[file.kind]}
                alt={file.kind}
                className="w-4 h-4 ml-auto object-scale-down"
            />
            <span className="text-left truncate w-[50%] flex-1">
                {removeExtension(file.name)}
            </span>
            <div role="toolbar" className="file-actions hidden">
                <FileButton
                    onClick={handleDelete}
                    icon="trash"
                />
                <FileButton
                    onClick={handleMoveUp}
                    icon="arrow"
                    rotate={270}
                />
                <FileButton
                    onClick={handleMoveDown}
                    icon="arrow"
                    rotate={90}
                />
            </div>
        </div>
    );
};
