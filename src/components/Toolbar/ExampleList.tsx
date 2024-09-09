import type { ChangeEvent, FC } from "react";
import { useProject } from "../../hooks/useProject";
import type { File } from "../../stores/storage/files";
import { exampleList } from "./examples";

const ExampleList: FC = () => {
    const {
        project,
        replaceProject,
        addFile,
    } = useProject();

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const exampleIndex = ev.target.selectedOptions[0].getAttribute(
            "data-example",
        );

        replaceProject({
            assets: new Map(),
            files: new Map<string, File>(),
            kaplayConfig: {},
            mode: "example",
            version: project.version,
        });

        addFile({
            name: "main.js",
            value: exampleList[Number(exampleIndex)].code,
            kind: "main",
            language: "javascript",
            path: "main.js",
        });
    };

    return (
        <select
            className="select select-bordered select-sm w-full max-w-xs"
            onChange={handleExampleChange}
        >
            <option selected>none</option>
            {exampleList.map((example, i) => (
                <option key={example.name} data-example={i}>
                    {example.name}
                </option>
            ))}
        </select>
    );
};

export default ExampleList;
