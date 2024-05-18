import sceneIcon from "@/assets/filetree/scene.png";
import kLogo from "@/assets/k.png";
import { useProject } from "@/hooks/useProject";
import type { File } from "@/stores/files";
import { cn } from "@/util/cn";
import { removeExtension } from "@/util/removeExtensions";
import type { FC } from "react";

type Props = {
    file: File;
};

const logoByKind = {
    kaboom: kLogo.src,
    scene: sceneIcon.src,
    main: kLogo.src,
};

const FileEntry: FC<Props> = ({ file }) => {
    const [getCurrentFile, setCurrentFile] = useProject((state) => [
        state.getCurrentFile,
        state.setCurrentFile,
    ]);
    const { name, kind } = file;

    const handleClick = () => {
        setCurrentFile(name);
    };

    return (
        <button
            className={cn("btn btn-sm w-full justify-start rounded-none px-2", {
                "btn-primary": getCurrentFile()?.name === name,
                "btn-ghost": getCurrentFile()?.name !== name,
            })}
            onClick={handleClick}
        >
            <span className="truncate max-w-[80%]">
                {removeExtension(name)}
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
