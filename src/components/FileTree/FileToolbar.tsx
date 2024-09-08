import type { FC, PropsWithChildren } from "react";
import addFileIcon from "../../assets/filetree/add_file.png";
import removeFileIcon from "../../assets/filetree/remove_file.png";
import { useProject } from "../../hooks/useProject";

const FileToolbar: FC<PropsWithChildren> = ({ children }) => {
    const [addFile, removeFile, getCurrentFile, setCurrentFile] = useProject((
        state,
    ) => [
        state.addFile,
        state.removeFile,
        state.getCurrentFile,
        state.setCurrentFile,
    ]);

    const handleAddScene = () => {
        const sceneName = prompt("Scene name");
        if (!sceneName) return;

        addFile({
            name: sceneName + ".js",
            kind: "scene",
            value: `scene("${sceneName}", () => {\n\n});`,
            isCurrent: true,
            isEncoded: false,
            language: "javascript",
        });
    };

    const handleRemoveScene = () => {
        const currentFile = getCurrentFile();
        if (!currentFile) return;

        if (currentFile.kind === "kaplay" || currentFile.kind === "main") {
            return alert("You cannot remove this file");
        }

        if (confirm("Are you sure you want to remove this scene?")) {
            removeFile(currentFile.name);
            setCurrentFile("kaboom.js");
        }
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

            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
                onClick={handleRemoveScene}
            >
                <img
                    src={removeFileIcon}
                    alt="Remove Scene"
                    className="h-4"
                />
            </button>

            {children}
        </div>
    );
};

export default FileToolbar;
