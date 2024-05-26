import { useProject } from "@/hooks/useProject";
import type { ChangeEvent } from "react";
import { exampleList } from "./examples";

const ExampleList = () => {
    const [
        project,
        replaceProject,
    ] = useProject((state) => [state.project, state.replaceProject]);

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const exampleIndex = ev.target.selectedOptions[0].getAttribute(
            "data-example",
        );

        replaceProject({
            assets: [],
            files: [
                {
                    name: "main.js",
                    value: exampleList[Number(exampleIndex)].code,
                    isCurrent: true,
                    isEncoded: true,
                    kind: "main",
                    language: "javascript",
                },
            ],
            kaboomConfig: {},
            mode: "classic",
            version: project.version,
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
