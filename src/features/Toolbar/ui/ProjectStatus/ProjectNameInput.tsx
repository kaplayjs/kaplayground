import { useProjectStore } from "../../../Project/store/useProject.ts";

export const ProjectNameInput = () => {
    const { currentProject, updateProject } = useProjectStore();

    if (!currentProject) {
        return <div className="badge badge-error">No current project!</div>;
    }

    const handleInputChange = (t: React.ChangeEvent<HTMLInputElement>) => {
        const newName = t.target.value;
        if (!newName) return;

        updateProject({
            name: newName,
        });
    };

    return (
        <input
            id="projectNameInput"
            className="input input-xs"
            defaultValue={currentProject.name}
            onChange={handleInputChange}
        >
        </input>
    );
};
