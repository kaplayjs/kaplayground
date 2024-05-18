import { type File, useProject } from "@/hooks/useProject";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useState } from "react";
import FileEntry from "./FileEntry";
import FileFolder from "./FileFolder";

const FileTree = () => {
    const files = useProject((state) => state.project.files);
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

    return (
        <div className="flex flex-col p-2 gap-2">
            <FileFolder level={1} title="Scenes">
                {scenes.length === 0
                    ? <li className="text-gray-500 text-xs">No scenes yet</li>
                    : (
                        scenes.map((file) => {
                            return (
                                <li key={file.name}>
                                    <FileEntry
                                        file={file}
                                    />
                                </li>
                            );
                        })
                    )}
            </FileFolder>
            <FileFolder level={0} noClose>
                <li>
                    <FileEntry file={kaboom} />
                </li>
            </FileFolder>
        </div>
    );
};

export default FileTree;
