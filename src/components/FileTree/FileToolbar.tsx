import addSceneImage from "@/assets/add_scene.png";
import removeSceneIcon from "@/assets/icons/remove_scene_icon.png";
import { useProject } from "@/hooks/useProject";
import type { FC } from "react";

const FileToolbar = () => {
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
            value: `scene("${sceneName}", () => {\n\n})`,
            isCurrent: true,
            isEncoded: false,
            language: "javascript",
        });
    };

    const handleRemoveScene = () => {
        const currentFile = getCurrentFile();
        if (!currentFile) return;

        if (currentFile.kind === "kaboom") {
            return alert("Cannot remove the kaboom file");
        }

        if (confirm("Are you sure you want to remove this scene?")) {
            removeFile(currentFile.name);
            setCurrentFile("kaboom.js");
        }
    };

    return (
        <div className="flex gap-2">
            <button className="btn btn-primary btn-xs rounded-sm">
                <img
                    src={addSceneImage.src}
                    alt="Add Scene"
                    className="h-6"
                    onClick={handleAddScene}
                />
            </button>

            <button className="btn btn-error btn-xs rounded-sm">
                <img
                    src={removeSceneIcon.src}
                    alt="Remove Scene"
                    className="h-6"
                    onClick={handleRemoveScene}
                />
            </button>
        </div>
    );
};

export default FileToolbar;
