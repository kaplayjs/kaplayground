import { assets } from "@kaplayjs/crew";
import { type FC, type PropsWithChildren, useMemo, useState } from "react";
import { cn } from "../../util/cn";
import { FileToolbar } from "./FileToolbar";
import "./FileFolder.css";
import type { FileFolder } from "../../features/Projects/models/FileFolder";
import type { FileKind } from "../../features/Projects/models/FileKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { FileEntry, logoByKind } from "./FileEntry";

type Props = PropsWithChildren<{
    level: 0 | 1 | 2;
    title?: string;
    toolbar?: boolean;
    /** Kind of files on Folder */
    kind?: FileKind;
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
    const { getFilesByFolder, project: project } = useProject();
    const files = useMemo(() => getFilesByFolder(props.folder), [
        project.files.values(),
    ]);

    return (
        <div className={cn("mb-2", { "ml-2": props.level })}>
            <div className="flex justify-between items-center">
                {props.title && props.kind && (
                    <div className="flex items-center justify-center gap-2">
                        <img
                            src={logoByKind[props.kind]}
                            className="w-4"
                        />
                        <h2 className="font-bold text-xs uppercase tracking-wider">
                            {props.title}
                        </h2>
                    </div>
                )}

                {(props.toolbar && props.kind) && (
                    <FileToolbar
                        kind={props.kind}
                    >
                        <button
                            className="btn btn-ghost btn-xs rounded-md px-1"
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
                className={cn(
                    paddingLevels[props.level],
                    "space-y-px",
                    {
                        "mt-1 border-l border-base-content/10": props.level,
                        "hidden": folded,
                    },
                )}
            >
                {files.length === 0
                    ? (
                        <li className="inline-flex items-center text-gray-500 text-xs pl-3.5 min-h-[1.875rem]">
                            Create {props.kind === "obj" ? "an" : "a"}{" "}
                            {props.kind} to start
                        </li>
                    )
                    : (
                        files.map((file) => {
                            return (
                                <li key={file.name} className="">
                                    <FileEntry
                                        file={{ ...file }}
                                    />
                                </li>
                            );
                        })
                    )}
            </ul>
        </div>
    );
};
