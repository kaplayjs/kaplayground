import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { FC, useEffect, useRef, useState } from "react";
import tween from "tweenkie";
import { cn } from "../../util/cn";

type Props = {
    tags: () => string[];
    filterTags: string[];
    setFilterTags: (tags: string[]) => void;
    multipleTags: boolean;
    tagsExpandingDeps?: unknown[];
};

export const TagsFilter: FC<Props> = (
    {
        tags,
        filterTags,
        setFilterTags,
        multipleTags = true,
        tagsExpandingDeps = [],
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
            setTagsExpanded(tags().length < 24 && tags().length != 0);
        }
        if (filterTags.length > 0) {
            setFilterTags(filterTags.filter(tag => tags().includes(tag)));
        }
    }, [tags]);

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
        <div className="flex justify-between gap-1">
            <div
                ref={tagsRef}
                className="flex justify-between items-start gap-1 rounded-xl overflow-hidden"
                data-collapsed-height="24"
            >
                {tags().length > 0
                    ? (
                        <ToggleGroup.Root
                            className="flex flex-wrap gap-1"
                            value={filterTags}
                            type={"multiple"}
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
                            {tags().map(tag => (
                                <ToggleGroup.Item
                                    key={tag}
                                    value={tag}
                                    className={cn(
                                        "relative btn btn-xs btn-outline font-medium bg-base-content/10 border-base-content/10 rounded-full focus-visible:-outline-offset-2 focus-visible:z-10",
                                        {
                                            "bg-primary text-neutral focus-visible:ring-[3px] ring-inset ring-neutral":
                                                filterTags.includes(
                                                    tag,
                                                ),
                                        },
                                    )}
                                >
                                    {tag}
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
                        {tags().length}
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
