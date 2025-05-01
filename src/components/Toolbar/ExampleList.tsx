import type { ChangeEvent, FC } from "react";
import { demos } from "../../data/demos";
import type { Example } from "../../data/demos";
import { useProject } from "../../features/Projects/stores/useProject";
import { sortEntries } from "../ProjectBrowser/SortBy";

const ExampleList: FC = () => {
    const {
        getSavedProjects,
        getProjectMetadata,
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

    const getSortedProjects = (mode: "pj" | "ex") => (
        getSavedProjects(mode)
            .map(p => getProjectMetadata(p) as Example)
            .sort((a, b) =>
                sortEntries(
                    "latest",
                    mode == "pj" ? "Projects" : "Examples",
                    a,
                    b,
                )
            )
    );

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

                {getSortedProjects("pj").map((project) => (
                    <option key={project.name} value={project.name}>
                        {project.formattedName}
                    </option>
                ))}

                <option className="text-md" disabled value="uex-Untitled">
                    My Examples
                </option>

                {getSortedProjects("ex").map((project) => (
                    <option key={project.name} value={project.name}>
                        {project.formattedName}
                    </option>
                ))}

                <option className="text-md" disabled>KAPLAY Demos</option>

                {demos.sort((a, b) => sortEntries("topic", "Examples", a, b))
                    .map((example) => (
                        <option
                            key={example.name}
                            value={example.name}
                            data-example-id={example.id}
                        >
                            {example.formattedName}
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
