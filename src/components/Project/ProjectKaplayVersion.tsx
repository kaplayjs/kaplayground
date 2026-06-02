import { assets } from "@kaplayjs/crew";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
    type MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import tween from "tweenkie";
import changelog from "../../data/kaplayChangelog.html?raw";
import { kaplayVersions } from "../../data/kaplayVersions.json";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../util/cn";
import { confirm } from "../../util/confirm";
import { ToolbarDropdown } from "../Toolbar/ToolbarDropdown";
import { ToolbarDropdownButton } from "../Toolbar/ToolbarDropdownButton";
import { KDropdownMenuSeparator } from "../UI/KDropdown/KDropdownSeparator";
import { ScrollArea } from "../UI/ScrollArea";

const overrideIds: Record<string, string> = {
    "4000.0.0-alpha.26.1": "4000.0.0-alpha.26",
    ...Object.fromEntries(
        Array.from(
            { length: 18 },
            (_, i) => [`4000.0.0-alpha.${i + 1}`, "4000.0.0-alpha.19"],
        ),
    ),
};
const overrideIdsReverse = Object.entries(overrideIds).reduce<
    Record<string, string[]>
>((acc, [key, value]) => {
    (acc[value] ??= []).push(key);
    return acc;
}, {});

type ProjectKaplayVersionProps = {
    value?: string;
    onSelect?: (kaplayVersion: string) => void;
    portalContainer?: HTMLElement | null;
    className?: string;
    contentClass?: string;
    align?: "start" | "end" | "center";
};

