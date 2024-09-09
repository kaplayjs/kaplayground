import { useEffect, useState } from "react";
import { useProject } from "../../hooks/useProject";
import FileEntry from "./FileEntry";
import FileFolder from "./FileFolder";

const FileTree = () => {
    const { getProjectMode, project: { files } } = useProject();
    const [scenes, setScenes] = useState(
        Array.from(files.entries()).filter(([_, file]) =>
            file.kind === "scene"
        ),
    );
    const [kaplay, setKaplay] = useState(
        Array.from(files.entries()).filter(([_, file]) =>
            file.kind === "kaplay"
        )[0],
    );
    const [main, setMain] = useState(
        Array.from(files.entries()).filter(([_, file]) =>
            file.kind === "main"
        )[0],
    );
    const [assets, setAssets] = useState(
        Array.from(files.entries()).filter(([_, file]) =>
            file.kind === "assets"
        )[0],
    );

    useEffect(() => {
        setScenes(
            Array.from(files.entries()).filter(([_, file]) =>
                file.kind === "scene"
            ),
        );
        setKaplay(
            Array.from(files.entries()).filter(([_, file]) =>
                file.kind === "kaplay"
            )[0],
        );
        setMain(
            Array.from(files.entries()).filter(([_, file]) =>
                file.kind === "main"
            )[0],
        );
        setAssets(
            Array.from(files.entries()).filter(([_, file]) =>
                file.kind === "assets"
            )[0],
        );
    }, [JSON.stringify(Array.from(files))]);

    return (
        <div className="flex flex-col p-2 gap-2">
            <FileFolder level={1} title="Scenes">
                {scenes.length === 0
                    ? <li className="text-gray-500 text-xs">No scenes yet</li>
                    : (
                        scenes.map(([_, file]) => {
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
            <FileFolder level={0} toolbar={false}>
                <li>
                    <FileEntry file={main[1]} />
                    {getProjectMode() === "project" && (
                        <>
                            <FileEntry file={kaplay[1]} />
                            <FileEntry file={assets[1]} />
                        </>
                    )}
                </li>
            </FileFolder>
        </div>
    );
};

export default FileTree;
