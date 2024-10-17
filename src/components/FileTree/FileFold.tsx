import { assets } from "@kaplayjs/crew";
import { type FC, type PropsWithChildren, useMemo, useState } from "react";
import { cn } from "../../util/cn";
import { FileToolbar } from "./FileToolbar";
import "./FileFolder.css";
import { useProject } from "../../hooks/useProject";
import type { FileFolder, FileKind } from "../../stores/storage/files";
import { FileEntry } from "./FileEntry";

type Props = PropsWithChildren<{
    level: 0 | 1 | 2;
    title?: string;
    toolbar?: boolean;
    /** Kind of files on Folder */
    kind?: FileKind;
    /** Folder */
    folder: FileFolder;
}>;

const paddingLevels = {
    0: "pl-0",
    1: "pl-4",
    2: "pl-8",
};

export const FileFold: FC<Props> = (props) => {
    const [folded, setFolded] = useState(false);
    const { getFilesByFolder, project } = useProject();
    const files = useMemo(() => getFilesByFolder(props.folder), [
        project.files.values(),
    ]);

    return (
        <div className="mb-2">
            <div className="flex justify-between">
                {props.title && (
                    <h2 className="text-lg font-medium">{props.title}</h2>
                )}

                {(props.toolbar && props.kind) && (
                    <FileToolbar
                        kind={props.kind}
                    >
                        <button
                            className="btn btn-ghost btn-xs rounded-sm px-1"
                            onClick={() => setFolded(!folded)}
                        >
                            <img
                                src={assets.arrow.outlined}
                                alt={folded ? "Open folder" : "Close folder"}
                                data-folded={folded}
                                className="folded-icon | h-4"
                            />
                        </button>
                    </FileToolbar>
                )}
            </div>

            <ul
                className={cn(paddingLevels[props.level], {
                    "hidden": folded,
                })}
            >
                {files.length === 0
                    ? (
                        <li className="text-gray-500 text-xs">
                            Create an {props.folder} to start
                        </li>
                    )
                    : (
                        files.map((file) => {
                            return (
                                <li key={file.name}>
                                    <FileEntry
                                        file={file}
                                    />
                                </li>
                            );
                        })
                    )}
            </ul>
        </div>
    );
};
