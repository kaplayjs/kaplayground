import { FC } from "react";

type Props = {
    value: string | undefined;
    options: Record<string, number>;
    onChange: (value: string) => void;
    allOption: Record<string, number> | false;
    strictComparison?: boolean;
};

const optionFormatted = (option = "") => (
    option != "" && /^\d/.test(option) ? `v${option}` : option
);

export const VersionFilter: FC<Props> = (
    {
        value = "",
        options,
        onChange,
        allOption = false,
        strictComparison = false,
    },
) => {
    const selectOptions: Record<string, number> = allOption
        ? { ...allOption, ...options }
        : options;

    return (
        <div className="grid">
            <select
                value={value}
                className="col-start-1 row-start-1 select select-bordered font-sans text-xs sm:text-sm pr-8 opacity-0"
                onChange={e => onChange(e.target.value ?? "")}
                data-tooltip-id="projects-browser"
                data-tooltip-content={strictComparison
                    ? "Version filter"
                    : "Compatible with"}
                data-tooltip-place="left"
            >
                <option
                    value=""
                    className="text-md disabled:text-base-content/50"
                    disabled
                >
                    Version
                </option>

                {Object.entries(selectOptions).map((
                    [value, count]: [string, number],
                ) => (
                    <option key={value} value={value}>
                        {optionFormatted(value)} ({count})
                    </option>
                ))}
            </select>

            <div className="join-item col-start-1 row-start-1 select select-bordered text-xs sm:text-sm pr-8 gap-1 items-center pointer-events-none">
                {optionFormatted(value)}

                {value in selectOptions && (
                    <span className="badge badge-xs font-medium py-1 px-1 min-w-5 h-auto bg-base-content/15 border-0">
                        {selectOptions[value]}
                    </span>
                )}
            </div>
        </div>
    );
};
