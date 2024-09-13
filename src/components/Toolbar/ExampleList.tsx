import type { ChangeEvent, FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import type { File } from "../../stores/storage/files";
import { exampleList } from "./examples";

const ExampleList: FC = () => {
    const {
        project,
        replaceProject,
        addFile,
        setProjectMode,
    } = useProject();
    const {
        update,
        run,
    } = useEditor();

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const exampleIndex = ev.target.selectedOptions[0].getAttribute(
            "data-example",
        );

        useProject.persist.setOptions({
            name: "kaplay-off-example",
        });

        setProjectMode("example");

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

        update();
        run();
    };

    return (
        <div className="join border border-base-100">
            <select
                className="join-item | select select-xs w-full max-w-xs"
                onChange={handleExampleChange}
                defaultValue={"none"}
            >
                <option value="none">none</option>
                {exampleList.map((example, i) => (
                    <option key={example.name} data-example={i}>
                        {example.name}
                    </option>
                ))}
            </select>
            <button
                className="join-item | btn btn-xs"
                onClick={() => {
                    const dialog = document.querySelector<HTMLDialogElement>(
                        "#examples-browser",
                    );
                    dialog?.showModal();
                }}
            >
                Browse all
            </button>
        </div>
    );
};

export default ExampleList;
