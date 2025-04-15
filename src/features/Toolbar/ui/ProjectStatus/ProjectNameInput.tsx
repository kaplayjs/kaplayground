import { useProjects } from "../../../Project/stores/useProjects.ts";

export const ProjectNameInput = () => {
    const projects = useProjects();
    const curProject = projects.curProject;

    if (!curProject) return;

    const handleInputChange = (t: React.ChangeEvent<HTMLInputElement>) => {
        const newName = t.target.value;
        if (!newName) return;

        projects.updateCurProject({
            name: newName,
        });
    };

    return (
        <input
            id="projectNameInput"
            className="input input-xs"
            defaultValue={curProject.name}
            onChange={handleInputChange}
            placeholder={"hi"}
        >
        </input>
    );
};
