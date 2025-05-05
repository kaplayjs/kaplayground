import { assets } from "@kaplayjs/crew";
import { type FC } from "react";
import { cn } from "../../util/cn";
import "./FileEntry.css";
import * as ContextMenu from "@radix-ui/react-context-menu";
import type { File } from "../../features/Projects/models/File";
import type { FileKind } from "../../features/Projects/models/FileKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { removeExtension } from "../../util/removeExtensions";
import { KContextMenuContent } from "../UI/ContextMenu/KContextMenuContent";
import { KContextMenuItem } from "../UI/ContextMenu/KContextMenuItem";

interface FileEntryProps {
    file: File;
}

export const logoByKind: Record<FileKind, string> = {
    kaplay: assets.dino.outlined,
    scene: assets.art.outlined,
    main: assets.play.outlined,
    assets: assets.assetbrew.outlined,
    obj: assets.grass.outlined,
    util: assets.toolbox.outlined,
};

export const FileEntry: FC<FileEntryProps> = ({ file }) => {
    const { getRuntime, setCurrentFile } = useEditor();
    const removeFile = useProject((s) => s.removeFile);

    const isRoot = () => !file.path.includes("/");

    const handleClick = () => {
        setCurrentFile(file.path);
    };

    const handleDelete = () => {
        removeFile(file.path);
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <div
                    className={cn(
                        "file btn btn-sm w-full justify-start pl-2 pr-0.5 h-[1.875rem] min-h-0",
                        {
                            "font-normal pl-3": !isRoot(),
                            "bg-base-100":
                                getRuntime().currentFile === file.path,
                            "btn-ghost": getRuntime().currentFile !== file.path,
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
                        {removeExtension(file.name)}
                    </span>
                </div>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <KContextMenuContent
                    title={file.name}
                >
                    <KContextMenuItem onClick={handleDelete}>
                        Delete File
                    </KContextMenuItem>
                </KContextMenuContent>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};
