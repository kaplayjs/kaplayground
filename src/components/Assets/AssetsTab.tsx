import * as Tabs from "@radix-ui/react-tabs";
import type { FC } from "react";

type TabProps = {
    label: string;
    icon: string;
};

const AssetsTab: FC<TabProps> = ({ label, icon }) => {
    return (
        <Tabs.Trigger
            value={label}
            className="tab data-[selected]:tab-active !border-t-transparent !border-x-0 !rounded-t-[inherit] hover:bg-base-300/70"
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

export default AssetsTab;
