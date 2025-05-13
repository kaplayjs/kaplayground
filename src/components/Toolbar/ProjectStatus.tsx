import { assets } from "@kaplayjs/crew";
import { useEffect, useRef, useState } from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor.ts";
import { cn } from "../../util/cn.ts";

export const ProjectStatus = () => {
    const getSavedProjects = useProject((s) => s.getSavedProjects);
    const getProjectMetadata = useProject((s) => s.getProjectMetadata);
    const saveNewProject = useProject((s) => s.saveNewProject);
    const projectMode = useProject((s) => s.project.mode);
    const kaplayVersion = useProject((s) => s.project.kaplayVersion);
    const setProject = useProject((s) => s.setProject);
    const run = useEditor((s) => s.run);
    const kaplayVersions = useEditor((s) => s.runtime.kaplayVersions);
    const projectName = useProject((s) => s.project.name);
    const projectKey = useProject((s) => s.projectKey);
    const demoKey = useProject((s) => s.demoKey);
    const [isEditing, setIsEditing] = useState(false);
    const [initialName, setInitialName] = useState(() => projectName);
    // the name is the name of the project
    // the current value of the input that will be displayed
    const [inputValue, setInputValue] = useState(() => projectName);
    const nameInput = useRef<HTMLInputElement>(null);
    const [usedNames, setUsedNames] = useState<string[] | null>(null);
    const [error, setError] = useState<string>("");

    const setNameInputValue = (value: string) => {
        if (nameInput.current) {
            nameInput.current.value = value;
        }
    };

    const blur = () => {
        setTimeout(() => {
            nameInput.current?.blur();
        });
    };

    const isSaved = () => {
        return Boolean(projectKey);
    };

    const handleSaveProject = () => {
        if (!isSaved()) saveNewProject();
    };

    const setProjectName = (newName = initialName) => {
        if (newName == projectName) return;
        setProject({
            name: newName,
        });
    };

    const handleInputChange = (t: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(t.target.value || initialName);
        if (error) setError("");
    };

    const handleInputBlur = () => {
        if (!isEditing) return;

        if (!error) setInitialName(projectName);

        setIsEditing(false);
    };

    const resetValue = () => {
        setInputValue(initialName);
        setIsEditing(false);
        setNameInputValue(initialName);
        setError("");
        setTimeout(blur);
    };

    const isValid = () => {
        let names = usedNames;
        if (!names) {
            names = getSavedProjects()
                .filter(k => k !== projectKey)
                .map(k => getProjectMetadata(k).name);
            setUsedNames(names);
        }
        const nameAlreadyUsed = inputValue && names?.includes(inputValue);
        setError(
            nameAlreadyUsed ? "Project with that name already exists!" : "",
        );
        return !nameAlreadyUsed;
    };

    // Save project name
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (inputValue == projectName) return;
            setProjectName(isValid() ? inputValue : initialName);
        }, 500);
        return () => clearTimeout(timeout);
    }, [inputValue]);

    // This is when a new project is loaded
    useEffect(() => {
        if (isEditing) return;

        setInitialName(projectName);
        setNameInputValue(projectName);
        setInputValue(projectName);
        setUsedNames(null);
        setError("");
    }, [projectKey, projectName]);

    return (
        <div className="flex flex-row gap-2 items-center h-full">
            {!demoKey && (
                <>
                    <div className="uppercase badge badge-sm px-2 py-[3px] h-auto font-semibold tracking-wider bg-base-50 rounded-xl">
                        {projectMode === "pj" ? "Project" : "Example"}
                    </div>

                    <input
                        id="projectNameInput"
                        ref={nameInput}
                        className={cn(
                            "input input-xs placeholder:text-base-content/45",
                            {
                                "border-error focus-visible:outline-error":
                                    error,
                            },
                        )}
                        defaultValue={inputValue}
                        placeholder={initialName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onFocus={() => setIsEditing(true)}
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
                    ? "Autosave Enabled"
                    : "Save as My Project"}
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
                value={kaplayVersion}
            >
                <option value={"master"} key={"no"}>master</option>
                {kaplayVersions.map((v, i) => (
                    <option value={v} key={i}>{v}</option>
                ))}
            </select>
        </div>
    );
};
