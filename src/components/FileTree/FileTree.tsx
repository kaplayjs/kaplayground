import { useProject } from "../../hooks/useProject";
import FileEntry from "./FileEntry";
import FileFolder from "./FileFolder";

const FileTree = () => {
    const {
        getProjectMode,
        getFile,
        getFilesByFolder,
    } = useProject();

    return (
        <div className="flex flex-col p-2 gap-2">
            {getProjectMode() === "project" && (
                <>
                    <FileFolder level={1} title="Scenes">
                        {getFilesByFolder("scenes").length === 0
                            ? (
                                <li className="text-gray-500 text-xs">
                                    No scenes yet
                                </li>
                            )
                            : (
                                getFilesByFolder("scenes").map((file) => {
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
                            <>
                                <FileEntry file={getFile("main.js")!} />
                                <FileEntry file={getFile("kaplay.js")!} />
                                <FileEntry file={getFile("assets.js")!} />
                            </>
                        </li>
                    </FileFolder>
                </>
            )}
        </div>
    );
};

export default FileTree;
