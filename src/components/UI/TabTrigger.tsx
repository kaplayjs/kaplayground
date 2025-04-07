import * as Tabs from "@radix-ui/react-tabs";
import type { FC } from "react";

export type TabTriggerProps = {
    label: string;
    value: string;
    icon: string;
    count?: number;
};

export const TabTrigger: FC<TabTriggerProps> = (
    { label, icon, value, count },
) => {
    return (
        <Tabs.Trigger
            value={value}
            className="tab px-6 data-[selected]:tab-active text-sm hover:bg-base-300/70"
        >
            <div className="flex gap-2 items-center justify-center">
                <img
                    src={icon}
                    alt={label}
                    className="inline h-5 w-5 object-scale-down"
                />

                <p className="inline font-medium">{label}</p>

                {!!count && (
                    <span className="badge badge-xs font-medium py-1 px-1.5 min-w-5 h-auto bg-base-content/15 border-0">
                        {count}
                    </span>
                )}
            </div>
        </Tabs.Trigger>
    );
};
