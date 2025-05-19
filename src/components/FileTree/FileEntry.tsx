import { assets } from "@kaplayjs/crew";
import type { FC, MouseEventHandler } from "react";
import { cn } from "../../util/cn";
import { removeExtension } from "../../util/removeExtensions";
import "./FileEntry.css";
import { basename } from "../../features/Projects/application/path";
import type { File } from "../../features/Projects/models/File";
import type { FileKind } from "../../features/Projects/models/FileKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";

type Props = {
    file: File;
};

export const logoByKind: Record<FileKind, string> = {
    kaplay: assets.dino.outlined,
    scene: assets.art.outlined,
    main: assets.play.outlined,
    assets: assets.assetbrew.outlined,
    obj: assets.grass.outlined,
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
            className="btn btn-ghost btn-xs rounded-md px-1 [.btn-primary_&:hover]:bg-white/30"
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
    const removeFile = useProject((s) => s.removeFile);
    const projectFiles = useProject((s) => s.project.files);
    const setProject = useProject((s) => s.setProject);
    const setCurrentFile = useEditor((s) => s.setCurrentFile);
    const currentFile = useEditor((s) => s.runtime.currentFile);

    const isRoot = () => !file.path.includes("/");

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
        const files = projectFiles;
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
            ...projectFiles,
            files: newFiles,
        });
    };

    const handleMoveDown: MouseEventHandler = (e) => {
        e.stopPropagation();

        // order the map with the file one step down
        const files = projectFiles;
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
            ...projectFiles,
            files: newFiles,
        });
    };

    return (
        <div
            className={cn(
                "file btn btn-sm w-full justify-start pl-2 pr-0.5 h-[1.875rem] min-h-0",
                {
                    "font-normal pl-3": !isRoot(),
                    "bg-base-100 hover:bg-base-100": currentFile === file.path,
                    "btn-ghost": currentFile !== file.path,
                },
            )}
            onClick={handleClick}
            data-file-kind={file.kind}
        >
            {isRoot() && (
                <img
                    src={logoByKind[file.kind]}
                    alt={file.kind}
                    className="w-4 h-4 ml-auto object-scale-down"
                />
            )}
            <span className="text-left truncate w-[50%] flex-1 py-0.5">
                {removeExtension(basename(file.path))}
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
