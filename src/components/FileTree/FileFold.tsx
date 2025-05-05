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
import * as ContextMenu from "@radix-ui/react-context-menu";
import type { File } from "../../features/Projects/models/File";
import type { FileFolder } from "../../features/Projects/models/FileFolder";
import type { FileKind } from "../../features/Projects/models/FileKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { KContextMenuContent } from "../UI/ContextMenu/KContextMenuContent";
import { KContextMenuItem } from "../UI/ContextMenu/KContextMenuItem";
import { FileEntry, logoByKind } from "./FileEntry";
import { FileEntryDirty } from "./FileEntryDirty";

type Props = PropsWithChildren<{
    level: 0 | 1 | 2;
    title?: string;
    toolbar?: boolean;
    /** Kind of files on Folder */
    kind: FileKind | null;
    /** Folder */
    folder: FileFolder;
    folded?: boolean;
}>;

const paddingLevels = {
    0: "pl-0",
    1: "pl-2.5",
    2: "pl-5",
};

export const FileFold: FC<Props> = (props) => {
    const [folded, setFolded] = useState(props.folded ?? false);
    const [creatingFile, setCreatingFile] = useState(false);
    const project = useProject((s) => s.project);
    const getFilesByFolder = useProject((s) => s.getFilesByFolder);
    const addFile = useProject((s) => s.addFile);
    const newFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDraggableFiles(getFilesByFolder(props.folder));
    }, [project]);

    const [
        draggableParent,
        draggableFiles,
        setDraggableFiles,
    ] = useDragAndDrop<HTMLUListElement, File>([]);

    const handleCreateFile = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!props.kind) return;

        const name = e.currentTarget.value.trim();
        if (!name) return;
        const isValid = newFileInputRef.current?.dataset.valid;

        if (isValid === "true") {
            const file: File = {
                name: `${name}.js`,
                kind: props.kind,
                language: "javascript",
                path: `${props.folder}/${name}`,
                value: "",
            };

            addFile(file);
        }

        setCreatingFile(false);
    };

    return (
        <ContextMenu.Root>
            <div className={cn("mb-2", { "ml-2": props.level })}>
                <ContextMenu.Trigger
                    draggable={false}
                    id={props.folder}
                >
                    <div className="flex justify-between items-center">
                        {props.title && props.kind && (
                            <div
                                className="file btn btn-sm w-full justify-start pl-2 pr-0.5 h-[1.875rem] min-h-0 btn-ghost"
                                onClick={() => {
                                    setFolded(!folded);
                                }}
                            >
                                <img
                                    src={logoByKind[props.kind]}
                                    className="w-4"
                                />
                                <h2 className="font-bold text-xs uppercase tracking-wider">
                                    {props.title}
                                </h2>
                            </div>
                        )}
                    </div>
                </ContextMenu.Trigger>

                <div
                    className={cn(
                        paddingLevels[props.level],
                        "space-y-px",
                        {
                            "mt-1 border-l border-base-content/10": props.level,
                            "hidden": folded,
                        },
                    )}
                >
                    {creatingFile && (
                        <FileEntryDirty
                            folder={props.folder}
                            ref={newFileInputRef}
                            onBlur={handleCreateFile}
                        />
                    )}

                    {draggableFiles.length == 0
                        ? !creatingFile && (
                            (
                                <ul>
                                    <li className="inline-flex items-center text-gray-500 text-xs pl-3.5 min-h-[1.875rem]">
                                        Create{" "}
                                        {props.kind === "obj" ? "an" : "a"}{" "}
                                        {props.kind} to start
                                    </li>
                                </ul>
                            )
                        )
                        : (
                            <ul
                                ref={draggableParent}
                            >
                                {draggableFiles.map((file) => (
                                    <li key={file.name}>
                                        <FileEntry
                                            file={{ ...file }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                </div>
            </div>

            <ContextMenu.Portal>
                <KContextMenuContent
                    title={props.folder.charAt(0).toUpperCase()
                        + props.folder.slice(1) + " folder"}
                >
                    <KContextMenuItem
                        onClick={() => {
                            setCreatingFile(true);
                            setTimeout(() => {
                                newFileInputRef.current?.focus();
                            }, 0);
                        }}
                    >
                        New file
                    </KContextMenuItem>
                </KContextMenuContent>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};
