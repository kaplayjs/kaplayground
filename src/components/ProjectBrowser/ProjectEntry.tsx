import { assets } from "@kaplayjs/crew";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React, { type FC, useRef } from "react";
import type { Tag } from "../../data/demos";
import { loadProject } from "../../features/Projects/application/loadProject";
import { useProject } from "../../features/Projects/stores/useProject";
import { cn } from "../../util/cn";
import { confirmNavigate } from "../../util/confirmNavigate";
import { ConditionalWrap } from "../Util/ConditionalWrap";
import { ProjectContextMenu } from "./ProjectContextMenu";

export type ProjectEntryProject = {
    key: string;
    name: string;
    formattedName: string;
    description: string | null;
    difficulty?: { level: number; name: string };
    tags?: Tag[];
    version: string;
    minVersion: string;
    createdAt: string;
    updatedAt: string;
    locked?: boolean;
};

interface ProjectEntryProps {
    project: ProjectEntryProject;
    isProject?: boolean;
    toggleTag?: Function;
    filterVersion?: string;
    filterStrictComparison?: boolean;
}

const imagesPerDifficulty = [
    assets.bean.outlined,
    assets.ghosty.outlined,
    assets.burpman.outlined,
    assets.ghostiny.outlined,
];

const colorsPerDifficulty = [
    "text-primary",
    "text-warning",
    "text-error",
    "text-gray-400",
];

