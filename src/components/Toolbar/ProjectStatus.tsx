import { assets } from "@kaplayjs/crew";
import { useEffect, useMemo, useState } from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor.ts";
import { cn } from "../../util/cn.ts";

const ProjectStatus = () => {
    const {
        saveProject,
        getProject,
        projectIsSaved,
        setProject,
    } = useProject();
    const { run, runtime } = useEditor();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(getProject().name);
    const [initialName, setInitialName] = useState(() => name);
    const [value, setValue] = useState(() => initialName);

    const isSaved = (n = name) => {
        return projectIsSaved(n, getProject().mode);
    };

    const projectHasSwitched = () =>
        !isEditing && getProject().name != initialName;

    const handleSaveProject = (newName = name) => {
        if (isSaved(newName)) return;

        saveProject(newName, getProject().id);
        setProject({
            isDefault: false,
        });
    };

    const handleInputChange = (t: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = t.target.value;
        const newName = newValue || initialName;

        setValue(newValue);
        setName(newName);
        handleSaveProject(newName);
    };

    const handleInputBlur = () => {
        if (!isEditing) return;

        const newName = error ? initialName : name;
        setValue(value || newName);
        setInitialName(newName);
        setIsEditing(false);
        handleSaveProject(newName);
    };

    const resetValue = () => {
        setName(initialName);
        setValue(initialName);
        handleSaveProject(initialName);
        setIsEditing(false);
        setTimeout(blur);
    };

    const blur = () => (document.activeElement as HTMLElement | null)?.blur();

    const error = useMemo(() => {
        if (projectHasSwitched()) return "";
        return (value && value != getProject().name
            ? "Project with that name already exists!"
            : "");
    }, [value, getProject().name]);

    useEffect(() => {
        if (!projectHasSwitched()) return;

        const newName = getProject().name;
        setName(newName);
        setInitialName(newName);
        setValue(newName);
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
                        className={cn(
                            "input input-xs placeholder:text-base-content/45",
                            {
                                "border-error focus-visible:outline-error":
                                    error,
                            },
                        )}
                        value={value}
                        placeholder={initialName}
                        onChange={handleInputChange}
                        onFocus={() => setIsEditing(true)}
                        onBlur={handleInputBlur}
                        data-tooltip-id="global-open"
                        data-tooltip-content={error}
                        data-tooltip-hidden={!error}
                        data-tooltip-variant="error"
                        data-tooltip-place="bottom-start"
                        onKeyUpCapture={e => {
                            if (e.key === "Escape") resetValue();
                            else if (e.key === "Enter" && !error) blur();
                        }}
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
                value={getProject().kaplayVersion}
            >
                <option value={"master"} key={"XDD"}>master</option>
                {runtime.kaplayVersions.map((v, i) => (
                    <option value={v} key={i}>{v}</option>
                ))}
            </select>
        </div>
    );
};

export default ProjectStatus;
