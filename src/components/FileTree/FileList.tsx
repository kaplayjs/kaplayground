import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import type { RealFile } from "../../features/Projects/models/File";
import { FileEntry } from "./FileEntry";

interface FileListProps {
    files: RealFile[];
}

export const iconByPath: Record<string, any> = {
    "main.js": assets.play.outlined,
    "assets.js": assets.assetbrew.outlined,
    "kaplay.js": assets.ka.outlined,
};

export const FileList: FC<FileListProps> = ({ files }) => {
    const [
        filesParent,
        dragFiles,
    ] = useDragAndDrop<HTMLUListElement, RealFile>(files);

    return (
        <div>
            {files.length > 0 && (
                <ul
                    ref={filesParent}
                    className="flex flex-col gap-px"
                >
                    {dragFiles.map((file) => (
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
    );
};
