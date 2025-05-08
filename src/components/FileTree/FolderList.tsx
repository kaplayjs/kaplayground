import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import type { FC } from "react";
import type { Folder } from "../../features/Projects/models/File";
import { FileFold } from "./FileFold";
import { iconByPath } from "./FileList";

interface FileListProps {
    folders: Folder[];
    level: number;
    path: string;
}

export const FolderList: FC<FileListProps> = ({ folders, level, path }) => {
    const [
        parent,
        draggables,
    ] = useDragAndDrop<HTMLUListElement, Folder>(folders);

    return (
        <div>
            {folders.length > 0 && (
                <ul
                    ref={parent}
                    className="flex flex-col gap-px"
                >
                    {draggables.map((folder) => (
                        <li key={folder.name}>
                            <FileFold
                                path={`${path}/${folder.name}`}
                                title={folder.name}
                                level={level + 1}
                                icon={iconByPath[folder.name]}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
