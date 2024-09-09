import type { FC, PropsWithChildren } from "react";
import addFileIcon from "../../assets/filetree/add_file.png";
import { useProject } from "../../hooks/useProject";

const FileToolbar: FC<PropsWithChildren> = ({ children }) => {
    const { addFile } = useProject();

    const handleAddScene = () => {
        const sceneName = prompt("Scene name");
        if (!sceneName) return;

        addFile({
            name: sceneName + ".js",
            kind: "scene",
            value: `scene("${sceneName}", () => {\n\n});`,
            language: "javascript",
            path: `scenes/${sceneName}.js`,
        });
    };

    return (
        <div className="flex" role="toolbar">
            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
                onClick={handleAddScene}
            >
                <img
                    src={addFileIcon}
                    alt="Add Scene"
                    className="h-4"
                />
            </button>

            {children}
        </div>
    );
};

export default FileToolbar;
