import type { FC } from "react";
import type { File } from "../../../core/File/models/File.ts";
import { cn } from "../../../util/cn.ts";

export interface FileEntryProps {
    file: File;
}

export const FileEntry: FC<FileEntryProps> = (props) => {
    return (
        <div
            className={cn(
                "file btn btn-sm w-full justify-start pl-2 pr-0.5 h-[1.875rem] min-h-0",
            )}
            onClick={() => {
                alert("implement change file");
            }}
            data-file-kind={props.file.kind}
        >
            <span className="text-left truncate w-[50%] flex-1 py-0.5">
                {props.file.name}
            </span>
        </div>
    );
};
