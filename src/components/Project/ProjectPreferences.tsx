import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { validateProjectName } from "../../features/Projects/application/validateProjectName";
import { Project } from "../../features/Projects/models/Project";
import { ProjectBuildMode } from "../../features/Projects/models/ProjectBuildMode";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { confirm } from "../../util/confirm";
import { openDialog } from "../../util/openDialog";
import { Dialog } from "../UI/Dialog";
import { BuildModesDialog } from "./BuildModes/BuildModesDialog";
import {
    BuildModeLegacy,
    BuildModeModern,
} from "./BuildModes/BuildModesInstructions";
import { ProjectFavicon } from "./ProjectFavicon";

const buildOptions = {
    esbuild: "Modern (ESBuild)",
    legacy: "Legacy (Simplified)",
};

const ProjectPreferences = () => {
    const projectKey = useProject((s) => s.projectKey);
    const projectName = useProject((s) => s.project.name);
    const projectMode = useProject((s) => s.project.mode);
    const projectFavicon = useProject((s) => s.project.favicon);
    const projectBuildMode = useProject((s) => s.project.buildMode);
    const setProject = useProject((s) => s.setProject);
    const getProject = useProject((s) => s.getProject);
    const saveProject = useProject((s) => s.saveProject);
    const updateAndRun = useEditor((s) => s.updateAndRun);

    const [editedKey, setEditedKey] = useState<string | null>(null);
    const [openedProject, setOpenedProject] = useState<Partial<Project>>({
        name: projectName,
        favicon: projectFavicon,
        buildMode: projectBuildMode,
        mode: projectMode,
    });

    const editedProject = useMemo(() => (
        !editedKey
            ? {
                name: projectName,
                favicon: projectFavicon,
                buildMode: projectBuildMode,
                mode: projectMode,
            }
            : openedProject
    ), [
        projectName,
        projectFavicon,
        projectBuildMode,
        projectMode,
        editedKey,
        openedProject,
    ]);

    const formRef = useRef<HTMLFormElement>(null);
    const [prevBuildMode, setPrevBuildMode] = useState<ProjectBuildMode | null>(
        null,
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState<string>(editedProject.name || "");
    useEffect(() => setName(editedProject.name || ""), [editedProject.name]);

    const [buildMode, setBuildMode] = useState<ProjectBuildMode>(
        editedProject.buildMode ?? "legacy",
    );
    useEffect(() => setBuildMode(editedProject.buildMode ?? "legacy"), [
        editedProject.buildMode,
    ]);

    const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name;
        const value = e.target.value;
        setName(value);
        const [, error] = await validateProjectName(
            value,
            editedKey ?? projectKey,
        );

        if (error) {
            setErrors((prev) => ({ ...prev, [key]: error }));
            return;
        }

        if ((!value || !error) && errors?.[key]) resetError(key);
    };

    const handleBuildModeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as ProjectBuildMode;
        setBuildMode(newValue);

        const confirmed = await confirm(
            `Change build mode to ${
                buildOptions[newValue as keyof typeof buildOptions]
            }?`,
            newValue == "esbuild" ? <BuildModeModern /> : <BuildModeLegacy />,
            {
                confirmText: `Yes, change`,
                dismissText: `No, keep the ${
                    buildOptions[
                        editedProject.buildMode as keyof typeof buildOptions
                    ]
                }`,
                cancelImmediate: true,
            },
        );

        if (!confirmed) {
            setBuildMode(
                prevBuildMode ?? (editedProject.buildMode as ProjectBuildMode)
                    ?? "legacy",
            );
            return;
        }

        setPrevBuildMode(newValue);
    };

    useEffect(() => {
        const handler = async (e: Event) => {
            const d = (e as CustomEvent).detail;
            if (!d || d.id !== "project-preferences") return;

            const newKey = d.params?.projectKey;

            if (newKey) {
                const pj = await getProject(newKey);
                if (pj) {
                    setOpenedProject(pj);
                    setName(pj.name ?? "");
                    setBuildMode(pj.buildMode ?? "legacy");
                }
            } else {
                setOpenedProject({
                    name: projectName,
                    favicon: projectFavicon,
                    buildMode: projectBuildMode,
                    mode: projectMode,
                });
                setName(projectName ?? "");
                setBuildMode(projectBuildMode ?? "legacy");
            }

            setEditedKey(newKey ?? null);

            if (d.params?.lazy) setTimeout(d.open);
        };

        window.addEventListener("dialog-open", handler);
        return () => window.removeEventListener("dialog-open", handler);
    }, [
        getProject,
        projectName,
        projectFavicon,
        projectBuildMode,
        projectMode,
    ]);

    const handleSave = () => {
        let shouldRerun = false;
        const projectData: Partial<Project> = {};
        const favicon = new FormData(formRef.current!).get("favicon");

        if (name !== editedProject.name) projectData.name = name;
        if (buildMode !== editedProject.buildMode) {
            projectData.buildMode = buildMode as ProjectBuildMode;
            shouldRerun = true;
        }
        if (
            typeof favicon === "string"
            && favicon !== (editedProject.favicon ?? "")
        ) projectData.favicon = favicon;

        if (!Object.keys(projectData).length) return;

        if (editedKey && editedKey !== projectKey) {
            saveProject(editedKey, {
                ...(editedProject as Project),
                ...projectData,
            });
        } else {
            setProject(projectData);
            if (shouldRerun) updateAndRun();
        }
    };

    const handleDismiss = () => {
        formRef.current?.reset();
        setPrevBuildMode(null);
        setErrors({});
        setName(editedProject.name ?? "");
        setBuildMode(editedProject.buildMode ?? "legacy");

        setTimeout(() => {
            (formRef.current!).querySelectorAll("[name]").forEach(el => {
                el.dispatchEvent(new Event("reset", { bubbles: false }));
            });
        });
    };

    const resetError = (key: string) => {
        setErrors(cur => {
            const { [key]: _, ...rest } = cur;
            return rest;
        });
    };

    return (
        <>
            <Dialog
                id="project-preferences"
                onSave={handleSave}
                onCloseWithoutSave={handleDismiss}
                saveDisabled={Object.keys(errors).length > 0}
            >
                <div className="flex flex-col -mx-1 [&>*]:px-1">
                    <h2 className="text-2xl text-white font-bold px-1 pb-3">
                        Project Preferences
                    </h2>

                    <form
                        ref={formRef}
                        className="-mx-1 [&>*]:px-1"
                        key={editedKey ?? projectKey}
                        onKeyDown={e => e.key == "Enter" && e.preventDefault()}
                    >
                        <div className="mt-2 !px-0 space-y-1">
                            <ProjectFavicon
                                defaultValue={editedProject.favicon}
                            />

                            <label className="label gap-2 pl-3 pr-2 bg-base-200 rounded-xl border border-base-content/10">
                                <span className="flex flex-col gap-1">
                                    <span className="label-text font-medium cursor-pointer [.label:has([data-tooltip-content])_&]:text-error transition-colors">
                                        Name
                                    </span>
                                </span>

                                <input
                                    name="name"
                                    className="input input-bordered input-sm w-full max-w-60 placeholder:text-base-content/45 data-[tooltip-content]:border-error data-[tooltip-content]:focus-visible:outline-error"
                                    value={name}
                                    placeholder={editedProject.name}
                                    onChange={handleNameChange}
                                    onBlur={() => {
                                        if (!name) {
                                            setName(
                                                editedProject.name ?? "",
                                            );
                                        }
                                    }}
                                    onKeyDownCapture={e => {
                                        if (e.key != "Escape") return;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setName(editedProject.name ?? "");
                                        resetError("name");
                                        (e.target as HTMLInputElement).blur();
                                    }}
                                    data-tooltip-id="project-preferences-tooltips"
                                    data-tooltip-content={errors?.name}
                                    data-tooltip-hidden={!errors?.name}
                                    data-tooltip-variant="error"
                                    data-tooltip-place="bottom-end"
                                />
                            </label>
                        </div>

                        {editedProject.mode == "pj" && (
                            <>
                                <div className="divider mt-1.5 mb-0 first:hidden">
                                </div>
                                <div className="label gap-2">
                                    <span className="flex flex-col gap-1">
                                        <label
                                            className="label-text font-medium cursor-pointer"
                                            htmlFor="build-mode"
                                        >
                                            Build Mode
                                        </label>

                                        <span className="label-text-alt">
                                            The way project is structured and
                                            built.{" "}
                                            <button
                                                className="link no-underline hover:underline text-white focus-visible:rounded-sm focus-visible:outline-base-content/40"
                                                onClick={() =>
                                                    openDialog("build-modes")}
                                                type="button"
                                            >
                                                Learn more
                                            </button>.
                                        </span>
                                    </span>

                                    <select
                                        id="build-mode"
                                        name="buildMode"
                                        className="select select-bordered select-sm"
                                        value={buildMode}
                                        onChange={handleBuildModeChange}
                                    >
                                        {Object.entries(buildOptions).map((
                                            [value, option],
                                        ) => (
                                            <option value={value} key={value}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                <Tooltip
                    id="project-preferences-tooltips"
                    className="text-xs !px-3 !py-2"
                    isOpen={true}
                />
            </Dialog>

            <BuildModesDialog />
        </>
    );
};

export default ProjectPreferences;
