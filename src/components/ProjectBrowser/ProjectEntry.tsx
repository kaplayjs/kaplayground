import { assets } from "@kaplayjs/crew";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { FC } from "react";
import type { Tag } from "../../data/demos";
import { useProject } from "../../features/Projects/stores/useProject";
import { cn } from "../../util/cn";

type LoadedProject = {
    name: string;
    formattedName: string;
    description: string | null;
    id: number;
    difficulty?: { level: number; name: string };
    tags?: Tag[];
    version: string;
    createdAt: string;
    updatedAt: string;
};

type Props = {
    project: LoadedProject;
    isProject?: boolean;
    toggleTag?: Function;
};

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

export const ProjectEntry: FC<Props> = (
    { project: example, isProject, toggleTag },
) => {
    const {
        createNewProjectFromDemo,
        loadProject,
        currentSelection,
    } = useProject();

    const isRecent = (timestamp: string, withinDays = 5) =>
        Math.floor(
            (new Date().getTime() - new Date(timestamp).getTime())
                / (1000 * 60 * 60 * 24),
        ) <= withinDays;

    const isNew = isRecent(example.createdAt);
    const isUpdated = isRecent(example.updatedAt);

    const handleClick = () => {
        const dialog = document.querySelector<HTMLDialogElement>(
            "#examples-browser",
        );

        if (!dialog?.open) return;

        if (isProject) {
            loadProject(example.name);
        } else {
            createNewProjectFromDemo(example.id);
        }

        dialog?.close();
    };

    return (
        <article
            className={cn(
                "group bg-base-200 px-4 pt-3.5 pb-3 rounded-lg flex flex-col gap-2 cursor-pointer min-h-[90px] hover:bg-base-content/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content transition-colors",
                {
                    "bg-base-content/10 ring-1 ring-inset ring-base-content/[4%]":
                        currentSelection == example.name,
                },
            )}
            onClick={handleClick}
            onKeyUpCapture={e => e.key == "Enter" && handleClick()}
            tabIndex={0}
            role="button"
        >
            <div className="relative flex flex-col gap-1.5 flex-1">
                {!isProject && (isNew || isUpdated) && (
                    <span
                        className={cn(
                            "absolute -top-2.5 -right-3.5 inline-flex items-center mr-px text-[0.56rem] leading-none tracking-wide text-white min-h-4 px-1.5 font-medium uppercase rounded-md",
                            {
                                "bg-pink-800/80": isNew,
                                "bg-cyan-800/80": !isNew && isUpdated,
                            },
                        )}
                    >
                        {isNew ? "New" : "Updated"}
                    </span>
                )}

                <h2 className="flex items-start justify-between gap-1 text-lg font-medium text-white">
                    {example.formattedName}
                </h2>

                {example.description && (
                    <p className="text-[0.94rem] leading-snug -mt-0.5">
                        {example.description}
                    </p>
                )}

                <div className="flex flex-col gap-1.5 mt-auto">
                    {example.difficulty && (
                        <p
                            className={cn(
                                "font-bold text-xs tracking-wider uppercase flex items-center gap-2 py-1",
                                colorsPerDifficulty[example.difficulty.level],
                            )}
                        >
                            <img
                                src={imagesPerDifficulty[
                                    example.difficulty.level
                                ] ?? assets.stranger.outlined}
                                alt={example.difficulty.name}
                                className="inline h-[1.125rem] w-[1.125rem] object-scale-down"
                            />

                            {example.difficulty.name}
                        </p>
                    )}

                    {!!example?.tags?.length && (
                        toggleTag
                            ? (
                                <ToggleGroup.Root
                                    className="flex flex-wrap gap-1 -mx-1.5"
                                    type="multiple"
                                >
                                    {example.tags?.map((tag) => (
                                        <ToggleGroup.Item
                                            value="tag"
                                            key={tag.name}
                                            className={cn(
                                                "btn btn-xs btn-ghost bg-base-content/10 h-auto min-h-0 py-1 font-medium leading-none capitalize rounded-full hover:bg-base-content hover:text-neutral focus-visible:z-10 focus-visible:outline-offset-0 [.group:hover_&:not(:hover)]:bg-base-200 transition-colors",
                                                {
                                                    "bg-base-200":
                                                        currentSelection
                                                            == example.name,
                                                },
                                            )}
                                            onClick={e => {
                                                e.stopPropagation();
                                                toggleTag(tag.name);
                                            }}
                                        >
                                            {tag?.displayName ?? tag.name}
                                        </ToggleGroup.Item>
                                    ))}
                                </ToggleGroup.Root>
                            )
                            : (
                                <div className="flex flex-wrap gap-1 -mx-1.5">
                                    {example.tags?.map((tag) => (
                                        <span
                                            key={tag.name}
                                            className={cn(
                                                "badge bg-base-content/10 badge-xs font-medium h-auto px-2 py-1 border-none [.group:hover_&:not(:hover)]:bg-base-200 hover:bg-base-200",
                                                {
                                                    "bg-base-200":
                                                        currentSelection
                                                            == example.name,
                                                },
                                            )}
                                        >
                                            {tag?.displayName ?? tag.name}
                                        </span>
                                    ))}
                                </div>
                            )
                    )}
                </div>
            </div>
        </article>
    );
};
