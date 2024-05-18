import { type File, useProject } from "@/hooks/useProject";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useState } from "react";
import FileEntry from "./FileEntry";
import FileToolbar from "./FileToolbar";
import IndentedSection from "./IndentedSection";

const FileTree = () => {
    const [files, addFile, setCurrentFile] = useProject((state) => [
        state.project.files,
        state.addFile,
        state.setCurrentFile,
    ]);
    const [scenes, setScenes] = useState(
        files.filter((file) => file.kind === "scene"),
    );
    const [kaboom, setKaboom] = useState(
        files.filter((file) => file.kind === "kaboom")[0],
    );

    useEffect(() => {
        setScenes(files.filter((file) => file.kind === "scene"));
        setKaboom(files.filter((file) => file.kind === "kaboom")[0]);
    }, [files]);

    const handleFileClick = (file: File) => {
        setCurrentFile(file.name);
    };

    return (
        <div className="flex flex-col p-2">
            <FileToolbar />

            <IndentedSection level={1} title="Scenes">
                {scenes.length === 0
                    ? <li className="text-gray-500">No scenes yet</li>
                    : (
                        scenes.map((file) => {
                            return (
                                <li key={file.value}>
                                    <FileEntry
                                        file={file}
                                        onClick={handleFileClick}
                                    />
                                </li>
                            );
                        })
                    )}
            </IndentedSection>
            <IndentedSection level={0}>
                <li>
                    <FileEntry file={kaboom} onClick={handleFileClick} />
                </li>
            </IndentedSection>
        </div>
    );
};

export default FileTree;
