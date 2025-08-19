import * as Tabs from "@radix-ui/react-tabs";
import type { FC } from "react";

interface AssetsTabProps {
    label: string;
    icon: string;
}

export const AssetsTab: FC<AssetsTabProps> = ({ label, icon }) => {
    return (
        <Tabs.Trigger
            value={label}
            className="tab data-[selected]:tab-active !border-t-transparent !border-x-0 !rounded-t-[inherit] hover:bg-base-300/70"
        >
            <div className="w-full">
                <div className="@container flex items-center justify-center shrink-0">
                    <div className="mr-2 hidden @[6rem]:inline font-medium">
                        {label}
                    </div>

                    <img
                        src={icon}
                        alt={label}
                        className="inline h-5 w-5 object-scale-down vertical"
                    />
                </div>
            </div>
        </Tabs.Trigger>
    );
};
