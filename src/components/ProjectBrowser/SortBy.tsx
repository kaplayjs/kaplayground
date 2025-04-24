import type { FC } from "react";
import type { Example } from "../../data/demos";

type Props = {
    value: string;
    onChange: (value: string) => void;
    options: string[];
};

export const sortMapExamples: Record<
    string,
    (item: Example) => string | number
> = {
    topic: item => item.sortName,
    title: item => item.formattedName,
    latest: item => new Date(item.updatedAt).getTime(),
    difficulty: item => item.difficulty?.level ?? 0,
};
export const sortMapProjects: Record<
    string,
    (item: Example) => string | number
> = {
    latest: item => new Date(item.updatedAt).getTime(),
    type: item => item.tags[0].name,
    title: item => item.name,
};

export const sortEntries = (
    value: Props["value"],
    type: string | "Projects" | "Examples",
    a: Example,
    b: Example,
): number => {
    const accessor = type == "Projects"
        ? sortMapProjects?.[value]
        : sortMapExamples?.[value];

    if (!accessor) return 0;

    const entryA = accessor(a);
    const entryB = accessor(b);
    const isNumeric = typeof entryA === "number" && typeof entryB === "number";

    if (value === "latest" && isNumeric) {
        return (entryB as number) - (entryA as number);
    }

    return String(entryA).localeCompare(String(entryB), undefined, {
        numeric: true,
    });
};

export const SortBy: FC<Props> = ({ value, onChange, options }) => {
    return (
        <div className="flex items-center justify-end gap-3 min-h-6 text-xs">
            <div className="flex items-baseline gap-1.5">
                Sort by

                <select
                    className="select select-xs bg-select-xs border border-base-content/15 pr-6 font-sans"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                >
                    {options.map(o => (
                        <option key={o} value={o}>
                            {o.charAt(0).toUpperCase() + o.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
