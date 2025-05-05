import {
    type FC,
    type PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { cn } from "../../util/cn";
import "./FileFolder.css";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { assets } from "@kaplayjs/crew";
import * as ContextMenu from "@radix-ui/react-context-menu";
import type { Folder, RealFile } from "../../features/Projects/models/File";
import { useProject } from "../../features/Projects/stores/useProject";
import { KContextMenuContent } from "../UI/ContextMenu/KContextMenuContent";
import { KContextMenuItem } from "../UI/ContextMenu/KContextMenuItem";
import { KContextMenuSeparator } from "../UI/ContextMenu/KContextMenuSeparator";
import { FileEntry } from "./FileEntry";
import { FileTreeItemDirty } from "./FileTreeItemDirty";

type Props = PropsWithChildren<{
    level: number;
    path: string;
    title?: string;
    icon?: string;
    folded?: boolean;
}>;

const iconByPath: Record<string, any> = {
    "main.js": assets.play.outlined,
    "assets.js": assets.assetbrew.outlined,
    "kaplay.js": assets.ka.outlined,
};

export const FileFold: FC<Props> = ({ icon, ...props }) => {
    const [folded, setFolded] = useState(props.folded ?? false);
    const project = useProject((s) => s.project);
    const getTreeByPath = useProject((s) => s.getTreeByPath);
    const addFile = useProject((s) => s.addFile);
    const removeFile = useProject((s) => s.removeFile);
    const [creatingItem, setCreatingItem] = useState<"folder" | "file" | null>(
        null,
    );
    const newItemRef = useRef<HTMLInputElement>(null);

    const isRoot = () => !props.path.includes("/");

    useEffect(() => {
        const tree = getTreeByPath(props.path);
        const files = tree.filter((file) => file.kind !== "folder");
        const folders = tree.filter((file) => file.kind === "folder");

        setFiles(files);
        setFolders(folders);
    }, [project]);

    const [
        filesParent,
        files,
        setFiles,
    ] = useDragAndDrop<HTMLUListElement, RealFile>([]);

    const [
        foldersParent,
        folders,
        setFolders,
    ] = useDragAndDrop<HTMLUListElement, Folder>([]);

    const handleCreate = (e: React.FocusEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value.trim();
        if (!name) return;

        const kind = e.currentTarget.dataset.kind as "file" | "folder";
        if (!kind) return;

        const isValid = newItemRef.current?.dataset.valid;

        if (isValid === "true") {
            if (kind === "folder") {
                const file: Folder = {
                    name: `${name}`,
                    kind: kind,
                    path: `${props.path}/${name}`,
                };

                addFile(file);
            } else {
                const file: RealFile = {
                    name: `${name}.js`,
                    kind: kind,
                    language: "javascript",
                    path: `${props.path}/${name}.js`,
                    value: "",
                };

                addFile(file);
            }
        }

        setCreatingItem(null);
    };

    const handleDeleteFolder = () => {
        removeFile(props.path);
    };

    return (
        <ContextMenu.Root>
            {props.title && (
                <ContextMenu.Trigger
                    id={props.path}
                >
                    <div
                        className={cn("flex justify-between items-center", {
                            "-mb-1.5": props.level < 2,
                        })}
                    >
                        <div
                            className={cn(
                                "file btn btn-sm w-full justify-start pl-2 pr-0.5 h-[1.875rem] min-h-0 btn-ghost",
                                {
                                    "pl-3": !icon,
                                },
                            )}
                            onClick={() => {
                                setFolded(!folded);
                            }}
                        >
                            {icon && (
                                <img
                                    src={icon}
                                    className="w-4"
                                />
                            )}

                            <h2
                                className={cn("font-semibold", {
                                    "font-bold text-xs uppercase tracking-wider":
                                        props.level == 1,
                                })}
                            >
                                {props.title}
                            </h2>
                        </div>
                    </div>
                </ContextMenu.Trigger>
            )}

            <div
                className={cn(
                    "space-y-px",
                    {
                        "pl-3 border-l border-base-content/10": props.level,
                        "ml-2": props.level == 1,
                        "ml-3": props.level > 1,
                        "hidden": folded,
                    },
                )}
            >
                {creatingItem && (
                    <FileTreeItemDirty
                        folder={props.path}
                        ref={newItemRef}
                        onBlur={handleCreate}
                        createFolder={creatingItem === "folder"}
                    />
                )}

                {files.length == 0 && folders.length == 0 && !creatingItem && (
                    <ul>
                        <li className="inline-flex items-center text-gray-500 text-xs pl-3.5 min-h-[1.875rem]">
                            No files or folders
                        </li>
                    </ul>
                )}

                {folders.length > 0 && (
                    <ul
                        ref={foldersParent}
                        className="flex flex-col gap-px"
                    >
                        {folders.map((folder) => (
                            <li key={folder.name}>
                                <FileFold
                                    path={`${props.path}/${folder.name}`}
                                    title={folder.name}
                                    level={props.level + 1}
                                    icon={iconByPath[folder.name]}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {files.length > 0 && (
                    <ul
                        ref={filesParent}
                        className="flex flex-col gap-px"
                    >
                        {files.map((file) => (
                            <li key={file.name}>
                                <FileEntry
                                    file={file}
                                    icon={iconByPath[file.name]}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ContextMenu.Portal>
                <KContextMenuContent
                    title={props.path.charAt(0).toUpperCase()
                        + props.path.slice(1) + " folder"}
                >
                    <KContextMenuItem
                        onClick={() => {
                            setCreatingItem("file");
                            setTimeout(() => {
                                newItemRef.current?.focus();
                            }, 0);
                        }}
                    >
                        New file
                    </KContextMenuItem>
                    <KContextMenuItem
                        onClick={() => {
                            setCreatingItem("folder");
                            setTimeout(() => {
                                newItemRef.current?.focus();
                            }, 0);
                        }}
                    >
                        New folder
                    </KContextMenuItem>
                    <KContextMenuSeparator />
                    <KContextMenuItem
                        disabled={isRoot()}
                        onClick={handleDeleteFolder}
                    >
                        Delete folder
                    </KContextMenuItem>
                    <KContextMenuSeparator />
                    <KContextMenuItem
                        onClick={() => {
                            setFolded(false);
                        }}
                    >
                        Expand all
                    </KContextMenuItem>
                    <KContextMenuItem
                        onClick={() => {
                            setFolded(true);
                        }}
                    >
                        Collapse all
                    </KContextMenuItem>
                </KContextMenuContent>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};
