import kLogo from "@/assets/k.png";
import { type File, useProject } from "@/hooks/useProject";
import { cn } from "@/util/cn";
import type { FC } from "react";

type Props = {
    file: File;
    onClick?: (file: File) => void;
};

const logoByKind = {
    kaboom: kLogo.src,
    scene: kLogo.src,
};

const FileEntry: FC<Props> = ({ file, onClick }) => {
    const [getCurrentFile] = useProject((state) => [state.getCurrentFile]);
    const { name, kind } = file;

    return (
        <button
            className={cn("btn btn-sm w-full justify-start rounded-none px-2", {
                "btn-primary": getCurrentFile()?.name === name,
                "btn-ghost": getCurrentFile()?.name !== name,
            })}
            onClick={() => {
                onClick?.(file);
            }}
        >
            <span className="truncate max-w-[80%]">
                {file.name}
            </span>
            <img
                src={logoByKind[kind]}
                alt={kind}
                className="w-4 h-4 ml-auto"
            />
        </button>
    );
};

export default FileEntry;