export const ProjectEntry: FC<ProjectEntryProps> = (
    {
        project,
        isProject,
        toggleTag,
        filterVersion,
        filterStrictComparison = false,
    },
) => {
    const createNewProject = useProject((s) => s.createNewProject);
    const projectKey = useProject((s) => s.projectKey);
    const demoKey = useProject((s) => s.demoKey);
    const isCurrent = projectKey == project.key || demoKey == project.key;

    const isRecent = (timestamp: string, withinDays = 5) =>
        Math.floor(
            (new Date().getTime() - new Date(timestamp).getTime())
                / (1000 * 60 * 60 * 24),
        ) <= withinDays;

    const isNew = isRecent(project.createdAt);
    const isUpdated = isRecent(project.updatedAt);
    const isNewOrUpdated = !isProject && (isNew || isUpdated);

    const isIncompatible = (() => {
        if (!filterVersion || filterVersion == "All") return false;

        if (filterStrictComparison) {
            return project.minVersion != filterVersion;
        }

        const filter = parseFloat(filterVersion ?? "");
        const min = parseFloat(project.minVersion);
        const ver = !isProject && project.version == "master"
            ? ""
            : project.version;

        return ver
            ? !ver.startsWith(`${filter}.`) && min < filter
            : (project.locked ? min != filter : min > filter);
    })();
    const exampleHasMaxVersion = !isProject
        && (project.version != "master"
            && project.version.startsWith(`${filterVersion}.`));

    const labelBaseClass = cn([
        "inline-flex items-center",
        "font-medium text-[0.56rem] leading-none tracking-wide text-white uppercase",
        "min-h-4 px-1.5 rounded-md transition-opacity",
    ]);

    const contextMenuRef = useRef<{ trigger: HTMLDivElement | null }>(null);

    const handleClick = () => {
        const dialog = document.querySelector<HTMLDialogElement>(
            "#examples-browser",
        );

        if (!dialog?.open) return;

        if (isCurrent) {
            return dialog?.close();
        }

        confirmNavigate(() => {
            if (isProject) {
                loadProject(project.key);
            } else {
                createNewProject("ex", {}, project.key);
            }

            dialog?.close();
        });
    };

    const handleContextMenuTrigger = (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.stopPropagation();
        e.currentTarget.closest<HTMLElement>("[tabindex]")?.focus();
        const rect = e.currentTarget.getBoundingClientRect();
        contextMenuRef.current?.trigger?.dispatchEvent(
            new MouseEvent("contextmenu", {
                bubbles: true,
                clientX: rect.x,
                clientY: rect.y,
            }),
        );
    };

    const VersionLabel: FC<{ className?: string }> = ({ className }) => (
        <span
            className={cn(
                labelBaseClass,
                "normal-case bg-error/60 animate-fade-in",
                className,
            )}
        >
            {![project.version, project.minVersion]
                .includes("master") && "v"}
            {project.version != "master"
                ? project.version
                : project.minVersion
                    + (!project.locked ? "+" : "")}
        </span>
    );

    return (
        <ConditionalWrap
            condition={isProject}
            wrap={(children) => (
                <ProjectContextMenu
                    children={children}
                    project={project}
                    ref={contextMenuRef}
                />
            )}
        >
            <article
                className={cn(
                    "group bg-base-200 px-4 pt-3.5 pb-3 rounded-lg flex flex-col gap-2 cursor-pointer min-h-[90px] hover:bg-base-content/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content transition-colors",
                    "data-[state='open']:bg-base-content/10",
                    "data-[wrong-version]:bg-base-200/30 data-[wrong-version]:hover:bg-base-content/5",
                    {
                        "bg-base-content/10 ring-1 ring-inset ring-base-content/[4%]":
                            isCurrent,
                    },
                )}
                onClick={handleClick}
                onKeyUpCapture={e => e.key == "Enter" && handleClick()}
                tabIndex={0}
                role="button"
                data-wrong-version={(isIncompatible && !isCurrent) || undefined}
                data-current={isCurrent || undefined}
            >
                <div className="relative flex flex-col gap-1.5 flex-1 [&>*]:transition-opacity">
                    {(isProject || isNewOrUpdated || isIncompatible) && (
                        <div className="absolute -top-3 -right-4 flex justify-end items-center gap-1 mr-px p-0.5 max-w-full overflow-hidden [[data-wrong-version]:not(:hover)_&~*]:opacity-40">
                            {isNewOrUpdated && (
                                <span
                                    className={cn(
                                        labelBaseClass,
                                        {
                                            "bg-pink-800/80": isNew,
                                            "bg-cyan-800/80": !isNew
                                                && isUpdated,
                                            "[[data-wrong-version]:not(:hover)_&]:opacity-50":
                                                isIncompatible,
                                        },
                                    )}
                                >
                                    {isNew ? "New" : "Updated"}
                                </span>
                            )}

                            {!isProject
                                && (isIncompatible || exampleHasMaxVersion) && (
                                <VersionLabel />
                            )}

                            {isProject && (
                                <button
                                    className="btn btn-xs btn-ghost p-1 h-auto min-h-0 border-none rounded-md hover:bg-base-200 hover:!opacity-100 focus-visible:outline-none  focus-visible:bg-base-300 focus-visible:ring-2 focus-visible:ring-base-content group-data-[state='open']:bg-transparent opacity-0 group-hover:opacity-60 group-data-[current]:opacity-60 group-data-[state='open']:opacity-60 transition-all"
                                    type="button"
                                    data-tooltip-id="projects-browser"
                                    data-tooltip-content="Manage"
                                    data-tooltip-place="left"
                                    data-tooltip-delay-show={400}
                                    data-tooltip-class-name="!py-1 !px-2 !text-xs"
                                    data-tooltip-offset={6}
                                    onClick={handleContextMenuTrigger}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    <h2 className="flex items-start justify-between gap-1 text-lg font-medium text-white">
                        {project.formattedName}
                    </h2>

                    {project.description && (
                        <p className="text-[0.94rem] leading-snug -mt-0.5">
                            {project.description}
                        </p>
                    )}

                    <div className="flex flex-col gap-1.5 mt-auto">
                        {project.difficulty && (
                            <p
                                className={cn(
                                    "font-bold text-xs tracking-wider uppercase flex items-center gap-2 py-1",
                                    colorsPerDifficulty[
                                        project.difficulty.level
                                    ],
                                )}
                            >
                                <img
                                    src={imagesPerDifficulty[
                                        project.difficulty.level
                                    ] ?? assets.stranger.outlined}
                                    alt={project.difficulty.name}
                                    className="inline h-[1.125rem] w-[1.125rem] object-scale-down"
                                />

                                {project.difficulty.name}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                            {!!project?.tags?.length && (
                                toggleTag
                                    ? (
                                        <ToggleGroup.Root
                                            className="flex flex-wrap gap-1 -mx-1.5 mr-auto"
                                            type="multiple"
                                        >
                                            {project.tags?.map((tag) => (
                                                <ToggleGroup.Item
                                                    value="tag"
                                                    key={tag.name}
                                                    className={cn(
                                                        "btn btn-xs btn-ghost bg-base-content/10 h-auto min-h-0 py-1 font-medium leading-none capitalize rounded-full hover:bg-base-content hover:text-neutral focus-visible:z-10 focus-visible:outline-offset-0 [.group:hover_&:not(:hover)]:bg-base-200 [.group[data-state='open']_&]:bg-base-200 transition-colors",
                                                        {
                                                            "bg-base-200":
                                                                isCurrent,
                                                        },
                                                    )}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        toggleTag(tag.name);
                                                    }}
                                                >
                                                    {tag?.displayName
                                                        ?? tag.name}
                                                </ToggleGroup.Item>
                                            ))}
                                        </ToggleGroup.Root>
                                    )
                                    : (
                                        <div className="flex flex-wrap gap-1 -mx-1.5">
                                            {project.tags?.map((tag) => (
                                                <span
                                                    key={tag.name}
                                                    className={cn(
                                                        "badge bg-base-content/10 badge-xs font-medium h-auto px-2 py-1 border-none [.group:hover_&:not(:hover)]:bg-base-200 hover:bg-base-200",
                                                        {
                                                            "bg-base-200":
                                                                isCurrent,
                                                        },
                                                    )}
                                                >
                                                    {tag?.displayName
                                                        ?? tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )
                            )}

                            {isProject && isIncompatible && (
                                <VersionLabel className="-mb-1 -mx-1" />
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </ConditionalWrap>
    );
};
