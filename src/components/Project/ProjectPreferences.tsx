import React, { ChangeEvent, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { validateProjectName } from "../../features/Projects/application/validateProjectName";
import { Project } from "../../features/Projects/models/Project";
import { ProjectBuildMode } from "../../features/Projects/models/ProjectBuildMode";
import { useProject } from "../../features/Projects/stores/useProject";
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
    const project = useProject((s) => s.project);
    const projectDataKeys = Object.keys(project);
    const projectKey = useProject((s) => s.projectKey);
    const setProject = useProject((s) => s.setProject);

    const formRef = useRef<HTMLFormElement>(null);
    const [prevBuildMode, setPrevBuildMode] = useState<ProjectBuildMode | null>(
        null,
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name;
        const value = e.target.value;
        const [_, error] = validateProjectName(value);

        if (error) {
            setErrors({
                ...errors,
                [key]: error,
            });
        }

        if ((!value || !error) && errors?.[key]) resetError(key);
    };

    const handleBuildModeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as ProjectBuildMode;

        if (
            !await confirm(
                `Change build mode to ${
                    buildOptions[value as keyof typeof buildOptions]
                }?`,
                value == "esbuild" ? <BuildModeModern /> : <BuildModeLegacy />,
                {
                    confirmText: `Yes, change`,
                    dismissText: `No, keep the ${
                        buildOptions[
                            project.buildMode as keyof typeof buildOptions
                        ]
                    }`,
                    cancelImmediate: true,
                },
            )
        ) e.target.value = prevBuildMode || project.buildMode;

        setPrevBuildMode(e.target.value as ProjectBuildMode);
    };

    const handleSave = () => {
        let projectData: Partial<Project> = {};

        for (const [key, value] of new FormData(formRef.current!).entries()) {
            if (
                !projectDataKeys.includes(key)
                || typeof value != "string"
                || typeof project[key as keyof Project] != "string"
            ) continue;

            projectData[key as keyof Project] = value as any;
        }

        if (
            Object.entries(projectData).some(
                ([key, value]) => project[key as keyof Project] != value,
            )
        ) setProject(projectData);
    };

    const handleDismiss = () => {
        formRef.current?.reset();
        setPrevBuildMode(null);
        setErrors({});
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
                        key={projectKey}
                        onKeyDown={e => e.key == "Enter" && e.preventDefault()}
                    >
                        <div className="mt-2 !px-0 space-y-1">
                            <ProjectFavicon defaultValue={project.favicon} />

                            <label className="label gap-2 pl-3 pr-2 bg-base-200 rounded-xl border border-base-content/10">
                                <span className="flex flex-col gap-1">
                                    <span className="label-text font-medium cursor-pointer [.label:has([data-tooltip-content])_&]:text-error transition-colors">
                                        Name
                                    </span>
                                </span>

                                <input
                                    name="name"
                                    className="input input-bordered input-sm w-full max-w-60 placeholder:text-base-content/45 data-[tooltip-content]:border-error data-[tooltip-content]:focus-visible:outline-error"
                                    defaultValue={project.name}
                                    placeholder={project.name}
                                    onInput={handleNameChange}
                                    onBlur={e =>
                                        (!e.target.value)
                                        && (e.target.value = project.name)}
                                    onKeyDownCapture={e => {
                                        if (e.key != "Escape") return;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const target = e
                                            .target as HTMLInputElement;
                                        target.value = project.name;
                                        resetError("name");
                                        target.blur();
                                    }}
                                    data-tooltip-id="project-preferences-tooltips"
                                    data-tooltip-content={errors?.name}
                                    data-tooltip-hidden={!errors?.name}
                                    data-tooltip-variant="error"
                                    data-tooltip-place="bottom-end"
                                />
                            </label>
                        </div>

                        {project.mode == "pj" && (
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
                                        defaultValue={project.buildMode}
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
