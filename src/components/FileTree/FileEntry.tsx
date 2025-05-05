import { type FC } from "react";
import { cn } from "../../util/cn";
import "./FileEntry.css";
import * as ContextMenu from "@radix-ui/react-context-menu";
import type { File } from "../../features/Projects/models/File";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { removeExtension } from "../../util/removeExtensions";
import { KContextMenuContent } from "../UI/ContextMenu/KContextMenuContent";
import { KContextMenuItem } from "../UI/ContextMenu/KContextMenuItem";

interface FileEntryProps {
    file: File;
    icon?: string;
}

export const FileEntry: FC<FileEntryProps> = ({ file, icon }) => {
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
                            "bg-base-100 border-base-100 hover:bg-base-100 hover:border-base-100":
                                getRuntime().currentFile === file.path,
                            "btn-ghost": getRuntime().currentFile !== file.path,
                        },
                    )}
                    onClick={handleClick}
                    data-file-kind={file.kind}
                >
                    {icon && (
                        <img
                            src={icon}
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
                    <KContextMenuItem
                        onClick={handleDelete}
                        disabled={isRoot()}
                    >
                        Delete File
                    </KContextMenuItem>
                </KContextMenuContent>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};
