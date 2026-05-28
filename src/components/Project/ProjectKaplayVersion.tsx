import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import { kaplayVersions } from "../../data/kaplayVersions.json";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../util/cn";
import { ToolbarDropdown } from "../Toolbar/ToolbarDropdown";
import { ToolbarDropdownButton } from "../Toolbar/ToolbarDropdownButton";
import { KDropdownMenuSeparator } from "../UI/KDropdown/KDropdownSeparator";

type ProjectKaplayVersionProps = {
    value?: string;
    onSelect?: (kaplayVersion: string) => void;
    portalContainer?: HTMLElement | null;
    className?: string;
    contentClass?: string;
};

export const ProjectKaplayVersion = (
    { value, onSelect, portalContainer, className, contentClass }:
        ProjectKaplayVersionProps,
) => {
    const kaplayVersion = useProject((s) => s.project.kaplayVersion);
    const defaultValue = useCallback(() => (
        value && kaplayVersions.includes(value) ? value : kaplayVersion
    ), [kaplayVersion, value]);
    const [selected, setSelected] = useState(defaultValue());
    const setProject = useProject((s) => s.setProject);
    const run = useEditor((s) => s.run);

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

    const handleVersionChange = onSelect
        ? onSelect
        : (kaplayVersion: string) => {
            setProject({ kaplayVersion });
            run();
        };

    const Option = ({ value, ...props }: { value: string }) => (
        <ToolbarDropdownButton
            className="h-7 min-h-7 grow aria-selected:[:not(&:hover)]:bg-base-content/30 aria-selected:text-white aria-selected:focus-visible:outline-none"
            text={value}
            role="listitem"
            aria-selected={selected === value}
            onSelect={() =>
                setTimeout(() => {
                    if (!kaplayVersions.includes(value)) return;
                    setSelected(value);
                    handleVersionChange(value);
                })}
            {...props}
        />
    );

    return (
        <div className="contents">
            <ToolbarDropdown
                text={selected}
                icon={"down"}
                className={cn(
                    "font-normal h-6 min-w-40 text-left justify-between rounded-lg bg-base-100 tabular-nums focus-visible:outline-offset-2 focus-visible:outline-base-content/20",
                    className,
                )}
                tip="KAPLAY Version"
                data-tooltip-place="bottom"
                align="start"
                alignOffset={-6}
                contentClass={cn("mt-[calc(0.375rem+1px)]", contentClass)}
                setOpen={(open) =>
                    open && requestAnimationFrame(() => {
                        const el: HTMLElement | null | undefined = document
                            ?.querySelector(
                                "[data-version-select] [aria-selected=true]",
                            );
                        el?.focus();
                    })}
                loop={true}
                {...(portalContainer && { portalContainer })}
            >
                <div
                    className="flex gap-1 max-h-[calc(var(--radix-popper-available-height)-1.5rem)] tabular-nums overflow-hidden overflow-y-auto scrollbar-thin"
                    role="listbox"
                    data-version-select
                >
                    <div className="relative p-1.5">
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
                                                <label className="relative group-has-[[aria-expanded=true]]:hidden btn btn-sm btn-ghost font-normal text-xs px-1.5 py-1 h-auto min-h-0 rounded-md hover:outline-none has-[:checked]:[&:not(:hover)]:bg-base-content/10 focus-visible:-outline-offset-2 outline-base-content/30">
                                                    +{versions[major].length
                                                        - 1}

                                                    <input
                                                        type="checkbox"
                                                        className="invisible absolute inset-0 pointer-events-none"
                                                    />
                                                </label>
                                            </DropdownMenuItem>
                                        </div>

                                        <div
                                            className="grid grid-rows-[0fr] min-h-0 items-end aria-expanded:grid-rows-[1fr] peer-has-[:checked]:grid-rows-[1fr] focus-within:grid-rows-[1fr]  has-[:hover]:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden"
                                            aria-expanded={versions[major][0]
                                                    !== selected
                                                && versions[major].includes(
                                                    selected,
                                                )}
                                        >
                                            <div className="flex flex-col gap-px px-px max-h-[min(calc(50vh-2.25rem*4),calc((1.75rem+1px)*5))] overflow-hidden overflow-y-auto scrollbar-thin [scrollbar-gutter:stable]">
                                                {versions[major].map((v, i) =>
                                                    i !== 0 && (
                                                        <Option
                                                            value={v}
                                                            key={v}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {i === 0 && (
                                        <KDropdownMenuSeparator className="my-0.5" />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </ToolbarDropdown>
            <input type="hidden" value={value} name="kaplayVersion" />
        </div>
    );
};
