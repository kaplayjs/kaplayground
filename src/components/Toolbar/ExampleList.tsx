import type { ChangeEvent, FC } from "react";
import { examples } from "../../data/examples";
import { useProject } from "../../hooks/useProject";

const ExampleList: FC = () => {
    const {
        getSavedProjects,
        loadProject,
        createNewProjectFromDemo,
    } = useProject();

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const demoIndex = ev.target.selectedOptions[0].getAttribute(
            "data-def-example",
        );

        if (demoIndex) {
            createNewProjectFromDemo(demoIndex);
        } else {
            loadProject(ev.target.value);
        }
    };

    return (
        <div className="join border border-base-100">
            <select
                className="join-item | select select-xs w-full max-w-xs"
                onChange={handleExampleChange}
                defaultValue={"none"}
            >
                <option className="text-md" disabled value="none">
                    My Projects
                </option>

                {getSavedProjects("pj").map((project) => (
                    <option key={project} value={project}>
                        {project.replace("pj-", "")}
                    </option>
                ))}

                <option className="text-md" disabled value="none">
                    KAPLAY Demos
                </option>

                {getSavedProjects("ex").map((project) => (
                    <option key={project} value={project}>
                        {project.replace("ex-", "")}
                    </option>
                ))}

                <option className="text-md" disabled>KAPLAY Demos</option>

                {examples.map((example) => (
                    <option key={example.name} data-def-example={example.index}>
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
