import { demos } from "../../../../data/demos.ts";

export const ProjectList = () => {
    return (
        <div className="join border border-base-100">
            <select
                className="join-item | select select-xs w-full max-w-xs"
                onChange={() => {}}
            >
                <option className="text-md" disabled value="upj-Untitled">
                    My Projects
                </option>

                <option className="text-md" disabled value="uex-Untitled">
                    My Examples
                </option>

                <option className="text-md" disabled>KAPLAY Demos</option>

                {demos.map((example) => (
                    <option key={example.name} data-example-id={example.id}>
                        {example.name}
                    </option>
                ))}
            </select>
            <button className="join-item | btn btn-xs">
                Browse all
            </button>
        </div>
    );
};
