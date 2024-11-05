import * as Tabs from "@radix-ui/react-tabs";
import type { FC } from "react";

export type TabTriggerProps = {
    label: string;
    value: string;
    icon: string;
};

export const TabTrigger: FC<TabTriggerProps> = ({ label, icon, value }) => {
    return (
        <Tabs.Trigger
            value={value}
            className="tab px-6 data-[selected]:tab-active"
        >
            <div className="flex gap-2 items-center justify-center">
                <p className="inline font-medium">{label}</p>

                <img
                    src={icon}
                    alt={label}
                    className="inline h-5 w-5 object-scale-down"
                />
            </div>
        </Tabs.Trigger>
    );
};
