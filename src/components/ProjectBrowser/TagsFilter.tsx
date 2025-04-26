import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { FC, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import tween from "tweenkie";
import type { ExamplesDataRecord } from "../../data/demos";
import { cn } from "../../util/cn";

type Props = {
    value: () => string[];
    tags?: ExamplesDataRecord;
    filterTags: string[];
    setFilterTags: (tags: string[]) => void;
    multipleTags: boolean;
    tagsExpandingDeps?: unknown[];
    className?: string;
};

export const TagsFilter: FC<Props> = (
    {
        value,
        tags = {},
        filterTags,
        setFilterTags,
        multipleTags = true,
        tagsExpandingDeps = [],
        className,
    },
) => {
    const tagsRef = useRef<HTMLDivElement | null>(null);
    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [userToggled, setUserToggled] = useState(false);

    const toggleTags = () => {
        setUserToggled(true);
        setTagsExpanded(!tagsExpanded);
    };

    useEffect(() => {
        if (!userToggled) {
            setTagsExpanded(value().length < 22 && value().length != 0);
        }
        if (filterTags.length > 0) {
            setFilterTags(filterTags.filter(tag => value().includes(tag)));
        }
    }, [value]);

    useEffect(() => {
        const node = tagsRef?.current;
        if (node == null) return;

        const prev = node.offsetHeight;
        node.style.height = "";
        const expanded = node.scrollHeight;
        node.style.height = `${prev}px`;

        setTimeout(() => {
            tween(
                [
                    prev,
                    tagsExpanded
                        ? expanded
                        : parseInt(node?.dataset?.collapsedHeight ?? "0"),
                ],
                val => node.style.height = `${val}px`,
                () => !expanded && (node.style.height = ""),
            );
        });
    }, [tagsExpanded, ...tagsExpandingDeps]);

    return (
        <div className={cn("relative flex justify-between gap-1", className)}>
            <Tooltip
                id="projects-browser-tags-tooltip"
                className="!top-auto !bottom-full mb-[19px] ml-1 !py-2.5 !bg-neutral"
                opacity={1}
            />

            <div
                ref={tagsRef}
                className="flex justify-between items-start gap-1 rounded-xl overflow-hidden"
                data-collapsed-height="24"
            >
                {value().length > 0
                    ? (
                        <ToggleGroup.Root
                            className="flex flex-wrap gap-1"
                            value={filterTags}
                            type="multiple"
                            onValueChange={(tags) => {
                                setFilterTags(
                                    multipleTags
                                        ? tags
                                        : tags.filter(t =>
                                            !filterTags.includes(t)
                                        ),
                                );
                            }}
                        >
                            {value().map(tag => (
                                <ToggleGroup.Item
                                    key={tag}
                                    value={tag}
                                    data-tooltip-id="projects-browser-tags-tooltip"
                                    data-tooltip-content={tags?.[tag]
                                        ?.description}
                                    data-tooltip-place="top-start"
                                    className={cn(
                                        "relative btn btn-xs btn-outline font-medium capitalize bg-base-content/10 border-base-content/10 rounded-full focus-visible:-outline-offset-2 focus-visible:z-10",
                                        {
                                            "bg-primary text-neutral focus-visible:ring-[3px] ring-inset ring-neutral":
                                                filterTags.includes(
                                                    tag,
                                                ),
                                        },
                                    )}
                                >
                                    {tags?.[tag]?.displayName || tag}
                                </ToggleGroup.Item>
                            ))}
                        </ToggleGroup.Root>
                    )
                    : (
                        <span className="badge h-auto min-h-6 text-xs bg-base-content/10 px-2 border border-transparent opacity-80">
                            No tags
                        </span>
                    )}
            </div>

            <div className="flex gap-1 shrink-0">
                <button
                    className={cn(
                        "btn btn-xs btn-outline gap-1 font-medium px-0 w-6 bg-base-content/10 border-base-content/10 rounded-full opacity-0 scale-0 focus-visible:z-10 transition-all",
                        {
                            "opacity-1 scale-100": filterTags.length,
                        },
                    )}
                    type="button"
                    disabled={filterTags.length == 0}
                    onClick={() => setFilterTags([])}
                    aria-label="Clear tags"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                <button
                    className={cn(
                        "btn btn-xs btn-outline gap-1 font-medium pl-1 pr-1.5 bg-base-content/10 border-base-content/10 rounded-full focus-visible:z-10",
                        {
                            "bg-base-content text-neutral": tagsExpanded,
                        },
                    )}
                    type="button"
                    onClick={toggleTags}
                    aria-expanded={tagsExpanded}
                >
                    <span className="badge badge-xs font-medium text-[0.5rem] py-0.5 px-0.5 min-w-4 h-auto bg-base-100 border-0">
                        {value().length}
                    </span>

                    Tags

                    <svg
                        className={cn("transition-transform", {
                            "-rotate-90": tagsExpanded,
                        })}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-label="Toggle"
                        role="icon"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
