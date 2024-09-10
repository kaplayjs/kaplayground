import { assets } from "@kaplayjs/crew";
import { type FC, type PropsWithChildren, useState } from "react";
import { cn } from "../../util/cn";
import FileToolbar from "./FileToolbar";
import "./FileFolder.css";

type Props = PropsWithChildren<{
    level: 0 | 1 | 2;
    title?: string;
    toolbar?: boolean;
}>;

const paddingLevels = {
    0: "pl-0",
    1: "pl-4",
    2: "pl-8",
};

const FileFolder: FC<Props> = (
    { level, title, toolbar = true, children },
) => {
    const [folded, setFolded] = useState(false);

    return (
        <div className="mb-2">
            <div className="flex justify-between">
                {title && <h2 className="text-lg font-medium">{title}</h2>}
                {toolbar && (
                    <FileToolbar>
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
                className={cn(paddingLevels[level], {
                    "hidden": folded,
                })}
            >
                {children}
            </ul>
        </div>
    );
};

export default FileFolder;
