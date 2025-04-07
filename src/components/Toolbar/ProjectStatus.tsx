import { assets } from "@kaplayjs/crew";
import { useEffect, useState } from "react";
import { useEditor } from "../../hooks/useEditor.ts";
import { useProject } from "../../hooks/useProject";
import { cn } from "../../util/cn.ts";

const ProjectStatus = () => {
    const { saveProject, getProject, projectIsSaved, setProject } =
        useProject();
    const { run, runtime } = useEditor();
    const [name, setName] = useState(getProject().name);

    const handleSaveProject = (newName = name) => {
        if (isSaved(newName)) return;

        saveProject(newName, getProject().id);
        setProject({
            isDefault: false,
        });
    };

    const handleInputChange = (t: React.ChangeEvent<HTMLInputElement>) => {
        const newName = t.target.value;
        if (!newName) return;

        setName(newName);
        handleSaveProject(newName);
    };

    const isSaved = (n = name) => {
        return projectIsSaved(n, getProject().mode);
    };

    useEffect(() => {
        setName(getProject().name);
    }, [getProject().name]);

    return (
        <div className="flex flex-row gap-2 items-center h-full">
            {!getProject().isDefault && (
                <>
                    <div className="uppercase badge badge-sm px-2 py-[3px] h-auto font-semibold tracking-wider bg-base-50 rounded-xl">
                        {getProject().mode === "pj" ? "Project" : "Example"}
                    </div>

                    <input
                        id="projectNameInput"
                        className="input input-xs"
                        value={name}
                        placeholder={name}
                        onChange={handleInputChange}
                    >
                    </input>
                </>
            )}

            <button
                className={cn(
                    "btn btn-xs btn-ghost px-px rounded-sm items-center justify-center h-full",
                    {
                        "hover:bg-transparent cursor-default": isSaved(),
                    },
                )}
                onClick={() => handleSaveProject()}
                data-tooltip-id="global"
                data-tooltip-html={isSaved()
                    ? `Autosave Enabled`
                    : `Save as My Project`}
                data-tooltip-place="bottom-end"
            >
                <img
                    src={assets.save.outlined}
                    alt="Save Project"
                    className={cn("w-6 h-6 transition-all p-[3px]", {
                        "grayscale opacity-30": isSaved(),
                    })}
                />
            </button>

            <div className="divider divider-horizontal mx-0 px-0"></div>

            <select
                className="select select-xs"
                onChange={(e) => {
                    const target = e.target as HTMLSelectElement;

                    setProject({
                        kaplayVersion: target.value,
                    });

                    run();
                }}
                defaultValue={getProject().kaplayVersion}
            >
                <option
                    value={"master"}
                    key={"XDD"}
                    selected={getProject().kaplayVersion == "master"}
                >
                    master
                </option>
                {runtime.kaplayVersions.map((v, i) => (
                    <option
                        value={v}
                        key={i}
                        selected={getProject().kaplayVersion == v}
                    >
                        {v}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectStatus;
