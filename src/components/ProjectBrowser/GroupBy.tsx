import type { FC } from "react";
import examplesData from "../../../kaplay/examples/examples.json";
import { difficultyByName, type Example } from "../../data/demos";
import type { ExamplesData } from "./ProjectBrowser";

type Props = {
    value: string;
    onChange: (value: string) => void;
    options: string[];
};

const optionsMap: Record<string, string> = {
    group: "Topic",
};

const groupMap: Record<string, (item: Example) => string> = {
    difficulty: (
        item,
    ) => ((examplesData as ExamplesData)?.difficulties?.[item.difficulty?.level]
        ?.displayName ?? ""),
};

const sortables = ["category", "group", "difficulty"];
const sortMap: Record<string, (item: any) => number> = {
    category: (
        item,
    ) => ((examplesData as ExamplesData)?.categories?.[item]?.order ?? 0),
    difficulty: (item: string) => difficultyByName(item)?.level ?? 0,
};

export const groupBy = (entries: Example[], key: string) => {
    if (!key || key == "none") return { "all": entries };

    const grouped = entries.reduce(
        (arr: Record<string, Example[]>, entry: Example) => {
            const group = (groupMap?.[key]?.(entry)
                ?? (entry as Record<string, any>)?.[key])
                || "uncategorized";
            arr[group] ??= [];
            arr[group].push(entry);
            return arr;
        },
        {},
    );

    if (!sortables.includes(key)) return grouped;

    return Object.fromEntries(
        Object.entries(grouped).sort(([a], [b]) => {
            if (a === "uncategorized") return 1;
            if (b === "uncategorized") return -1;

            return (sortMap?.[key]?.(a) ?? 0) - (sortMap?.[key]?.(b));
        }),
    );
};

export const GroupBy: FC<Props> = ({ value, onChange, options }) => {
    return (
        <div className="flex items-center justify-end gap-3 min-h-6 text-xs">
            <div className="flex items-baseline gap-1.5">
                Group by

                <select
                    className="select select-xs bg-select-xs border border-base-content/15 pr-6 font-sans"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                >
                    {options.map(o => (
                        <option key={o} value={o}>
                            {optionsMap?.[o]
                                ?? o.charAt(0).toUpperCase() + o.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
