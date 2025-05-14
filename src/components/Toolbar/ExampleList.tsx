import type { ChangeEvent, FC } from "react";
import { demos } from "../../data/demos";
import { loadProject } from "../../features/Projects/application/loadProject";
import { useProject } from "../../features/Projects/stores/useProject";
import { sortEntries } from "../ProjectBrowser/SortBy";

const ExampleList: FC = () => {
    const getSavedProjects = useProject((s) => s.getSavedProjects);
    const getProjectMetadata = useProject((s) => s.getProjectMetadata);
    const createNewProject = useProject((s) => s.createNewProject);
    const projectKey = useProject((s) => s.projectKey);
    useProject((s) => s.project.name);

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const demoId = ev.target.selectedOptions[0].getAttribute(
            "data-demo-id",
        );

        if (demoId) {
            createNewProject("ex", {}, demoId);
        } else {
            loadProject(ev.target.value);
        }
    };

    const getSortedProjects = (mode: "pj" | "ex") => (
        getSavedProjects(mode)
            .map(pId => getProjectMetadata(pId))
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
                value={projectKey ?? "untitled"}
            >
                <option className="text-md" disabled value="untitled">
                    My Projects
                </option>

                {getSortedProjects("pj").map((project) => (
                    <option key={project.key} value={project.key}>
                        {project.formattedName}
                    </option>
                ))}

                <option className="text-md" disabled value="nothing">
                    My Examples
                </option>

                {getSortedProjects("ex").map((project) => (
                    <option key={project.key} value={project.key}>
                        {project.formattedName}
                    </option>
                ))}

                <option className="text-md" disabled>KAPLAY Demos</option>

                {demos.sort((a, b) => sortEntries("topic", "Examples", a, b))
                    .map((demo) => (
                        <option
                            key={demo.name}
                            value={demo.key}
                            data-demo-id={demo.key}
                        >
                            {demo.formattedName}
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