export const ProjectKaplayVersion = (
    {
        value,
        onSelect,
        portalContainer,
        className,
        contentClass,
        align = "start",
    }: ProjectKaplayVersionProps,
) => {
    const kaplayVersion = useProject((s) => s.project.kaplayVersion);
    const defaultValue = useCallback(() => (
        value && kaplayVersions.includes(value) ? value : kaplayVersion
    ), [kaplayVersion, value]);
    const [selected, setSelected] = useState(defaultValue());
    const [userIntent, setUserIntent] = useState(true);
    const setProject = useProject((s) => s.setProject);
    const run = useEditor((s) => s.run);
    const [showChangelog, setShowChangelog] = useState(false);
    const [noChangeloEntry, setNoChangelogEntry] = useState(false);
    const changelogRef = useRef<HTMLDivElement>(null);

    const master = kaplayVersions.includes("master") ? "master" : null;
    const versions = kaplayVersions.reduce(
        (acc: Record<string, string[]>, v) => {
            if (v === "master") return acc;

            const major = "v" + v.split(".")[0];

            acc[major] ??= [];
            acc[major].push(v);

            return acc;
        },
        {},
    );
    const majors = Object.keys(versions);

    useEffect(() => {
        setSelected(defaultValue());
    }, [defaultValue]);

    useEffect(() => {
        const container = changelogRef.current;
        if (!container) return;

        let timeout: ReturnType<typeof setTimeout>;

        const headings = Array.from(
            container.querySelectorAll<HTMLHeadingElement>("h2[data-version]"),
        );

        const handleScroll = () => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                let current: HTMLElement | undefined;

                headings.forEach(h => {
                    if (
                        Math.abs(
                            container.getBoundingClientRect().top
                                - h.getBoundingClientRect().top,
                        ) <= 100
                    ) current = h;
                });

                if (!current) return;

                const v = current?.dataset?.version;
                if (!v) return;

                const target = overrideIdsReverse[v] || v;
                setSelected(prevSelected => {
                    if (!v || [v, ...target].includes(prevSelected)) {
                        return prevSelected;
                    }

                    const entry = document.querySelector(
                        `[role="listitem"][data-version="${v}"]`,
                    );
                    entry?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });

                    setNoChangelogEntry(!entry);

                    return v;
                });
            }, 200);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            container?.removeEventListener("scroll", handleScroll);
            clearTimeout(timeout);
        };
    }, [showChangelog]);

    const handleVersionChange = onSelect
        ? onSelect
        : (kaplayVersion: string) => {
            setProject({ kaplayVersion });
            run();
        };

    const handleChangelogToggle = async (e: MouseEvent) => {
        e.stopPropagation();
        const contentEl = (e.currentTarget as HTMLElement).closest(
            "[data-version-select]",
        )?.parentElement;
        if (!contentEl) return;

        const from = contentEl.getBoundingClientRect();
        const show = !showChangelog;

        if (show) {
            setShowChangelog(show);
            setUserIntent(false);
            setTimeout(() => scrollToVersion(selected, false));
        } else {
            if (selected === defaultValue()) setUserIntent(true);
            if (changelogRef.current) {
                changelogRef.current.style.display = "none";
            }
        }

        const onEnd = () => {
            if (!show) {
                if (changelogRef.current) {
                    changelogRef.current.style.display = "none";
                }
                setShowChangelog(false);
            }
            contentEl.style.overflow = "";
            contentEl.style.width = "";
            contentEl.style.height = "";
            contentEl.style.minWidth = "0";
            (contentEl.firstElementChild as HTMLElement)!.style.minWidth = "";
            requestAnimationFrame(() => {
                contentEl.classList.toggle("is-animating", false);
                contentEl.classList.toggle("is-animating-in", false);
                contentEl.classList.toggle("is-animating-out", false);
            });
        };

        if (window.innerWidth < 640) {
            return onEnd();
        }

        requestAnimationFrame(() => {
            contentEl.classList.toggle("is-animating", true);
            contentEl.classList.toggle("is-animating-in", show);
            const to = contentEl.getBoundingClientRect();
            if (changelogRef.current) changelogRef.current.style.display = "";

            contentEl.style.overflow = "hidden";
            contentEl.style.width = from.width + "px";
            contentEl.style.minWidth = "0";
            (contentEl.firstElementChild as HTMLElement)!.style.minWidth =
                "max-content";
            contentEl.style.height = from.height + "px";

            requestAnimationFrame(() => {
                contentEl.classList.toggle("is-animating-out", !show);

                tween(
                    [[from.width, to.width], [from.height, to.height]],
                    ([w, h]) => {
                        contentEl.style.width = w + "px";
                        contentEl.style.height = h + "px";
                    },
                    onEnd,
                );
            });
        });
    };

    const confirmVersionChange = async () => {
        if (selected === defaultValue()) return;

        if (
            (await confirm("Change version?", null, {
                confirmText: `Use ${selected}`,
                dismissText: `Keep ${defaultValue()}`,
            }))
        ) {
            handleVersionChange(selected);
        } else {
            setSelected(defaultValue());
        }
    };

    const scrollToVersion = (version: string, smooth = true) => {
        const changelogEl = changelogRef.current;
        const entryEl = changelogEl?.querySelector(
            `[data-version="${(overrideIds[version] || version)}"]`,
        ) as HTMLElement;

        setNoChangelogEntry(!entryEl);
        if (!changelogEl || !entryEl) return;

        entryEl.style.position = "relative";
        const top = entryEl.offsetTop
            - (parseFloat(getComputedStyle(changelogEl).paddingTop) || 0);
        entryEl.style.position = "";

        changelogEl.scrollTo({
            top,
            behavior: smooth ? "smooth" : "instant",
        });
    };

    const Option = ({ value, ...props }: { value: string }) => (
        <ToolbarDropdownButton
            className={cn(
                "h-7 min-h-7 grow [&[aria-selected=true]:not(:hover)]:bg-base-content/30 aria-selected:text-white aria-selected:focus-visible:outline-none",
                {
                    "[&:not(:hover)]:bg-base-content/10": value !== selected
                        && value === defaultValue(),
                },
            )}
            text={value}
            role="listitem"
            aria-selected={selected === value}
            data-version={value}
            onSelect={() => {
                if (showChangelog) return;
                setUserIntent(true);
                setTimeout(() => {
                    setSelected(value);
                    handleVersionChange(value);
                });
            }}
            onClickCapture={(e) => {
                if (!showChangelog) return;
                e.stopPropagation();
                setSelected(value);
                scrollToVersion(value);
            }}
            {...props}
        />
    );

    return (
        <div className="contents">
            <ToolbarDropdown
                text={defaultValue()}
                icon={"down"}
                className={cn(
                    "font-normal h-6 min-w-40 text-left justify-between rounded-lg bg-base-100 tabular-nums focus-visible:outline-offset-2 focus-visible:outline-base-content/20",
                    className,
                )}
                tip="KAPLAY Version"
                data-tooltip-place="bottom"
                align={align}
                alignOffset={-6}
                contentClass={cn(
                    "mt-[calc(0.375rem+1px)] p-px overflow-hidden",
                    contentClass,
                )}
                setOpen={async (open) => {
                    requestAnimationFrame(async () => {
                        if (open) {
                            (document?.querySelector(
                                "[data-version-select] [aria-selected=true]",
                            ) as HTMLElement)?.focus();
                        } else {
                            if (
                                !userIntent && selected !== defaultValue()
                            ) await confirmVersionChange();
                            setShowChangelog(false);
                        }
                    });
                }}
                loop={true}
                {...(portalContainer && { portalContainer })}
            >
                <div
                    className="flex gap-1 items-stretch !max-sm:h-svh max-w-[100vw] max-h-[min(600px,calc(var(--radix-popper-available-height)-1.5rem))] tabular-nums overflow-hidden overflow-y-auto scrollbar-thin"
                    role="listbox"
                    data-version-select
                >
                    <div
                        className={cn(
                            "relative flex flex-col min-w-0 group-[-dropdown.is-animating:not(.is-animating-in)]:flex",
                            { "max-sm:hidden": showChangelog },
                        )}
                    >
                        <div className="flex flex-col min-w-0 min-h-0 p-2 overflow-hidden overflow-y-auto">
                            <DropdownMenuItem asChild={true}>
                                <button
                                    className={cn(
                                        "absolute top-1.5 right-1.5 btn btn-xs btn-ghost h-auto -m-px min-h-0 p-0.5 hover:outline-none focus-visible:-outline-offset-2 outline-base-content/30",
                                        { "bg-neutral/50": showChangelog },
                                    )}
                                    onClickCapture={handleChangelogToggle}
                                    data-tooltip-id="global"
                                    data-tooltip-content="Changelog"
                                    data-tooltip-place="top-end"
                                    data-tooltip-delay-show={400}
                                    data-tooltip-offset={8}
                                    data-tooltip-class-name="[&>:first-child]:!px-2 [&>:first-child]:!py-1 !text-xs z-[100]"
                                    data-tooltip-hidden={showChangelog}
                                >
                                    <img
                                        src={assets.history.outlined}
                                        width={18}
                                        height={18}
                                        aria-hidden="true"
                                        className="m-px"
                                    />
                                    <span className="sr-only">Changelog</span>
                                </button>
                            </DropdownMenuItem>

                            {master && (
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1.5 mb-1">
                                        <h3 className="px-1.5 py-0.5 bg-base-content/15 font-medium text-xs text-white rounded-md">
                                            GitHub
                                        </h3>
                                        <div className="text-xs">
                                            Latest Changes
                                        </div>
                                    </div>

                                    <div className="group flex flex-col">
                                        <Option value={master} />
                                    </div>

                                    <KDropdownMenuSeparator className="my-0.5" />
                                </div>
                            )}

                            {majors.map((major, i) =>
                                i < 2 && (
                                    <div key={major}>
                                        <div className="flex items-baseline gap-1.5 mb-1">
                                            <h3 className="px-1.5 py-0.5 bg-base-content/15 font-medium text-xs text-white rounded-md">
                                                {major}
                                            </h3>
                                            {i === 0 && (
                                                <div className="text-xs">
                                                    Latest Release
                                                </div>
                                            )}
                                        </div>

                                        <div className="group flex flex-col gap-px">
                                            <div className="peer flex gap-0.5 items-stretch">
                                                <Option
                                                    value={versions[major][0]}
                                                />

                                                <DropdownMenuItem
                                                    onClickCapture={e =>
                                                        e.stopPropagation()}
                                                    asChild={true}
                                                >
                                                    <label className="relative btn btn-sm btn-ghost font-normal text-xs px-1.5 py-1 h-auto min-h-0 rounded-md hover:outline-none has-[:checked]:[&:not(:hover)]:bg-base-content/10 focus-visible:-outline-offset-2 outline-base-content/30">
                                                        +{versions[major].length
                                                            - 1}

                                                        <input
                                                            type="checkbox"
                                                            className="invisible absolute inset-0 pointer-events-none"
                                                            defaultChecked={versions[
                                                                        major
                                                                    ][0]
                                                                    !== selected
                                                                && versions[
                                                                    major
                                                                ].includes(
                                                                    selected,
                                                                )}
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                            </div>

                                            <div
                                                className="grid grid-rows-[0fr] min-h-0 items-end aria-expanded:grid-rows-[1fr] peer-has-[:checked]:grid-rows-[1fr] focus-within:grid-rows-[1fr] has-[:hover]:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden"
                                                aria-expanded={versions[major][
                                                            0
                                                        ]
                                                        !== selected
                                                    && versions[major].includes(
                                                        selected,
                                                    )}
                                            >
                                                <ScrollArea className="flex flex-col gap-px px-px aria-exp max-h-[clamp(calc((1.75rem+1px)*3),calc(50vh-2.25rem*4),calc((1.75rem+1px)*5))]">
                                                    {versions[major].map((
                                                        v,
                                                        i,
                                                    ) => i !== 0 && (
                                                        <Option
                                                            value={v}
                                                            key={v}
                                                        />
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                        </div>

                                        {i === 0 && (
                                            <KDropdownMenuSeparator className="my-0.5" />
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        {showChangelog && (
                            <div
                                className={cn(
                                    "grid grid-rows-[0fr] min-h-0 shrink-0 -mr-[calc(0.25rem-1px)] mt-auto overflow-hidden group-[-dropdown.is-animating]:grid-rows-[0fr] group-[-dropdown.is-animating:not(.is-animating-in):not(.is-animating-out)]:hidden transition-[grid-template-rows]",
                                    {
                                        "grid-rows-[1fr]":
                                            selected !== defaultValue(),
                                    },
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex justify-between gap-2 p-2 bg-base-300 rounded-md overflow-hidden opacity-1 transition-[opacity,transform]",
                                        {
                                            "opacity-0 translate-y-full":
                                                selected === defaultValue(),
                                        },
                                    )}
                                >
                                    <DropdownMenuItem
                                        asChild={true}
                                        onSelect={() =>
                                            setSelected(defaultValue())}
                                    >
                                        <button className="btn btn-xs btn-ghost bg-base-content/20 rounded-md hover-outline-none hover:bg-base-content/15">
                                            Dismiss
                                        </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild={true}
                                        onSelect={() => {
                                            setUserIntent(true);
                                            setTimeout(() =>
                                                handleVersionChange(selected)
                                            );
                                        }}
                                    >
                                        <button className="btn btn-xs btn-primary rounded-md hover-outline-none">
                                            Use Version
                                        </button>
                                    </DropdownMenuItem>
                                </div>
                            </div>
                        )}
                    </div>

                    {showChangelog && (
                        <div
                            ref={changelogRef}
                            className="relative px-4 py-2 w-full max-w-lg bg-base-200 flex-1 min-h-0 rounded-md overflow-hidden overflow-y-auto scrollbar-thin group-[-dropdown.is-animating-out]:opacity-0 transition-opacity group-[-dropdown.is-animating-in]:animate-fade-in [--tw-animation-duration:0.45s]"
                        >
                            <DropdownMenuItem asChild={true}>
                                <button
                                    className="sm:hidden fixed top-4 right-4 btn btn-xs btn-neutral h-auto -m-px min-h-0 p-0.5 hover:outline-none focus-visible:-outline-offset-2 outline-base-content/30 z-10"
                                    onClickCapture={handleChangelogToggle}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                    <span className="sr-only">Close</span>
                                </button>
                            </DropdownMenuItem>

                            <div
                                className="prose prose-sm max-w-none prose-h1:text-lg prose-h1:text-subheadings prose-h1: prose-h2:text-base prose-h2:text-subheadings prose-h2:pb-1.5 prose-h2:border-b prose-h2:border-base-content/10 prose-h3:text-sm prose-h3:mt-3 prose-ul:ps-4 prose-li:ps-0.5 prose-code:px-1.5 prose-code:rounded-md prose-hr:my-6 prose-h2:sticky prose-h2:top-0 prose-h2:bg-base-200 prose-h2:shadow-[0_-0.75rem_0.25rem_0.25rem_oklch(var(--b2))] [&_h2_span]:font-medium [&_h2_span]:text-sm [&_h2_span]:text-base-content/80 [&_pre]:scrollbar-thin"
                                dangerouslySetInnerHTML={{ __html: changelog }}
                            />

                            <div className="sticky -mb-2 -bottom-2 left-0 right-0">
                                <div
                                    className="h-8 bg-gradient-to-t from-base-200 to-base-200/0"
                                    aria-hidden="true"
                                />

                                <div className="absolute -left-4 bottom-0 -right-4 overflow-hidden shadow-[0_-1rem_4rem_1.5rem] shadow-base-200 has-[[aria-hidden=true]]:opacity-0 transition-opacity">
                                    <div
                                        className="px-4 py-2.5 bg-neutral font-medium text-sm text-warning-subtle rounded-md border-t border-base-200 aria-hidden:translate-y-full transition-transform"
                                        aria-hidden={!noChangeloEntry}
                                    >
                                        No changelog for this version
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ToolbarDropdown>
            <input type="hidden" value={value} name="kaplayVersion" />
        </div>
    );
};
