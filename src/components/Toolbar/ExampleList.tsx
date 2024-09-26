import type { ChangeEvent, FC } from "react";
import { examples } from "../../data/examples";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";

const ExampleList: FC = () => {
    const { getSavedProjects } = useProject();
    const { loadExample, loadProject } = useEditor();

    const handleExampleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const exampleIndex = ev.target.selectedOptions[0].getAttribute(
            "data-example",
        );

        if (exampleIndex) {
            loadExample(exampleIndex);
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
                    Projects
                </option>

                {getSavedProjects().map((project) => (
                    <option key={project} value={project} data-project>
                        {project.replace("pj-", "")}
                    </option>
                ))}

                <option className="text-md" disabled>KAPLAY Examples</option>

                {examples.map((example) => (
                    <option key={example.name} data-example={example.index}>
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
