import type { ChangeEvent, FC } from "react";
import { demos } from "../../data/demos";
import { useProject } from "../../features/Projects/stores/useProject";

const ExampleList: FC = () => {
    const {
        getSavedProjects,
        loadProject,
        createNewProjectFromDemo,
        currentSelection,
    } = useProject();

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const demoStringId = ev.target.selectedOptions[0].getAttribute(
            "data-example-id",
        );

        if (demoStringId) {
            const demoId = parseInt(demoStringId);
            createNewProjectFromDemo(demoId);
        } else {
            loadProject(ev.target.value);
        }
    };

    return (
        <div className="join border border-base-100">
            <select
                className="join-item | select select-xs w-full max-w-xs"
                onChange={handleExampleChange}
                value={currentSelection ?? "upj-Untitled"}
            >
                <option className="text-md" disabled value="upj-Untitled">
                    My Projects
                </option>

                {getSavedProjects("pj").map((project) => (
                    <option key={project} value={project}>
                        {project.replace("pj-", "")}
                    </option>
                ))}

                <option className="text-md" disabled value="uex-Untitled">
                    My Examples
                </option>

                {getSavedProjects("ex").map((project) => (
                    <option key={project} value={project}>
                        {project.replace("ex-", "")}
                    </option>
                ))}

                <option className="text-md" disabled>KAPLAY Demos</option>

                {demos.map((example) => (
                    <option key={example.name} data-example-id={example.id}>
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
