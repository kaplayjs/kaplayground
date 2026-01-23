import {
    type ChangeEvent,
    type FC,
    useCallback,
    useEffect,
    useState,
} from "react";
import { demos } from "../../data/demos";
import { loadProject } from "../../features/Projects/application/loadProject";
import { useProject } from "../../features/Projects/stores/useProject";
import { confirmNavigate } from "../../util/confirmNavigate";
import { sortEntries } from "../ProjectBrowser/SortBy";

interface ListItem {
    id: string;
    name: string;
}

const ExampleList: FC = () => {
    const savedProjects = useProject((s) => s.savedProjects);
    const projectKey = useProject((s) => s.projectKey);
    const demoKey = useProject((s) => s.demoKey);
    const projectName = useProject((s) => s.project.name);
    const projectMode = useProject((s) => s.project.mode);
    const selectedValue = projectKey || demoKey || projectMode;
    const getSavedProjects = useProject((s) => s.getSavedProjects);
    const createNewProject = useProject((s) => s.createNewProject);

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const demoId = ev.target.selectedOptions[0].getAttribute(
            "data-demo-id",
        );

        confirmNavigate(() => {
            if (demoId) {
                createNewProject("ex", {}, demoId);
            } else {
                loadProject(ev.target.value);
            }
        });
    };

    const [projectsList, setProjectsList] = useState<ListItem[]>([]);
    const [examplesList, setExamplesList] = useState<ListItem[]>([]);

    const getSortedProjects = async (mode: "pj" | "ex") => {
        const projects = await getSavedProjects(mode);
        return projects.sort((a, b) =>
            sortEntries(
                "latest",
                mode == "pj" ? "Projects" : "Examples",
                a,
                b,
            )
        );
    };

    const isKeyInList = useCallback(() => {
        if (!projectKey) return false;
        if (projectsList.some((p) => p.id === projectKey)) return true;
        if (examplesList.some((p) => p.id === projectKey)) return true;
        if (demos.some((d) => d.key === projectKey)) return true;
        return false;
    }, [projectKey, projectsList, examplesList]);

    useEffect(() => {
        (async () => {
            const pj = await getSortedProjects("pj");
            const ex = await getSortedProjects("ex");
            setProjectsList(pj);
            setExamplesList(ex);
        })();
    }, [projectName, savedProjects]);

    return (
        <div className="join border border-base-100 max-w-full">
            <select
                className="join-item select select-xs min-w-0 w-full md:w-28 lg:w-48 xl:w-full max-w-xs [footer_&]:w-auto"
                onChange={handleExampleChange}
                value={selectedValue}
            >
                {/* Prevents selection flash if current existing item is not in the list yet */}
                {(projectKey && !isKeyInList()) && (
                    <option key={projectKey} value={projectKey}>
                        {projectName}
                    </option>
                )}

                <option className="text-md" disabled value="pj">
                    My Projects
                </option>

                {projectsList.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}

                <option className="text-md" disabled value="ex">
                    My Examples
                </option>

                {examplesList.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
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
