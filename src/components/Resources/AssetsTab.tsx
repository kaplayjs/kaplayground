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
            className="tab px-12 data-[selected]:tab-active"
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
